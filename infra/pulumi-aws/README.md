# Pulumi AWS (TypeScript)

This stack provisions an Ubuntu 22.04 EC2 instance for Nomad Dev.

## Security defaults
- `enablePublicSsh=false`
- `enableMosh=true`
- `enablePublicMoshIngress=false`
- `enableTailscaleUdp=false`
- IMDSv2 required

## Prerequisites
- Pulumi CLI
- Node.js 18+
- AWS credentials (`aws configure` or AWS SSO)

## Quickstart
```bash
npm ci
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set rootVolumeSizeGiB 30
pulumi config set enablePublicSsh false
pulumi up
```

## Config options
- `namePrefix` (default `nomad-dev`)
- `instanceType` (default `t3.micro`)
- `rootVolumeSizeGiB` (default `8`)
- `amiId` (optional explicit AMI)
- `keyName` (optional existing EC2 key pair)
- `sshPublicKey` or `sshPublicKeyPath` (one required if `keyName` unset)
- `enablePublicSsh` (default `false`)
- `allowedSshCidr` (required when `enablePublicSsh=true`)
- `allowWideOpenSsh` (default `false`; must be `true` to allow `0.0.0.0/0`)
- `enableMosh` (default `true`)
- `enablePublicMoshIngress` (default `false`)
- `allowedMoshCidr` (optional; required when `enablePublicMoshIngress=true` unless `allowedSshCidr` is set)
- `allowWideOpenMosh` (default `false`; must be `true` to allow `0.0.0.0/0` for Mosh ingress)
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

## Mosh modes
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

Explicitly allow world-open Mosh ingress (not recommended):
```bash
pulumi config set enableMosh true
pulumi config set enablePublicMoshIngress true
pulumi config set allowedMoshCidr 0.0.0.0/0
pulumi config set allowWideOpenMosh true
```

## Root volume resizing
Increase root volume size:
```bash
pulumi config set rootVolumeSizeGiB 30
pulumi up
```

If resizing an existing host, expand the filesystem on the instance after `pulumi up`:
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

## Integrity and provenance
Tailscale is installed via signed apt repository metadata for Ubuntu Jammy. Avoid remote shell bootstrap patterns in downstream changes.
