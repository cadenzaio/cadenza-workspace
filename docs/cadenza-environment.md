# Cadenza Environment Definition

Date: 2026-07-23
Status: implemented foundation with explicitly prospective extensions

This document began as the first-generation Environment proposal discussed in
[CAD-22](https://linear.app/cadenzaai/issue/CAD-22/design-simulator-backed-live-graph-authoring-with-fact-primitives-and)
and follow-on architecture work. Its foundation is now implemented across
`cadenza-environment`, `cadenza-chamber`, and `cadenza-cell`.

Current behavior is governed by the contracts, repository READMEs, security
posture, and compatibility manifest linked from
[architecture.md](./architecture.md). Sections using future-oriented language
describe prospective tags, plugins, Facts, UI, Memory, agents, or
database-native authoring and do not expand the current release contract.

## Purpose

A Cadenza environment is the first deployable unit in the new architecture.

It gives the platform a clean center of gravity:

- one authoritative seeded database
- one or more cells
- an optional UI console
- the seeded meta layer and bootstrap flow that make those parts operate as one system

This replaces the earlier tendency to spread bootstrap, persistence, transport, and meta behavior across multiple file repos with hard service boundaries.

## Working Definition

For the current iteration, a Cadenza environment is:

- a seeded database
- one or more cells
- an optional UI console
- environment bootstrap and materialization rules

Later, nested environments may consume some of those bootstrap and materialization responsibilities from a higher layer. That is explicitly out of scope for this first definition.

## Cells And Chambers

### Runtime Host Boundary

The old `engine` name is retired for the environment architecture:

- the Cadenza runtime loop in core executes materialized primitive graphs.
- a `chamber` is the isolated Cadenza runtime that materializes and executes one governed runtime image.
- a `cell` is the trusted host that manages chambers and mediates their capabilities.

The Chamber runtime lives in the official `cadenza-chamber` repository and
consumes the activation handoff defined by Environment authority. Legacy
`cadenza-engine` code is reference-only.

The official `cadenza-cell` repository owns the trusted host boundary,
containment plan, and capability mediation for source-bearing runtime behavior.
These responsibilities do not belong to `cadenza` core.

Cells should advertise a small governed capability set so placement, materialization, and security review can reason about which executable slices are allowed to run there.

### Security Kernel And Extension Base

This should be read through a stronger security posture:

- Cadenza should avoid inheriting ambient-authority assumptions from conventional app platforms
- security-relevant trust and capability rules should be declared in authority and enforced during placement and materialization
- privileged control-plane logic should remain rare and isolated
- cells should enforce security semantics, not invent them locally

The v1 security base should be understood as a small mandatory kernel with governed extension points:

- Cadenza owns normalized subjects, sessions, trusted execution identity, distributed envelopes, authorization decisions, capability enforcement, secret enforcement, authority gateway enforcement, audit evidence, and plugin activation
- external authentication, policy, secret, audit, supply-chain, capability, business, and agent plugins may extend the system through declared extension points
- plugins may provide proofs, policies, capabilities, projections, adapters, and agent behavior, but they may not grant themselves authority or bypass kernel enforcement
- installing a plugin imports an inactive candidate graph; activation is separate authority work that approves a specific version, capability set, secret access, placement eligibility, and extension-point use
- secrets are brokered references and controlled operations, not ordinary context values

Security and management orchestration should follow the same principle as the rest of Cadenza: Cadenza extends Cadenza. Wherever possible, security and management behavior should be implemented as Cadenza primitive flows. Static bootstrap, the cell host, secure chamber substrate, brokers, transport verification, and hard local enforcement remain substrate responsibilities, but they should not become a separate management product.

### Trust Bootstrap, Identity, And Authorization

Trust bootstrap should be static and narrow. Static bootstrap creates the environment trust root, enrolls the first trusted-control cell, seeds the minimal security kernel, and only then allows runtime and plugin expansion. Plugins cannot create the trust root that authorizes them. Nested-environment bootstrap, where parent environments authorize child environments, is deferred.

Authentication should map external provider proof into Cadenza subjects and sessions. Runtime execution should always preserve both the initiating subject and the runtime principal carrying the work, including when cells signal or delegate across the environment. Inter-cell calls should carry a trusted host-authored envelope around the normal context, and ordinary hops may narrow delegated authority but not widen it.

Authorization should remain graph-native. Tags classify subjects and resources, effective tags and provenance feed policy, and policy decisions interpret those tags together with object lifecycle, execution mode, runtime principal, delegated authority, capability requirements, secret requirements, assurance level, and sensitivity. Developer access to graph structure must not imply production execution or live-state access.

Access mode should be explicit:

- `development` for graph authoring and candidate work
- `simulation` for production-like execution with non-production consequences
- `staging` for controlled pre-production execution
- `production` for live state, real users, real external effects, real secrets, and real authority

Development should also split by layer:

- business development
- meta-plugin development
- trusted-control development

Business development authority must not imply meta-plugin development authority, and meta-plugin development authority must not imply trusted-control authority.

### Supply Chain And Materialization Trust

Supply-chain and materialization trust should be split across authority, stem-cell, and cell hosts:

- authority records approved artifacts, plugin activations, dependency sets, runtime image attestations, revocation state, materialization eligibility, and evidence
- stem-cell verifies provenance, resolves dependencies, enforces approved-source policy, publishes materialization projections, detects revoked artifacts, and coordinates rollout or rollback
- cell hosts perform final local enforcement before materializing or activating images

A cell should never materialize code only because it can fetch it. It should materialize only authority-approved, provenance-checked inputs whose digests, dependency locks, activation state, capabilities, image revision, image epoch, and revocation status still match.

### Audit, Containment, And Resumable Flows

Audit should be structured evidence, not ordinary logging. Cadenza should create evidence for high-value trust boundaries such as authentication, authorization, delegated authority, inter-cell envelope validation, plugin lifecycle, secret use, capability use, authority gateway access, cell enrollment, chamber image lifecycle, supply-chain approval, policy changes, tag management, and trusted-control execution. Audit plugins may export evidence, but they do not decide whether evidence exists.

Response and containment should be controlled trust reduction. Risk signals should drive Cadenza primitive flows that update authority state first, push projections second, and let cells, chambers, capability brokers, and secret brokers enforce locally. Containment should prefer narrow reversible actions such as session suspension, chamber drain, plugin activation suspension, or image revocation before escalating to cell suspension or environment repair mode.

Persistent and resumable flows should be opt-in execution policy over normal Cadenza graphs, not a new executable primitive or separate workflow engine. They should resume only at declared primitive boundaries such as task graph completion, unique signal receipt, delegation completion, authority commit, external-effect confirmation, or projection acknowledgement. A seeded flow-manager support slice should own leases, checkpoints, safe resume decisions, and repair transitions; cells and chambers remain disposable execution boundaries.

### Runtime Lanes And Chambers

Cells should also be able to partition executable work into different runtime lanes and processes.

The intended first cut is:

- business execution
- meta-support execution
- trusted control-plane execution

That higher-level lane should be derived from the authored executable `meta` classification plus effective security, rather than introducing a second independent authored knob for process placement.

Inside a cell, those lanes should be realized through a chamber model:

- a narrow trusted cell host
- isolated execution chambers for source-bearing code
- a trusted broker boundary between chambers and host capabilities

This is not literally another layer of cells, but it is intentionally cell-like in structure and follows the same architectural principle of bounded concerns, mediated communication, and managed lifecycle.

The host should be understood as the local cell's brokered network and safeguard. Chambers do not get ambient direct access to each other or to host powers; the host mediates those paths the same way the wider cell network mediates cross-cell interaction.

### Chamber Primitive Transport Surface

The chamber execution surface should also stay Cadenza-centric rather than turning into a generic worker protocol.

The intended first cut is:

- a host control plane for lifecycle and materialization
- a tiny chamber primitive transport surface for runtime activity:
  - `delegation`
  - `signal`
  - `status`

Those transport requests should carry context objects, be enriched with chamber and cell ingress metadata, and then hand off directly into the local chamber runtime. For delegation, that should mean direct local runner handoff after validation rather than routing through another meta-signal hop. Signal delivery should remain detached at the chamber layer; if an outer network transport wants to acknowledge receipt, that should stay a network concern above the chamber primitive surface. Helpers, globals, actor definitions, and actor bindings should be chamber-local materialized structure rather than per-execution transport payloads.

### Inter-Chamber Communication

Inter-chamber execution-time communication should mirror the larger Cadenza model:

- `signal` for detached work
- `delegation` for synchronous execution-root handoff
- local `inquire` resolution through the normal local inquiry broker and locally registered responder tasks

The chamber should still avoid inventing a second intent-routing subsystem. Hidden generated local proxy tasks should attach their normal `.respondsTo(...)` bindings at image activation time, and the local inquiry broker should resolve to those proxies the same way the current distributed intent pattern uses local deputy responders.

### Actor Persistence Extensions

Actor persistence and hydration should follow the same principle. They should be handled by support slices in `meta_support` chambers behind exact, authority-projected runtime facades. Chamber division should not introduce a public persistence endpoint or a second business coordination model. Addressed signals remain suitable for detached lifecycle and evidence work, but they are not the write-through durability acknowledgement.

Actor extensions should keep the actor primitive small. The early v1 set should distinguish local residency from durable persistence:

- `cadenza.actor.residency.v1` governs local actor-key lifetime, touch behavior, eviction, drain behavior, and prewarm as an operational first-touch preparation path
- `cadenza.actor.persistence.v1` governs first-touch hydration, write-through persistence, stale-owner guards, durable commits, recovery behavior, and evidence

Sprint 8 admits only local ephemeral state and distributed write-through state.
Write-behind, checkpointed persistence, and event sourcing are deferred until
their distinct failure semantics have a concrete need and approved contract.

For persisted local-residency actors, first-touch residency is not ready until durable state is hydrated and installed for the matching `assignmentEpoch`. The host owns residency and assignment epochs, the owner chamber owns current local runtime state, and the persistence backing owns durable committed state. Cell-local eviction is not semantic expiry.

### First Touch And Hydration Guard

First touch should mean **first actor-bound task touch**. It is not equivalent to host ingress, because a chamber-local flow may link directly to an actor-bound task without the host triggering that task. The local runner detects first touch when it is about to execute an actor-bound task for an actor key and the chamber does not already have ready, valid local residency for that actor key.

For persisted actors, the actor-bound task wrapper is the mandatory hydration guard. The task body should never manually hydrate actor state and should never run against unready persisted state. The wrapper should:

- resolve the actor key, actor definition, persistence extension, and effective access policy
- check local residency for the actor key and `assignmentEpoch`
- validate or obtain ownership through host authority when residency is missing, stale, or not ready
- start or join single-flight hydration for the same actor key and assignment epoch
- install hydrated state only if the assignment epoch still matches
- run the task body only after local actor state is ready

The wrapper creates the point-of-no-return boundary. Before task body execution, failures are pre-start rejects or retryable operational failures. After task body execution, failures follow normal Cadenza task graph semantics.

Hydration failure classes should remain explicit:

- `actor_not_found`: durable actor state does not exist and create-on-touch is not allowed
- `policy_denied`: the chamber, task, actor identity, or caller context is not allowed to access or hydrate the actor
- `not_owner`: this chamber is not the current valid owner and cannot claim ownership
- `projection_stale`: chamber authority projection is too stale to prove ownership
- `hydration_unavailable`: persistence backing or meta-support path is temporarily unavailable
- `hydration_corrupt`: durable state failed integrity or schema validation
- `epoch_lost`: hydration completed after ownership epoch changed
- `timeout`: hydration did not complete within the caller's effective deadline

Concurrent first touch should use single-flight hydration per actor key and assignment epoch inside a chamber. The first wrapper starts hydration; other wrappers wait for the same result. Duplicate hydration work should not run for the same actor key and epoch.

### Actor Write Semantics And Authority Actors

Actor state writes should be owned by the actor wrapper and persistence extension, not by business task bodies. The task body mutates candidate local actor state; the wrapper detects state changes and applies the actor's persistence policy before returning the final task result. Sprint 8 supports:

- `ephemeral`: local chamber lifetime only; no durable commit
- `write-through`: task success requires durable commit success
  Write-through is mandatory for distributed actors. A persisted actor with dirty
  uncommitted state must not be silently evicted; it must commit, transfer
  ownership explicitly, mark recovery required, or drain/fail safely.

Authority actors should not be treated as physical singletons. Authority state remains one logical truth per authority domain, but authority actors may be replicated as cell-local runtime actors that serve read-heavy authority checks from signed or revisioned local projections and initiate privileged write-through commits. Replicated authority actors are valid only within freshness, policy, identity, epoch, and commit-path bounds.

The write-through support slice must not decide durable destination. It validates and forwards to an authority-provided destination from host authority projection, actor residency assignment, actor persistence descriptor, authority domain routing table, or an epoch-bound commit target. If destination metadata is missing, stale, invalid, or mismatched, the support slice rejects or requests refreshed authority state instead of improvising a destination.

Remaining actor-lifecycle gaps:

- exact actor-bound wrapper contract and context object shape
- exact ownership claim/request protocol between wrapper and host authority
- read-only behavior for persisted actors that explicitly allow stale or cached reads
- dirty-state drain, transfer, and recovery details
- timeout and deadline propagation across hydration and persistence support flows
- whether event-sourced persistence belongs in v1 or later
- exact evidence records emitted for hydration, commit, recovery, and stale-owner rejection

### Host Meta Authority And Chamber Lifecycle

The host should also maintain host meta authority state for:

- chamber existence and readiness
- task ingress groups
- actor residency capability membership
- concrete actor-key residency ownership
- internal generated endpoint and proxy descriptors

Each chamber should receive a pushed runtime-only projection from that host meta authority rather than a full chamber directory. In v1 that should stay split conceptually into:

- static activation payload
  - image identity, image epoch, hidden proxy/endpoint descriptors, and local support boot inputs
- dynamic authority projection
  - current ownership and current foreign routing for that chamber

That dynamic projection should contain foreign signal route groups and target-route groups plus a monotonic revision so the chamber's local forwarding and proxy support can stay in sync.

Those revisions should stay explicit. `imageRevision` identifies immutable chamber content, `imageEpoch` identifies the active generation for an image or lane family, host meta-authority revision identifies the host's local truth, and per-chamber projection revision identifies the pushed view a chamber has applied. A chamber should only be eligible for work after it is ready, on the intended image revision and epoch, and caught up to the required projection revision.

The first chamber-lifecycle cut should also stay pragmatic:

- keep at least one warm `meta_support` chamber on active cells
- keep `business` chambers mostly demand-driven at first
- keep warm `trusted_control` capacity only on trusted cells that actually host privileged control work
- treat chambers as replaceable runtime boundaries rather than as durable homes for important state

Multiple chambers may still run the same image revision. That is explicit image reuse for concurrency and resilience, not an anonymous pool abstraction. The host remains the local authority and network that decides which chamber is currently a valid ingress owner or actor residency owner.

### Actor Manager Endpoints And Delegation Outcomes

Actor manager endpoints deserve one explicit clarification:

- business-owned actors may opt into generated meta-support endpoints
- those generated manager endpoints are not semantic business tasks
- they are authoritative only inside host meta authority
- they execute where the actor owner lives
- eligible meta chambers reach them through generated hidden proxies and normal delegation/inquiry mechanics

Delegation across chambers should return source-facing outcomes that clearly separate completed graph results, semantic graph failures, pre-start retryable rejects, policy denials, and transport failures. The important operational boundary is whether the target graph has started. Before start, retries are generally safe within the same absolute deadline; after start, failures must preserve ordinary Cadenza graph semantics or report operational uncertainty explicitly.

## Repository Authority Split

### `cadenza`

`cadenza` is the official TypeScript core repository with strict package
boundaries.

The root `@cadenza.io/core` package owns:

- primitive semantics.
- runtime loop behavior.
- executable APIs and contracts for core-represented runtime objects.
- materializable runtime representations such as tasks, intents, signals, actors, helpers, and globals.

Core remains persistence- and authority-agnostic. It does not import
Environment bootstrap, PostgreSQL, Chamber, or Cell implementation.

The Python, Elixir, and C# core repositories express the same portable
primitive meaning through checked language-specific implementations. They are
not Chamber adapters in the current release.

### `cadenza-environment`

The official Environment authority repository owns:

- neutral bootstrap contracts and genesis orchestration;
- the PostgreSQL authority schema and purpose-separated authority operations;
- desired state, placement, reconciliation, supply, and stem succession;
- execution-evidence ledger processing and distributed actor authority;
- trust-root public records, Cell enrollment, and Chamber activation handoff.

It does not own primitive semantics, callable materialization, host
containment, or peer transport.

### `cadenza-chamber`

The official chamber runtime repository owns:

- validating bootstrap and authority activation handoffs.
- loading assigned graph slices from environment authority.
- controlled callable materialization through approved language adapters.
- executing materialized slices through the appropriate core implementation.
- publishing normalized runtime evidence.

It does not own graph authority, environment schema, business logic authority, or meta-layer authority.

### `cadenza-cell`

The official trusted-host repository owns:

- deterministic containment and launch policy;
- Chamber process custody and bounded host capabilities;
- local and authenticated peer routing;
- durable local evidence custody;
- runtime convergence, supply realization, and termination.

It interprets current Environment authority but does not replace that durable
authority.

### Legacy Repositories

`cadenza-engine`, `cadenza-db`, `cadenza-service`, old UI experiments, and demo
repositories are historical evidence only. They do not own current contracts
or implementation direction.

### UI Console

The UI console is a human-facing surface for:

- prompting agents
- visualizing the graph
- monitoring the environment
- inspecting runtime and architecture state

It is part of the environment, but it is not part of the chamber substrate or core responsibilities.

## Core Representation And Materialization Boundary

Chambers materialize only what can be represented by the selected core and what
is needed for their assigned execution slice. Cells admit and host that work
under current placement, artifact, containment, and capability authority.

This is the practical materialization rule for the first generation:

- if a thing has a core representation, it can be materialized
- if it has no core representation, it remains database-native only

Examples of materializable runtime structure:

- tasks
- intents
- signals
- actors
- helpers
- globals

Examples of database-native-only structure:

- facts and other graph-native knowledge structures that do not have a core representation

This avoids a false split between "executable materialization" and "context
materialization." The real boundary is simpler: a Chamber adapter materializes
the assigned slice plus required supporting context when that structure is
representable by its core.

## Execution Model

`Task` is the only executable primitive.

Other important runtime roles:

- `Intent` defines the callable contract
- `Actor` defines state authority
- `Signal` defines propagation
- `Helper` and `Global` define shared support surfaces

An "actor task" is not a separate primitive. It is a normal task that has a relationship to an actor. That relationship affects materialization and runtime access, but not the primitive taxonomy.

## Tag-Only Grouping

Routines are no longer a first-class executable primitive.

Any remaining routine references in current-system discussions should be read as historical migration input, not as part of the 4.0 executable model.

For the first generation, grouping is tag-only.

Tags are used to:

- slice materialization scope
- group business capabilities
- express operational ownership
- mark domains, priorities, and lifecycle state
- support future optimization and redistribution work

This keeps grouping soft instead of turning it into a second executable abstraction.

## Slice Taxonomy

The meta layer is not one blob. It is a family of slices with different placement semantics.

### Per-Cell Meta Slices

These must exist on every cell so the distributed system can function.

Likely examples:

- socket and REST actors
- local registry actors
- execution persistence paths
- Cell and Chamber health evidence paths
- baseline bootstrap participation logic
- other distributed-runtime support expressed through current contracts

### Singleton Environment Slices

These exist once per environment.

Examples:

- the privileged authority-access slice
- the singleton expansion-control slice for durable generated bundles
- other environment-wide authority or coordination slices

In a single-Cell environment, singleton slices may be assigned to governed
Chambers on that Cell beside ubiquitous meta and business slices, subject to
lane and capability policy.

### Per-Agent Slices

These exist once per agent identity.

Examples:

- agent initialization
- agent operational logic
- agent-facing API support logic

An agent is modeled as an actor. Its standing instructions are represented as facts. Agent-local context assembly is part of the actor-based model and will evolve further later.

### Business Slices

These are the domain and product graph slices that Environment authority places
on eligible Cells and their Chambers materialize according to runtime policy.

## Stem Cell

Each environment should own its own ongoing placement and scaling logic through one singleton meta placement unit: the stem-cell unit.

This changes the control-plane model in one important way:

- parent environments may initialize child environments
- parent environments should not remain the continuous managers of child environments
- ongoing reconciliation should be owned by the environment itself

The active stem cell is whichever cell currently hosts the ready singleton replica of that unit.

The stem-cell unit should own:

- cell reconciliation
- replica reconciliation
- replica-to-cell assignment
- routing-state convergence

Humans and agents should be able to override desired state, but automation should be the default operating mode.

## Placement And Assignment

For the first generation, slice assignment should stay simple.

The environment uses static configuration for assignment.

The main operational scaling unit should not be the cell itself. The environment should instead place explicit placement units, create replicas of those units, and assign those replicas to cells. Cells provide hosting capacity; placement units define what scales together.

The stem-cell unit should be the singleton environment-local owner of that assignment and scaling reconciliation after bootstrap.

Placement is still conceptually derived from tags and relationships, but the first implementation should not try to solve dynamic placement, optimizer-driven co-location, or adaptive redistribution.

That later optimization layer remains intentionally out of scope.

## Bootstrap Flow

The environment bootstrap foundation ends at a verifiable chamber handoff:

1. initialize and verify the minimal environment authority schema.
2. create the environment identity and public trust-root record.
3. enroll the first trusted-control cell identity from explicit static bootstrap input.
4. seed structural vocabulary, the governed capability registry, and the minimal authority/security kernel from pinned seed packs.
5. declare the privileged authority-access slice as the sole initial holder of direct `authority_access`.
6. record ordered bootstrap evidence and produce a digest-bound activation handoff.
7. enter `handoff_ready`.

Bootstrap does not execute source or claim the environment is operational. The later chamber/runtime integration validates the handoff, activates the authority-access slice under containment, and then enables subsequent meta-layer expansion.

Agent APIs, stem-cell reconciliation, plugin activation, general identity/session providers, additional cells, placement replicas, and broader meta slices are post-bootstrap phases.

## Live Authoring Model

Although the environment database is authoritative, the intended development and authoring path is not "edit Postgres directly with no live runtime."

The intended setup is:

- instantiate an environment
- ensure at least one cell is active
- let humans and agents work through the live meta system hosted on that cell

That means:

- the human-facing UI console should talk to cell-hosted meta slices
- the higher-level agent API should also be a meta slice running on a cell
- those meta flows and tasks should call explicit privileged authority-access tasks to perform graph queries, graph commands, projection writes, and the narrower bootstrap or repair operations
- projection and reconciliation flows such as relationship, route, and other authority-derived read models should also run as meta slices on cells

So the database remains the authority, but the normal authoring loop is mediated by a live environment with at least one active cell.

Direct database mutation may still exist as a low-level bootstrap, repair, or emergency path. It should not be the default human or agent development workflow.

One important consequence is that durable generated bundles should also converge through the live environment.

For example:

- trusted static cell bootstrap makes one explicit bootstrap call that materializes the privileged authority-access slice
- that slice becomes the only slice with direct authority access
- a cell-hosted meta slice reconciles the official generated access layer back into authority through those privileged authority-access tasks
- the next materialization pass makes those generated tasks live and testable as normal runtime objects

The same pattern should apply when humans or agents add new generator-style actors during development: write the actor object to authority through the live meta system, let a live cell reconcile the durable generated bundle, then let normal materialization bring that bundle into runtime.

This is how the environment should feel in practice: add something, wait briefly for convergence, then test it as a live part of the system.

## Agent API Surfaces

The environment should expose three distinct interaction surfaces:

### High-Level Agent API

This surface should enforce the soft core and make the intended development loop efficient:

- facts describe why
- intents define what contract should be satisfied
- tasks execute the work
- outcomes and evaluations drive revision

This API should guide agents toward that flow and provide useful helpers for working within it.

The high-level agent API should eventually be backed by the meta-memory methodology in [cadenza-meta-memory.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-meta-memory.md). In that model, agents work from scoped context packets assembled from source events, atoms, edges, constraints, evidence, projections, and capsules rather than from compressed chat history. Early pre-Cadenza harness work should use the same conceptual objects before those flows are internalized as Cadenza meta slices.

### Low-Level CRUD API

This surface should allow direct graph manipulation and may bypass soft-core guidance when needed.

It exists for advanced or system-level work and should remain usable in tandem with the high-level API.

### Engine-Local CLI

This is primarily a debugging and direct-runtime manipulation surface.

It should not be the main way agents operate on the system.

## Policy Use Cases

The policy layer is useful because it lets one governed mechanism control visibility, editing, execution, materialization, and tag mutation without falling back to hard service boundaries or rigid role grids.

### Team-scoped editing without blanket ownership

An actor representing a payments engineer or payments agent can carry ownership tags such as `@team-payments`, while tasks and intents in the billing slice carry `module-payments`.

Policy can then allow `write` when:

- the subject carries the required ownership tags
- the resource object carries the relevant module tags

This gives precise edit authority without granting broad environment-wide write access.

### Read vs execute separation on sensitive workflows

Some objects should be inspectable by many actors but executable by very few.

A production remediation task can be readable by platform actors for diagnosis, while `execute` is only allowed for actors whose effective tags and lifecycle context match a narrower security or operations policy surface.

That lets the system separate understanding from action.

### Cell placement and materialization boundaries

Cells and their governed runtime lanes are policy subjects too.

A Cell tagged `region-eu` and `gpu` can be eligible to host Chambers that
materialize only logical objects whose effective tags require EU placement and
GPU capability. Another Cell may still receive bounded routing projections
without becoming eligible to materialize those objects.

That makes placement governable without turning it into a hardcoded deployment rule.

### Controlled tag assignment

Tag assignment is one of the most dangerous actions in the system because it can widen authority indirectly.

The separate tag-management rule family allows a team lead or platform actor to assign ownership tags within a known scope while blocking assignment of security or placement tags that remain system-only by default.

This prevents authority escalation through casual metadata edits.

### Shared helpers without shared edit authority

A helper can be used by many domains through task execution while remaining writable only by a smaller set of platform actors.

Teams can depend on the same shared runtime surface without sharing control over that surface.

### Rollout and rollback with bounded authority

An actor may be allowed to inspect version history, compare `candidate` and `stable` versions, and move the current version pointer only if it satisfies the relevant `write` or `execute` policy over that logical object.

Another actor may be able to review the same history while remaining unable to promote or roll back the version.

This supports staged deployment and audit-heavy review flows without a separate permission system.

### Human console visibility by governed slice

The same graph can exist underneath one UI console while different humans see different slices.

A support operator may have `read` authority over customer support objects and facts while being denied access to billing-security objects. The console does not need a separate data model; it just renders what the policy layer allows.

### Clear denial feedback for agents

Because policy evaluation returns a full decision envelope, a denied action can explain itself precisely:

- no matching allow rule
- missing ownership or placement tags
- wrong object type or lifecycle state
- target tag category is system-only

That matters operationally because an agent can correct its next step instead of retrying blindly.

## Legacy Boundary

`cadenza-service` remains an important proof-of-concept and a source of lessons learned, but the environment model changes what survives.

What survives as meta-slice concerns:

- transport
- deputy behavior
- local registry behavior
- execution persistence paths
- health monitoring
- bootstrap participation

What becomes legacy with the old service concept:

- manifesting as a service-centered abstraction
- hard service identity as a primary architecture boundary
- repo- or machine-tied ownership as the main unit of distribution

## Near-Term Non-Goals

The following are intentionally not part of this first environment definition:

- nested environment orchestration
- dynamic slice placement
- performance-driven co-location optimization
- hot-path redistribution logic
- final multi-agent lifecycle design
- final tag-system architecture beyond tag-only grouping and placement semantics
- final storage schema and UI console for Cadenza meta memory

## Immediate Implications

This Environment model preserves a few concrete implementation rules:

- the environment schema and bootstrap implementation belong in the official
  `cadenza-environment` repository; core repositories remain persistence- and
  environment-authority-agnostic.
- all core implementations remain persistence- and authority-agnostic.
- the Chamber runtime stays narrow, containment-aware, and
  materialization-focused.
- task-only execution should be treated as a hard simplification, not a soft preference
- routines should not return as executable structure through the back door
- future work should preserve the distinction between durable graph authority,
  Cell placement, and Chamber execution
- the policy layer should be treated as a first-class environment concern, not an afterthought bolted onto tags

## Related Documents

- [vision.md](./vision.md)
- [architecture.md](./architecture.md)
- [index.md](./index.md)
- [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)
