# Sprint 8 Distributed Actor Lifecycle And Persistence Design Proposal

Date: 2026-07-20

## Current Status

- State: `done`; Sprint 8A through Sprint 8D and final Sprint 8 closure are
  approved.
- Complexity gate: required. This is a breaking shared-contract, schema,
  persistence, security, runtime-lifecycle, and multi-repository change.
- Impacted repos: `cadenza`, `cadenza-python`, `cadenza-elixir`,
  `cadenza-csharp`, `cadenza-cell`, `cadenza-chamber`, and the workspace meta
  repo.
- Contract authority: TypeScript remains the working primitive-contract
  authority. Language-neutral workspace contracts govern shared meaning.
- Prerequisite: Sprint 7 closure is approved.
- Parent roadmap:
  [Cadenza Official Implementation Roadmap](../active/2026-07-09-cadenza-official-roadmap.md).
- Required approval phrase: `Design approved. Proceed.`
- Approval received: `Design approved. Proceed.` on 2026-07-20.
- Sprint 8A closure approval received: `Sprint 8A closure approved.` on
  2026-07-20.
- Sprint 8B closure approval received: `Sprint 8B closure approved.` on
  2026-07-20.
- Sprint 8C closure approval received: `Great. 8C is approved. Let's move on`
  on 2026-07-20.
- Sprint 8D and Sprint 8 closure approval received:
  `Sprint 8D and Sprint 8 closure approved.` on 2026-07-21.
- Sprint 8C closure review:
  [Actor Hydration And Persistence Closure Review V1](../../../contracts/actor-distribution/sprint-8c-closure-review-v1.md).
- Sprint 8D closure review:
  [Distributed Actor Failure And Closure Review V1](../../../contracts/actor-distribution/sprint-8d-closure-review-v1.md).
- Decision record:
  [Distributed Actor Lifecycle And Persistence](../../../decisions/2026-07-20-distributed-actor-lifecycle-and-persistence.md).

## Context

Sprint 7 completed the placement, Cell supply, Chamber custody, routing, stem
recovery, and evidence substrate required to distribute actor state safely.
Actors are the last missing part of the first complete distributed Cadenza
model.

An actor is a keyed state authority. A task bound to an actor key runs against
the current state for that key. Application authors should express the stateful
business operation; they should not coordinate placement, owner selection,
hydration, persistence, retries, fencing, failover, or cleanup.

The live repositories are not yet ready for that lifecycle:

- the TypeScript actor definition still mixes semantic identity with runtime
  load, persistence, consistency, retry, idempotency, and read-guard policy.
- actors still nest task definitions even though task-side binding is the more
  coherent authority direction.
- Chamber runtime images reproduce that nested shape.
- local actor reads and writes do not yet form one strict per-key execution
  sequence.
- no official runtime owns global actor-key assignment, local residency,
  hydration, or durable commit.

The detailed actor sections in
[cadenza-schema-proposal.md](../../../cadenza-schema-proposal.md) and
[cadenza-environment.md](../../../cadenza-environment.md) are useful design
evidence, but they are proposals rather than immutable specifications. The
legacy `cadenza-service` and `cadenza-db` implementations are reference-only.
They demonstrate the value of lazy hydration and write-through commits, and
the danger of service-scoped identity, unfenced ownership, version-only stale
guards, and persistence hidden inside general inquiry paths.

## Intended Whole

The application author defines:

- an actor's state contract and initial-state behavior.
- ordinary tasks whose bindings declare actor interaction.
- the business logic that reads or transforms actor state.

Cadenza determines and enforces:

- where each distributed actor state key currently lives.
- whether an invocation is local or must cross a Cell boundary.
- when state must be hydrated.
- whether the caller still holds current assignment authority.
- the exact order of reads, writes, commits, evidence, and downstream effects.
- how ownership changes after drain or failure.

The authored graph remains about business coordination. Distribution and
persistence must not leak into task handlers or graph structure.

False success includes:

- two Chambers accepting writes for the same state key.
- returning success before a required durable commit is authoritative.
- rerunning a mutation with a new idempotency identity after an uncertain
  response.
