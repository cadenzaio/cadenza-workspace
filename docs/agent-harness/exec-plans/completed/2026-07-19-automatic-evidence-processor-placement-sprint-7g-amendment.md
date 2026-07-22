# Sprint 7G Amendment: Automatic Per-Cell Evidence Processor Placement

Date: 2026-07-19

## Current Status

- State: `done`; implementation and validation completed and closure was
  approved on 2026-07-20.
- Complexity gate: required. This is a new placement meaning, a migration 012,
  and a cross-repo authority/runtime contract change.
- Parent:
  [Sprint 7G Scale And Orchestration System Closure](2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md).
- Approval phrase: `Design amendment approved. Proceed.`
- Approval received: `Design amendment approved. Proceed.` on 2026-07-20.
- Closure approval received: `Approved.` on 2026-07-20.
- Decision:
  [Automatic Per-Cell Evidence Processor Placement](../../../decisions/2026-07-20-automatic-per-cell-evidence-processor-placement.md).
- Closure review:
  [Sprint 7G Scale And Orchestration System Closure Review](../../../contracts/distribution/sprint-7g-closure-review-v0.md).

## Context

Sprint 6D.5 established the canonical TypeScript execution-evidence processor,
its narrow capability facades, nonrecursive policy, local claim custody,
ledger append authority, compaction, and one explicitly placed processor per
active Cell. Its approved design explicitly deferred automatic processor
placement and reconciliation to Sprint 7.

The first Sprint 7G combined Linux/gVisor proof reached real three-Cell supply,
placement, and Chamber readiness, then failed at the first durable-ledger
barrier. PostgreSQL contained zero ledger records because the environment had
no processor slice or placement. The Cells correctly retained sealed local
custody; there was no authorized Chamber to process it.

The missing behavior cannot be repaired coherently in the test harness:

- a normal desired processor replica on Demand C would itself create supply
  demand and prevent the Cell from becoming dormant.
- manually changing processor demand beside business demand would expose
  evidence infrastructure to the application author.
- processing Demand C's journal from a retained Cell would violate Cell-local
  custody and credential boundaries.
- starting a hidden host worker without a placed Cadenza slice would violate
  Cadenza's extension principle and bypass activation authority.

## Intended Meaning

Every active Cell has exactly one canonical local evidence-processor Chamber
while it can execute processing-eligible work. This Chamber is system support,
not application demand:

- it is derived from current Cell authority, not authored desired state.
- it is assigned only to its own Cell and processes only that Cell's journal.
- it cannot start or retain a dormant supplied Cell.
- it becomes ready before ordinary affect-bearing work is eligible there.
- it drains after ordinary work and before a supplied Cell is released.
- it uses the existing processor slice, capability facades, ledger credential,
  activation policy, and nonrecursive evidence rules unchanged.

## Proposed Approach

### 1. Add A System-Owned `per_cell` Placement Mode

Extend the neutral placement-unit contract with mode `per_cell`. A `per_cell`
unit declares one system-support replica per current active Cell and has these
fixed semantics:

- replica identity is stable per environment, unit, and Cell enrollment, not
  per transient Cell generation.
- assignment is pinned to that exact Cell.
- the unit does not consume or produce supply demand.
- its member slot cost still counts against an already active Cell's capacity.
- application desired-state and override operations cannot target it.
- only an authority-registered system-support unit may use the mode.

The execution-evidence processor is the first and only V0 `per_cell` unit.
The contract is general only at the placement semantic level; no generic
plugin, arbitrary lifecycle hook, or new controller is introduced.

### 2. Derive It In The Existing Reconciliation Stem

The deterministic planner derives exact processor replica and assignment
actions from the current active Cell set. The existing leased stem remains the
only policy loop and exact gateway operations remain the only mutation path.

For a retained Cell:

```text
current ready Cell generation
  -> processor replica and same-Cell assignment
  -> processor Chamber ready
  -> Cell eligible for ordinary placement and execution
```

For a supplied Cell:

```text
ordinary unsatisfied demand
  -> supply directive starts pre-enrolled Cell
  -> current ready Cell generation
  -> local processor assignment and readiness
  -> ordinary assignment and execution
```

The processor assignment is ignored when deciding whether application demand
requires a supplied Cell. On release, sequencing is reversed:

```text
ordinary assignments drain and stop
  -> routes withdraw
  -> processor flushes, acknowledges, drains, and stops
  -> processor assignment retires
  -> supply directive permits Cell stop and dormant profile
```

This avoids both circular supply demand and evidence loss during ordinary
drain.

### 3. Register Canonical Assets After Bootstrap Handoff

The existing canonical processor assets in `cadenza` remain authoritative.
The governed environment foundation preparation registers the processor slice
and defines its `per_cell` unit through authority operations after bootstrap
handoff. Migration SQL establishes schema and exact operation authority only;
it does not insert callable source or materialize the processor.

### 4. Gate Ordinary Eligibility, Not Host Existence

A Cell generation must exist before its local processor can be placed, so host
generation readiness cannot depend on processor readiness. Instead:

- reconciliation may create the processor assignment for a current ready Cell.
- ordinary business/meta placement eligibility requires the current local
  processor residency to be ready.
- the bootstrap stem may initially run while evidence is held in bounded local
  custody; it must converge the processor before admitting ordinary work.
- processor absence is an explicit unsatisfied prerequisite, never healthy
  application readiness.

