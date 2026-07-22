# Cell Custody And Distribution Identity

Date: 2026-07-15

## Context

Sprint 6D.3 established validated chamber capture and a dedicated custody
channel, but trusted execution still lacked durable cell-owned custody.
Distribution also reused one generic correlation value for several distinct
causal facts. The resulting ambiguity could not support authoritative realtime
execution evidence or safe affect-bearing failure semantics.

## Decision

- Bind a purpose-separated Ed25519 evidence key to cell enrollment in V0.
- Give each cell generation one cell-owned, bounded, append-only segmented
  journal through a pre-opened directory descriptor.
- Return `cell_durable` custody only after a canonical record is synced.
- Recover only valid history, truncate only an incomplete final frame, and
  quarantine all complete or non-final corruption.
- Seal journal segments as signed immutable custody batches with explicit claim
  and acknowledgement sidecars.
- Preserve terminal evidence capacity and fail closed before new affect when
  normal custody capacity is exhausted.
- Replace generic correlation with explicit trace, source-effect,
  distribution-execution, transport-attempt, signal, inquiry, and idempotency
  identities.
- Continue a trace across target ingress while creating a new local target graph
  execution.
- Keep substrate execution identities out of authored business context.
- Preserve the existing activation-proof input until a durable projection proves
  equal or stronger authority.

## Consequences

- `cadenza` authority contracts and schemas change first, followed by chamber
  and cell consumers.
- This is an intentional new-major breaking change with no compatibility path.
- Database availability remains outside the execution-success path.
- Custody loss can stop new work and terminal custody loss after possible affect
  is reported as an evidence-integrity failure, not a safe retry.
- V0 has one evidence key per enrollment. Independent rotation requires a later
  additive authority decision that preserves historical verification.
- Production durability claims require Linux filesystem conformance tests.

## Alternatives

- Reusing transport or control keys was rejected because evidence has a
  different compromise and retention domain.
- Direct PostgreSQL custody was rejected because it would couple execution
  availability to database availability.
- SQLite and a separate daemon were rejected because they enlarge the trusted
  surface without improving the required append, seal, replay, and ack model.
- Idempotency-as-correlation and exactly-once networking claims were rejected as
  semantically ambiguous.
- Putting execution identities in business context was rejected because it
  leaks substrate mechanics into authored logic and persisted application data.

## Links

- [Approved design](../agent-harness/exec-plans/completed/2026-07-15-cell-custody-distribution-identity-design.md)
- [Sprint 6D implementation plan](../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md)
- [Execution evidence protocol](../contracts/execution-evidence/v0.md)
