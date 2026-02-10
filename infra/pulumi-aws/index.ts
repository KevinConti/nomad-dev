import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const namePrefix = config.get("namePrefix") ?? "nomad-dev";
const instanceType = config.get("instanceType") ?? "t3.micro";
const enablePublicSsh = config.getBoolean("enablePublicSsh") ?? false;
const allowedSshCidr = config.get("allowedSshCidr");
const allowWideOpenSsh = config.getBoolean("allowWideOpenSsh") ?? false;
const enableMosh = config.getBoolean("enableMosh") ?? true;
const enablePublicMoshIngress = config.getBoolean("enablePublicMoshIngress") ?? false;
const allowedMoshCidr = config.get("allowedMoshCidr");
const allowWideOpenMosh = config.getBoolean("allowWideOpenMosh") ?? false;
const enableTailscaleUdp = config.getBoolean("enableTailscaleUdp") ?? false;

const keyName = config.get("keyName");
const sshPublicKey = config.get("sshPublicKey");
const sshPublicKeyPath = config.get("sshPublicKeyPath");

const tailscaleAuthKey = config.getSecret("tailscaleAuthKey");
const amiIdOverride = config.get("amiId");

function loadPublicKey(): string | undefined {
  if (sshPublicKey) {
    return sshPublicKey.trim();
  }
  if (sshPublicKeyPath) {
    const expanded =
      sshPublicKeyPath.startsWith("~")
        ? path.join(os.homedir(), sshPublicKeyPath.slice(1))
        : sshPublicKeyPath;
    const resolved = path.resolve(expanded);
    return fs.readFileSync(resolved, "utf8").trim();
  }
  return undefined;
}

const publicKey = loadPublicKey();
let instanceKeyName: pulumi.Input<string> | undefined;

if (publicKey) {
  const keyPair = new aws.ec2.KeyPair(`${namePrefix}-key`, {
    publicKey,
  });
  instanceKeyName = keyPair.keyName;
} else if (keyName) {
  instanceKeyName = keyName;
} else {
  throw new Error("Set either 'keyName' or 'sshPublicKey/sshPublicKeyPath' in config.");
}

const vpc = aws.ec2.getVpc({ default: true });
const subnets = vpc.then((v) =>
  aws.ec2.getSubnets({
    filters: [{ name: "vpc-id", values: [v.id] }],
  })
);
const subnetId = subnets.then((s) => s.ids[0]);

function resolveSshCidr(): string | undefined {
  if (!enablePublicSsh) {
    return undefined;
  }
  if (!allowedSshCidr) {
    throw new Error("Set 'allowedSshCidr' when 'enablePublicSsh=true'.");
  }
  if (allowedSshCidr === "0.0.0.0/0" && !allowWideOpenSsh) {
    throw new Error(
      "Refusing world-open SSH. Set 'allowWideOpenSsh=true' to explicitly override."
    );
  }
  return allowedSshCidr;
}

function resolveMoshCidr(): string | undefined {
  if (!enablePublicMoshIngress) {
    return undefined;
  }

  const moshCidr = allowedMoshCidr ?? allowedSshCidr;
  if (!moshCidr) {
    throw new Error(
      "Set 'allowedMoshCidr' (or 'allowedSshCidr') when 'enablePublicMoshIngress=true'."
    );
  }
  if (moshCidr === "0.0.0.0/0" && !allowWideOpenMosh) {
    throw new Error(
      "Refusing world-open Mosh ingress. Set 'allowWideOpenMosh=true' to explicitly override."
    );
  }
  return moshCidr;
}

const sshCidr = resolveSshCidr();
const moshCidr = resolveMoshCidr();
const ingressRules: aws.types.input.ec2.SecurityGroupIngress[] = [];

if (enablePublicMoshIngress && !enableMosh) {
  throw new Error("Set 'enableMosh=true' when 'enablePublicMoshIngress=true'.");
}

if (sshCidr) {
  ingressRules.push({
    protocol: "tcp",
    fromPort: 22,
    toPort: 22,
    cidrBlocks: [sshCidr],
    description: "SSH",
  });
}

if (moshCidr) {
  ingressRules.push({
    protocol: "udp",
    fromPort: 60000,
    toPort: 61000,
    cidrBlocks: [moshCidr],
    description: "Mosh",
  });
}

if (enableTailscaleUdp) {
  ingressRules.push({
    protocol: "udp",
    fromPort: 41641,
    toPort: 41641,
    cidrBlocks: ["0.0.0.0/0"],
    description: "Tailscale UDP",
  });
}

const securityGroup = new aws.ec2.SecurityGroup(`${namePrefix}-sg`, {
  vpcId: vpc.then((v) => v.id),
  ingress: ingressRules,
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
      description: "All outbound",
    },
  ],
});

const amiId = amiIdOverride
  ? pulumi.output(amiIdOverride)
  : pulumi
      .output(
        aws.ec2.getAmi({
          mostRecent: true,
          owners: ["099720109477"],
          filters: [
            {
              name: "name",
              values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
            },
            {
              name: "virtualization-type",
              values: ["hvm"]
            }
          ],
        })
      )
      .apply((ami) => ami.id);

const userData = pulumi.all([tailscaleAuthKey]).apply(([authKey]) => {
  const base = [
    "#!/bin/bash",
    "set -euo pipefail",
    "apt-get update",
    "apt-get install -y curl git gnupg tmux",
    "install -m 0755 -d /usr/share/keyrings",
    "curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg -o /usr/share/keyrings/tailscale-archive-keyring.gpg",
    "curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list -o /etc/apt/sources.list.d/tailscale.list",
    "chmod 0644 /usr/share/keyrings/tailscale-archive-keyring.gpg /etc/apt/sources.list.d/tailscale.list",
    "apt-get update",
    "apt-get install -y tailscale",
  ];

  if (enableMosh) {
    base.push("apt-get install -y mosh");
  }

  if (authKey) {
    base.push(`tailscale up --authkey=${authKey}`);
  } else {
    base.push("echo 'Run: sudo tailscale up'");
  }

  return base.join("\n");
});

const instance = new aws.ec2.Instance(`${namePrefix}-host`, {
  ami: amiId,
  instanceType,
  subnetId,
  vpcSecurityGroupIds: [securityGroup.id],
  keyName: instanceKeyName,
  userData,
  metadataOptions: {
    httpEndpoint: "enabled",
    httpTokens: "required",
    httpPutResponseHopLimit: 1,
  },
  tags: {
    Name: `${namePrefix}-host`,
    Project: "nomad-dev",
  },
});

export const publicIp = instance.publicIp;
export const publicDns = instance.publicDns;
