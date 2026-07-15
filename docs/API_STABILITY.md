# <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> API Stability Contract

To enable ecosystem-wide trust, `talak-web3` adheres to a strict stability contract. This document defines which interfaces are safe for production relyance and how we handle breaking changes.

---

## 1. <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Stable APIs (Tier 1)

These APIs are guaranteed to follow SemVer and will receive long-term support (LTS). Breaking changes require a major version bump and a 6-month deprecation period.

- **Auth Interface**: `login()`, `logout()`, `refresh()`.
- **Plugin Lifecycle**: `onBeforeRequest`, `onResponse`, `onInit`.
- **RPC Proxying**: The standard JSON-RPC mapping layer.
- **Client SDK Hooks**: `useAuth()`, `useUnifiedRpc()`.

## 2. <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Experimental APIs (Tier 2)

These APIs are evolving and may change between minor versions. Use with caution in production.

- **AI-Driven Transaction Optimization**: Automatically selecting gas parameters.
- **New Service Adapters**: Emerging storage or identity adapters.
- **Advanced CLI Commands**: Interactive scaffolding tools.

## 3. <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Breaking Change Policy

1. **RFC Process**: Any breaking change to a Tier 1 API must be proposed via a GitHub issue as an RFC.
2. **Deprecation**: Deprecated features will trigger console warnings for one full major version before removal.
3. **Migration Guides**: Every major release will include an automated or manual migration guide in the [CHANGELOG](../CHANGELOG.md).

---

## 4. Pending Breaking Changes (planned for next major version)

The changes below to the Tier-1 `TalakWeb3Auth` interface are **already landed in source** but will be released under a future **SemVer-major** bump, with a migration guide per §3. They are documented now so consumers can prepare ahead of the versioned release.

### `TalakWeb3Auth` contract changes

- **`verifySession(token, context?)` return type** changed from `{ address: string; chainId: number }` to `SessionPayload`. `SessionPayload` still exposes `address` and `chainId`, so read-only consumers are unaffected; consumers that relied on the nominal tuple type must update their types.
- **`revokeSession` signature** changed from `revokeSession(token)` to `revokeSession(accessToken: string, refreshToken?: string)`. Revocation now accepts the access token (revoked by `jti`) and optionally the refresh token (revoked independently). Old single-argument callers must pass the access token as the first argument.
- **New required methods** added to the interface (implementers must provide them):
  - `forceGlobalInvalidation(): Promise<void>`
  - `signJwt(payload: SessionPayload): Promise<string>`
  - `getJwks(): Promise<JwksResponse>`
  - `createNonce(address: string, meta?: { ip?: string; ua?: string }): Promise<string>`
  - `refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>`

**Migration impact**: consumers that only call `loginWithSiwe` / `refresh` / `verifySession` and read `address` / `chainId` require no code change. Custom `TalakWeb3Auth` implementers must add the five new methods before upgrading to the major version that ships these changes.

[Back to Root README](../README.md)
