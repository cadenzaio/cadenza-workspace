# Sprint 7 Scale, Placement Reconciliation, And Orchestration Design Proposal

Date: 2026-07-17

## Status

- State: `done`; implementation and definitive validation completed and Sprint
  7 closure was approved on 2026-07-20.
- Current pass: Sprint 7A through Sprint 7F are complete and closure-approved.
  Sprint 7G repaired the automatic per-Cell execution-evidence processor
  placement exposed by its first combined proof, passed the definitive
  three-Cell Linux lifecycle, and completed recursive review.
- Completed amendment:
  [Automatic Per-Cell Evidence Processor Placement](2026-07-19-automatic-evidence-processor-placement-sprint-7g-amendment.md).
- Closure review:
  [Sprint 7G Scale And Orchestration System Closure](../../../contracts/distribution/sprint-7g-closure-review-v0.md).
- Detailed Sprint 7C proposal:
  [Autonomous Cell Runtime Convergence](2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md).
- Complexity gate: required. This sprint changes authority schemas, placement
  and lifecycle contracts, trusted-control execution, cell process behavior,
  runtime projections, host provisioning, and failure recovery across the
  workspace, `cadenza`, `cadenza-cell`, and `cadenza-chamber`.
- Approval received: `Design approved. Proceed.` on 2026-07-17.
- Closure approval received: `Approved.` on 2026-07-20.
- Parent roadmap:
  [Cadenza Official Roadmap](../active/2026-07-09-cadenza-official-roadmap.md).
- Preconditions: Sprint 6 and Sprint 6D are complete and accepted. The
  realtime execution-evidence prerequisite is satisfied.

## Context

### Problem

Sprint 6 established explicit placement units, stable replicas, static
assignments, signed residencies, derived route members, direct authenticated
cell transport, and trustworthy execution evidence. It intentionally requires
an external caller to define replicas, choose cells, refresh projections, and
drive cell/chamber lifecycle.

That is a correct static foundation but it does not yet express Cadenza's
intended whole. An application author should declare intended workload shape
and constraints, not repeatedly implement deployment, assignment, failover,
route refresh, or scale logic.

The older schema proposal describes useful concepts, but it combines several
different responsibilities under the word orchestration:

- deciding desired replica count and placement.
- observing cell and replica reality.
- committing authority changes.
- starting and stopping cell processes.
- converging chambers inside each cell.
- refreshing route projections and bridge bindings.
- later demand inference and runtime-memory optimization.

Implementing those as one scheduler or one large stem function would create a
second management architecture and concentrate excessive authority.

### Why Now

- static route residencies expire and currently require external refresh.
- current cell and chamber integration is proven strongly enough that an
  automated loop can inherit bounded, signed state rather than infer reality.
- execution evidence now makes reconciliation actions and failures observable.
- actor distribution should not begin until placement and residency are
  automatically stewarded.

### Evidence

- [Multi-Cell Distribution Contract V0](../../../contracts/distribution/v0.md)
  explicitly excludes automatic reconciliation.
- [Sprint 6 Closure Review](../../../contracts/distribution/sprint-6-closure-review-v0.md)
  records residency expiry and manual route refresh as the principal remaining
  orchestration risks.
- [Cadenza Environment](../../../cadenza-environment.md) defines the stem cell
  as one environment-local singleton placement unit.
- [Cadenza Schema Proposal](../../../cadenza-schema-proposal.md) defines useful
  desired-state, override, capacity, assignment, and bridge vocabulary but is
  explicitly non-authoritative and subject to coherent revision.
- [Sprint 6D System Closure](../../../contracts/execution-evidence/system-closure-v0.md)
  proves that local work, custody, retry, and distributed evidence remain
  trustworthy during central ledger outage and recovery.

## Intended Whole

Humans and agents declare:

- what executable slices belong together.
- how many replicas are desired.
- hard trust, capability, affinity, and placement constraints.
- narrow explicit overrides when automation must be steered.

Cadenza then converges cells, replicas, chambers, residencies, and routes
toward that declared state without exposing process control, credentials,
network topology, retry machinery, or deployment procedure to business logic.

False success includes:

- calling a planner without executing or evidencing its actions.
- creating a general-purpose scheduler or deployment service beside Cadenza.
- allowing a stem graph to hold root keys, database credentials, arbitrary
  process control, or generic host capabilities.
