# Human Quickstart

This guide assumes no prior knowledge of Nomad Dev.

## What you will have at the end
- A cloud Ubuntu host you can reach from your phone.
- A resilient terminal session using tmux.
- Push notifications when your agent needs attention.

## Prerequisites
- AWS account with billing enabled
- Pulumi CLI
- AWS CLI
- Node.js 18+
- SSH keypair (or ability to generate one)
- Tailscale account and mobile app

## 1) Provision the host
```bash
cd infra/pulumi-aws
npm ci
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set rootVolumeSizeGiB 30
pulumi config set enablePublicSsh false
pulumi up
```

If you resize disk on an existing host, expand the filesystem after `pulumi up`:
```bash
lsblk
df -hT
sudo growpart /dev/nvme0n1 1
sudo resize2fs /dev/nvme0n1p1
df -hT
```

Use `sudo xfs_growfs -d /` instead of `resize2fs` on XFS.

## 2) Prepare host tools
If Pulumi user-data was interrupted, run:
```bash
sudo ./scripts/host-setup-ubuntu.sh
```

Then authenticate Tailscale:
```bash
sudo tailscale up
tailscale status
```

## 3) Install Nomad Dev in your target repo
```bash
./scripts/nomad-dev install --target /path/to/your/repo
```

This generates a random ntfy topic by default.

## 4) Verify notifications
```bash
cd /path/to/your/repo
./scripts/nomad wait-notify 10 "nomad test"
```

## 5) Connect from your phone
- Join Tailscale on your phone.
- Connect to the host from your terminal app.
- Start a persistent session:
```bash
tmux new -s nomad
```

## Next references
- iOS detail guide: `/docs/phase-1-ios.md`
- Infra deep dive: `/docs/infra-pulumi-aws.md`
- Security hardening: `/docs/security/hardening-checklist.md`