### 5. Preserve Failure And Recovery Meaning

- processor failure removes ordinary placement eligibility but does not invent
  supply or move Cell-local custody elsewhere.
- bounded local custody and terminal reserve remain the fail-closed buffer.
- Cell generation replacement rematerializes the stable Cell-local processor
  replica under the new generation.
- abrupt permanent loss of a Cell may still lose untransferred local custody;
  this amendment does not pretend local disk is distributed durability.
- stem takeover does not move processor custody; the successor continues its
  own processor and reconciles current Cells under the new lease.

## Authority And Contract Changes

### `cadenza`

- add `per_cell` and system-support ownership to neutral placement contracts.
- extend planner input, output, fixtures, pressure bounds, and hostile tests.
- add migration 012 for final-schema constraints, projections, exact gateway
  operations, and stale lease/plan/assignment fencing.
- register and define the canonical processor through governed post-handoff
  foundation operations in conformance environments.

### `cadenza-cell`

- interpret the derived processor assignment through existing convergence and
  `EvidenceProcessorControl` paths.
- enforce ordinary eligibility and drain ordering without adding a second
  lifecycle loop.
- extend the combined Linux proof and focused restart/outage/pressure tests.

### `cadenza-chamber`

- conformance only unless exact projection or drain contracts prove a missing
  runtime invariant. No new Chamber feature is planned.

### Workspace Meta Repo

- update contract authority, scenario matrix, operational-loop inventory, and
  Sprint 7 closure evidence.

## Security Requirements

- standard Cells receive no authority, reconciliation, recovery, or generic
  ledger access beyond the existing processor facades.
- only the exact canonical processor slice may satisfy local processor
  readiness.
- application operations cannot define, scale, pin, suppress, or impersonate
  system-support replicas.
- processor placement cannot enroll Cells, launch processes, create demand, or
  select profiles.
- stale Cell generations, assignments, stem leases, plans, and processor
  residencies fail after replacement or takeover.

## Pressure And Boundedness

- at most one processor replica and one current assignment per enrolled active
  Cell.
- processor derivation is included in the existing planner action bound.
- repeated Cell observations or notifications produce no semantic churn.
- missing processor readiness produces one bounded unsatisfied reason rather
  than a retry queue.
- supply release has one explicit bounded drain path; no processor-created
  keepalive state is permitted.

## Migration Strategy

Add immutable migration `012_per_cell_system_support_authority.sql`. Migrations
001 through 011 remain unchanged. The migration must reject ambiguous existing
units and preserve all ordinary singleton/replicated behavior.

No backwards compatibility is required for this new major version, but the
migration must still prove deterministic upgrade from the current migration
011 schema because migration history is authoritative.

## Risks

- **Supply circularity:** a processor replica could retain the Cell it is
  supposed to help release. Mitigation: system support is excluded from supply
  demand and has explicit last-to-drain ordering.
- **Bootstrap circularity:** the stem is needed to place its own processor.
  Mitigation: bounded local custody permits bootstrap stem execution; ordinary
  work remains ineligible until the processor is ready.
- **Hidden scheduler growth:** `per_cell` could become a generic daemon model.
  Mitigation: authority-registered system support, one V0 use, exact contracts,
  and no generic hook or controller.
- **False readiness:** host readiness could be mistaken for evidence-ready
  execution. Mitigation: expose and test the separate ordinary eligibility
  prerequisite.
- **Drain deadlock:** processor removal and Cell stop could wait on each other.
  Mitigation: model and test the exact ordinary-stop, processor-flush,
  processor-stop, supply-stop order.

## Alternatives

### Static Processor Desired State

Rejected. It creates supply demand and keeps dormant Cells alive.

### Application-Managed Processor Counts

Rejected. It exposes evidence infrastructure and lifecycle coordination to the
application author.

### One Environment-Wide Processor

Rejected. It breaks Cell-local journal custody and purpose-separated provider
authority.

### Hidden Host-Native Processor

Rejected. It bypasses Cadenza slice registration, placement, activation, and
the principle that features extend Cadenza through its own primitives.

### Omit Durable Evidence From Sprint 7 Closure

Rejected. The approved Sprint 7 whole includes trustworthy execution evidence;
business output without transferable custody is false success.

## Exit Criteria

- migration 012 and neutral contracts define exact `per_cell` system support.
- planner deterministically derives one local processor per active Cell without
  creating supply demand.
- ordinary placement is ineligible until the local processor is ready.
- supplied Cell release drains the processor last and reaches dormant without
  deadlock.
- hostile application and standard-Cell attempts cannot affect system support.
- retained and supplied generation replacement rematerialize exact processor
  custody without stale affect.
- the Sprint 7G three-Cell proof transfers ledger evidence before and after
  stem takeover, resupplies fresh capacity, and cleans up fully.
- pressure, outage, no-churn, role-boundary, contract, and Linux/gVisor tests
  pass.

## Work Items After Approval

- [x] Specify neutral `per_cell` and system-support contracts and fixtures.
- [x] Implement migration 012 and exact authority operations.
- [x] Extend deterministic planner semantics and pressure tests.
- [x] Register the canonical processor through post-handoff authority.
- [x] Implement Cell eligibility and ordered drain interpretation.
- [x] Complete focused hostile, failure, restart, and no-churn tests.
- [x] Rerun the Sprint 7G combined proof and submit closure for review.
