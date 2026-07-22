# Sprint 7C Autonomous Cell Runtime Convergence Design Proposal

Date: 2026-07-17

## Current Status

- State: `done`; Sprint 7C closed with explicit approval on 2026-07-18 after
  the final
  [Sprint 7C closure review](../../../contracts/distribution/sprint-7c-closure-review-v0.md).
- Complexity gate: required because this pass changes database-native runtime
  materialization authority, delegated signing, chamber activation proof,
  PostgreSQL roles, cell process descriptors, and autonomous lifecycle affect.
- Impacted repos: `cadenza`, `cadenza-chamber`, `cadenza-cell`, and the workspace
  meta repo.
- Completed prerequisites:
  - [Sprint 7A reconciliation planner](../completed/2026-07-17-scale-placement-reconciliation-sprint-7a.md).
  - [Sprint 7B PostgreSQL authority](../completed/2026-07-17-reconciliation-postgres-authority-sprint-7b-design.md).
  - [Sprint 7B closure review](../../../contracts/distribution/sprint-7b-closure-review-v0.md).
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).

## Context

Sprint 7B can now declare and assign replicas, serialize one stem owner, and
derive convergence from signed cell-generation and member-residency evidence.
The production-shaped cell still starts from a static activation bundle and
returns signed residencies to an external test controller. Route refresh is
also an explicit control command. Those boundaries proved the underlying
mechanisms, but they do not form an autonomous runtime.

The audit found four concrete gaps:

1. `cadenza-cell` can read one named replica but cannot read one bounded,
   transactionally coherent projection of all current assignments for itself.
2. runtime-slice authority stores artifact identity and runtime-support digest,
   but not the canonical source bytes and support manifest needed to
   materialize the definition later.
3. operational activation grants are short-lived and signed directly by the
   environment root outside the cell. A running cell cannot safely mint or
   renew them, and putting the root key in the cell would collapse semantic
   authority into process custody.
4. member residencies and route refresh are still published by the test
   controller. The cell runtime credential intentionally has read-only
   distribution authority.

Automating only the current control commands would preserve those hidden
dependencies and create a demo reconciler rather than a coherent runtime.

### Current Baseline

The current cell already provides the difficult local mechanisms:

- deterministic gVisor containment plans and a separate privileged launcher.
- chamber hello, prepare, activate, full projection apply, delegate, signal,
  drain, and stop.
- successor-before-predecessor local replacement.
- generation-scoped host meta authority and bounded chamber registries.
- signed member residencies and current assignment validation.
- opaque local and remote route interpretation with authenticated peer
  transport.
- durable execution-evidence custody and bounded background processing.

The baseline `cadenza-cell` suite passes 81 tests with one environment-dependent
test ignored. No existing failure needs repair before design approval.

## Intended Whole

Each running cell should continuously make its local runtime state agree with
the exact placement authority already declared for that cell. It absorbs
materialization, process lifecycle, residency renewal, and route refresh so
business and meta definitions remain concerned with intended function rather
than deployment coordination.

The cell is an interpreter and enforcer of local authority. It is not a
placement planner, desired-state owner, environment scheduler, root signer,
artifact author, or infrastructure provider.

False success includes:

- replaying preloaded startup bundles while claiming dynamic materialization.
- giving an environment root key or broad authority credential to the cell.
- letting the cell choose another cell or alter desired replica count.
- treating a database notification as authority without rereading current
  state.
- publishing `ready` before chamber activation and projection acknowledgement.
- retaining unbounded stale routes during an authority outage.
- using the generic authority gateway for routine runtime observations.
- introducing a durable job queue whose state competes with placement
  authority and local process truth.

## Proposed Architecture

```text
runtime-slice registration
  -> immutable source bytes + runtime-support authority in PostgreSQL

current assignment + active source + current cell/generation
  -> exact local convergence projection
  -> pure cell-local convergence decision
  -> exact delegated activation issuance when materialization is needed
  -> chamber prepare
  -> signed materializing residency
  -> chamber activate + projection acknowledgement
  -> signed ready residency
  -> bounded renewal and route refresh

withdrawal or replacement
  -> signed draining residency
  -> route removal/replacement
  -> quiescent drain + stop
  -> signed stopped residency
```

