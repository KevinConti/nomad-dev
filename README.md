# Nomad Dev

## Why this exists
Nomad Dev exists to make mobile-first AI coding practical in the real world.

Most remote workflows break down on phones because sessions die, reconnects are painful, and setup is inconsistent across machines. Nomad Dev gives you a repeatable way to run coding agents on a VPS while controlling everything from your phone.

## Value delivered
- Faster setup: provision and bootstrap a host with repeatable scripts.
- Resilient sessions: use tmux, Mosh, and Tailscale for unstable networks.
- Mobile-first operation: run Codex or Claude Code from iOS/Android terminal apps.
- Notification loop: receive ntfy prompts when an agent needs input.
- Security-first defaults: no public SSH by default, explicit opt-in for less secure settings.

## Who this is for
- Engineers who want to run AI coding agents from mobile devices.
- People comfortable with command-line tools and cloud infrastructure basics.
- Teams that want a sharable template for secure remote dev hosts.

## Who this is not for
- Users looking for a no-CLI, GUI-only workflow.
- Production multi-tenant hosting of untrusted workloads.
- Mobile app build pipelines by themselves (this is an agent-host workflow toolkit).

## High-level architecture
1. Pulumi provisions an Ubuntu 22.04 EC2 host.
2. Bootstrap installs core tools (`git`, `tmux`, `mosh`, `tailscale`).
3. `scripts/nomad-dev` installs repo-local notification helpers into target repos.
4. On the phone, you connect through Tailscale (optionally Mosh) and run the agent in tmux.
5. ntfy notifications alert you when the agent is waiting for input.

## Secure quickstart
For a complete walkthrough, use `/docs/human/quickstart.md`.

1. Provision infrastructure:
```bash
cd infra/pulumi-aws
npm ci
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set sshPublicKeyPath ~/.ssh/nomad-dev.pub
pulumi config set rootVolumeSizeGiB 30
pulumi up
```

2. Keep secure defaults (recommended):
- Leave `enablePublicSsh=false`.
- Keep `enableMosh=true` for Tailscale-based Mosh sessions.
- Leave `enablePublicMoshIngress=false` unless you intentionally want public Mosh UDP exposure.
- Leave `enableTailscaleUdp=false` unless you need direct UDP.

3. Install Nomad Dev files into a repo on the host:
```bash
/home/ubuntu/mobile-dev/scripts/nomad-dev install --target /path/to/repo
```

4. Validate notifications:
```bash
cd /path/to/repo
./scripts/nomad wait-notify 10 "nomad test"
```

## Documentation map
- Human docs (start here): `/docs/human/quickstart.md`
- iOS flow details: `/docs/phase-1-ios.md`
- Infrastructure details: `/docs/infra-pulumi-aws.md`
- Host setup details: `/docs/host-setup-ubuntu-22-04.md`
- Claude Code setup: `/docs/claude-code.md`

AI-agent operator docs:
- Agent runbook: `/docs/ai/setup-runbook.md`
- Preflight checklist: `/docs/ai/preflight-checklist.md`
- Verification scenarios: `/docs/ai/verification-scenarios.md`
- Agent security guardrails: `/docs/ai/security-guardrails.md`
- Agent behavior contract: `/AGENTS.md`

Security docs:
- Threat model: `/docs/security/threat-model.md`
- Hardening checklist: `/docs/security/hardening-checklist.md`
- Public release checklist: `/docs/security/public-release-checklist.md`

## Security model and known limitations
- Secure-by-default network posture: no public SSH unless explicitly enabled.
- Tailscale is the preferred access path for administration.
- This project configures a developer host, not a hardened production bastion.
- If you choose public SSH or broad CIDRs, you increase attack surface.
- ntfy topics are not private unless protected (token or self-hosting).

## Cost expectations
- EC2 + storage + data transfer are billed by AWS.
- Typical t3.micro compute cost is often low, but pricing changes by region and usage.
- Always check current AWS pricing before running `pulumi up`.

## Contributing and vulnerability reporting
- Contribution guide: `/CONTRIBUTING.md`
- Security policy and private reporting: `/SECURITY.md`

## License
MIT (`/LICENSE`)
