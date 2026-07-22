# Sprint 7D Stem-Cell Meta Slice Design Proposal

Date: 2026-07-18

## Current Status

- State: `done`; Sprint 7D.1 through 7D.4 and the
  [closure review](../../../contracts/distribution/sprint-7d-closure-review-v0.md)
  were explicitly approved on 2026-07-19.
- Complexity gate: required. This pass activates environment-wide placement
  affect from a Cadenza graph, extends authority-gateway and runtime-support
  contracts, adds a privileged private provider, and changes trusted Cell host
  behavior.
- Approval received: `Design approved. Proceed.` on 2026-07-18.
- Amendments approved: operational authority-mount promotion on 2026-07-18,
  and separate activation and containment lifetimes on 2026-07-19.
- Impacted repos: `cadenza`, `cadenza-cell`, `cadenza-chamber` for conformance,
  and the workspace meta repo.
- Completed prerequisites:
  - [Sprint 7A planner](../completed/2026-07-17-scale-placement-reconciliation-sprint-7a.md).
  - [Sprint 7B PostgreSQL authority](../completed/2026-07-17-reconciliation-postgres-authority-sprint-7b-design.md).
  - [Sprint 7C autonomous Cell convergence](../completed/2026-07-17-autonomous-cell-runtime-convergence-sprint-7c-design.md).
  - [Sprint 7C closure review](../../../contracts/distribution/sprint-7c-closure-review-v0.md).
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).

## Context

Sprint 7A can deterministically turn one canonical placement snapshot into a
bounded plan. Sprint 7B makes PostgreSQL the semantic authority for desired
state, leases, snapshots, plans, exact actions, and immutable outcomes. Sprint
7C lets ordinary Cells autonomously materialize their current assignments and
derive routes.

The remaining gap is the policy loop between declared intent and those local
Cell projections. Tests can currently call the planner and PostgreSQL
operations directly, but no production Cadenza graph owns that sequence.
Consequently, declared desired state alone does not yet create, assign,
withdraw, or reassign replicas.

Sprint 7D introduces the first active stem-cell meta slice. It is an ordinary
Cadenza source definition running in a contained Chamber. It receives bounded
host trigger signals, reads exact reconciliation authority through private
facades, runs the same pure planner proved in 7A, commits the plan, and invokes
only committed placement actions through the authority-access slice.

### Audit Findings Before Design

The current foundation exposes five concrete integration gaps:

1. `cadenza_reconciliation_stem` can call both control functions and the
   authority action function. Giving that credential to a private facade would
   let the source bypass the authority gateway.
2. operational Chambers currently receive `DenyAuthority`; the contained
   authority-access slice cannot yet use the already implemented
   `CellAuthoritySession` during autonomous activation.
3. the authority gateway has 18 fixed primitives. Migration 007 knows
   `Reconciliation.ExecuteAction`, but the digest-pinned artifact, Cell catalog,
   schemas, and provider map do not.
4. a snapshot can be 16 MiB while ordinary capability results are capped at 1
   MiB. Silently relying on small fixtures would invalidate the approved
   pressure contract.
5. after an unknown action outcome or graph restart, a snapshot identifies
   unresolved action bodies but not enough committed-plan and application state
   to resume safely.

These are foundation defects revealed by composing the real path. They belong
in 7D.1 before the source slice is authored.

### Implementation Gate Discovered On 2026-07-18

The real Linux proof passed source materialization, five-Chamber gVisor
activation, route synchronization, cross-Cell delegation, and the deliberate
seven-role PostgreSQL outage. It then proved two missing authority bindings in
sequence:

1. the host-generated stem subject and runtime principal were not registered
   authority subjects. Migration 009 now creates exact reconciliation system
   actors and the host uses those identities; PostgreSQL conformance passes.
2. the dynamically activated authority-access support Chamber is not the
   bootstrap Chamber/image recorded in the singleton
   `cadenza.activated_authority_mount`. The gateway correctly rejects it as an
   activated-mount mismatch before action affect.

The second finding requires a security-architecture decision. The current
table and gateway contract intentionally permit one exact operational
authority mount per environment. Sprint 7D intentionally creates a new,
grant-backed authority-support Chamber. That Chamber cannot inherit or bypass
the bootstrap binding.

