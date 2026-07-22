# Sprint 7E Pre-Enrolled Cell Supply Design Proposal

Date: 2026-07-19

## Current Status

- State: `done`; implementation, validation, and closure review were explicitly
  approved on 2026-07-19.
- Complexity gate: required. This pass changes reconciliation contracts and
  planning, PostgreSQL authority, Cell generation lifecycle, Linux process
  supervision, credential custody, and cross-process recovery.
- Impacted repos: `cadenza`, `cadenza-cell`, `cadenza-chamber` for conformance,
  and the workspace meta repo.
- Approval received: `Design approved. Proceed.` on 2026-07-19.
- Sprint 7E.4 transport-identity amendment explicitly approved with
  `Design amendment approved. Proceed.` on 2026-07-19.
- Sprint 7E closure explicitly approved with `Sprint 7E closure approved.` on
  2026-07-19.
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).
- Completed prerequisite:
  [Sprint 7D Stem-Cell Meta Slice](2026-07-18-stem-cell-meta-slice-sprint-7d-design.md).

## Context

Sprint 7D proves that declared replica demand can create, assign, materialize,
route, reassign, and withdraw work across Cells that are already running. It
correctly leaves demand unsatisfied when those Cells lack eligible capacity.

Sprint 7E adds bounded Cell process supply without turning the stem into an
infrastructure controller. V1 remains restricted to identities, keys,
endpoints, launch profiles, database roles, launcher access, and journal roots
provisioned before reconciliation begins. It does not enroll a Cell, create a
machine, call a cloud API, construct a launch profile, or accept arbitrary
process configuration.

### Current Contract Findings

The existing foundation intentionally reserves more meaning than it implements:

1. `request_cell_start`, `request_cell_drain`, and `request_cell_stop` are valid
   reconciliation action kinds, but the planner never emits them and the
   authority executor rejects them.
2. The reconciliation snapshot contains active enrollments and current Cell
   generations, but no authority saying which dormant identities have an
   available pinned launch profile or may be released automatically.
3. A PostgreSQL transaction can commit a supply request, but it cannot
   transactionally prove that a Linux process started. Treating those as the
   same outcome would create false success and unsafe retry behavior.
4. The Cell host supports orderly `stop`, but not the explicit
   `ready -> draining -> stopped` generation sequence needed to fence new
   assignment before process termination.
5. Starting a Cell requires a sensitive fixed descriptor bundle: transport and
   control keys, certificates, purpose-separated database credentials,
   listener, journal custody, launcher session, issuer session, and pinned
   runtime components. None may enter a graph context or database action body.
6. The current Linux proofs let the test controller own Cell child processes.
   Production supply needs one recoverable owner whose crash cannot leave an
   unfenced child or duplicate Cell generation.

These gaps require one explicit supply authority and one purpose-specific
substrate reconciler. They do not justify a generic provisioning service.

## Intended Whole

An author changes desired replica count. Cadenza obtains or releases enough
pre-authorized local runtime capacity, then converges placement and execution,
without exposing Cells, process commands, credentials, launch profiles, or
provider mechanics in the authored business graph.

The stem interprets demand. PostgreSQL serializes directives. The supply
supervisor realizes only pre-authorized process state. Each Cell remains the
signed authority for its own runtime generation and local Chamber custody.

False success includes:

- returning “Cell started” when only a request row was committed.
- giving the stem or a contained support slice a launcher socket, process
  handle, filesystem path, credential, endpoint, profile, or provider API.
- allowing a provider to enroll Cells, choose placement, change desired count,
  assign replicas, or weaken capability and trust requirements.
- accepting executable, arguments, environment, mounts, sockets, identities,
  credentials, or profile references from a reconciliation action.
- starting a second generation while a prior generation remains current.
- stopping a Cell that still owns an assignment, residency, route, or stem
  lease.
- interpreting provider absence as available capacity.
- creating a second scheduler or durable process-command queue.

## Governing Architecture