- emitting downstream effects from a write that later fails to commit.
- moving healthy actor keys merely because new capacity appears.
- calling a distributed actor task by replaying its complete downstream graph
  on both the caller and owner.
- treating a loaded in-memory value as durable authority.
- exposing actor keys or raw state through evidence, logs, errors, or routing
  metadata.
- adding persistence behavior back into the public primitive core.

## Governing Architecture

The lifecycle has four distinct owners:

1. **PostgreSQL authority** owns the current global assignment, immutable
   assignment epochs, current committed actor state, state version, and
   immutable commit summaries.
2. **Cell host** owns local residency coordination, owner resolution, generated
   internal execution endpoints, and the capability facades presented to its
   Chambers.
3. **Chamber** owns the current loaded state instance and serialized execution
   for actor keys assigned to that Chamber generation.
4. **Actor persistence extension** owns exact bounded hydration and commit
   flows through purpose-separated PostgreSQL functions and credentials.

The primitive core defines actor meaning and an internal runtime-coordinator
contract. It does not know PostgreSQL, tables, credentials, Cells, Chambers,
network addresses, placement algorithms, or serialization-to-callable logic.

```text
task actor binding
        |
        v
Chamber actor coordinator ---- local current owner ----> state instance
        |
        +---- Cell owner resolver ----> PostgreSQL assignment authority
        |
        +---- persistence facade -----> PostgreSQL actor state authority
        |
        +---- remote owner endpoint ---> owner Cell / owner Chamber
```

Every crossing is exact and typed. No Chamber receives generic SQL, a database
credential, arbitrary routing authority, or a host provider object.

## Identity Model

The design must keep these identities separate:

- `actor_object_key`: immutable authority identity of the actor definition.
- `actor_state_key`: application-selected key identifying one logical state
  instance under that actor.
- `placement_unit_key`: actor-capable replica family that may host the actor.
- `replica_key`: one eligible runtime replica.
- `actor_assignment_epoch`: immutable epoch for one period of global ownership.
- `cell_key` and `cell_generation`: current trusted host identity.
- `chamber_key` and `chamber_generation`: current contained runtime identity.
- `actor_state_version`: monotonic committed state version within the logical
  actor state.
- `actor_mutation_key`: stable operation identity fixed before the first
  mutation attempt.
- execution-evidence trace, graph, task, inquiry, distribution, relationship,
  attempt, and custody identities.

An assignment is for `(actor_object_key, actor_state_key)`, not a service name,
task name, route, process, or session. A state version cannot substitute for an
assignment epoch. A process generation cannot substitute for either.

## Sprint 8A: Semantic Contract Alignment

### Minimal Actor Definition

The official shared actor definition will contain only semantic information
required to construct the keyed state authority:

- actor identity and unique name.
- state contract or schema reference.
- initial-state definition.
- metadata already common to official primitive definitions, such as tags and
  description where applicable.

Runtime load policy, residency, persistence, consistency, retry,
idempotency, execution guards, and nested task collections do not belong in
the actor definition. They move to explicit extension contracts or runtime
policy.

This is a new major version. No backward-compatibility adapter will preserve
the transitional actor API, and dead transitional code will be removed.

### Task-Side Actor Binding

Tasks remain the only executable primitive. Actor interaction is declared from
the task through a versioned binding extension equivalent to
`cadenza.actor.binding.v1`.

The binding identifies:

- the actor authority.
- whether the task is a state read or state write.
- the runtime location policy required for actor execution.
- the application input field or deterministic resolver that supplies the
  actor state key.

The binding does not embed persistence configuration, owner identity, endpoint
location, current state, or callable materialization authority.

All tasks that directly access one distributed actor must be placed within one
actor-capable placement unit or replica family. This creates one bounded owner
set without coupling actor semantics to current topology.

### Official-Language Parity

TypeScript is updated first as the working authority. The minimal actor and
task-binding meaning then propagates through Python, Elixir, and C# using the
existing translation doctrine and shared neutral fixtures.

Language APIs may remain idiomatic. They must agree on identity, state
transition, error, binding, and serialization meaning. Internal coordinator
and runtime-only classes remain hidden from public APIs.

