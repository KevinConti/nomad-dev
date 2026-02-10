# AI Verification Scenarios

## Scenario 1: Secure default infrastructure
Commands:
```bash
cd infra/pulumi-aws
pulumi preview
```
Expected:
- No public SSH ingress rule unless `enablePublicSsh=true`.

## Scenario 2: Reject world-open SSH without explicit override
Commands:
```bash
pulumi config set enablePublicSsh true
pulumi config set allowedSshCidr 0.0.0.0/0
pulumi preview
```
Expected:
- Preview fails with explicit error requiring `allowWideOpenSsh=true`.

## Scenario 3: Allow explicit override for world-open SSH
Commands:
```bash
pulumi config set allowWideOpenSsh true
pulumi preview
```
Expected:
- Preview succeeds.

## Scenario 4: Notification script rejects invalid config
Set invalid values in `.nomad-dev/config.env`.
Expected:
- `template/scripts/nomad notify` fails with clear validation error.

## Scenario 5: End-to-end notify loop
Commands:
```bash
./scripts/nomad-dev install --target /path/to/repo
cd /path/to/repo
./scripts/nomad wait-notify 10 "nomad test"
```
Expected:
- Notification arrives on subscribed device.
