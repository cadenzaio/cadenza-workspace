# PostgreSQL Reconciliation Authority

Date: 2026-07-17

## Context

Sprint 7A established a language-neutral reconciliation contract and a pure,
bounded, deterministic TypeScript planner. A plan is not authority by itself:
PostgreSQL must serialize one stem owner, issue the exact state being planned,
reject stale plans, bind effects to committed actions, and preserve immutable
outcomes without absorbing placement policy or becoming a scheduler.

Global semantic authority revision alone cannot fence generation observations,
residencies, action history, or time-based expiry. Recomputing a source digest
at commit time is also invalid because snapshots contain authority-supplied
time and time-relative projections.

## Decision

- Add an isolated additive PostgreSQL reconciliation authority migration in the
  official `cadenza/environment-bootstrap` package.
- Store desired state and overrides relationally with append-only revisions.
- Custody verified cell-generation observations and derive current generation
  and replica convergence from current signed evidence.
- Serialize initial stem ownership and renewal with one lease projection and
  immutable lease events; expired-owner takeover remains Sprint 7F.
- Issue and persist exact canonical snapshots with internal input/control
  revisions and earliest semantic expiry.
- Accept a plan only while its issued snapshot, semantic authority revision,
  lease epoch, state revisions, and time fence remain current.
- Keep placement policy exclusively in the Sprint 7A planner. SQL validates
  contracts and applies precommitted exact effects only.
- After the first stem lease activates reconciliation, close direct replica
  definition and assignment mutation; later effects require a committed plan
  action.
- Preserve plans, actions, applications, outcomes, observations, snapshots,
  desired revisions, override revisions, and lease events immutably.
- Use narrow NOLOGIN roles for operator, observation-appender, stem, auditor,
  and function-owner boundaries. Chambers receive private facades, never
  database credentials.
- Verify Ed25519 at the authenticated cell-transport provider, then require
  canonical-byte, digest, current-enrollment-key, TTL, monotonicity, and narrow
  role checks inside PostgreSQL.

## Consequences

- A snapshot digest becomes custodial evidence rather than an unverified caller
  claim.
- Lease renewal by the same owner does not create semantic plan churn, while
  expiry or ownership change always fences mutation.
- Manual or unrelated authority changes between plan actions stop later effects
  and require replanning from current state.
- PostgreSQL gains exact reconciliation storage and effect operations but no
  candidate selection, packing, host provisioning, or general job API.
- Initial static placement remains available before reconciliation activation.
- The database signature boundary remains explicit and testable instead of
  claiming unsupported native Ed25519 verification.

## Alternatives

- Recomputing snapshots at plan commit was rejected because time-relative state
  makes equivalent authority produce a different digest and can cross expiry
  boundaries without writes.
- Fencing only with global authority revision was rejected because runtime
  evidence and control history can change independently.
- Implementing the planner in SQL was rejected because it would create a second
  policy authority and weaken cross-language conformance.
- Storing all state only as JSONB was rejected because revisions, ownership,
  referential integrity, and projections benefit from relational constraints.
- A separate reconciliation service was rejected because it would duplicate
  Cadenza identity, authority, evidence, and deployment boundaries.
- Allowing the stem to invoke existing placement operations directly was
  rejected because plans would remain advisory and targets could drift.

## Links

- [Approved Sprint 7B design](../agent-harness/exec-plans/completed/2026-07-17-reconciliation-postgres-authority-sprint-7b-design.md)
- [Sprint 7 parent decision](2026-07-17-scale-placement-reconciliation.md)
- [Sprint 7A closure](../contracts/distribution/sprint-7a-closure-review-v0.md)
- [Sprint 7B closure review](../contracts/distribution/sprint-7b-closure-review-v0.md)
- [Neutral reconciliation contract](../../cadenza/contracts/reconciliation/v0/README.md)
