# Sprint 7C.1 Materialization And Issuance Authority Closure Review

Date: 2026-07-17

## Status

Sprint 7C.1 closed with explicit user approval on 2026-07-17. Sprint 7C.2 may
proceed under the approved parent design.

## Intended Whole

This pass gives an assigned cell everything required to receive exact source
materialization authority and an independently verifiable activation grant
without placing either the environment root key or issuer key in the cell.
It reduces deployment coordination around authored business and meta logic
while keeping placement, signing, process custody, and execution semantics in
separate authority layers.

## Implemented Authority

- `RuntimeSlice.Register` now atomically custodies bounded canonical artifact
  bytes and the canonical runtime-support manifest with raw and canonical
  SHA-256 verification. No incomplete dynamic registration is accepted.
- migration 008 adds immutable materialization, delegated issuer, revocation,
  grant reservation, signed-grant, operation-evidence, convergence projection,
  and runtime-observation authority.
- grant issuance is two phase: PostgreSQL derives and reserves the complete
  grant body from current authority; the issuer may sign only that digest; the
  exact signed value is then recorded immutably.
- the activation reader returns assignment authority only for the exact signed
  reservation while delegation, generation, assignment, placement membership,
  materialization, and artifact authority remain current.
- the Chamber verifies the root-signed delegation, issuer SPKI digest, issuer
  signature, grant digest and lifetime, delegated scope, and exact current
  assignment before artifact resolution.
- the Cell operational host resolves root, issuer, and cell keys separately.
  It requests assignment-bound authority and never receives a signing key.
- grant `0.2.0` is the only operational contract in this major-version line.
  The direct-root `0.1.0` constructor and fixture path were removed.

The prebuilt bootstrap authority slice remains a bootstrap exception and does
not claim dynamic source materialization. A placement projection fails closed
if any assigned dynamic member lacks materialization custody.

## Proved Scenarios

- exact registration accepts canonical artifact and runtime-support authority;
  byte, digest, handler, support, and canonicalization drift are rejected.
- equal delegation, reservation, and signature operations replay exactly;
  conflicting request or idempotency identity is rejected.
- revoked, expired, wrong-key, unsupported-runtime, unsupported-handler,
  stale-generation, stale-assignment, wrong-cell, and wrong-member authority
  fail before activation affect.
- a multi-member replica becomes routable only when every required member has
  current ready residency.
- materializing and ready observations advance only through the narrow appender
  role; broad post-reconciliation residency mutation remains closed.
- reader, issuer, delegation operator, observation appender, gateway, auditor,
  and `PUBLIC` cannot cross their function or table boundaries.
- the Cell and Chamber reject delegation, issuer-key, assignment, generation,
  chamber, grant, and evidence-chain drift.
- the official Linux fixture now performs real delegated registration,
  reservation, issuer signing, signature recording, and exact authority reread.

## Linux Evidence

The provisioned ARM64 Ubuntu/gVisor environment passed:

- the complete non-ignored Linux `cadenza-cell` all-target suite.
- focused compilation of the platform-gated two-cell target after final API
  normalization.
- the root-only two-cell gVisor proof in 86.16 seconds, including five contained
  chambers, delegated activation, assignment-bound reread, multi-member
  routing, execution-evidence processing, suspension, drain, stop, and cleanup.

This is stronger 7C.1 integration evidence, not a claim that 7C.4 autonomous
convergence is complete. The proof still uses the bounded static controller
path that 7C.3 will remove from production operation.

## Coherence Review

### Purpose

Every new runtime type and database object serves materialization custody,
delegated issuance, exact authority verification, projection, observation, or
host propagation. The scan found and removed the stale direct-root Linux grant
constructor. Issuer-key input is proof-shaped: required for an operational
grant and nullable for bootstrap handoff.

### Layer Integrity

- PostgreSQL owns semantic derivation and immutable issuance evidence.
- the issuer owns only its private key and exact reserved-digest signature.
- the Cell owns key resolution, current-authority mediation, and process custody.
- the Chamber owns cryptographic verification and controlled materialization.
- notifications remain hints; no runtime authority is inferred from them.

### Corrections Discovered

1. Issuance initially labeled adapter isolation `host_contained`. The Linux
   proof showed this conflated Cell containment with adapter identity. Grants
   now use `chamber_process`; gVisor containment remains a separate measured
   Cell boundary.
2. The Linux fixture initially reused deterministic convergence request keys
   across fresh databases. The launcher replay ledger correctly rejected the
   resulting globally reused nonce. Fixture requests now include a per-run
   identity while retaining exact replay within a run.
3. The convergence reader lives in the
   `cadenza_runtime_convergence` authority schema rather than the broader
   distribution schema proposed initially. This makes ownership and grants
   explicit and avoids expanding the legacy distribution reader surface.

No unresolved coherence issue should precede Sprint 7C.2.

## Security Boundary

PostgreSQL validates canonical delegation custody and agreement with the active
root record, but does not perform native Ed25519 verification. The authenticated
delegation operator supplies the verified root-key reference after external
signature verification. The Chamber independently verifies the root signature
at use time. This is an explicit custody boundary, not a claim that PostgreSQL
cryptographically verified the signature.

Migration 008 deliberately has several small `NOLOGIN` roles and a large exact
function surface. This increases operational setup cost, but avoids generic SQL,
generic signing, table access, or shared runtime credentials. Role count and
function ownership must remain part of every later operational-complexity
review.

## Deferred Scope

- the separate issuer service/client and private-key descriptor custody: 7C.3.
- the pure no-churn local convergence decision engine: 7C.2.
- notification coalescing, safety cadence, renewal, withdrawal, replacement,
  and automatic route installation: 7C.2 and 7C.3.
- autonomous outage, recovery, restart, pressure, and final Linux proof: 7C.4.
- issuer high availability and concurrency optimization: later measured passes.

## Validation

- environment-bootstrap: typecheck and 68 tests passed across 14 files.
- cadenza-chamber: complete all-target tests, format, and strict all-feature
  Clippy passed.
- cadenza-cell: complete macOS all-target tests, Linux all-target tests, format,
  strict all-feature Clippy, focused final Linux compile, and gVisor proof passed.
- neutral JSON schemas parsed successfully.
- the machine-sensitive TypeScript core performance test remains deferred by
  prior agreement and is unrelated to this authority gate.