Only TypeScript receives the live Chamber adapter proof in Sprint 8 because it
is the currently supported Chamber language adapter. The other cores prove
contract and fixture parity; additional Chamber adapters remain separate work.

## Sprint 8B: Assignment And Residency

### Single Global Owner

Exactly one ready replica owns each distributed actor state key at a time.
Active-active state, CRDT merging, multi-writer consensus, and replicated
in-memory actor execution are outside Sprint 8.

On first touch, the Cell host asks an exact PostgreSQL resolver for the current
assignment. PostgreSQL serializes concurrent claims and either returns the
current owner or creates one immutable assignment epoch from the canonical set
of eligible ready route members.

The requester cannot nominate an arbitrary owner. Owner choice uses a stable
deterministic selection, such as rendezvous ranking over the current eligible
set. This distributes new keys while keeping existing healthy keys stable.

Existing assignments move only when:

- the owner becomes invalid under current Cell, Chamber, replica, route, or
  placement authority.
- a governed drain explicitly prevents new work and transfers ownership.
- a later approved operation requests controlled movement.

New capacity does not rebalance existing actor keys in Sprint 8.

### Epoch Fencing

Every hydration, read, mutation, commit, and generated owner-endpoint call
carries the current assignment epoch plus Cell and Chamber generation
identity. PostgreSQL and the owner Chamber reject stale identity before affect.

After abrupt owner loss, a new assignment epoch is created lazily on the next
touch. The successor hydrates only the latest committed state. Historical
epochs remain immutable evidence and cannot regain authority.

### Local Residency

The owner Cell maps an assignment to one current Chamber generation. That
Chamber lazily creates one local coordinator entry per actor state key.

Reads and writes use one strict per-key sequence in Sprint 8. This is more
restrictive than concurrent reads, but it gives unambiguous ordering while the
distributed contract is established. Concurrency may be optimized later
without changing actor meaning.

A clean local eviction may unload an idle state instance without ending the
global assignment or changing semantic state lifetime. The same owner
rehydrates it on next touch. Semantic expiry is a separate future policy and is
not inferred from process, session, cache, or idle timeouts.

### Cross-Chamber Invocation

Delegating the authored actor task as a graph root would replay its downstream
relationships on the owner and caller. Sprint 8 therefore generates one hidden
single-task execution endpoint for each actor-bound task in the actor-capable
runtime image.

- if the caller is the current owner, the task executes through the local
  actor coordinator.
- if the caller is not the owner, its semantic task wrapper delegates only the
  handler execution to the generated owner endpoint.
- the owner returns the committed handler result.
- the caller's original graph continues downstream relationships exactly once.

These endpoints are host-generated compatibility surfaces, not authored
primitives, public intents, or independently placeable business tasks. Their
provenance binds them to the actor task, runtime image, placement, and
generation that produced them.

## Sprint 8C: Hydration And Write-Through Persistence

### Persistence Extension Boundary

The first persistence provider is PostgreSQL and uses canonical bounded JSON
for actor state. JSON is the shared interchange representation, not a claim
that every language must expose a JSON-shaped in-memory API.

The provider exposes only exact operations through purpose-separated facades:

- resolve or establish current actor assignment.
- read current committed state under current assignment authority.
- commit one mutation under expected assignment epoch, expected state version,
  and actor mutation key.
- record or inspect bounded commit outcome needed to resolve an unknown
  response.
- end or supersede assignment during an authorized drain or invalidation.

No generic query, table, transaction, or provider handle crosses into a
Chamber. Database roles for assignment, hydration, commit, and bounded outcome
resolution are separated where their affects differ.

### First-Touch Hydration

On the first accepted invocation for a local assignment epoch:

1. the coordinator verifies current owner, Cell generation, Chamber generation,
   runtime image, and actor contract identity.
2. the persistence facade loads the latest committed state and version.
3. if no committed state exists, the core constructs initial state through the
   actor's semantic initial-state definition.
4. the core validates the state contract before exposing state to the handler.
5. the coordinator marks the local entry ready and releases the queued first
   invocation.