- reporting healthy scale while placement demand is unsatisfied.
- electing two active stem owners.
- treating stale observations as current authority.
- silently violating operator pins, blocks, trust, capability, or capacity.

## Governing Architecture

Sprint 7 establishes one reconciliation system with four separate roles.

```text
declared desired state + narrow overrides
  -> PostgreSQL semantic authority and observed-state projections
  -> one leased stem-cell graph computes a deterministic plan
  -> exact authority operations commit replica and assignment changes
  -> each Rust cell converges only its own chambers and residencies
  -> optional trusted cell-supply provider starts pre-enrolled dormant cells
  -> derived route projections converge automatically
  -> execution evidence records every meaningful boundary and outcome
```

### Semantic Authority

PostgreSQL owns:

- placement desired state and its revisions.
- sparse explicit overrides.
- current effective directives derived from desired state plus overrides.
- immutable reconciliation plans, actions, and outcomes.
- the current stem ownership lease and lease epoch.
- current replica definitions, assignment epochs, and signed observations.

Desired state is semantic authority. Observations are signed runtime claims.
Plans are derived proposals. An action becomes authoritative only through its
exact committed operation and evidence.

### Stem-Cell Graph

The stem cell is an ordinary singleton `trusted_control` placement unit. Its
authoritative implementation is one Cadenza meta slice, not a new primitive or
service.

The graph owns policy-level reconciliation:

1. read one revision-bound reconciliation snapshot.
2. derive the effective placement directive.
3. compute missing, surplus, displaced, or unhealthy replicas.
4. compute capacity and assignment actions deterministically.
5. commit the exact plan against the same snapshot and lease epoch.
6. dispatch only the fixed committed actions.
7. record outcomes and request another pass when reality changed.

The graph does not launch processes, read credentials, sign enrollment grants,
open database connections, interpret network endpoints, or mutate tables
directly.

The graph should remain shallow and primitive-first. Deterministic candidate
filtering, canonical sorting, and capacity arithmetic may use one pure helper;
policy stages, actions, and consequences remain explicit tasks and
relationships.

### Cell Runtime Convergence

`cadenza-cell` remains the trusted local runtime manager. This follows the
approved doctrine that code which safely manages Cadenza runtimes is substrate,
not a feature that must itself be implemented with Cadenza primitives.

Each cell owns only local convergence:

- publish and renew one signed generation observation.
- read its bounded current assignment projection.
- prepare and activate assigned chamber images.
- publish `materializing`, `ready`, `draining`, and `stopped` residencies.
- replace changed images using successor-before-predecessor ordering.
- drain and stop withdrawn work.
- atomically apply route projection revisions.
- reject stale assignment, lease, image, and projection authority.

The cell cannot choose placement, alter desired count, spill to another cell,
or reinterpret an override.

### Cell Supply Boundary

V1 cell scaling is restricted to pre-enrolled dormant cell identities. Dynamic
trust enrollment, root-key use, arbitrary machine creation, cloud APIs, and
general infrastructure provisioning are out of scope.

A purpose-specific trusted provider may perform only:

- start one named pre-enrolled dormant cell from a pinned launch profile.
- drain one named running cell after authority permits it.
- stop one empty drained cell.
- report the exact provider outcome.

The provider holds launch descriptors and credentials outside chambers. The
stem sees only opaque cell keys, eligibility, slot capacity, and action
outcomes. The first proof may use a local Linux provider in `cadenza-cell`, but
its contract must not expose an arbitrary executable, environment, mount,
socket, image, or credential surface.

If no eligible pre-enrolled supply exists, reconciliation records explicit
unsatisfied demand. It never fabricates capacity or weakens placement rules.

### Stem Recovery Boundary

An ordinary stem graph cannot repair its own absence. Sprint 7 therefore
allows one minimal trusted-cell substrate rule:

- eligible trusted-control cells may request an atomic stem takeover only
  after the current lease expires.
- PostgreSQL serializes the lease epoch and assignment authority.
- the winner receives authority to materialize the exact approved stem image.
- every stem mutation operation requires the current unexpired lease epoch.
- a partitioned or expired stem may continue no authority mutation and fails
  closed.

