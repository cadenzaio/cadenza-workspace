# Sprint 7F Stem Recovery And Fencing Design Proposal

Date: 2026-07-19

## Current Status

- State: `done`; implementation, validation, and closure were explicitly
  approved on 2026-07-19.
- Complexity gate: required. This pass changes singleton recovery authority,
  lease and assignment transitions, PostgreSQL roles, Cell host descriptors,
  predecessor fencing, and cross-Cell failure recovery.
- Impacted repos: `cadenza`, `cadenza-cell`, `cadenza-chamber` for conformance,
  and the workspace meta repo.
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).
- Completed prerequisite:
  [Sprint 7E Pre-Enrolled Cell Supply](2026-07-19-pre-enrolled-cell-supply-sprint-7e-design.md).
- Approval received: `Design approved. Proceed.` on 2026-07-19.
- Closure approval received: `Approved. let's continut` on 2026-07-19.
- Closure review:
  [Sprint 7F Stem Recovery And Fencing Closure Review V0](../../../contracts/distribution/sprint-7f-closure-review-v0.md).

## Context

Sprint 7E proves that one live reconciliation stem can interpret desired state,
obtain pre-authorized Cell capacity, place replicas, and converge execution.
The stem remains a singleton. Its lease, assignment, source Chamber, authority
support Chamber, and operational authority mount currently begin on one
bootstrap-selected trusted-control Cell.

The current system correctly fences an expired lease from renewal and rejects
later stem operations when the lease owner generation is no longer current and
ready. It does not appoint a successor. Every other trusted-control Cell sees a
fixed safety cadence and reconciliation notifications, but its host can only ask
whether its own generation already owns the lease. The built-in stem desired
state also retains the bootstrap Cell as its only allowed Cell, which makes the
bootstrap binding a permanent placement restriction.

Recovery cannot be delegated to the unavailable stem. It must be a narrow
substrate responsibility that restores the conditions under which the ordinary
stem graph can execute again.

## Intended Whole

When the active reconciliation stem can no longer exercise current authority,
one already-running eligible trusted-control Cell succeeds it. PostgreSQL
atomically transfers the singleton lease and assignment, fences every
predecessor operation, and preserves exact evidence. Normal Cell convergence
then materializes the unchanged stem and authority-support slices, promotes the
operational authority mount, and resumes the same reconciliation graph.

The author continues to change application intent without managing leaders,
leases, failover, processes, endpoints, or recovery commands.

False success includes:

- declaring recovery because another Cell noticed an expired lease.
- transferring the lease without transferring the singleton assignment.
- assigning a successor before proving its current generation, trust,
  capabilities, capacity, and exact stem authority.
- allowing predecessor plans or actions to remain executable after takeover.
- treating a running Cell as a ready stem or promoting authority before both
  exact stem members are ready.
- permitting two lease owners, active-active stems, or host-local election
  truth.
- starting dormant Cells, enrolling Cells, or calling infrastructure from the
  recovery path.
- hiding total trusted-control extinction behind retries or fabricated health.

## Governing Architecture

```text
trusted Cell host safety cadence / PostgreSQL notification
  -> purpose-separated stem-recovery resolver
  -> PostgreSQL database time and one atomic transaction
       validate loss condition
       select one exact eligible successor
       advance lease epoch
       advance singleton assignment epoch when the Cell changes
       retire unresolved predecessor work
       advance authority and reconciliation revisions
       append immutable takeover evidence
  -> ordinary Cell convergence observes successor assignment
  -> exact stem source and authority support Chambers become ready
  -> existing authority-mount promotion moves operational custody
  -> successor host delivers the fixed reconciliation signal
  -> unchanged stem graph resumes ordinary reconciliation
```

PostgreSQL is already the shared serialization authority for environment
mutation, reconciliation plans, assignments, lease epochs, and evidence. Sprint
7F does not add a consensus service, distributed lock product, host election
file, or second durable state machine.

Database time is the only lease clock. Host clocks decide only when to retry a
bounded read; they never establish loss or ownership.

## Recovery Eligibility

Takeover becomes eligible when either:

1. the current stem lease has expired according to PostgreSQL time; or
2. the exact owner Cell generation is no longer the current unexpired `ready`
   generation.

The second condition is safe before lease expiry because every consequential
stem operation already requires both the exact lease identity and a current
ready owner generation. Once that generation is absent, the predecessor is
already fenced from database affect.

A successor candidate must satisfy all of the following in the same locked
authority view:

- environment is active, operational, and past bootstrap handoff.
- Cell enrollment is active and has `trusted_control` trust.
- exact Cell generation is current, unexpired, and `ready`, with matching
  enrolled transport identity.
- the Cell holds every capability required by the exact built-in stem unit,
  including `authority_access:admin` and `reconciliation_control:use`.
- the exact stem source and authority-support artifacts are active,
  materialized, unrevoked, and match the fixed singleton unit definition.
- current assignment and observed occupancy leave enough capacity for the stem
  unit.
- current desired-state and override policy permit the Cell.

The bootstrap Cell is an initial binding, not a permanent pin. The built-in stem
desired state therefore changes to an empty `allowed_cell_keys` list. Trust,
capabilities, exact artifacts, capacity, and explicit future overrides remain
the continuing placement authority. Migration records one immutable policy
transition for existing fixed stem desired state rather than silently ignoring
the old pin.

## Deterministic Successor Selection

PostgreSQL computes the eligible candidate; hosts do not nominate placement.
Candidates are ordered by canonical Cell key using `COLLATE "C"`.

If the previous owner remains eligible but its lease expired, another eligible
Cell is preferred. This prevents a Cell with a persistently broken stem
materialization from reclaiming the singleton forever. If no alternative is
eligible, the same ready owner may acquire the next lease epoch without moving
the assignment. That permits recovery from a transient stem-Chamber failure in
a one-Cell environment.

Concurrent callers receive one of three bounded outcomes:

- `owner`: the caller already owns the current valid lease and may trigger the
  stem.
- `standby`: another generation owns valid authority or the caller is not the
  deterministically selected eligible successor.
- `takeover_committed`: this transaction advanced authority to the caller.

Only `owner` and a later locally ready stem permit signal delivery. A committed
takeover is not stem readiness.

## Atomic Takeover Transition

One purpose-specific PostgreSQL function uses the established lock order:

```text
environment authority
  -> reconciliation environment state
  -> current stem lease
  -> current singleton assignment
```

Under those locks it:

1. rereads the exact loss condition and candidate set.
2. validates the current fixed stem unit, desired state, artifacts,
   capabilities, assignment, and generation authority.
3. advances `lease_epoch` by exactly one and writes event sequence `1` with
   event kind `taken_over`.
4. if the selected Cell differs, appends the next `assigned` epoch for the same
   singleton replica; it does not create a second replica or mutate history.
5. appends terminal `rejected` outcomes with reason `lease_replaced` for every
   unresolved uncommitted action belonging to predecessor-epoch plans.
6. advances environment authority and reconciliation control revisions exactly
   once; assignment triggers advance input revision when placement changes.
7. appends immutable recovery evidence and emits the existing reconciliation
   wake notification.

Committed predecessor actions remain committed. Their effects are ordinary
current authority and appear in the successor snapshot. Uncommitted work is
retired rather than replayed under a lease epoch that did not create it.

The takeover function is idempotent by current authority state. If a response
is lost, the next call observes `owner`; it cannot append another assignment or
lease epoch for the same transition.

## Predecessor Fencing

Every existing reconciliation operation continues to require the exact current
lease epoch, owner Cell key, owner generation key, and current ready generation.
Takeover changes that identity atomically before any successor materialization.

After takeover, the predecessor cannot:

- renew the lease.
- read privileged work or issue a snapshot.
- commit a plan.
- execute an action through the authority gateway.
- record or close an action outcome.
- deliver a host reconciliation trigger.
- use its old authority-support residency for new gateway affect.

The assignment epoch change makes predecessor stem residencies ineligible.
Existing Cell convergence drains and stops their Chambers. The operational
authority mount may still name the predecessor during successor
materialization, but runtime gateway checks require the current assignment,
generation, slice, and residency. The old mount therefore cannot affect
authority. Existing promotion moves the mount only after the successor's exact
authority-support member is ready under a current signed activation grant.