PostgreSQL owns semantic and issuance authority. The activation issuer owns one
narrow signing delegation. The Rust cell owns local interpretation and process
custody. The chamber owns materialization and primitive execution semantics.

## 1. Database-Native Materialization Authority

Extend the existing `RuntimeSlice.Register` operation instead of adding a
parallel artifact API. Registration must include:

- exact artifact bytes encoded as bounded base64.
- the artifact handler, digest, and provenance already present.
- one canonical runtime-support manifest and its digest.
- the existing execution-evidence policy, capabilities, facades, and
  responsibilities.

PostgreSQL stores canonical bytes and structured JSON in an immutable
`runtime_slice_materialization` row keyed by environment and slice. It verifies
the raw SHA-256 artifact digest, canonical JSON for the
`cadenza-source-slice-v0` handler, runtime-support digest, bounds, and exact
agreement with runtime-slice authority before registration commits.

This implements the previously agreed materialization direction: definition is
serialized authority, callable materialization remains inside the controlled
chamber, and primitive materialization remains in the core runtime.

The V0 source artifact bound remains 1 MiB. One deduplicated local convergence
projection is bounded to 16 MiB and contains at most 256 local chamber members.
Artifact bytes appear once per slice, not once per replica.

No backward-compatibility adapter is added. Existing official registrations and
fixtures are updated to provide the complete authority in this new major-version
line.

## 2. Exact Local Convergence Projection

Migration 008 adds one restricted reader:

`cadenza_distribution.read_cell_convergence_projection(environment_key, cell_key, cell_generation_key)`

The result is produced in one PostgreSQL statement snapshot and contains:

- database evaluation time, global authority revision, reconciliation input
  revision, and projection digest.
- current active cell enrollment, slot capacity, and latest current generation
  observation.
- every current assignment to that cell in canonical replica order.
- each placement member and its current source/materialization authority.
- current member residency, when present.
- a deduplicated route catalog for responsibilities declared by locally
  assigned source slices.
- each route member's current assignment, generation, image, and earliest
  residency expiry.

The reader returns no desired-state policy, other-cell capacity, lease, plan,
credential, endpoint secret, private key, host command, or provider object.
The cell cannot use it to choose placement.

PostgreSQL emits a small `LISTEN/NOTIFY` hint after relevant assignment,
materialization, residency, revocation, or cell-state changes. The payload is
never authority. Cells coalesce hints and reread the exact projection. A fixed
five-second safety tick repairs missed notifications and schedules evidence
renewal; it is a V0 constant, not ambient configuration.

## 3. Delegated Operational Activation Issuer

### Why Direct Root Signing Is Rejected

Autonomous activation requires a live signer. Keeping the environment root
online for every chamber activation would turn the most powerful key into a
routine availability dependency. Giving it to a cell would allow process
custody to invent semantic execution authority.

Sprint 7C therefore performs the delegated-signer design that was explicitly
deferred by the Sprint 5 operational-grant decision.

### Delegation Contract

An `activation-issuer-delegation` is signed by the active environment root and
stored immutably in PostgreSQL. It binds:

- environment and delegation identities and revision.
- issuer public key reference, Ed25519 SPKI digest, and key purpose.
- the sole `issue_operational_activation` permission.
- validity interval and revocation identity.
- maximum grant lifetime and supported runtime/handler boundary.
- root key identity, root version, delegation digest, and root signature.

The root may remain offline after issuing the delegation. Rotation or
revocation creates new authority; history is never rewritten.

Operational activation grants advance to a new contract version and carry the
delegation identity. `cadenza-chamber` verifies the root-signed delegation,
issuer public-key digest, issuer signature, grant digest, current assignment,
current source authority, current cell enrollment, and exact activation basis
before artifact resolution.

### Issuer Process

Add a separate unprivileged `cadenza-activation-issuer` binary in
`cadenza-cell`. It is substrate, not a chamber or Cadenza feature slice. It
receives only:

- a preopened Unix `SOCK_SEQPACKET` listener.
- one issuer private-key descriptor.
- one exact PostgreSQL issuer credential descriptor.
- bounded static identity/configuration.

