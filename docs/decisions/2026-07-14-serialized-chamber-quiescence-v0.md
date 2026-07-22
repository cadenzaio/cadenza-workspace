# Serialized Chamber Quiescence V0

Date: 2026-07-14

## Context

Sprint 5 replacement used one serialized cell-chamber command stream, but the
wire contract reported `active_executions: 0` as a constant. That field implied
concurrent execution state that the implementation neither created nor
observed. Preserving it would export false confidence and dead contract surface
into the first environment.

The current serialized path already has a narrower, honest temporal guarantee:
a drain command cannot be interpreted until every earlier command on the same
connection returns. Delegation deadlines, cancellation, and chamber
supervision bound work that does not return.

## Decision

- V0 processes one cell command at a time on each chamber control connection.
- An accepted drain is interpreted only after earlier commands on that stream
  have completed, transitions the chamber to `draining`, and closes new ingress
  before acknowledgement.
- The drain acknowledgement is the V0 quiescence evidence. It does not include
  an active-execution count.
- `active_executions` is removed from status and drain responses, and drain
  returns acknowledgement rather than a count.
- The breaking cell-chamber protocol advances to `0.5.0`.
- Concurrent chamber execution, command multiplexing, and true in-flight drain
  coordination are deferred to an explicit optimization pass after the first
  Cadenza environment is complete.

## Consequences

- The contract expresses only consequential state and no longer simulates a
  concurrency capability.
- Successor-first replacement remains deterministic: publish and acknowledge
  the successor, close predecessor ingress, drain the serialized predecessor,
  then stop it.
- V0 throughput is intentionally limited by serialized chamber command
  handling. This is accepted foundation behavior, not an accidental promise
  about the final performance model.
- A future concurrency pass must introduce explicit execution identity,
  cancellation, accounting, ordering, and drain semantics through a new design
  and protocol version.

## Alternatives

- Keep the constant counter for future use: rejected because dead state weakens
  contract clarity and can be mistaken for a proven safety condition.
- Implement concurrent chamber execution now: deferred because it expands the
  lifecycle and failure model before the first environment proves the complete
  serialized architecture.
- Remove drain entirely: rejected because successor replacement and orderly
  shutdown still require an explicit no-new-ingress lifecycle transition.

## Links

- [Sprint 5 execution plan](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
- [Local orchestration contract](../contracts/local-orchestration/v0.md)
- User decision on 2026-07-14 to defer concurrency until after the first Cadenza environment.
