# `packages/` — library packages

This directory contains **publishable libraries** and tooling for [talak-web3](https://github.com/dagimabebe/talak-web3): core runtime, auth, RPC, React hooks, CLI, templates, and more.

## Package index

See **[`packages.md`](../packages.md)** in the repository root for a **full table** of every workspace package: npm name, path, short summary, and link to each package README.

## Naming

- All scoped packages live under `packages/<name>/` and publish as `@talak-web3/<name>` (for example `packages/auth` → `@talak-web3/auth`).
- The umbrella SDK package lives at `packages/talak-web3` and publishes as `talak-web3` (no scope).

## Development

From the monorepo root:

```bash
pnpm install
pnpm build
pnpm --filter @talak-web3/core build
```

See the root [README.md](../README.md) for CI, testing, and contribution guidelines.
