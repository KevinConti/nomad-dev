# Pulumi AWS (TypeScript)

This stack provisions an Ubuntu 22.04 EC2 instance for Nomad Dev.

## Security defaults
- `enablePublicSsh=false`
- `enableMosh=false`
- `enableTailscaleUdp=false`
- IMDSv2 required

## Prerequisites
- Pulumi CLI
- Node.js 18+
- AWS credentials (`aws configure` or AWS SSO)

## Quickstart
```bash
npm install
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set enablePublicSsh false
pulumi up
```

## Config options
- `namePrefix` (default `nomad-dev`)
- `instanceType` (default `t3.micro`)
- `amiId` (optional explicit AMI)
- `keyName` (optional existing EC2 key pair)
- `sshPublicKey` or `sshPublicKeyPath` (one required if `keyName` unset)
- `enablePublicSsh` (default `false`)
- `allowedSshCidr` (required when `enablePublicSsh=true`)
- `allowWideOpenSsh` (default `false`; must be `true` to allow `0.0.0.0/0`)
- `enableMosh` (default `false`; requires public SSH configuration)
- `enableTailscaleUdp` (default `false`)
- `tailscaleAuthKey` (optional secret)

## Public SSH examples
Enable narrow CIDR SSH:
```bash
pulumi config set enablePublicSsh true
pulumi config set allowedSshCidr 203.0.113.4/32
```

Explicitly allow world-open SSH (not recommended):
```bash
pulumi config set enablePublicSsh true
pulumi config set allowedSshCidr 0.0.0.0/0
pulumi config set allowWideOpenSsh true
```

## Integrity and provenance
Tailscale is installed via signed apt repository metadata for Ubuntu Jammy. Avoid remote shell bootstrap patterns in downstream changes.