Concurrent first touches join one bounded hydration attempt. They must not
duplicate state creation or publish partially hydrated state.

Corrupt, oversized, or contract-incompatible state fails explicitly and leaves
the actor unavailable. It is never silently replaced with initial state.

### Strict Write-Through Commit

Sprint 8 supports two runtime modes:

- Chamber-local ephemeral actors with explicitly local, loss-tolerant state.
- distributed actors with strict write-through PostgreSQL persistence.

A distributed local-residency actor must use durable persistence. A
non-persisted actor cannot fail over between replicas while claiming coherent
state continuity.

For a write invocation:

1. fix `actor_mutation_key` before the first handler attempt.
2. verify current assignment and local generation fences.
3. run the handler against an isolated candidate state derived from the current
   committed local version.
4. validate the resulting state and bounded result.
5. commit using expected assignment epoch, expected state version, and the
   stable mutation key.
6. make the candidate state locally current only after authoritative commit
   success or bounded resolution of an unknown response.
7. publish the handler result, buffered signals, downstream graph execution,
   and success evidence only after commit.

The same mutation key is reused after a timeout or lost response. PostgreSQL
returns the existing committed outcome when the operation already committed.
This is bounded mutation deduplication, not a broad claim of exactly-once
execution across independent graph runs.

### Handler Side-Effect Restriction

An actor write handler may compute its next state and return value. Signal
emissions caused during the handler are buffered until commit succeeds.

Direct inquiry, delegation, or other externally observable nested execution
from inside an actor write handler is rejected in Sprint 8. Such work belongs
in downstream graph relationships that run after commit. Without this
restriction, a handler could affect another authority and then fail its own
state commit, creating an irreversible false history.

Read handlers cannot mutate actor state. Their returned values are released
after the current epoch and version remain valid for the serialized operation.

Write-behind, periodic checkpoints, event sourcing, custom persistence
providers, and user-defined transaction choreography are deferred until strict
write-through semantics are proven end to end.

## Sprint 8D: Failure, Drain, Evidence, And Closure

### Graceful Drain

An owner entering drain stops accepting new actor invocations, completes or
explicitly fails bounded in-flight operations, resolves uncertain commits,
flushes evidence custody, and relinquishes assignments through PostgreSQL
authority. New epochs may then be established on eligible successors.

Drain completion cannot be inferred solely from process exit or route removal.
It requires explicit actor residency and commit barriers.

### Abrupt Failure

After owner Cell or Chamber loss:

- route and generation invalidation prevent new calls to the stale owner.
- in-flight callers receive an explicit retryable or uncertain-commit outcome.
- the next authorized touch establishes a successor epoch.
- the successor hydrates the last durable state before accepting work.
- delayed predecessor reads, writes, commits, endpoint calls, and evidence
  claims fail under stale epoch or generation identity.

If PostgreSQL authority is unavailable, no new assignment, hydration, durable
write, failover, or successful ownership claim is invented. Existing loaded
actors may reject new operations until their required authority can be
verified. Availability must not outrank state authority.

### Realtime Execution Evidence

Evidence must cover:

- assignment resolution, creation, continuation, invalidation, and succession.
- local residency loading, readiness, clean eviction, drain, and loss.
- hydration start, success, join, and failure.
- actor read and write attempt identity.
- commit accepted, deduplicated, rejected, unknown, resolved, and failed.
- stale owner, stale epoch, stale generation, version conflict, and contract
  rejection.
- local and remote actor execution paths and generated endpoint provenance.

Evidence carries actor definition identity, assignment epoch, versions,
mutation identity, generation identity, result/state digests, bounded error
classification, and normal execution trace ancestry. Raw actor state, actor
state keys, business input/output, credentials, database details, and generated
endpoint secrets are excluded by default.

### Required Scenario Matrix

Focused and end-to-end proofs must account for:

- two Cells concurrently touching an unassigned actor key.
- repeated touches retaining a healthy owner after capacity changes.
- local first-touch hydration with concurrent queued calls.
- local clean eviction followed by same-owner rehydration.
- successful reads and write-through mutations.
- lost commit response before and after durable commit.
- duplicate delivery with the same mutation key.
- owner loss before hydration, during handler execution, before commit, and
  after commit but before response.