## Cell Host Recovery Boundary

The recovery resolver belongs to the Rust Cell host substrate, not the stem
meta slice. Its purpose is to restore a safe primitive runtime; it does not
extend Cadenza functionality or contain business policy.

Each trusted-control host:

- checks recovery authority on the existing fixed five-second safety cadence
  and PostgreSQL wake hint.
- submits only its fixed environment, Cell, and generation identity.
- receives only `owner`, `standby`, or `takeover_committed` plus the current
  lease epoch when it is the owner.
- runs an immediate ordinary convergence pass after takeover.
- delivers fixed stem signals only after its exact stem source and support
  members are locally ready and projection-eligible.
- never renews a takeover lease on behalf of a not-yet-working stem. Lease
  renewal remains evidence that the stem graph itself can execute.

The old `read_stem_trigger_lease` surface is replaced by this resolver and
removed from the final schema and Rust host. Migration history remains intact;
the deployed authority surface contains no obsolete alternative path.

## Purpose-Separated Database Role

Takeover can move both lease and assignment authority and must not be added to
the meta slice's reconciliation-control credential. Sprint 7F introduces one
NOLOGIN `cadenza_stem_recovery_control` role and one additional fixed inherited
Cell-host credential descriptor.

The role can execute only the literal recovery resolver. It cannot:

- read private authority tables directly.
- invoke ordinary stem control operations.
- change desired state, overrides, enrollment, supply, routes, or artifacts.
- call the authority gateway or generic SQL through a Chamber capability.
- publish Cell generations or residencies.

Standard Cells receive the existing disabled privileged-credential sentinel.
The credential is never passed into a Chamber, graph context, profile record,
evidence body, log, command line, or environment variable. The stem source and
authority-support slices receive no takeover facade.

## Recovery Evidence

One immutable `cadenza.stem-recovery-evidence` record binds:

- environment and takeover evidence identity.
- recovery reason: `lease_expired` or `owner_generation_unavailable`.
- predecessor lease epoch, Cell, generation, expiry, assignment Cell, and
  assignment epoch.
- successor lease epoch, Cell, generation, assignment Cell, and assignment
  epoch.
- exact stem unit definition and artifact digests.
- eligibility projection digest and selected candidate key.
- retired predecessor plan and action identities through a bounded canonical
  digest plus counts.
- authority, input, and control revisions before and after.
- database-observed transition time.

Evidence excludes credentials, endpoints, profile bodies, process handles,
commands, stderr, business definitions, and business context. Existing Cell,
Chamber, residency, authority-mount promotion, and execution evidence describe
later materialization and resumed consequence; takeover evidence does not
pretend to cover them.

## Failure Scenarios

### Predecessor Crashes Before Plan Commit

No plan is durable. Recovery advances lease and assignment authority, then the
successor creates a fresh snapshot and plan.

### Predecessor Crashes After Plan Commit

Committed action effects remain. Every remaining uncommitted action from the
old lease is rejected atomically as `lease_replaced`. The successor interprets
current state and replans instead of resuming stale work.

### Predecessor Is Delayed Or Partitioned

It may continue local computation, but current lease and generation checks
reject every later database mutation. It cannot publish a valid new plan or
action outcome after takeover.

### PostgreSQL Is Unavailable

No host can infer loss, elect itself, or mutate local recovery truth. Existing
business execution continues only within its still-valid runtime authority.
Recovery resumes from PostgreSQL state after connectivity returns.

### Concurrent Eligible Claimants

All contenders serialize on the same database rows. Only the exact
deterministically selected candidate advances the epoch; all others observe
`standby`.

### Successor Fails Before Stem Readiness

The Cell host does not renew the lease. On expiry or successor-generation loss,
the next transaction prefers another eligible trusted-control Cell and advances
the epochs again. No authority mount is promoted from incomplete residency.

### Lost Takeover Response

The transaction is either absent or committed. A retry observes `standby` or
`owner`; it never repeats the same assignment transition.

### No Eligible Trusted-Control Cell

