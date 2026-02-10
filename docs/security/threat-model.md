# Threat Model

## Assets
- Cloud account resources and billing exposure
- SSH access to the host
- Source code in target repositories
- ntfy channels and tokens
- Pulumi state/config

## Adversaries
- Internet-wide opportunistic scanners
- Credential harvesters and secret scrapers
- Attackers abusing misconfigured SSH/network controls
- Malicious contributors introducing backdoors

## Entry points
- Public network ingress rules (SSH, UDP)
- Bootstrap/install scripts
- CI pipelines and third-party actions
- Checked-in configuration files
- Notification endpoint/topic abuse

## Major risks and mitigations
1. Public SSH brute force / probing
- Mitigation: `enablePublicSsh=false` default, explicit CIDR required, block world-open by default.

2. Supply-chain compromise via remote script execution
- Mitigation: avoid `curl | sh`; use signed apt repository setup.

3. Secrets committed to repository
- Mitigation: `.gitignore`, secret scanning workflow, pre-publish checks.

4. Config command injection
- Mitigation: strict config parser in `template/scripts/nomad` (no `source`).

5. Notification channel spoofing
- Mitigation: random topics by default, optional token-based auth, recommend private topics for sensitive use.

## Residual risks
- User-enabled insecure options can still increase attack surface.
- Security depends on user key hygiene and cloud account hygiene.
- This project is a developer environment template, not a full hardened enterprise baseline.