```text
declared replica demand
  -> stem snapshot exposes bounded eligible supply state
  -> pure planner selects exact dormant cell keys
  -> Reconciliation.ExecuteAction commits a supply directive
  -> purpose-bound supply supervisor reads its current projection
  -> pinned local profile starts, drains, or stops one Cell process
  -> Cell signs starting, ready, draining, and stopped generation state
  -> provider signs profile/process realization state
  -> semantic revision wakes the same stem graph
  -> placement proceeds only after current ready Cell authority exists
```

There is no synchronous graph-to-process RPC. `request_cell_start` commits the
desired disposition `running`; it does not claim readiness. Provider and Cell
observations later make realization interpretable and trigger another ordinary
reconciliation pass.

## Authority Identities

### Supply Provider Registration

One `cadenza.cell-supply-provider-registration` binds:

- environment and provider key.
- Ed25519 public-key reference and digest.
- active or revoked status.
- maximum managed profile count.
- provider protocol identity and version.

Registration is bootstrap/operator authority. The stem cannot create, update,
or revoke a provider.

### Pre-Enrolled Supply Profile

One `cadenza.cell-supply-profile` binds:

- environment, provider, profile, and already enrolled Cell keys.
- digest of the pinned local launch profile.
- release policy: `retained` or `demand`.
- active or revoked status.
- registration revision and evidence.

The database record contains no executable, path, endpoint secret, private key,
credential, environment, descriptor, mount, or host configuration body. Those
remain in the provider's locally provisioned profile custody.

`retained` supply may be started automatically but is not automatically
drained. `demand` supply may be started and later released when it is empty.
This avoids speculative Cell types or a second pool desired-state model.

### Provider Generation

Each supervisor process publishes one signed
`cadenza.cell-supply-provider-generation` with:

- provider generation key and monotonically increasing epoch.
- provider key and registration revision.
- lifecycle: `starting`, `ready`, `draining`, or `stopped`.
- observation and expiry times.
- profile-catalog digest and observation signature.

Only one unexpired ready generation may realize a provider's directives. A new
supervisor generation cannot overlap the previous generation. This prevents
two same-key processes from independently starting the same Cell profile.

### Supply Directive

Every committed supply action creates the next immutable directive epoch for
one Cell:

- directive key and epoch.
- source plan and action keys.
- target disposition: `running`, `draining`, or `stopped`.
- current provider, profile, and profile-digest authority.
- stem lease epoch and source authority revision.
- committed time and gateway evidence key.

The current directive is desired process state, not proof of realization.
Equal requests replay; contradictory stale epochs fail closed.

### Supply Observation

The provider signs bounded observations with state:

- `dormant`: no Cell process is held for the profile.
- `starting`: exact process activation is in progress.
- `running`: the provider holds the control channel for the named current Cell
  generation; Cell `ready` observation remains independently required.
- `draining`: the Cell acknowledged the exact drain directive.
- `stopping`: final process termination is in progress.
- `failed`: the current directive could not be realized, with a normalized
  reason code.

Every observation binds provider generation, profile digest, directive epoch,
Cell key, optional Cell generation key, attempt sequence, timestamps, digest,
and signature. It contains no stderr, credential, profile body, path, command,
or secret.

## Stem Projection And Planner

The full authority tables remain private. The snapshot gains one sorted bounded
`cell_supply` projection per managed Cell containing only:

- Cell key.
- release policy.
- provider availability: `ready`, `unavailable`, or `revoked`.
- current directive epoch and target disposition, if present.
- current observed supply state.
- current observed Cell generation key, if any.
- normalized failure reason, if any.

Enrollment continues to supply trust profile, capabilities, transport identity,
slot capacity, and current signed Cell generation. The stem does not receive
provider keys, profile keys, profile digests, endpoints, or launch material.

### Start Planning

When eligible ready capacity cannot place all desired replicas, the planner:

1. preserves valid current assignments.
2. emits required replica definitions.
3. identifies active dormant profiles whose enrolled Cell satisfies the exact
   unit trust, capability, allowed, pinned, and blocked constraints.
4. selects candidates deterministically by smallest fitting slot capacity and
   then Cell key, reusing simulated selected capacity before selecting another
   profile.
5. emits at most one `request_cell_start` per selected Cell.
6. leaves replicas unassigned until a current ready Cell generation exists.

The plan records `supply_pending` when selected supply can satisfy demand and
`supply_unavailable` when no current provider/profile can do so. Existing
capacity and pin-specific reasons remain when supply is not applicable.

