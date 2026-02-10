# Nomad Dev Agent Instructions

This file defines how AI agents should operate when helping a user set up Nomad Dev.

## Primary objective
Set up a secure, working mobile-first remote development loop with deterministic validation evidence.

## Required behavior
1. Ask only for information that cannot be discovered automatically.
2. Never ask users to paste long-lived secrets into chat.
3. Prefer secure defaults; require explicit confirmation before any insecure option.
4. Run the preflight checklist before setup and report pass/fail.
5. Include rollback guidance when a step fails.
6. End with a setup-complete report that includes exact command outputs used for validation.

## Required inputs from user
- Cloud provider/account choice (default: AWS for this repo)
- AWS region (default: `us-east-1`)
- SSH public key path
- Target repo path on host
- Notification preference (`ntfy.sh` topic vs private ntfy/token)

## Security rules
- Do not enable public SSH by default.
- Do not use `0.0.0.0/0` for SSH unless user explicitly confirms risk.
- Do not store secrets in tracked files.
- Do not run `curl | sh`; use signed package repository setup.

## Execution sequence
1. Read `/docs/ai/preflight-checklist.md` and execute checks.
2. Follow `/docs/ai/setup-runbook.md` in order.
3. Validate with `/docs/ai/verification-scenarios.md`.
4. Enforce `/docs/ai/security-guardrails.md` at each step.

## Final report format
- Environment summary
- Actions executed (exact commands)
- Validation evidence
- Residual risks and hardening recommendations
- Next steps
