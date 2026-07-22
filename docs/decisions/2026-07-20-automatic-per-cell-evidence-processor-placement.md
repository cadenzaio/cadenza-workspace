# Automatic Per-Cell Evidence Processor Placement

Date: 2026-07-20

## Context

Sprint 6D.5 established one explicitly placed execution-evidence processor per
active Cell and deferred automatic placement to Sprint 7. The first Sprint 7G
three-Cell proof reached supply and Chamber readiness but could not transfer
sealed journals to the durable ledger because Sprints 7A through 7F never
implemented that deferred placement responsibility.

A normal desired processor replica would create circular supply demand and
retain dormant Cells. Application-managed processor counts would expose
evidence infrastructure to business authors. A host-native hidden processor or
remote processor would bypass Cadenza placement and Cell-local custody.

## Decision

Add a system-owned `per_cell` placement meaning through migration 012 and the
existing reconciliation stem.

- one stable processor replica is derived per active Cell enrollment and
  assigned only to that Cell.
- system-support replicas do not create or retain Cell supply demand.
- ordinary affect-bearing placement on a Cell requires its local processor
  residency to be ready.
- ordinary work drains first; the processor flushes and drains last before a
  supplied Cell is released.
- canonical processor source remains registered after bootstrap handoff through
  governed authority operations; migration SQL contains no callable source.
- the current stem remains the only policy loop and exact gateway operations
  remain the only mutation path.

The complete contract, migration, runtime, pressure, security, and proof scope
is defined by the approved
[Sprint 7G amendment](../agent-harness/exec-plans/active/2026-07-19-automatic-evidence-processor-placement-sprint-7g-amendment.md).

## Consequences

- `cadenza` gains neutral `per_cell` system-support placement semantics,
  deterministic planner behavior, migration 012, and hostile authority tests.
- `cadenza-cell` interprets processor eligibility and ordered drain through its
  existing convergence worker and evidence processor control.
- supplied Cells can become evidence-ready without processor demand keeping
  them alive.
- host readiness and ordinary execution eligibility remain distinct,
  preventing false evidence-ready claims.
- per-Cell support is bounded to one canonical V0 processor and does not become
  a general daemon or lifecycle-hook facility.

## Alternatives

- Static processor desired state was rejected because it creates circular
  supply demand.
- Application-managed processor counts were rejected because they expose
  infrastructure complexity.
- One environment processor was rejected because evidence custody is
  Cell-local.
- A hidden native host worker was rejected because it bypasses Cadenza
  primitives and activation authority.
- Omitting durable evidence from Sprint 7 closure was rejected as false
  success.

## Links

- [Sprint 7G system closure](../agent-harness/exec-plans/active/2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md)
- [Execution-evidence ledger processing design](../agent-harness/exec-plans/completed/2026-07-16-execution-evidence-ledger-processing-design.md)
- [Parent Sprint 7 design](../agent-harness/exec-plans/active/2026-07-17-scale-placement-reconciliation-design.md)