A current running directive reserves its candidate capacity while realization
is pending, preventing duplicate over-provisioning. Failed or unavailable
supply remains explicit and never becomes fabricated readiness.

### Drain And Stop Planning

Automatic release is restricted to `demand` profiles. V1 does not proactively
move healthy replicas merely to reduce Cell count.

The planner may emit `request_cell_drain` only when:

- no current assignment targets the Cell.
- no current residency or route remains for the Cell generation.
- the Cell does not own the stem lease or operational authority mount.
- no selected pending replica needs its capacity.
- the provider, profile, generation, and directive are current.

The authority executor rechecks those conditions. A drain directive prevents
future assignment immediately. The provider asks the host to enter `draining`;
the host publishes that signed generation state and remains alive.

The planner may emit `request_cell_stop` only after the exact generation is
draining and remains empty. The provider then performs orderly stop, verifies
child exit, and publishes `dormant`. A later start always creates a new Cell
generation and directive epoch.

## Authority Operations And Roles

`Reconciliation.ExecuteAction` remains the singular action path. It is extended
to the three existing supply action kinds:

- start commits target disposition `running`.
- drain commits target disposition `draining`.
- stop commits target disposition `stopped`.

For these action kinds, `committed` means the directive was transactionally
committed. The result and action outcome use reason `directive_committed`; they
never claim process realization. Provider and Cell observations carry later
consequence.

New purpose-separated roles expose literal operations only:

- provider-generation acquire, renew, and stop.
- read the current bounded projection for one exact provider generation.
- append one signed supply observation.
- read the exact registered public authority needed to verify local profile
  custody.

The provider role cannot read private authority tables, mutate desired state,
commit plans, execute actions, enroll or suspend Cells, assign replicas,
publish Cell generation/residency, promote authority mounts, or append business
execution evidence. PUBLIC, stem-control, gateway, Cell convergence,
observation, activation issuer, ledger, and unrelated provider roles receive no
supply-provider privilege.

## Linux Supply Supervisor

`cadenza-cell` adds a separate `cadenza-cell-supply` binary. It is substrate
runtime management, not a meta slice and not another Cadenza primitive runtime.

The daemon:

- runs as a dedicated unprivileged OS identity.
- accepts only fixed inherited startup descriptors for canonical config,
  pre-opened profile-root custody, provider signing key, and its isolated
  PostgreSQL credential.
- takes no runtime command-line path, Cell key, executable, argument,
  environment, mount, endpoint, or credential.
- locks the profile root and proves its canonical catalog digest against
  registered provider authority before publishing ready.
- opens exact profile members relative to the pre-opened root with no symlink
  traversal and strict owner, mode, type, size, and digest checks.
- starts only the pinned `cadenza-cell` executable with its fixed descriptor
  layout, an empty environment, fixed working directory, and no shell.
- creates one fresh generation journal directory and one fresh Cell generation
  identity per start attempt.
- retains the child control channel and process handle until stopped.
- processes one profile transition at a time in V1.
- uses database notifications only as wake hints and one fixed five-second
  safety cadence.

Each managed Cell profile contains the complete deployment-owned resource map
needed to construct the existing host descriptors. Profile bytes and secrets
never enter PostgreSQL, observations, evidence, graph context, or logs.

The supervisor-child control channel is also the liveness boundary. Closing it
causes the Cell host to exit and launcher custody to clean contained Chambers.
The supervisor uses Linux parent-death protection and an exclusive profile lock.
After supervisor restart, a new provider generation waits until prior Cell
generation authority is stopped or expired before creating a successor. V1
does not adopt an unowned child process.

## Cell Host Lifecycle Refinement

The fixed host control protocol gains `drain` as a lifecycle command available
only on its inherited supervisor channel. It is not a public controller or peer
operation.

- startup publishes signed `starting`, then `ready` only after host authority,
  listener, journal, providers, and convergence are ready.
- `drain` is accepted only when the current database directive agrees and the
  local inventory is empty. It publishes signed `draining`, rejects new local
  materialization, but remains alive for the final stop decision.
- `stop` requires the current stopped directive after draining. It publishes
  signed `stopped`, closes all custody, returns the terminal response, and exits.