- stale owner and stale generated-endpoint calls after reassignment.
- graceful owner drain and successor hydration.
- abrupt Cell and Chamber generation loss.
- PostgreSQL outage during assignment, hydration, commit, and failover.
- corrupt, oversized, or schema-incompatible persisted state.
- no eligible owner and route-projection skew.
- high-cardinality actor keys, bounded residency, queue, retry, and evidence
  pressure.
- interaction with placement scale-down, Cell supply, stem takeover, evidence
  custody, and final environment cleanup.

One definitive Linux/gVisor multi-Cell proof must execute real actor business
logic before and after owner loss and reconcile durable state, routing,
assignment, evidence, and cleanup. Focused destructive tests may prove cases
that would make the lifecycle scenario less interpretable.

## Security And Pressure Boundaries

- actor state and state keys are treated as business-sensitive data.
- serialized state has explicit size, depth, and decode limits.
- per-Chamber loaded actor count, per-key pending invocation count, hydration
  attempts, commit retries, unknown-outcome lookups, assignment candidates,
  generated endpoints, and evidence reserves are bounded.
- callers cannot select the owner, epoch, persistence operation, database
  function, or credential.
- standard Cells cannot mutate assignment tables or commit state outside exact
  generated facades.
- Chambers cannot access PostgreSQL directly.
- persistence roles cannot alter application definitions, placement intent,
  Cell enrollment, or stem ownership.
- generated endpoint identity is private, revision-bound, placement-bound, and
  generation-bound.
- errors distinguish unavailable, stale, conflict, invalid state, pressure,
  and uncertain commit without disclosing state or topology.

## Operational Complexity Budget

Sprint 8 adds no new general controller. Actor activity is request-driven:

- owner resolution occurs on first or stale-routed touch.
- hydration occurs on first local touch after load or reassignment.
- persistence occurs on accepted writes.
- clean eviction is a bounded local runtime concern.
- drain is driven by existing placement and Chamber lifecycle authority.
- failover is established lazily on the next touch after invalidation.

The implementation review must inventory every timer, retry loop, queue,
durable row family, local cache, and cleanup path. A background rebalance loop,
independent actor scheduler, parallel lease system, or second placement model
requires a new design gate.

## Implementation Passes

### Sprint 8A: Contract Repair And Shared Conformance

- reduce the actor definition to semantic authority.
- replace nested actor tasks with task-side actor binding.
- align all four official core repositories and neutral fixtures.
- align Chamber runtime-image and TypeScript adapter contracts.
- remove transitional exports and dead actor behavior without compatibility
  shims.

Gate: every official core expresses the same actor and task-binding meaning,
and the Chamber image no longer invents a competing actor structure.

### Sprint 8B: Single-Owner Assignment And Local Residency

- add language-neutral assignment, epoch, residency, and generated endpoint
  contracts.
- add exact PostgreSQL assignment authority and roles.
- add Cell owner resolution and Chamber residency coordination.
- prove deterministic first touch, stable ownership, strict per-key execution,
  remote handler execution, and stale-owner rejection.

Gate: one and only one current Chamber generation can affect each distributed
actor state key, and graph relationships continue exactly once.

### Sprint 8C: Hydration And Strict Write-Through Persistence

- implement the PostgreSQL actor persistence extension.
- add bounded canonical state hydration and validation.
- add expected-version, epoch-fenced, mutation-keyed commits.
- buffer write signals and enforce the nested-affect restriction.
- prove unknown-commit recovery and failure disclosure.

Gate: success means current durable state is authoritative, and no rejected
write produces downstream affect.

### Sprint 8D: Distributed Failure And System Closure

- integrate actor residency with drain, route invalidation, Cell/Chamber
  generation loss, placement scale-down, and supply.
- capture actor lifecycle and commit evidence through existing custody.
- run focused security, pressure, dead-code, and operational-complexity review.
- run the definitive Linux/gVisor multi-Cell actor recovery proof.
- publish a scenario-to-test matrix and recursive coherence closure review.

