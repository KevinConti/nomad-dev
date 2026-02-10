# Infrastructure: Pulumi + AWS

This guide provisions an Ubuntu 22.04 VPS for Nomad Dev using Pulumi (TypeScript).

## Security posture
- Public SSH is disabled by default.
- World-open SSH (`0.0.0.0/0`) is blocked unless explicitly overridden.
- Public Mosh UDP ingress is disabled by default.
- EC2 requires IMDSv2.

## Prerequisites
- AWS credentials configured (`aws configure` or AWS SSO)
- Pulumi CLI installed
- Node.js 18+
- SSH public key available (or existing EC2 key pair)

## Quickstart
```bash
cd infra/pulumi-aws
npm ci
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set rootVolumeSizeGiB 30
pulumi config set enablePublicSsh false
pulumi config set enableMosh true
pulumi config set enablePublicMoshIngress false
pulumi config set enableTailscaleUdp false
pulumi up
```

## Optional settings
Use only if needed:

```bash
pulumi config set namePrefix nomad-dev
pulumi config set instanceType t3.micro
pulumi config set rootVolumeSizeGiB 30
pulumi config set amiId ami-xxxxxxxx
```

Enable public SSH with a narrow CIDR:
```bash
pulumi config set enablePublicSsh true
pulumi config set allowedSshCidr 203.0.113.4/32
```

Allow world-open SSH only with explicit override (not recommended):
```bash
pulumi config set enablePublicSsh true
pulumi config set allowedSshCidr 0.0.0.0/0
pulumi config set allowWideOpenSsh true
```

Use Mosh over Tailscale only (recommended):
```bash
pulumi config set enableMosh true
pulumi config set enablePublicMoshIngress false
```

Enable internet-facing Mosh with a narrow CIDR:
```bash
pulumi config set enableMosh true
pulumi config set enablePublicMoshIngress true
pulumi config set allowedMoshCidr 203.0.113.4/32
```

Allow world-open Mosh ingress only with explicit override (not recommended):
```bash
pulumi config set enableMosh true
pulumi config set enablePublicMoshIngress true
pulumi config set allowedMoshCidr 0.0.0.0/0
pulumi config set allowWideOpenMosh true
```

Enable direct Tailscale UDP ingress if needed:
```bash
pulumi config set enableTailscaleUdp true
```

Optional: auto-run Tailscale with auth key:
```bash
pulumi config set --secret tailscaleAuthKey tskey-xxxxxxxx
```

## Root volume resizing
Increase root volume size:
```bash
pulumi config set rootVolumeSizeGiB 30
pulumi up
```

If resizing an existing host, expand the filesystem on the instance:
```bash
lsblk
df -hT
sudo growpart /dev/nvme0n1 1
sudo resize2fs /dev/nvme0n1p1
df -hT
```

If your root filesystem is XFS, use:
```bash
sudo xfs_growfs -d /
```

## Outputs
- `publicIp`
- `publicDns`

## Integrity and provenance notes
- Host bootstrap installs Tailscale from the signed official apt repository for Ubuntu Jammy.
- Avoid remote shell bootstrap patterns (`curl | sh`) in custom modifications.

## Minimal IAM assumptions
For this stack, your principal must be able to manage:
- EC2 instance, key pair, security group
- Read default VPC/subnets

## Troubleshooting
- If AWS returns account verification errors, resolve account verification in AWS support.
- If Pulumi prompts for login in non-interactive sessions, set `PULUMI_ACCESS_TOKEN`.