This recovery mechanism activates the runtime that performs reconciliation; it
does not contain placement policy. Full extinction recovery, where no eligible
trusted cell remains, stays a bootstrap or operator responsibility.

## Contract Foundation

The exact field names may be refined during Sprint 7A, but the identities and
ownership boundaries are fixed by this proposal.

### Desired State

```ts
type PlacementDesiredState = {
  unit_key: string;
  desired_state_revision: number;
  desired_replica_count: number;
  minimum_replica_count?: number;
  maximum_replica_count?: number;
  automation_mode: "automatic" | "automatic_with_overrides" | "manual";
  allowed_cell_keys?: string[];
};

type PlacementOverride = {
  unit_key: string;
  override_revision: number;
  desired_replica_count?: number;
  pinned_cell_keys?: string[];
  blocked_cell_keys?: string[];
  automation_locked: boolean;
  reason: string;
};
```

V1 uses explicit cell keys rather than introducing speculative `CellType`
authority. Existing enrollment already carries trust profile, capabilities,
endpoint identity, and slot capacity. A later provider-neutral cell-type layer
may be added only when more than one real provisioning implementation needs it.

Overrides follow replacement semantics for sets, never implicit merging.
Pinned and blocked overlap is invalid. Pins never spill. Manual mode freezes
desired-state evolution but does not disable repair toward the stored state.

### Cell Generation Observation

Current replica residency cannot describe a ready empty cell. V1 adds a signed,
expiring cell-generation observation containing:

- environment, cell, and generation identities.
- lifecycle state.
- observed and expiry times.
- occupied and available slot counts derived by the cell.
- current projection revision and digest.
- transport-key identity, canonical digest, and signature.

Authority derives effective availability. An expired observation is not a
ready cell. Observations never change enrollment or assignment authority.

### Reconciliation Snapshot

One bounded canonical snapshot contains:

- authority and projection revision.
- current stem lease epoch.
- desired states and overrides.
- active enrollments and current generation observations.
- placement units, replicas, current assignments, and current residencies.
- derived slot use and route readiness.
- unresolved prior actions relevant to the same units.
- snapshot digest.

The stem never queries arbitrary authority tables or composes a snapshot from
multiple drifting reads.

### Plan And Actions

```ts
type ReconciliationPlan = {
  plan_key: string;
  lease_epoch: number;
  source_authority_revision: number;
  source_snapshot_digest: string;
  actions: ReconciliationAction[];
  plan_digest: string;
};

type ReconciliationAction =
  | { kind: "define_replica"; unit_key: string; replica_key: string }
  | { kind: "assign_replica"; replica_key: string; cell_key: string }
  | { kind: "withdraw_replica"; replica_key: string }
  | { kind: "request_cell_start"; cell_key: string }
  | { kind: "request_cell_drain"; cell_key: string }
  | { kind: "request_cell_stop"; cell_key: string };
```

Actions are sorted, bounded, deterministic, and idempotent. Each has a stable
action key derived from the plan and action body. Plans are rejected if the
snapshot revision, snapshot digest, or lease epoch changed.

Authority and provider action attempts are immutable. Current outcome is a
projection over those attempts, not a mutable log row that erases history.

### Assignment Rules

The V1 algorithm is deliberately conservative:

1. preserve a current eligible healthy assignment unless movement is required.
2. filter by active enrollment, current ready generation, trust, capabilities,
   allowed/pinned/blocked rules, and available slot capacity.
3. prefer a cell that does not already host the same replicated unit.
4. then prefer the fullest cell that can fit the replica.
5. break ties by canonical `cell_key` order.
6. leave demand unassigned when no candidate is valid.

Replica identities are stable. Scale-down withdraws deterministic surplus
replicas rather than renumbering survivors. Reassignment increments the
assignment epoch; old residencies immediately lose authority.

## Language Fit Decision

C# remains the default comparison baseline for general-purpose meta slices.
The Sprint 7 stem slice uses TypeScript V1 as an explicit exception because:

- TypeScript is the only production chamber adapter currently implemented and
  proven under privileged containment, capability, custody, and hostile tests.
- reconciliation is mostly canonical planning and authority I/O; no measured
  workload justifies adding a second privileged adapter.
- reliability comes from immutable plans, idempotent actions, signed
  observations, leases, and restart recomputation rather than language-local
  process state.