The cell receives a connected issuer descriptor but never the issuer key or
database credential.

The protocol exposes one operation. A cell submits only environment, cell,
generation, replica, assignment epoch, slice, request, idempotency, and
deadline identities. PostgreSQL independently derives and reserves the entire
activation basis, including chamber key, image revision/epoch, activation
nonce, source authority, capabilities, artifact identity, and grant lifetime.
The issuer signs that exact digest, records the signed grant through a second
exact operation, and returns it.

The service cannot sign caller-provided bytes. Equal replay returns the exact
stored grant. Conflicting replay, stale assignment, inactive generation,
revoked source, expired delegation, key drift, or unsupported handler fails
before signature creation.

The issuer role is `NOLOGIN`, has no table privilege, and can call only the
reserve/read and record-signed-grant functions. Peer credentials, cell identity,
generation identity, request signature, frame bounds, and deadlines are checked
before database or signing affect.

## 4. Narrow Runtime Observation Publication

The existing reconciliation observation-appender boundary is extended with an
exact signed-residency operation. The cell host receives a separate observation
credential descriptor that can call only:

- `publish_cell_generation_observation`.
- `publish_replica_member_residency_observation`.

The cell verifies its own canonical signed value before selecting the appender
role. PostgreSQL then independently checks canonical bytes, digest, current
transport key, active enrollment, current generation, current assignment,
member identity, status transition, monotonic observation time, TTL, and exact
replay.

Routine observations do not use the generic authority gateway and cannot
mutate desired state, assignment, lease, plan, source, enrollment, or outcomes.
The existing generic residency operation remains only for pre-reconciliation
bootstrap and repair and is denied after the first reconciliation lease.

### Observation Semantics

- generation observations have the existing 60-second maximum TTL.
- ready generations publish occupied and available slot counts whose sum equals
  enrolled capacity.
- slot occupancy includes materializing, ready, and draining local replicas
  until their last member reaches stopped.
- `materializing` is published only after chamber prepare establishes the exact
  image digest.
- `ready` is published only after activation and required projection
  acknowledgement.
- `draining` precedes route removal and drain.
- `stopped` follows confirmed process stop.
- ready generation and residency observations renew every 20 seconds while
  current, leaving bounded time for retry before expiry.

## 5. Cell-Local Convergence Engine

Add a pure decision layer that compares one normalized local convergence
projection with one explicit local runtime inventory. It returns bounded local
effects but performs none itself.

The engine may decide only:

- publish or renew the generation observation.
- request an activation grant for one assigned member.
- prepare or activate one exact chamber.
- publish one member residency transition or renewal.
- replace one stale local member successor-first.
- drain and stop one member no longer assigned locally.
- install one complete current route catalog.
- wait until one fixed retry deadline.

It cannot define, assign, withdraw, or move a replica; change desired state;
choose another cell; request cell supply; acquire a stem lease; or issue a
reconciliation plan.

### Pass Ordering

Each pass rereads authority and proceeds in this order:

1. validate cell enrollment, generation identity, projection digest, bounds,
   and monotonic revision.
2. publish or renew the generation observation when due.
3. fence and drain local members no longer current for this cell/generation.
4. materialize missing current members in canonical replica/slice order.
5. publish or renew current residency evidence.
6. stage the complete route catalog and apply changed route groups to every
   affected ready source chamber.
7. publish a final generation observation if occupancy or route projection
   changed during the pass.

One lifecycle effect completes before the next begins. Authority is reread
after every external effect. There is no durable cell job queue: process state
is local truth, PostgreSQL is semantic truth, and restart recomputes the
difference.

Failures use fixed nonblocking retry deadlines of 250 ms, 1 second, and 5
seconds, then remain on the five-second safety cadence. Repeated notifications
are squashed into one requested pass. The peer/control event loop is never put
to sleep for backoff.

### Replacement And Withdrawal

For a new assignment epoch or changed materialization basis on the same cell,
the worker prepares and activates the successor before draining the predecessor.
The predecessor may finish already admitted work, but stale assignment or image
authority cannot receive new ingress.