- control loss, profile revocation, generation drift, or conflicting directive
  fails closed and terminates custody without inventing a graceful observation.

Unmanaged deployment-owned Cells retain the existing explicit orderly stop
path. Supply authority is required only for supply-managed generations.

## Recovery Scenarios

### Lost Notification Or Provider Database Outage

The safety cadence rereads current directives. No local transition occurs
without a current provider generation and directive. Running Cells continue
under their own bounded runtime authority.

### Crash Before Process Start

The running directive remains durable. A successor provider generation retries
the same desired disposition after predecessor expiry without another stem
action.

### Crash After Spawn Before Observation

Control-channel loss and parent-death protection terminate the unowned child.
Launcher disconnect cleans Chambers. The next provider waits for prior Cell
generation expiry, then starts a fresh generation under the same current
directive.

### Ready Response Or Observation Lost

The provider rereads current Cell generation authority and local child status.
An equal observation replays. It never starts a second process while the first
generation remains current.

### Desired State Changes During Start

The next directive epoch supersedes the start. The provider rereads before each
consequential step and converges the latest target rather than completing stale
work.

### Drain Or Stop Response Lost

Current signed Cell lifecycle, provider observation, child status, and directive
epoch determine recovery. Repeated control does not skip lifecycle or create a
new generation.

### Profile Drift Or Revocation

The provider publishes normalized failure or unavailable state and performs no
start. Existing running custody is drained by explicit current authority; a
changed local profile cannot silently replace registered authority.

### No Eligible Supply

The plan records explicit unsatisfied demand. It does not spill outside pins,
weaken trust/capability requirements, enroll a Cell, or call infrastructure.

## Evidence And Disclosure

Immutable authority/runtime evidence records:

- provider and provider-generation identity.
- profile and registered profile digest identity.
- directive, plan, action, lease, and authority revision.
- transition attempt and normalized phase/outcome.
- Cell generation and child exit classification when known.
- signed starting, ready, draining, and stopped observations.

Evidence excludes profile bodies, commands, paths, file names, private keys,
credentials, endpoints, descriptors, environment, stderr, and business context.
Supply evidence is authority/runtime evidence, not fabricated business
execution evidence.

## Pressure And Operational Complexity

- at most 1,024 managed profiles and the existing 1,024-Cell snapshot bound.
- one current directive and one current observation per profile.
- one current provider generation per provider registration.
- one child process and one in-flight transition per profile.
- one globally serialized profile transition in the first supervisor.
- one pending wake bit and one fixed five-second safety cadence.
- no provider command queue, workflow retry queue, cloud retry engine, or local
  desired-state database.
- no proactive repacking of healthy assignments in V1.
- no hidden start timeout, drain timeout, retry count, or backoff supplied by an
  action; fixed bounds are governed constants.

Operational complexity is reviewed as a first-class closure criterion. The
stem decides, PostgreSQL serializes, the supply supervisor realizes process
state, and each Cell converges its own Chambers. No part may duplicate another
part's policy loop.

## Implementation Passes

### Sprint 7E.1: Neutral Supply And Planner Contracts

Status: closed on 2026-07-19. The full environment-bootstrap suite passes with
90 tests after regenerating the canonical planner and stem fixtures.

- add provider, profile, directive, observation, and minimal snapshot schemas.
- extend canonical normalization and hostile fixtures.
- add deterministic supply selection and supply-only failure reasons.
- prove pending-capacity reservation, pins, trust, capability, packing,
  retained/demand release, and no-proactive-repack behavior.

Gate: the pure planner selects only exact pre-enrolled supply and never claims
that a requested Cell is ready.

### Sprint 7E.2: PostgreSQL Supply Authority

Status: closed on 2026-07-19. Migration 010, authority operations, generation
fencing, provider projections, signed observation custody, directive execution,
semantic wakes, role boundaries, and lifecycle tests pass the full 92-test
environment-bootstrap suite.

- register provider/profile authority through explicit bootstrap/operator
  operations.
- add provider-generation fencing, directives, observations, projections,
  semantic revisions, notifications, roles, and immutable evidence.