- introducing Roslyn, a C# runtime image, dependency materialization, evidence
  parity, and privileged adapter review would couple orchestration to a second
  major security project.

This does not make TypeScript the meta-layer default. A later C# adapter may
host a future stem version only through a separately approved migration with
equal conformance.

Elixir is not selected for V1. BEAM supervision would duplicate chamber and
cell supervision, while no Elixir production adapter exists. Its benefits do
not currently exceed the additional trusted and operational surface.

## Sprint Sequence

Sprint 7 is split into independently reviewable passes. Later passes may refine
the next pass but may not bypass an earlier gate.

### Sprint 7A: Reconciliation Contract And Pure Planner

- write the language-neutral V1 reconciliation contract and hostile fixtures.
- define desired state, override, generation observation, lease, snapshot,
  plan, action, and outcome identities.
- implement one deterministic pure planner in the TypeScript authority repo.
- prove order independence, no-churn assignment, anti-affinity, packing,
  pin/block conflict, capacity shortage, scale up/down, and stale-input denial.
- perform language-fit, security, pressure, and coherence reviews.

Gate: equal input authority produces one bounded canonical plan with no side
effect.

### Sprint 7B: PostgreSQL Reconciliation Authority

- add an isolated additive migration.
- add exact desired-state, override, lease, snapshot, plan, action, and outcome
  operations.
- add the restricted reconciliation snapshot reader.
- add cell-generation observation publication and expiry projections.
- extend placement authority with exact withdraw and reassignment behavior.
- prove role boundaries, replay, stale revision, lease fencing, plan
  idempotency, and rebuildable projections.

Gate: PostgreSQL serializes one stem owner and immutable action history without
becoming a generic scheduler API.

### Sprint 7C: Autonomous Cell Runtime Convergence

Detailed design:
[Sprint 7C Autonomous Cell Runtime Convergence](2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md).

- add signed generation observation and renewal to `cadenza-cell`.
- replace test-only manual projection refresh with a bounded cell-owned
  reconciliation worker.
- converge assigned chambers through prepare, activate, ready, replace, drain,
  and stop.
- renew replica residencies before expiry.
- atomically apply route revisions and reject stale projection state.
- preserve source execution, custody, and started-state semantics through
  replacement and failure.

Gate: two already-running cells converge static authority changes without
manual host-control refresh calls.

### Sprint 7D: Stem-Cell Meta Slice

Detailed design:
[Sprint 7D Stem-Cell Meta Slice](2026-07-18-stem-cell-meta-slice-sprint-7d-design.md).

Status: complete and closure-approved as of 2026-07-19.

- author and register the TypeScript stem source slice.
- statically seed and activate its first singleton replica.
- bind its snapshot and action paths through generated private facades and
  exact authority-access tasks.
- trigger reconciliation from authority-change notifications plus one bounded
  host-owned safety tick.
- automatically create, assign, withdraw, and reassign replicas across current
  ready cells.
- record execution and authority evidence without recursive processing.

Gate: changing only declared desired state causes the environment to converge
replicas, chambers, residencies, and routes across existing cells.

### Sprint 7E: Pre-Enrolled Cell Supply

Detailed design:
[Sprint 7E Pre-Enrolled Cell Supply](2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md).

Status: complete and closure-approved as of 2026-07-19.

- define the purpose-specific cell-supply provider contract.
- implement a bounded local Linux provider or supervisor in `cadenza-cell` for
  pre-enrolled dormant cells.
- execute committed start, drain, and stop actions without exposing launch
  material to the stem.
- prove unsatisfied demand when no eligible supply exists.
- prove scale-up, packing, safe scale-down, and provider restart recovery.

Gate: declared replica demand can add and remove bounded pre-authorized cell
capacity without dynamic enrollment or arbitrary process execution.

### Sprint 7F: Stem Recovery And Fencing

Detailed design:
[Sprint 7F Stem Recovery And Fencing](2026-07-19-stem-recovery-fencing-sprint-7f-design.md).

Status: complete and closure-approved as of 2026-07-19.

- add atomic expired-lease takeover for eligible trusted-control cells.
- bind takeover to current enrollment, generation, capability, exact stem
  artifact, and projection authority.