The expired or generation-invalid predecessor remains fenced. No successor is
invented. The environment reports explicit recovery unavailability and requires
bootstrap/operator restoration of trusted capacity.

### Dormant Pre-Enrolled Trusted Cell Exists

Recovery does not ask the supply supervisor to start it. Supply policy belongs
to the stem that is unavailable, and moving that policy into recovery would
create a second scheduler. Only current ready Cells participate in Sprint 7F.

## Operational Complexity

Sprint 7F adds no continuously running process and no new cadence. It extends
the existing trusted Cell-host safety pass with one fixed authority resolution.
PostgreSQL retains one current lease, one current assignment, immutable event
history, and bounded recovery evidence.

There is no election timeout separate from lease and generation expiry, no
quorum protocol, heartbeat table, host-local term, retry queue, candidate
registration, or recovery workflow engine. Candidate equivalence is derived
from existing enrollment, generation, capability, artifact, desired-state, and
capacity authority.

The material operational cost is one purpose-separated database credential per
Cell host and another high-authority transaction. Closure must review lock
ordering, role disclosure, candidate starvation, repeated takeover pressure,
and the time from loss detection to resumed stem execution.

## Implementation Passes

### Sprint 7F.1: Neutral Recovery Contract And PostgreSQL Authority

- add canonical recovery outcome and evidence contracts.
- remove the permanent bootstrap Cell pin from fixed stem desired state and
  record the built-in policy transition.
- add deterministic eligibility, takeover transaction, stale-plan retirement,
  revisions, evidence, notifications, and purpose-separated role.
- remove the obsolete trigger-lease read surface from the final schema.
- prove exact lock order, concurrent claimants, replay, stale epochs, role
  boundaries, candidate rotation, and no-eligible-candidate behavior.

Gate: one PostgreSQL transaction transfers exactly one singleton authority and
fences all predecessor mutation without claiming runtime readiness.

### Sprint 7F.2: Cell Host Recovery And Successor Activation

- add the fixed recovery credential descriptor and Rust authority client.
- integrate recovery resolution into the existing trusted-host cadence.
- trigger ordinary convergence after takeover without adding an activation
  shortcut.
- prove successor source/support materialization and authority-mount promotion.
- prove predecessor Chamber retirement and fixed provider surfaces.

Gate: one eligible Cell can become the operational stem through existing
convergence while the predecessor has no remaining affect.

### Sprint 7F.3: Failure Proof And Recursive Closure

- prove loss before and after plan commit, PostgreSQL outage, concurrent
  claimants, delayed predecessor operations, failed successor activation,
  second takeover, and total eligible-Cell absence.
- run Linux/gVisor recovery with at least two eligible trusted-control Cells and
  one ordinary workload Cell.
- change desired application state after takeover and prove the successor stem
  still controls supply, placement, routing, execution, and scale-down.
- run security, disclosure, pressure, dead-code, operational-complexity, and
  recursive coherence reviews.

Gate: active stem loss recovers without split brain, hidden infrastructure
policy, manual lifecycle control, or stale predecessor affect.

## Impacted Repositories

### `cadenza`

- recovery contracts and PostgreSQL migration 011.
- fixed stem desired-state policy transition.
- takeover authority, evidence, role boundaries, and hostile tests.
- canonical fixtures and documentation.

### `cadenza-cell`

- one fixed host descriptor and recovery authority client.
- trusted-host resolution integrated into the existing cadence.
- successor convergence, predecessor retirement, and Linux proofs.

### `cadenza-chamber`

- conformance only. The Chamber receives no election, takeover, lease-transfer,
  or database authority.

### Workspace Meta Repo

- approved decision after the design gate, contract authority routing,
  roadmap status, execution plan, and closure evidence.

## Security Review Requirements

- only current ready eligible trusted-control generations can succeed.
- PostgreSQL time and row locks are the sole loss and election authority.
- lease and assignment transfer, stale-work retirement, revisions, and evidence
  are one transaction.
- old lease, assignment, generation, residency, image, mount, and plan
  identities fail after takeover.
- no Chamber capability can invoke or receive the recovery resolver.
- the recovery role has no generic table or gateway privilege.
- a standard, suspended, revoked, stale, under-capacity, artifact-incompatible,
  or policy-blocked Cell cannot take over.