For withdrawal or reassignment away from the cell, the cell publishes
`draining`, removes the member from current local route authority, applies the
replacement projections, drains quiescently, stops, and publishes `stopped`.
Database outage or an invalid projection never implies withdrawal; absence is
consequential only in a valid current projection.

## 6. Automatic Route Convergence

Manual `RefreshTargetRoute` and `RefreshSignalRoutes` host commands are removed
from the production control protocol. The worker receives all route authority
through the local convergence projection.

Route candidate membership remains chamber-visible only as opaque keys. Full
route-member identity, location, image, assignment, and expiry remain
cell-private. The host stores `valid_until` on each binding and rejects new
affect after expiry even if a chamber still selects the opaque key.

When only residency expiry extends, the cell updates private binding validity
without republishing an equal candidate set to chambers. When membership or
selection changes, it advances one local route epoch, stages the full
HostMetaAuthority replacement, publishes complete chamber projections, and
commits the local revision only after exact acknowledgements. On failure it
restores the previous projection or marks the affected chamber failed closed.

This preserves bounded routing during PostgreSQL outage without creating
per-execution database dependence. Work admitted before expiry may finish; new
work after expiry fails with explicit stale-route meaning.

## State And Evidence

The worker maintains explicit local states:

- `absent`
- `grant_pending`
- `preparing`
- `materializing`
- `ready`
- `draining`
- `stopped`
- `failed_waiting_retry`

These are process interpretations, not a second durable authority. Every
meaningful transition is appended through the existing generation journal with
environment, cell, generation, replica, assignment, slice, chamber, image,
projection, request, and evidence identities. Raw source bytes, callable text,
credentials, endpoints, private keys, and business context are excluded from
evidence.

Execution-evidence processing remains nonrecursive under its approved profile.
The worker itself does not gain an alternate logging subsystem.

## Security Boundaries

- environment root private keys never enter a cell, issuer, chamber, database,
  source definition, evidence record, or process argument.
- issuer private keys never enter a cell or chamber and are authorized only by
  a root-signed, revocable, purpose-specific delegation.
- cells cannot submit grant bodies, artifact bytes, capabilities, runtime
  identities, containment fields, or timestamps to the issuer.
- chambers independently verify delegation and grant chains before artifact
  resolution.
- artifact and runtime-support bytes come only from immutable digest-bound
  authority.
- observation credentials cannot read or mutate authority tables.
- database notifications trigger reads but authorize nothing.
- no Docker socket, shell, command, path, mount, environment, endpoint,
  credential, cloud API, or arbitrary provider appears in a convergence
  contract.
- standard cells still cannot activate `trusted_control` materialization.

## Scenario Coverage

The implementation must prove:

- an empty ready cell publishes generation capacity without a chamber.
- a new local assignment autonomously prepares, activates, publishes ready
  residencies, and becomes routable.
- all members of a multi-member unit must be ready before route publication.
- equal projection and equal issuer requests create no churn and replay exactly.
- missed notifications repair on the safety tick.
- residency and generation renewal preserve readiness without chamber
  projection churn.
- withdrawal removes new ingress before quiescent drain and stop.
- same-cell assignment/image replacement is successor-first.
- reassignment fences the old cell and converges the new cell without either
  choosing placement.
- source revocation removes execution eligibility and drains affected work.
- issuer outage blocks only new materialization; current bounded work continues.
- PostgreSQL outage causes no invented drain or activation and routes expire
  closed.
- launcher, chamber prepare, activation, projection, residency, and observation
  failures preserve explicit partial state and retry safely.
- stale generation, assignment, artifact, issuer delegation, route, and key
  identities fail before affect.
- hostile cell, issuer, reader, appender, gateway, chamber, and PUBLIC role
  boundaries cannot cross into another authority surface.
- restart recomputes convergence without replaying an in-memory queue or
  leaving launcher-owned processes behind.

## Sprint Structure

### Sprint 7C.1: Materialization And Issuance Authority

- extend neutral runtime-slice and activation-delegation contracts.
- add migration 008 materialization custody, local projection, activation
  issuance, observation appender, and notification functions.
- update TypeScript authority validation and PostgreSQL hostile tests.
- update chamber activation verification for delegated issuer proof.