Recommended design amendment: extend the activation issuer with one narrow
authority-mount promotion command. After the trusted Cell has published exact
ready residency, the issuer verifies the current signed activation-grant
reservation, current assignment, trusted Cell generation, exact authority
slice/artifact, ready Chamber/image residency, singleton stem placement, and
existing mount key. It then atomically replaces the environment's singleton
mount identity and appends immutable promotion evidence. The issuer already
owns activation signing custody and a private UID-bound Cell channel, so this
adds no general gateway power and no new Cell database credential.

Alternatives not recommended:

- let the gateway treat current residency as a mount. This is smaller but
  makes the narrow observation credential part of authority-admin admission.
- keep routing through the fixed bootstrap Chamber. This avoids promotion but
  contradicts the approved two-member stem unit and makes the first managed
  meta slice depend on a special static runtime path.

No authority-mount bypass has been added. The approved amendment is being
implemented through the existing UID-bound activation-issuer custody channel.

## Intended Whole

An application or meta author declares workload shape and constraints. Cadenza
interprets that intent into exact placement affect, while the author remains
concerned with intended function rather than replicas, Cells, leases,
notifications, database credentials, or host lifecycle.

The stem graph is the environment's policy interpreter. PostgreSQL remains the
serialization and mutation authority. Cells remain local runtime custodians.
Chambers remain callable-materialization and primitive-execution boundaries.

False success includes:

- wrapping the planner in one opaque scheduler callback.
- giving the stem a database client, credential, generic SQL facade, root key,
  launcher descriptor, endpoint, or process-control capability.
- letting a private stem provider execute placement actions directly.
- reporting plan success before exact actions have committed.
- losing a committed action because a result was lost in transport.
- creating an unbounded trigger or retry queue.
- increasing all business-context limits to accommodate one privileged meta
  slice.
- requiring a controller to refresh routes or drive Cell lifecycle after
  desired state changes.

## Governing Architecture

```text
operator-declared desired state
  -> PostgreSQL input revision + bounded wake hint
  -> trusted Cell coalesces notification or safety tick
  -> stem source Chamber receives one fixed trigger signal
  -> private reconciliation-control facade reads resumable work
  -> pure bundled planner computes the canonical plan
  -> private facade commits the exact plan
  -> stem inquires of one generated authority-access task per action
  -> gateway-fenced SQL commits action and immutable outcome
  -> Sprint 7C Cells converge their local Chambers and routes
  -> next coalesced trigger proves no churn or performs the next pass
```

### Stem Placement Unit

The first stem is one statically provisioned singleton placement unit:

- unit: `unit.meta.reconciliation-stem.v0`.
- replica: `replica.meta.reconciliation-stem.0001`.
- primary member: `slice.meta.reconciliation-stem.v0`.
- support member: `slice.authority-access.v0` using the digest-pinned authority
  gateway artifact.
- lane: `trusted_control` for both members.
- source trust profile: `privileged`.
- host eligibility: active `trusted_control` Cell with the exact capabilities
  and available slots.

The source and authority members remain separate Chambers. The source cannot
mount `authority_access/admin`, which remains reserved for the authority-access
slice. It receives only a generated target proxy for the one new action task.

Initial source registration, support registration, unit definition, singleton
replica definition, assignment, desired state, and first lease acquisition are
explicit bootstrap/operator affects. They occur before reconciliation closes
direct placement mutation. The stem then manages ordinary placement, including
preserving its own valid singleton assignment. Expired-owner takeover remains
Sprint 7F.

## Authority Separation

### Reconciliation Control Capability

Migration 009 adds `reconciliation_control/use` as a privileged capability.
It is grantable only to trusted-control Cells and usable only by the exact stem
source slice. Its generated private facade exposes six literal operations:

- `read_work`: current lease, current input/control revisions, and bounded
  unresolved committed work.
- `renew_lease`: exact same-owner lease renewal.
- `issue_snapshot`: one canonical planner snapshot.
- `commit_plan`: one exact canonical plan.
- `record_action_failure`: one normalized known failure.
- `close_action`: explicit failed-action closure after changed authority.

The provider accepts no SQL name, procedure, query, table, credential,
transaction, arbitrary operation, or caller-supplied identity binding. It
derives environment, Cell, generation, Chamber, image, source slice, lease
owner, deadline, and result bound from the active runtime image and invocation.

The provider credential inherits only a new
`cadenza_reconciliation_stem_control` role. That role cannot execute placement
actions, replace desired state, acquire the initial lease, publish observations,
or read audit history.

### Authority Action Task

The authority gateway gains one nineteenth exact primitive:

- operation: `Reconciliation.ExecuteAction`.
- task: `task.authority.reconciliation.execute-action`.
- intent: `reconciliation-execute-action`.
- facade method: `reconciliation_execute_action`.
- family: `reconciliation_command`.