- a takeover does not imply Chamber readiness or authority-mount promotion.
- evidence and logs reveal no credential, endpoint, process, or business data.

## Migration Strategy

This is the new major-version line; backward compatibility is not required.

1. Add neutral contracts and a denied-by-default resolver surface.
2. Add migration 011, the purpose-separated role, and hostile PostgreSQL tests.
3. transition the fixed built-in stem desired state from bootstrap pinning to
   capability-based trusted placement with immutable evidence.
4. Add the Cell host descriptor and resolver client; standard Cells remain
   disabled.
5. Prove takeover in database tests before enabling host retries.
6. Enable successor convergence and run the complete Linux proof.

No migration adopts a host-local leader, revives an expired plan, or promotes
an authority mount without current successor residency.

## Alternatives

### Let The Stem Elect Its Successor

Rejected. The responsibility would be unavailable at the moment it is needed.

### Active-Active Stems

Rejected. Multiple policy writers increase ambiguity and require consensus for
every effect rather than one bounded failover transaction.

### Add etcd, Consul, Raft, Or Kubernetes Leases

Rejected. PostgreSQL already serializes the affected authority. A second
consensus field would create disagreement and operational complexity without
improving the current trust model.

### Use PostgreSQL Advisory Locks Alone

Rejected. A transient connection lock does not preserve lease, assignment,
generation, plan, or evidence identity across process and network failure.

### Keep The Bootstrap Cell Permanently Pinned

Rejected. It would make automatic recovery to another Cell semantically
illegal and turn an initial condition into permanent architecture.

### Let Any Eligible Host Win The Race

Rejected. Although row locking would prevent split brain, database-selected
canonical ordering gives interpretable and reproducible succession.

### Always Prefer The Current Owner

Rejected. A Cell that repeatedly fails to materialize the stem could reacquire
forever. The current owner is used only when no eligible alternative exists.

### Reuse The Stem Meta-Slice Database Credential

Rejected. Takeover moves the authority that governs the meta slice itself and
requires a purpose-separated substrate boundary.

### Start Dormant Recovery Capacity

Deferred. That would move supply policy into the failover mechanism and create
a second scheduler. Full trusted ready-capacity extinction remains explicit.

## Assumptions

- at least two already-running trusted-control Cells are required to prove
  cross-Cell takeover; one Cell can only reacquire locally.
- eligible Cells have the same exact fixed stem and authority-support artifacts
  provisioned through existing environment authority.
- PostgreSQL remains available and authoritative during successful takeover;
  database disaster recovery is a separate substrate concern.
- five-minute stem leases and current generation expiries remain the first
  production policy. Sprint 7F measures recovery latency before changing those
  governed durations.
- serialized Chamber business execution and reconciliation remain unchanged.
- dormant Cell supply, dynamic enrollment, cloud recovery, and infrastructure
  orchestration remain out of scope.

## Exit Criteria

- one and only one current stem lease and singleton assignment exist after any
  concurrent takeover attempt.
- owner-generation loss can safely trigger takeover before lease expiry.
- lease expiry rotates to another eligible Cell when one exists and permits
  same-Cell recovery only when no alternative is eligible.
- lease and assignment epochs advance exactly once per committed transition.
- all predecessor operations and unresolved work are fenced or retired.
- successor activation uses ordinary assignment, grant, containment,
  residency, and authority-mount promotion contracts.
- a lost response, database outage, failed successor, or delayed predecessor
  creates neither duplicate mutation nor false readiness.
- no eligible Cell remains an explicit recoverability failure.
- business definitions and contexts contain no recovery machinery.
- closure finds no security, disclosure, dead-code, pressure, operational, or
  coherence issue that should precede Sprint 7G.

## Work Items After Approval

- [x] Record the approved Sprint 7F decision.
- [x] Implement and close Sprint 7F.1 PostgreSQL recovery authority.
- [x] Implement and close Sprint 7F.2 Cell host recovery and activation.
- [x] Run Sprint 7F.3 failure proof and recursive closure review.
- [x] Update distribution contracts, roadmap, and closure evidence.