- fence the predecessor from all later mutation.
- prove crash before/after plan commit, lease expiry, delayed predecessor,
  partitioned authority, and successor activation.

Gate: loss of the active stem cell recovers on another eligible trusted cell
without split-brain mutation. Full trusted-cell extinction remains explicit
bootstrap recovery.

### Sprint 7G: Closure

Detailed design:
[Sprint 7G Scale And Orchestration System Closure](2026-07-19-scale-orchestration-system-closure-sprint-7g-design.md).

Status: complete and closure-approved on 2026-07-20. See
`docs/contracts/distribution/sprint-7g-closure-review-v0.md`.

- run Linux gVisor proofs with at least three real cells.
- exercise scale up, assignment, materialization, routing, cell loss, stem
  takeover, scale down, and cleanup under execution-evidence custody.
- perform security, disclosure, pressure, dead-code, operational-complexity,
  and recursive coherence reviews.
- verify that business definitions and contexts contain no deployment,
  endpoint, credential, lease, or reconciliation machinery.

Gate: automated scale and orchestration reduce accidental complexity without
creating a hidden management system or weakening authority.

## Explicit Deferrals

The older roadmap grouped several optimizations into Sprint 7. They are
deferred because they are not required to prove authority-driven scale and
would multiply the control-plane surface before reconciliation stabilizes:

- inferred soft-demand projections.
- unresolved-demand negative caches.
- new bridge artifact classes beyond the existing target proxies and signal
  forwarders.
- generalized runtime-memory slimming beyond current slice-local images.
- dynamic enrollment or trust-root delegation.
- cloud-provider, Kubernetes, Docker, or arbitrary machine APIs.
- adaptive metrics-based autoscaling and global optimization.
- multi-hop, relay, public ingress, or cross-environment placement.
- actor residency, hydration, and persistence.
- durable long-running flow/checkpoint infrastructure.
- concurrent chamber business execution.

Existing generated target proxies, signal forwarders, and derived route-member
projections remain the V1 bridge mechanism. Their route sets become automatic;
their taxonomy does not expand in Sprint 7.

## Impacted Repos

- `cadenza`: semantic authority, shared fixtures, deterministic planner,
  TypeScript stem source slice, capability authority, PostgreSQL migration,
  exact gateway operations, and projection readers.
- `cadenza-cell`: signed generation observations, autonomous local convergence,
  pre-enrolled cell supply, stem recovery activation, and Linux system proofs.
- `cadenza-chamber`: only contract changes required for dynamic projection,
  lifecycle fencing, or source activation; it does not gain placement policy.
- workspace meta repo: design, decision, contract routing, roadmap, and closure
  evidence.

The Python, Elixir, and C# core repos should receive the neutral planner
fixtures only if they implement the planner or a new shared primitive contract.
Sprint 7 does not require another primitive-core translation.

Legacy service, database, engine, demo, CLI, memory, UI, integrations, and
agent repos remain excluded.

## Security Boundaries

- the stem has no direct database, root key, enrollment key, launch descriptor,
  transport key, filesystem, network, or process-control access.
- only exact generated capability facades and authority task identities are
  available to the stem image.
- standard cells cannot host or recover the trusted-control stem.
- every plan is fenced by lease epoch, authority revision, and snapshot digest.
- every host action is fenced by committed action identity and current target
  state.
- cell supply cannot accept arbitrary executable, image, environment, mount,
  credential, endpoint, or command input.
- route and residency authority remain derived and signed; the planner cannot
  manufacture readiness.
- execution evidence records plan, action, local lifecycle, distribution, and
  failure boundaries without raw business context.
- capacity exhaustion and missing supply remain visible unsatisfied state.

## Pressure And Boundedness

- one active stem lease per environment.
- one snapshot and one bounded plan per reconciliation pass.
- bounded maximum action count derived from declared replica and cell limits.
- one in-flight action per target identity and action kind.
- fixed retry ceilings and backoff at provider boundaries.
- immutable action attempts with bounded current projections.
- squashed reconciliation requests; noisy authority changes do not create an
  unbounded queue.
- cell-local convergence processes one monotonic projection revision at a time.

No polling interval, lease duration, action bound, or retry count becomes an
ambient configuration field. Values are explicit governed policy or fixed V1
contract constants.