- extend exact action execution for start, drain, and stop directives.
- prove hostile role boundaries, stale epochs, replay, provider expiry,
  profile revocation, empty-cell drain, and stopped-state requirements.

Gate: PostgreSQL serializes desired process state while no provider credential
can alter placement or authority policy.

### Sprint 7E.3: Linux Supervisor And Cell Lifecycle

Status: closed on 2026-07-19. The fixed-descriptor Linux supervisor, closed
profile verifier, provider generation custody, Cell lifecycle reader and
signed transitions, restart fencing, parent-death cleanup, and hostile role
boundaries pass strict Linux validation and the full ordinary runtime suite.

- implement the fixed-descriptor supply daemon and profile verifier.
- refactor the existing proof launch path into production-owned descriptor
  construction without creating a generic builder API.
- add signed Cell starting, draining, and stopped generation transitions.
- add exact drain control and supply-managed stop fencing.
- prove provider crash, child cleanup, generation expiry, restart, profile
  tampering, control loss, and no duplicate generation.

Gate: the supervisor can realize only current registered directives through
pinned profiles and recover without adopting or leaking a child.

### Sprint 7E.4: End-To-End Proof And Closure

Status: implementation complete and closure review pending after explicit
amendment approval on 2026-07-19. The retained Cell starts before dormant
demand Cells receive fresh generation keys, while the prior TLS peer profile
incorrectly pinned a peer's process-generation key together with its stable
enrolled transport identity. The retained Cell therefore could not communicate
with a newly supplied generation without a manual restart or a predeclared
generation identity.

Approved amendment: make the pinned TLS peer credential enrollment-scoped
(Cell key, transport public-key reference, certificate, and SPKI digest), keep
all protocol frames and route decisions generation-scoped, and add a literal
distribution-authority read that verifies the inbound source generation is the
exact current unexpired ready generation before affect. The opened session
binds that dynamically verified generation across execution, proceed, result,
and evidence. This removes impossible foreknowledge while strengthening the
current static-generation check into a live authority check.

Rejected alternatives are restarting every retained Cell when supply changes,
predeclaring supposedly fresh generation keys, or introducing a mutable peer
configuration controller. Each adds accidental operational complexity or
weakens generation identity.

- begin with one retained running Cell and at least two dormant demand profiles.
- increase only replica desired state until existing capacity is insufficient.
- prove start, ready generation, assignment, Chamber materialization, routes,
  and remote execution.
- reduce desired state and prove withdrawal, empty-cell drain, stopped
  generation, process exit, dormant profile, and cleanup.
- repeat across provider and PostgreSQL outages and provider restart.
- run security, disclosure, pressure, dead-code, operational-complexity, and
  recursive coherence reviews.

Gate: desired replica state adds and removes bounded pre-authorized Cell
capacity without dynamic enrollment, arbitrary process execution, manual
lifecycle commands, or false readiness.

## Impacted Repositories

### `cadenza`

- neutral supply contracts, schemas, fixtures, and planner authority.
- PostgreSQL migration 010, roles, operations, projections, evidence, and
  hostile conformance tests.
- regenerated deterministic stem helper and source artifact.

### `cadenza-cell`

- fixed supply-supervisor protocol and binary.
- pinned profile verification and descriptor construction.
- provider database projection/observation client.
- signed Cell lifecycle transitions and exact drain control.
- Linux process, outage, restart, and cleanup proof.

### `cadenza-chamber`

- conformance only: regenerated stem source/helper materializes unchanged.
- no supply authority, process control, provider, profile, or lifecycle policy.

### Workspace Meta Repo

- approved decision, roadmap status, execution plan, contract documentation,
  and closure/coherence evidence.

## Security Review Requirements

- action bodies contain only the existing canonical action identity and Cell
  key.
- every provider/profile/directive/observation/generation relationship is exact
  and current before affect.
- provider and Cell signing keys are distinct identities.
- a provider cannot enroll, assign, plan, mount authority, publish Cell state,
  or execute SQL outside literal functions.
- a Cell cannot publish provider state or select its launch profile.
- profile and executable drift fail before child creation.
- stale provider or directive generations cannot start, drain, or stop.
- drain cannot target a Cell with assignments, residencies, routes, stem lease,
  or operational authority mount.
