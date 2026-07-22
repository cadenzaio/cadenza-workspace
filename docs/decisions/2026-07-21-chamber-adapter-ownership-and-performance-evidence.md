# Chamber Adapter Ownership And Performance Evidence

Date: 2026-07-21

## Context

The TypeScript language adapter was co-located with Chamber but its ownership
was not explicit. The TypeScript core also contained four performance tests
that measured unawaited and overlapping work, shared singleton/reporter state,
generated heap snapshots by default, and enforced uncalibrated timing and
memory thresholds.

## Decision

Chamber owns the neutral language-adapter protocol, lifecycle, artifact format,
acceptance/conformance surface, and current co-located adapter implementation
packages. The TypeScript core owns only the primitive runtime API consumed by
the adapter. Environment authority approves exact adapter artifacts and Cell
owns containment and process custody.

Retire the legacy performance tests. Keep deterministic lifecycle and cleanup
assertions in the default correctness suite. Move performance and retained
memory measurement to explicit isolated-process benchmark commands that await
completed work, retain mandatory evidence/custody behavior, and generate heap
snapshots only through explicit opt-in.

Establish the first measurements as a transparent baseline before adopting
regression budgets.

## Consequences

- the TypeScript adapter remains under `cadenza-chamber/adapters/typescript`.
- core does not import Chamber or adapter behavior.
- future adapters remain co-located by default while the protocol matures and
  may split only with evidence for an independent lifecycle.
- normal test commands contain no timing or GC thresholds and create no heap
  artifacts.
- benchmark results include environment metadata and are not stable-release
  performance promises.
- no new benchmark dependency is introduced.

## Alternatives

- moving the adapter into core was rejected because it reverses the runtime
  dependency direction.
- moving it into Environment or Cell was rejected because approval and
  containment are not language translation ownership.
- creating a separate adapter repository now was rejected as premature
  operational complexity.
- loosening the old thresholds was rejected because the workloads themselves
  were invalid.

## Links

- [Approved Amendment](../publication/sprint-9a-adapter-ownership-performance-harness-amendment-v1.md)
- [Language Runtime Contract](../cadenza-language-runtime-contract.md)
- [Sprint 9 Plan](../agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md)