Its payload contains only `plan_key`, `action_key`, `lease_epoch`,
`owner_cell_key`, and `owner_cell_generation_key`. PostgreSQL reloads the
committed action body and independently fences every current authority input.

The Cell's normal authority-gateway credential receives execute privilege for
this function. The private reconciliation-control credential does not. The
stem source reaches the operation only by inquiring through the image-bound
target proxy to the contained authority-access support Chamber.

### Operational Authority Session

Autonomous activation installs a real `CellAuthoritySession` only when all of
the following are true:

- the member is the exact `slice.authority-access.v0` runtime authority.
- the artifact handler and digest match the active bootstrap authority slice.
- the image has the exact `authority_access/admin` mount.
- the Cell is active `trusted_control` authority for that image.
- the complete 19-primitive catalog and current activation authority agree.

Every other operational source Chamber retains a denying authority broker.
This does not create a generic broker selection surface.

## Resumable Work Contract

`cadenza.reconciliation-work` is a new language-neutral runtime-control
contract. It is not planner input and does not alter the 7A plan contract. It
contains:

- environment and exact lease owner identities.
- lease epoch and expiry.
- current input and control revisions.
- at most one oldest unresolved committed plan identity and digest.
- its remaining actions in sequence order.
- each action's latest immutable outcome and application receipt identity when
  present.
- the plan's committed input and control revisions.

PostgreSQL derives this response. The caller cannot select a plan or action.
The result is bounded by the existing 8,192-action contract and one 16 MiB
canonical response limit.

The source follows these rules:

1. Read work before planning or executing.
2. If an action application is committed, never execute that action again,
   even if the prior response was lost.
3. If an unresolved action has no terminal outcome, retry that exact committed
   action before creating another plan.
4. A transport failure creates unknown outcome, not semantic failure. The next
   pass rereads work.
5. A known failed action remains blocked while the input revision is unchanged.
6. Once authority input advances beyond the failed plan basis, close that
   action with `authority_changed_after_failure`, then issue a new snapshot.
7. A failed action under unchanged authority does not spin or erase evidence;
   it remains visible for repair.

This contract gives restart and unknown-outcome safety without adding a Cell or
Chamber work queue. PostgreSQL's immutable plan history is the durable work
basis.

## Stem Source Graph

The source artifact is deterministic canonical JSON with explicit tasks,
relationships, one pure helper, and no actor state.

### Tasks

1. `task.meta.reconciliation.receive-trigger`
   observes `cadenza.reconciliation.authority_changed` and
   `cadenza.reconciliation.safety_tick`, validates the host-bound trigger, and
   calls `read_work`.
2. `task.meta.reconciliation.renew-lease`
   renews only inside the fixed renewal window and otherwise returns unchanged
   context.
3. `task.meta.reconciliation.resolve-work`
   resumes an unresolved committed action, closes a failed action only after
   input change, or marks the context ready for a new snapshot.
4. `task.meta.reconciliation.issue-snapshot`
   calls the exact private facade only when no unresolved work remains.
5. `task.meta.reconciliation.plan`
   invokes `helper.meta.reconciliation.plan-v0` and returns the canonical plan.
6. `task.meta.reconciliation.commit-plan`
   commits the exact plan through the private facade.
7. `task.meta.reconciliation.dispatch-actions`
   sequences the bounded committed action list and makes one inquiry to
   `reconciliation-execute-action` per action. It stops at the first unknown or
   known failure.
8. `task.meta.reconciliation.conclude`
   returns bounded run metadata and unsatisfied demand, never the full snapshot
   or raw provider response.

Tasks may no-op based on explicit context mode so the graph stays static and
reviewable. The only loop is the bounded action sequence inside the dispatcher;
the actual affect remains one separate authority task execution per action.
This is the narrow low-level sequencing exception already allowed by the parent
primitive-first design.

### Planner Helper

The helper is generated from the authoritative 7A TypeScript planner and its
normalizer as one deterministic, dependency-free callable expression. A build
step bundles it without Node APIs, dynamic import, filesystem, network, clock,
randomness, or ambient globals.

The build must prove:

- the bundled helper produces every existing conformance fixture exactly.
- source permutation produces the same plan digest.
- helper bytes and digest are reproducible.
- the artifact stays within the 1 MiB source-slice authority bound.
- the runtime helper and host-side planner cannot drift silently.

## Trigger And Lease Stewardship