Gate: actor state survives valid distributed ownership change without split
authority, hidden affect, state disclosure, unbounded pressure, or manual
application coordination.

## Impacted Repositories

- `cadenza`: TypeScript semantic authority, internal actor coordinator contract,
  strict local actor behavior, binding API, fixtures, and tests.
- `cadenza-python`: idiomatic actor and task-binding parity plus neutral
  conformance fixtures.
- `cadenza-elixir`: idiomatic actor and task-binding parity while preserving
  process isolation without inventing distributed ownership semantics.
- `cadenza-csharp`: idiomatic actor and task-binding parity plus neutral
  conformance fixtures.
- `cadenza-chamber`: runtime-image contract, TypeScript adapter, local residency,
  generated owner endpoints, persistence facade consumption, pressure bounds,
  and execution evidence.
- `cadenza-cell`: owner resolution, exact PostgreSQL providers and facades,
  generation fencing, remote endpoint routing, drain, and lifecycle custody.
- workspace meta repo: neutral schemas, PostgreSQL bootstrap migrations and
  roles, conformance fixtures, authority map, decisions, design records, and
  closure reviews.

Legacy repositories receive no implementation changes.

## Risks

- **Contract divergence:** four core languages and the Chamber image could
  preserve superficially similar but behaviorally different actor models.
- **Split authority:** route, placement, local cache, or state version could be
  mistaken for global assignment authority.
- **Unknown commit:** retrying with a new identity could apply a mutation twice;
  treating a timeout as failure could report false history.
- **Pre-commit side effects:** handler inquiry or emission could escape before
  state authority exists.
- **Operational growth:** high-cardinality actor keys could create unbounded
  assignment, residency, endpoint, queue, or evidence state.
- **Disclosure:** keys and state can contain sensitive business data.
- **Graph duplication:** naive remote execution could continue relationships in
  both owner and caller graphs.
- **Availability pressure:** weakening PostgreSQL fencing during outages would
  trade temporary availability for permanent state ambiguity.

Each risk has an explicit gate above. No implementation pass may weaken the
authority model to make a happy path pass.

## Migration Strategy

1. establish neutral actor and binding contracts and shared fixtures.
2. update TypeScript authority and remove incompatible transitional surfaces.
3. propagate semantic parity to Python, Elixir, and C#.
4. align Chamber runtime images and the TypeScript adapter.
5. add additive environment-bootstrap actor authority migrations and exact
   roles; migration numbering is chosen from the live sequence at
   implementation time.
6. add Cell/Chamber assignment and residency without persistence success claims.
7. add strict PostgreSQL hydration and commit facades.
8. integrate failure, drain, evidence, and end-to-end proofs.
9. run dead-code and recursive coherence review before Sprint 8 closure.

There is no backward-compatibility plan. This is a new major version and legacy
consumers remain on previous core releases. Migration history remains forward
only; corrective migrations remove superseded live surfaces.

## Alternatives

### Keep Runtime Policies In Actor Definitions

Rejected. Persistence, placement, consistency, and retry are environment
concerns. Embedding them in primitive identity couples authored business logic
to topology and duplicates authority across languages.

### Let Actors Own Nested Tasks

Rejected. Tasks are independently executable and placeable primitives. A
task-side binding states the affect directly and avoids a second task registry.

### Use Cell-Local Owner Selection

Rejected. Independent Cells cannot prove one global owner after concurrency,
partition, restart, or delayed messages. PostgreSQL already owns the durable
serialized environment authority needed for epochs.

### Rebalance All Keys When Capacity Changes

Rejected. It creates avoidable churn, hydration load, cache loss, evidence
volume, and failure surface. Stable current ownership serves the whole better.

### Persist Through General Inquiries

Rejected. Persistence is an exact runtime authority operation, not business
coordination. Hiding it in inquiry graphs makes commit ordering and privilege
ambiguous.

### Allow Nested Inquiry From Write Handlers

Deferred. A distributed transaction or outbox contract would be required to
make cross-authority affect coherent with commit failure. Downstream graph
relationships provide the clear first implementation.

