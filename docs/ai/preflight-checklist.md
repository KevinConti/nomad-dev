# AI Preflight Checklist

Run these checks before making changes.

## Local environment checks
1. `aws sts get-caller-identity`
Pass: command returns account identity.

2. `pulumi version`
Pass: Pulumi CLI available.

3. `node --version`
Pass: Node.js 18+ available.

4. `npm --version`
Pass: npm available.

## Repo checks
1. Confirm secure defaults in Pulumi config contract:
```bash
rg -n "enablePublicSsh|allowWideOpenSsh|allowedSshCidr" infra/pulumi-aws/index.ts
```
Pass: options exist and secure defaults are present.

2. Confirm no tracked local secrets/templates:
```bash
rg -n --hidden -g '!**/node_modules/**' -g '!.git/**' "AKIA|ASIA|BEGIN [A-Z ]+PRIVATE KEY|ghp_|github_pat_|tskey-"
```
Pass: no secret hits.

3. Validate script syntax:
```bash
bash -n scripts/nomad-dev scripts/host-setup-ubuntu.sh template/scripts/nomad
```
Pass: zero syntax errors.

## Gating rules
- Do not proceed if AWS identity cannot be verified.
- Do not proceed if secret scan finds a real credential.
- Do not proceed if shell scripts fail syntax checks.