Migration 009 emits a bounded `cadenza_reconciliation_changed` notification
containing only the environment key after relevant input revision changes.
Notifications are hints and may be lost, duplicated, or coalesced.

The trusted Cell owns one fixed stem trigger loop:

- match only its environment and exact current stem source member.
- require every member of the current singleton stem replica to be ready.
- coalesce notifications into one pending bit.
- permit at most one stem signal execution in flight.
- inject a fixed safety tick every five seconds.
- deliver directly to the local stem source with forwarding disabled.
- derive trigger context from current Cell generation and local authority, not
  from notification payload fields.
- discard pending triggers when the stem member drains, expires, or changes
  generation.

The graph renews a five-minute lease only when no more than two minutes remain.
Equal safety ticks outside that window create no lease event, plan, action, or
route churn. An expired lease fences all control and action affect; takeover is
not improvised in 7D.

Activation authority and process custody are separate temporal identities. An
operational activation grant remains capped at five minutes and must be live at
activation. A successfully admitted Chamber receives an independently signed
containment lifetime capped at fifteen minutes; later grant expiry does not
terminate that Chamber.

## Bounded Large-Context Path

The approved snapshot and plan contracts allow 16 MiB, while ordinary runtime
contexts and capability results remain capped at 1 MiB. Sprint 7D will not
raise the global business limit.

Runtime capability-facade authority gains an explicit
`maximum_result_bytes`. Existing execution-evidence facades remain at 1 MiB.
Only the exact `reconciliation_control/read_work` and `issue_snapshot` facades
may declare 16 MiB, and only inside a `trusted_control` image whose containment
frame limit is exactly 16 MiB. Plan commit requests receive the same exact
bound. Chamber, Cell, adapter, and host protocol checks must agree before
activation.

The stem's final result and trigger context remain small. Raw snapshots and
plans are excluded from ordinary logs and execution-evidence details; evidence
records their identities, digests, counts, and outcomes.

## Evidence Protocol

The stem source uses the `boundary` evidence profile and is processing eligible.
Every trigger creates or continues a trace with distinct graph, task, inquiry,
authority action, distribution, and execution identities.

Evidence records:

- trigger kind and coalesced wake identity.
- lease read and renewal outcome.
- snapshot and plan keys, digests, revisions, counts, and expiry.
- each action inquiry, gateway result, SQL application, and immutable outcome.
- unknown transport state and later work-resolution result.
- unsatisfied demand reason and count.
- final no-churn, applied, blocked, fenced, or failed conclusion.

Evidence excludes snapshot bodies, plan bodies, source bytes, credentials,
endpoints, keys, raw business context, and provider objects. The existing
evidence processor remains nonrecursive for its own slice; no sub-meta bypass is
introduced.

## Failure Scenarios

### Lost Notification

The five-second safety tick runs the same graph. Equal state is no-op.

### Notification Storm

The Cell keeps one in-flight run and one pending bit. It does not queue events.

### PostgreSQL Outage Before Affect

The private provider returns unavailable. No plan or action is invented. The
next trigger rereads current work.

### Lost Action Response

The next pass reads the immutable action application. A committed action is
not executed again; a genuinely unapplied action may be retried.

### Authority Changes Between Actions

The exact action operation rejects under its current fences. The failure is
recorded. Once the input revision advances beyond the failed plan basis, the
graph closes the failed action and replans.

### Lease Near Expiry

The graph renews before snapshot issue. A same-owner renewal does not create
semantic plan churn.

### Lease Expiry Or Owner Drift

All private facade and gateway action calls fail closed. 7D does not acquire a
new epoch or move the stem; Sprint 7F owns takeover.

### Cell Or Chamber Loss

Sprint 7C cleans up local runtime custody. The old generation cannot mutate
authority. Recovery of the stem lease and activation on another Cell remains
7F.

### Unsatisfied Capacity

The canonical plan records explicit unsatisfied demand and no fabricated
assignment. Sprint 7E may later add pre-enrolled supply.

## Implementation Passes

### Sprint 7D.1: Runtime-Control And Authority Boundaries

- add the neutral reconciliation-work contract and hostile fixtures.
- split stem-control and gateway-action PostgreSQL roles.
- add exact read-work authority and bounded notifications.
- add the nineteenth authority gateway primitive and provider mapping.
- add facade-specific result bounds without raising ordinary limits.
- prove role denial, catalog drift, replay, unknown outcome, and 16 MiB bounds.

Gate: no credential or facade can bypass the singular action path, and
committed work can be resumed without caller memory.