Gate: PostgreSQL can derive one exact activation basis from current assignment
authority, and a chamber can verify its delegated signature chain without any
cell holding the signer key.

### Sprint 7C.2: Pure Local Convergence Engine

- define normalized local runtime inventory and bounded effect decisions.
- prove ordering, no churn, renewal, withdrawal, replacement, backoff, and
  restart recomputation with in-memory providers.
- add cell-private route validity and full route replacement.

Gate: equal authority and local state produce no effect; every difference
produces only a legitimate local effect.

### Sprint 7C.3: Provider And Cell-Host Integration

- implement the activation-issuer service/client and exact PostgreSQL clients.
- refactor startup-only activation into reusable prepare/activate phases.
- wire notification plus safety cadence into the Linux cell-host event loop.
- remove manual production route refresh and external residency publication.

Gate: two ordinary cell-host processes converge database assignment changes
without controller lifecycle or route commands.

### Sprint 7C.4: Linux Proof And Closure

- run two real unprivileged cells with separate launchers, issuer, PostgreSQL
  roles, transport keys, and evidence journals under gVisor.
- exercise assignment, multi-member readiness, routing, renewal, replacement,
  withdrawal, outage, recovery, restart, and cleanup.
- perform security, disclosure, pressure, dead-code, operational-complexity,
  and recursive coherence reviews.

Gate: two already-running cells converge current static placement authority
without manual process, residency, or route control.

## Impacted Repos

### `cadenza`

- semantic authority for source materialization and issuer delegation.
- migration 008 exact roles, custody, projection, issuance, appender, and
  notifications.
- updated runtime-slice contract, fixtures, and PostgreSQL tests.

### `cadenza-chamber`

- delegated activation-issuer proof verification.
- no placement, database, process, or provider authority.
- existing prepare, activate, projection, drain, and stop semantics remain.

### `cadenza-cell`

- pure local convergence planning and inventory.
- activation issuer service/client.
- exact convergence reader and observation publisher clients.
- reusable materialization phases and automatic route/lifecycle convergence.
- Linux system evidence.

### Workspace Meta Repo

- design, decision, roadmap, contract routing, and closure evidence.

No primitive-core translation, legacy repo, CLI, UI, memory, agent, actor,
cell-supply, or stem graph change is included.

## Migration Strategy

1. record the approved decision before implementation.
2. update the authority contract and PostgreSQL source first.
3. update chamber proof verification and hostile vectors.
4. implement the pure cell convergence engine against fake providers.
5. implement issuer and PostgreSQL providers with distinct credentials.
6. integrate into the cell host while preserving static startup as a bounded
   bootstrap/repair path until closure.
7. remove manual route refresh and controller residency publication from the
   production host protocol after automatic proof passes.
8. run Linux evidence before making a privileged autonomous-convergence claim.

Static explicit authority mutation remains a test and repair path. It does not
remain a parallel production scheduler.

## Validation Plan

### Contract And Authority

- canonical artifact/runtime-support digest vectors and hostile mutations.
- delegated issuer chain, revocation, expiry, key drift, conflicting replay,
  stale assignment, and cross-cell denial.
- local projection transaction coherence, ordering, deduplication, time,
  collection, and byte bounds.
- exact observation replay and forbidden role/table/function access.
- migration upgrade and complete environment-bootstrap regression suite.

### Cell And Chamber

- pure decision matrix for every local state and transition.
- no-churn equal-state and route-validity-only refresh.
- process failure at every boundary from grant reservation through stop.
- projection rollback and stale opaque-route denial.
- strict formatting, all-target tests, and all-feature Clippy in both Rust repos.

### System

- two process-separated cells and one process-separated activation issuer.
- no controller activation, residency, or route-refresh call after initial
  process provisioning.
- PostgreSQL and issuer outage/recovery.
- bounded pressure at 256 local chamber members and maximum route groups.
- Linux gVisor containment, descriptor, process, cgroup, bundle, and cleanup
  proof.
- workspace harness and recursive coherence review.

## Risks

### Delegated Signer Complexity

The issuer adds another security-critical process. This is justified because
autonomous source activation requires a signer while root and cell custody must
remain separate. Its surface is one operation, one exact database role, one
key purpose, bounded frames, and no generic signing API.

