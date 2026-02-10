# Hardening Checklist

## Before publish
- Remove any local login URLs, tokens, and personal paths.
- Ensure sample configs use placeholders only.
- Confirm top-level `.gitignore` excludes secrets and local artifacts.
- Run secret scan on working tree.
- Validate script syntax and lint shell scripts.
- Confirm docs never instruct `curl | sh`.

## Infrastructure hardening
- Keep `enablePublicSsh=false` unless required.
- If enabling public SSH, set narrow `allowedSshCidr`.
- Do not set `allowWideOpenSsh=true` unless temporary and justified.
- Keep IMDSv2 required (`httpTokens=required`).

## Runtime hardening
- Rotate SSH keys periodically.
- Use Tailscale ACLs/tags for least privilege.
- Keep Ubuntu packages updated.
- Use private ntfy topics with tokens for sensitive notifications.

## CI and governance
- Enable secret scanning and push protection in GitHub.
- Require branch protection and passing checks.
- Keep dependencies updated via Dependabot.
- Maintain SECURITY.md reporting path.
- Follow `/docs/security/public-release-checklist.md` before first public push.

## Pre-release verification commands
```bash
rg -n --hidden -g '!**/node_modules/**' -g '!.git/**' "AKIA|ASIA|BEGIN [A-Z ]+PRIVATE KEY|ghp_|github_pat_|tskey-"
bash -n scripts/nomad-dev scripts/host-setup-ubuntu.sh template/scripts/nomad
```