### Sprint 7D.2: Deterministic Stem Assets

- bundle the planner helper from the 7A authority implementation.
- author the eight-task source graph and runtime support.
- add exact private facades, target proxy, responsibilities, and evidence
  policy.
- generate deterministic source, support, registration, unit, replica, desired
  state, and initial placement assets.
- prove all planner fixtures through the materialized helper.

Gate: the serialized stem artifact is deterministic, bounded, primitive-first,
and has no ambient authority.

### Sprint 7D.3: Trusted Cell Integration

- add the purpose-separated stem-control credential descriptor for
  trusted-control Cell hosts only.
- add the image-bound reconciliation control provider.
- activate the exact authority-access support member with a real authority
  session.
- add notification coalescing, safety tick, direct signal ingress, lease
  renewal, and lifecycle fencing.
- remove any test controller path that duplicates production trigger behavior.

Gate: a real stem replica executes only through its two contained members and
the fixed Cell providers.

### Sprint 7D.4: Convergence Proof And Closure

- provision the initial singleton stem through exact bootstrap/operator
  operations.
- start the stem and at least two current ready ordinary Cells.
- change only desired state to scale an existing unit up, reassign, and down.
- prove Chamber materialization, residency, routes, remote execution,
  unsatisfied demand, no-churn safety ticks, notification loss, database outage,
  response loss recovery, evidence, and cleanup.
- run security, disclosure, pressure, dead-code, operational-complexity, and
  recursive coherence reviews.

Gate: desired state alone converges replicas, assignments, Chambers,
residencies, and routes across existing Cells.

## Impacted Repositories

### `cadenza`

- neutral runtime-control schemas and fixtures.
- authority gateway catalog, schemas, artifact, and tests.
- migration 009 roles, functions, notifications, capability vocabulary, and
  hostile PostgreSQL tests.
- deterministic planner-helper and stem-source asset generation.
- environment bootstrap fixtures and conformance proof.

### `cadenza-cell`

- trusted-control-only descriptor and PostgreSQL provider.
- exact control capability broker.
- operational authority-session activation.
- notification and safety-trigger loop.
- Linux multi-Cell proof.

### `cadenza-chamber`

- facade-specific result-bound contract and validation.
- conformance tests for 16 MiB privileged control responses, target-proxy
  authority inquiries, and unchanged ordinary 1 MiB limits.
- no placement policy, SQL, lease ownership, or trigger loop.

### Workspace Meta Repo

- approved decision, roadmap status, execution plan, closure evidence, and
  coherence review.

## Security Review Requirements

- standard Cells cannot receive or use `reconciliation_control`.
- non-stem slices cannot declare its facades.
- the stem source cannot mount `authority_access`.
- the control role cannot execute an action.
- the gateway role cannot issue snapshots, commit plans, renew leases, close
  failures, or read stem work.
- PUBLIC, operator, observation appender, auditor, standard Cell, ordinary
  gateway, and unrelated source roles fail hostile calls.
- provider credentials, SQL names, plan bodies, and notification payloads never
  enter authored context.
- every operation validates exact image, source, Cell generation, lease owner,
  deadline, byte bound, and canonical contract.
- unknown outcome never becomes a blind retry or false failure.

## Pressure And Operational Complexity

- one active lease owner per environment.
- one in-flight graph and one pending wake bit per stem Cell.
- one snapshot and one plan per new planning pass.
- one bounded action sequence with at most 8,192 actions.
- one external action inquiry at a time.
- no durable Cell or Chamber queue.
- no lease renewal before the fixed renewal window.
- one five-second safety cadence, not an ambient tuning field.
- 16 MiB authority is limited to exact privileged facade operations.
- unchanged authority creates no new plan, action, process, route, or lease
  event.

The first implementation remains serialized. Concurrent planning, action
dispatch, and lifecycle are deferred until measured evidence proves need.

## Migration Strategy

This is the new major-version line; backward compatibility is not required.

1. Add migration 009 and update the authority gateway artifact at authority
   source first.
2. Prove role separation and work recovery before exposing any provider.
3. Add Chamber result-bound authority and conformance.
4. Add the Cell provider and operational authority session.
5. Generate and register stem assets through exact existing authority
   operations.
6. Run the source graph in shadow-plan mode and compare its plan with the
   host-side 7A planner.
7. Enable committed action dispatch.
8. Remove shadow comparison after exact conformance and run the Linux proof.

Static placement remains available only for initial stem bootstrap and repair
until Sprint 7F closes recovery. It is not retained as a parallel production
scheduler.