### Multiple Control Loops

Stem planning, PostgreSQL serialization, local convergence, launcher custody,
and evidence processing could become competing loops. 7C preserves one
direction: the stem is not yet active, PostgreSQL states what is assigned, the
cell converges only local runtime state, the launcher owns process custody, and
the evidence processor owns ledger transfer.

### Observation Churn

Generation and residency TTLs create regular writes. Renewals are batched per
pass, notifications are coalesced, equal route membership avoids chamber
projection churn, and pressure tests measure the maximum supported V0 cell.

### Serialized Host Latency

The current host serializes chamber control. One materialization effect may
temporarily delay peer acceptance. Every external operation is deadline-bound,
only one effect runs at a time, and concurrency remains a later measured
optimization rather than an unreviewed semantic change.

### Database-Native Artifact Size

Storing source bytes increases snapshot and database pressure. Source bytes are
immutable, content-addressed, limited to 1 MiB, deduplicated in local
projections, and excluded from reconciliation snapshots and evidence.

## Alternatives

### Give The Cell The Environment Root Key

Rejected. It merges process custody with semantic execution authority and makes
one compromised cell an environment-wide signer.

### Keep The Root Online In The Issuer

Rejected. Routine materialization should not make the root key a hot operational
credential or availability dependency.

### Delegate Signing To Each Cell

Rejected. The same compromised cell could sign a false grant and forge the
host-mediated current-authority read seen by its chamber.

### Pass Fresh Bundles Through The Existing Control Descriptor

Rejected. It preserves an external lifecycle controller and does not produce
autonomous cell convergence.

### Let Chambers Read PostgreSQL Or Artifact Storage Directly

Rejected. It places credentials and topology inside containment and bypasses
the cell's mediation boundary.

### Use The Generic Authority Gateway For Observations

Rejected. Routine runtime evidence does not justify access to eighteen broader
semantic mutation operations.

### Add A Durable Cell Work Queue

Rejected. PostgreSQL assignment plus local process state already provide the
two truths needed to recompute convergence. A queue would add competing state,
recovery ambiguity, and operational debt.

## Assumptions

- source-slice definitions and generated runtime support are immutable,
  canonical, bounded authority suitable for PostgreSQL custody.
- an operator can provision and rotate one purpose-specific activation issuer
  key and root-signed delegation without exposing the environment root online.
- V0 supports one issuer delegation active per environment; high availability
  is deferred until the single issuer contract is proven.
- the existing 60-second generation and residency TTL remains the V0 authority
  constant.
- cell restart creates a new generation and launcher disconnect cleanup removes
  the previous generation's processes.
- cell supply and stem takeover remain Sprint 7E and 7F respectively.

## Work Items After Approval

- [x] Record the delegated activation and local convergence decision.
- [x] Implement Sprint 7C.1 contracts, migration 008, and hostile tests.
- [x] Complete the 7C.1 coherence/security gate.
- [x] Implement and prove the pure 7C.2 convergence engine.
- [x] Complete the 7C.2 pressure and no-churn gate.
- [x] Implement the 7C.3 issuer, providers, and host integration.
- [x] Replace manual route and residency controller paths.
- [x] Prove two-cell autonomous convergence and failure recovery.
- [x] Run Linux gVisor proof and recursive closure review.
- [x] Update repo contracts, roadmap, and closure evidence.

## Exit Criteria

- a ready empty cell publishes current signed generation capacity.
- current local assignment authority materializes exact chambers without
  controller lifecycle commands.
- every ready, draining, and stopped claim has current signed residency
  evidence through a narrow appender.
- changed assignments and source authority converge monotonically without
  placement choice inside the cell.
- route membership and validity converge automatically and expire closed.
- the environment root remains offline and outside runtime processes.
- the activation issuer cannot sign arbitrary bytes or cross current assignment
  authority.
- equal state causes no process, projection, or authority churn.
- outage and restart recompute from authority and local truth without a durable
  competing queue.
- two real cells pass the Linux proof with no leaked process, container, bundle,
  descriptor, credential, or unacknowledged evidence.
- the final coherence review finds no issue that should precede Sprint 7D.