### Support Write-Behind Or Event Sourcing Immediately

Deferred. Multiple durability modes multiply failure semantics before the base
write-through contract is proven. They can be added later as explicit
extensions if they serve concrete needs.

### Make Actors Active-Active

Deferred. CRDTs and multi-writer state are specialized semantics, not a safe
default for arbitrary business logic.

## Assumptions

- Assumption 1: Sprint 8 supports only Chamber-local ephemeral state and strict
  distributed write-through persistence; other persistence modes are deferred.
- Assumption 2: distributed actor residency requires durable persistence. An
  ephemeral actor remains local to one Chamber and makes no failover promise.
- Assumption 3: TypeScript is the only live Chamber language adapter in Sprint
  8. Python, Elixir, and C# receive shared semantic parity but not new Chamber
  adapters.
- Assumption 4: distributed actor state has one global writer/owner at a time;
  active-active and CRDT semantics are outside this sprint.
- Assumption 5: PostgreSQL authority is required for successful ownership,
  hydration, durable mutation, and failover. Outage produces explicit
  unavailability rather than local authority invention.
- Assumption 6: actor write handlers may emit buffered signals but may not
  inquire, delegate, or cause other external affect before commit in Sprint 8.

Approval of this proposal confirms these assumptions.

## Exit Criteria

Sprint 8 is complete only when:

- all official cores share the approved semantic actor contract.
- nested actor-task authority and transitional runtime policy fields are gone.
- PostgreSQL proves one current assignment epoch per actor state key.
- Cell and Chamber generations fence every actor affect.
- actor state hydrates lazily, validates, commits write-through, and resolves
  unknown outcomes under stable mutation identity.
- local and remote actor execution continue authored graph relationships once.
- owner drain and abrupt loss produce coherent successor behavior.
- raw actor state and keys remain outside default evidence and diagnostics.
- pressure bounds, hostile role tests, dead-code screening, and definitive
  Linux/gVisor recovery tests pass.
- the recursive coherence review finds no unresolved authority, fragmentation,
  temporal, disclosure, or operational-complexity concern.
- the user approves Sprint 8 closure.

## Work Items After Approval

- [x] Create the approved Sprint 8 architecture decision record.
- [x] Execute Sprint 8A and request its closure gate.
- [x] Execute Sprint 8B and request its closure gate.
- [x] Execute Sprint 8C and request its closure gate.
- [x] Execute Sprint 8D and request final Sprint 8 closure.
- [x] Hand off to the separate distributed-foundation stabilization and
  publication design gate after closure approval.

## Evidence

- [Cadenza Intended Whole](../../../cadenza-intended-whole.md)
- [Cadenza Schema Proposal](../../../cadenza-schema-proposal.md)
- [Cadenza Environment](../../../cadenza-environment.md)
- [Persistence-Agnostic Core Decision](../../../decisions/2026-07-11-persistence-agnostic-core.md)
- [Cell Peer Transport Contract](../../../contracts/cell-peer-transport/v0.md)
- [Execution Evidence Contract](../../../contracts/execution-evidence/v0.md)
- [Completed Sprint 7 Design](../completed/2026-07-17-scale-placement-reconciliation-design.md)
- [Sprint 7G Closure Review](../../../contracts/distribution/sprint-7g-closure-review-v0.md)
- [Sprint 8B Closure Review](../../../contracts/actor-distribution/sprint-8b-closure-review-v1.md)
- [Sprint 8C Closure Review](../../../contracts/actor-distribution/sprint-8c-closure-review-v1.md)
- [Sprint 8D Scenario Matrix](../../../contracts/actor-distribution/sprint-8d-scenario-matrix-v1.md)
- [Sprint 8D Operational Complexity Inventory](../../../contracts/actor-distribution/sprint-8d-operational-complexity-v1.md)
- [Sprint 8D Closure Review](../../../contracts/actor-distribution/sprint-8d-closure-review-v1.md)
- [Actor Model Frontier](../completed/2026-04-23-actor-model-frontier.md),
  retained as non-authoritative historical evidence.