## Alternatives

### Put Reconciliation In The Cell Worker

Rejected. It would move environment policy into substrate code and violate the
principle that Cadenza extends features through its own primitives.

### Give The Stem Direct SQL

Rejected. It collapses interpretation, serialization, and affect into one
credentialed callback.

### Give The Private Provider Action Privilege

Rejected. The source could bypass the digest-pinned authority task and its
gateway evidence.

### Mount Authority Access In The Stem Source

Rejected. `authority_access/admin` remains isolated in the authority-access
support Chamber. The source gets one target proxy, not the catalog.

### One Large Reconcile Callable

Rejected. It hides stages and relationships and weakens execution evidence.

### Persist A Cell Work Queue

Rejected. PostgreSQL's immutable plans and outcomes already provide the
durable basis; another queue would create competing truth.

### Raise Every Context Limit To 16 MiB

Rejected. Only the exact privileged reconciliation facade needs that bound.

### Page Snapshots In V1

Deferred. Paging introduces assembly cursors and multi-read snapshot custody.
The existing bounded whole snapshot is simpler and more coherent for the first
environment. Pressure review may revisit this after measurement.

### Start With Cell Supply Or Stem Takeover

Rejected. 7D first proves policy expression across already-running Cells. Cell
supply and recovery remain 7E and 7F.

## Implementation Record

Sprint 7D.1 through 7D.4 are complete. The implementation follows the approved
design with these evidence-driven refinements:

- semantic input and control revisions replace coarse authority-row churn as
  the planning basis; an expiry scan advances the relevant revision once.
- route groups and member sets have one canonical order and empty groups are
  absent in both PostgreSQL and Cell projections.
- the operational authority-support Chamber is promoted through the approved
  UID-bound activation-issuer command and immutable evidence.
- the stem lease is five minutes with a two-minute renewal threshold.
- activation grants and Chamber containment use independent five- and
  fifteen-minute ceilings.
- residency and journal assertions preserve the generation that actually
  produced each transition and evidence record.

The definitive two-Cell Linux/gVisor proof passed in 392.17 seconds. It covered
database outage, scale-up, remote routing and execution, renewal, reassignment,
zero-action quiescence, scale-down, restart without resurrection, evidence
provenance, and cleanup. Full functional validation is recorded in the closure
review. The machine-relative TypeScript performance file remains deferred by
prior agreement.

## Assumptions

- the first environment can perform one explicit bootstrap/operator sequence
  to register and place the initial stem and acquire its first lease.
- the initial trusted-control Cell has two available slots for the source and
  authority support Chambers.
- the TypeScript adapter remains the only production adapter in Sprint 7.
- the 7A planner and fixtures remain the semantic planner authority.
- one 16 MiB bounded privileged context is acceptable inside the stem Chamber;
  ordinary business contexts remain capped at 1 MiB.
- Sprint 7C autonomous Cell convergence and execution-evidence custody remain
  the runtime foundation.
- machine-relative performance thresholds remain separate from correctness.

## Exit Criteria

- exact stem source and authority support members materialize as one singleton
  replica under ordinary 7C convergence.
- the stem renews only its current lease and performs no affect after expiry.
- notifications and safety ticks coalesce without a queue or no-op churn.
- the runtime planner matches every 7A conformance fixture.
- private control credentials cannot execute placement actions.
- the source can invoke only the generated reconciliation action target.
- unknown action outcome resolves from immutable work before retry.
- changing only desired state creates, assigns, withdraws, and reassigns
  replicas across current ready Cells.
- ordinary Cells materialize, route, replace, and drain the resulting work
  without controller lifecycle commands.
- unsatisfied demand remains explicit when current capacity cannot satisfy it.
- evidence connects trigger, graph, plan, action, distribution, Cell, and
  Chamber consequences without raw authority bodies.
- the Linux proof ends with no leaked process, container, bundle, descriptor,
  listener, credential, or unacknowledged evidence.
- the final coherence review finds no issue that should precede Sprint 7E.

## Work Items After Approval

- [x] Record the approved Sprint 7D decision.
- [x] Implement Sprint 7D.1 authority boundaries.
- [x] Implement Sprint 7D.2 deterministic stem assets.
- [x] Implement Sprint 7D.3 trusted Cell integration.
- [x] Run Sprint 7D.4 Linux proof and recursive closure review.
- [x] Update repo contracts, roadmap, and closure evidence.
- [x] Receive explicit Sprint 7D closure approval.