- stopped cannot precede draining or omit process cleanup.
- child, descriptor, listener, bundle, journal, and launcher ownership are
  cleaned on every failure boundary.

## Migration Strategy

This is the new major-version line; backward compatibility is not required.

1. Add neutral contract authority and planner fixtures first.
2. Add migration 010 with all supply execution denied by default.
3. Prove PostgreSQL role separation and directive semantics.
4. Add the provider daemon in observation-only mode and compare local profiles
   with registered digests.
5. Enable one dormant profile start, then explicit drain and stop.
6. Regenerate and prove the stem artifact against all prior and new vectors.
7. Run the complete Linux proof before claiming automatic Cell supply.

Existing externally managed Cells remain valid and are not silently converted
into supply-managed profiles.

## Alternatives

### Direct Stem-To-Process Capability

Rejected. It would expose runtime power to a contained source and make graph
response loss a process retry problem.

### Generic Cell Launcher Or OCI API

Rejected. V1 needs exact named profiles, not an infrastructure surface.

### Cloud Provider Integration

Rejected. Machine creation, dynamic enrollment, networking, and cloud
credentials are separate future concerns.

### Dynamic Cell Types And Pool Optimization

Rejected for V1. Existing exact enrollment properties and named profiles are
sufficient for one real provider. Types should be introduced only after more
than one provisioning implementation proves shared meaning.

### Store Launch Profiles In PostgreSQL

Rejected. Profiles contain deployment and secret custody that does not belong
in graph authority or serialized action context.

### Treat Directive Commit As Process Success

Rejected. Desired disposition and observed realization are separate identities.

### Put Supply Supervision Inside The Stem Cell Host

Rejected. Loss or replacement of the stem host would also remove process-supply
custody and blur environment policy with local Cell runtime ownership.

### Adopt Surviving Children After Provider Restart

Rejected for V1. Reconstructing control and secret custody is more complex and
less trustworthy than bounded termination followed by a fresh generation.

### Proactively Repack Healthy Cells

Deferred. Existing valid assignments remain stable. Measurement may later
justify a separate optimization pass.

## Assumptions

- dormant identities are already actively enrolled with exact keys, endpoint,
  trust profile, capabilities, and slot capacity.
- deployment can provision at least two pinned local profiles outside Chamber
  and database payloads for the Linux proof.
- the first provider runs on one Linux host and manages local child Cell
  processes; remote machine creation is out of scope.
- one retained Cell remains available while demand-managed Cells scale.
- the TypeScript adapter remains the only production Chamber adapter in Sprint
  7, but the supply supervisor itself is Rust substrate code.
- serialized Chamber business execution remains unchanged.
- machine-relative performance thresholds remain separate from correctness.

## Exit Criteria

- only registered active provider generations and exact pinned profiles can
  realize supply directives.
- changing only replica desired state can start enough eligible dormant Cells
  to satisfy bounded demand.
- replicas are never assigned until the new Cell publishes current signed ready
  generation authority.
- current pending supply does not cause duplicate over-provisioning.
- missing, failed, expired, revoked, pinned-incompatible, or insufficient supply
  remains explicit unsatisfied demand.
- demand-managed empty Cells transition ready, draining, stopped, and dormant
  without assignments, routes, or processes left behind.
- retained and unmanaged Cells are never automatically released.
- provider restart creates no overlapping Cell generation and recovers current
  desired disposition from PostgreSQL.
- the stem, Chamber, action body, evidence, and logs never receive launch
  material or secrets.
- the Linux proof ends with no leaked Cell, Chamber, gVisor container, bundle,
  listener, descriptor, credential, journal lock, or provider generation.
- the final recursive coherence review finds no issue that should precede
  Sprint 7F.

## Work Items After Approval

- [x] Record the approved Sprint 7E decision.
- [x] Implement and close Sprint 7E.1 neutral contracts and planner.
- [x] Implement and close Sprint 7E.2 PostgreSQL supply authority.
- [x] Implement and close Sprint 7E.3 Linux supervisor and Cell lifecycle.
- [x] Run Sprint 7E.4 proof and recursive closure review.
- [x] Update distribution contracts, roadmap, and closure evidence.
