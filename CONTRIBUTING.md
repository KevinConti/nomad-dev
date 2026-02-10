# Contributing

Thanks for contributing to Nomad Dev.

## Development principles
- Keep secure defaults intact.
- Treat all infrastructure and scripts as internet-facing by default.
- Avoid introducing breaking behavior without documenting migration steps.

## Pull request requirements
- Explain what changed and why.
- Include validation evidence (commands + results).
- Keep docs updated for any behavior/config changes.
- Pass CI checks.

## Security expectations
- Never commit secrets, tokens, private keys, or personal host paths.
- Do not add `curl | sh` install patterns.
- Do not weaken SSH/network controls by default.
- If insecure behavior is necessary, make it explicit and opt-in.

## Local validation
At minimum, run:
```bash
bash -n scripts/nomad-dev scripts/host-setup-ubuntu.sh template/scripts/nomad
```

If available, also run:
```bash
shellcheck scripts/* template/scripts/*
```

## Code of conduct
Be respectful, concise, and technically specific in issues and PR reviews.
