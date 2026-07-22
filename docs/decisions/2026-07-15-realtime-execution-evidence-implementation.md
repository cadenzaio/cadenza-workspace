# Realtime Execution Evidence Implementation

Date: 2026-07-15

## Context

The approved realtime execution-evidence protocol defines one causal account
across core primitives, chambers, cells, and distribution. Implementing it
requires a shared machine contract, honest observation boundaries, durable
local custody, post-custody meta processing, and immutable projection authority.

Integration review established that a chamber cannot independently prove the
internal execution of a task in a language runtime, and that adapter queue
acceptance cannot satisfy the protocol's durable-custody invariant.

## Decision

- execution evidence distinguishes `runtime_reported`, `chamber_observed`,
  `cell_observed`, and `authority_committed` observation bases.
- official core runtimes use a bounded reporter with abstract durable custody
  barriers at mandatory transitions.
- cell custody uses a bounded signed segmented journal reached through a narrow
  chamber-to-cell channel.
- evidence uses a dedicated cell signing key rather than control or transport
  keys.
- one TypeScript evidence-processing meta slice per active cell drains custody
  through narrow capabilities into an immutable PostgreSQL ledger.
- legacy context-carried execution authority, metric/evidence signals, and raw
  graph exports are removed rather than maintained in parallel.
- implementation proceeds through six separately reviewed passes, beginning
  with shared contracts and TypeScript core authority.

## Consequences

- mandatory custody barriers prioritize trustworthy consequence over maximum
  throughput.
- core runtimes remain persistence-agnostic but cannot claim official
  affect-bearing conformance with an immediately acknowledging in-memory sink.
- internal runtime reports state their limited assurance honestly; external
  effects require direct trusted-boundary evidence.
- PostgreSQL availability is not in the business-success path after local
  custody.
- Sprint 7 remains blocked until all six implementation passes close.

## Alternatives

- treating adapter queue acceptance as custody was rejected because evidence
  could be lost after business success.
- claiming chamber observation of task internals was rejected because those
  internals execute inside the language runtime.
- writing directly to PostgreSQL from execution was rejected because it would
  couple business availability to the global ledger.
- using one remote environment processor was rejected because cell-local
  custody should not depend on another cell.
- reusing control or transport signing keys was rejected because evidence has
  a distinct compromise and retention domain.

## Links

- [Approved semantic protocol](../contracts/execution-evidence/v0.md)
- [Approved implementation proposal](../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md)
- [Implementation coherence review](../contracts/execution-evidence/implementation-coherence-review-v0.md)
- User approval with `Design approved. Proceed.` on 2026-07-15.