## Risks

### Split-Brain Stem Ownership

Risk: two stem instances commit conflicting plans.

Control: database-serialized lease epochs, snapshot fencing, current-residency
checks, and mandatory lease validation in every mutation operation.

### Circular Self-Management

Risk: the stem must repair the runtime needed to run the stem.

Control: minimal trusted-cell takeover is substrate activation only. All normal
placement policy remains in the graph. Full trusted-cell extinction is
explicitly outside self-healing authority.

### Hidden Deployment Service

Risk: cell supply grows into a generic infrastructure API.

Control: V1 starts only named pre-enrolled cells from pinned provider-owned
profiles and exposes no arbitrary launch surface.

### Churn And Cascading Replacement

Risk: every observation change moves replicas or refreshes all cells.

Control: preserve valid assignments first, use deterministic ordering,
revision-scoped snapshots, cell-local projection filtering, and squashed
reconciliation triggers.

### Database Availability

Risk: PostgreSQL outage stops reconciliation.

Control: existing work and routing continue under current bounded local
authority and custody. No new placement mutation occurs without current lease
and authority. Recovery recomputes from immutable state rather than replaying
an in-memory plan.

### Operational Complexity

Risk: leases, workers, providers, plans, and projections become many competing
control loops.

Control: each loop has one owner and one direction of affect: stem decides,
authority serializes, cell converges locally, provider supplies processes.
Later passes must not duplicate these responsibilities.

## Migration Strategy

This remains the new major-version line; legacy compatibility is not required.

Order of operations:

1. stabilize the language-neutral contract and planner fixtures.
2. update PostgreSQL authority and exact operations.
3. add observations and local cell convergence while static placement remains
   the authority input.
4. activate the stem in shadow-plan mode and compare its plan with fixtures.
5. allow committed replica and assignment actions on existing cells.
6. enable pre-enrolled cell supply.
7. enable stem takeover only after all plan mutations are lease-fenced.
8. close with multi-cell Linux evidence and coherence review.

At every pass, static explicit operations remain available as test and repair
authority until the automated path proves equal or stronger behavior. They are
not retained as a parallel production scheduler after closure.

## Alternatives

### One Rust Scheduler In `cadenza-cell`

Rejected. Rust should enforce local runtime state, but environment-wide desired
placement is a Cadenza feature and should be expressed through Cadenza
primitives and authority.

### One Large Stem Callable

Rejected. It would hide policy stages, action boundaries, evidence, and repair
inside ordinary code rather than expressing a reviewable graph.

### Give The Stem Direct Database Or Process Access

Rejected. It collapses semantic planning, authority mutation, and host affect
into one privileged runtime.

### Implement The C# Adapter First

Rejected for V1. The stem workload has no demonstrated advantage that justifies
coupling scale/orchestration to another privileged materialization and adapter
security project.

### Let Every Cell Reconcile The Environment

Rejected. Idempotency alone does not make competing planners coherent, and
multi-writer action generation would increase churn and split-brain risk.

### Dynamic Enrollment During Scale-Up

Rejected. Root trust establishment and workload scaling have different
security authority. V1 may consume only pre-enrolled supply.

### Defer Stem Recovery Entirely

Rejected for Sprint 7 closure. A singleton control plane that cannot recover
while eligible trusted cells remain would leave the central orchestration claim
incomplete.

## Assumptions

- PostgreSQL remains the first environment's serialization authority for
  desired state, leases, plans, assignments, and projections.
- at least two pre-enrolled trusted-control cells are available for the final
  stem recovery proof.
- pre-enrolled dormant cell launch profiles can be provisioned outside chamber
  payloads for the Linux proof.
- current serialized chamber business execution remains unchanged in Sprint 7.
- the TypeScript adapter remains the only production adapter in Sprint 7.
- existing target proxies, signal forwarders, peer transport, execution
  evidence, and local journal custody remain the bridge and evidence
  foundations.
- machine-relative performance thresholds remain measured separately from
  correctness, as previously agreed.

Approval confirms these assumptions and the three central restrictions:

1. TypeScript is the justified V1 stem-language exception.
2. V1 cell scaling is limited to pre-enrolled supply.
3. trusted-cell substrate performs only lease-fenced stem activation; placement
   policy remains in the stem graph.
