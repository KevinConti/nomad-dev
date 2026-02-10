# AI Security Guardrails

## Non-negotiable rules
1. Never commit secrets, tokens, private keys, or personal absolute paths.
2. Never request long-lived secrets in chat.
3. Never enable insecure defaults silently.
4. Never recommend `curl | sh` for host bootstrap.
5. Never open SSH to `0.0.0.0/0` unless the user explicitly accepts risk.

## Allowed insecure exceptions (explicit consent required)
- Public SSH ingress for temporary troubleshooting.
- Wide CIDRs for short-lived debugging.
- Public ntfy topics without tokens.

## Required warning format
When an insecure option is requested, include:
- Risk being introduced
- Safer alternative
- Exact rollback step

## Output requirements
Every setup response must include:
- What changed
- Why it changed
- Evidence of validation
- Remaining risk
