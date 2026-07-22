# Coherent Cell Supply Capacity

Date: 2026-07-22

## Context

The definitive pre-enrolled supply proof started one demanded Cell but never
started the second. Normal placement tracked assignments, planned actions, and
signed generation occupancy in one reservation map. Cell supply discarded that
state and selected pending capacity from an empty map. It also omitted capacity
needed by the mandatory system-owned per-Cell evidence processor.

## Decision

Placement, Cell supply, and per-Cell support planning use one coherent
simulated capacity state. Supply fit is conservative against signed occupancy
and includes only missing mandatory support cost. The existing sequential,
demand-driven packing policy remains unchanged.

The reconciliation planner remains the single policy loop. No contract,
migration, provider, lifecycle, concurrency, or public API is added.

## Consequences

- A saturated running supplied Cell cannot hide demand for another Cell.
- A Cell is not started for ordinary work if mandatory local support leaves
  insufficient capacity.
- Signed runtime occupancy cannot be reused during authority lag.
- Generated stem fixtures change in Environment, Chamber, and Cell, while
  Chamber and Cell runtime implementations remain unchanged.
- Exact affected-source identities and aggregate release artifacts must be
  refrozen after the complete Linux proof.

## Alternatives

- Increasing proof time was rejected because the planner emitted no action
  capable of reaching convergence.
- Starting one Cell per missing replica was rejected because it abandons the
  bounded packing policy.
- Increasing test capacity was rejected because it hides the real scale-out
  boundary.
- Ignoring processor cost was rejected because processor readiness is required
  before ordinary work can execute.

## Links

- [Sprint 9F Cell Supply Occupancy Coherence Gate](../publication/sprint-9f-cell-supply-occupancy-coherence-gate-v1.md)
- [Pre-Enrolled Cell Supply](2026-07-19-pre-enrolled-cell-supply.md)
- [Automatic Per-Cell Evidence Processor Placement](2026-07-20-automatic-per-cell-evidence-processor-placement.md)
