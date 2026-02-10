# AI Setup Runbook

## Goal
Provision and validate Nomad Dev for a user with secure defaults and reproducible evidence.

## Inputs to collect
- AWS region (default `us-east-1`)
- SSH public key path
- Target repository path on host
- ntfy configuration (server/topic/token)
- Whether any insecure options are explicitly approved

## Step-by-step procedure
1. Preflight
- Run `/docs/ai/preflight-checklist.md`.
- Stop immediately on failed critical checks.

2. Infrastructure provisioning
```bash
cd infra/pulumi-aws
npm install
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set enablePublicSsh false
pulumi config set enableMosh false
pulumi config set enableTailscaleUdp false
pulumi up
```

3. Host bootstrap (if needed outside Pulumi user-data)
```bash
sudo ./scripts/host-setup-ubuntu.sh
sudo tailscale up
tailscale status
```

4. Install repo helper files into the user target repo
```bash
./scripts/nomad-dev install --target /path/to/repo
```

5. Validate notification loop
```bash
cd /path/to/repo
./scripts/nomad wait-notify 10 "nomad test"
```

6. Confirm mobile session flow
- User can connect from phone through Tailscale.
- User can start or reattach tmux.

## Rollback and recovery
- `pulumi destroy` to remove infrastructure created for testing.
- Restore previous `.nomad-dev/config.env` from backup if overwritten unintentionally.
- If Tailscale fails to authenticate, rerun `sudo tailscale up` and complete device approval.

## Required completion report
Include:
- Commands executed
- Output evidence for `pulumi stack output`, `tailscale status`, and `wait-notify`
- Any deviations from defaults and why
- Open security risks (if any)
