# Cadenza Schema Proposal

This document consolidates the current draft schema direction for Cadenza's next environment-native architecture.

It is a proposal document, not a claim that every described layer already
exists. The official environment foundation now lives in the independent
`cadenza-environment` repository; current Chamber, Cell, placement, and runtime
implementation is governed by later decisions and contracts.

## Purpose

The schema must support four things cleanly:

- stable logical object identity
- immutable semantic versioning with rollback
- governed tag-based grouping, routing, and authority
- dynamic policy evaluation over logical objects

The model is intentionally database-native. It assumes the environment database is authoritative and that engines materialize only the core-representable slice they need.

## Core Principles

- `object_registry` is the canonical logical-object identity surface.
- Primitive-specific semantic payload does not live in `object_registry`.
- Immutable versions exist for selected primitive types and are selected by environment-scoped pointers.
- Versions are marked for rollout and audit; they are not part of the main tag system in v1.
- Tags attach to logical objects in v1, not versions.
- Effective tags are normalized projections with provenance, plus optional lazy caches.
- Policy is allow-only and default-deny.
- Policy evaluates current effective tags plus governed object metadata such as type and lifecycle.
- privileged authority-access tasks are the low-level authority persistence substrate
- PostgresActor-generated CRUD tasks/signals are higher-level expansion conventions, not the root authority substrate
- Custom meta tasks exist only where semantics or invariants exceed raw CRUD.
- The environment database is authoritative, but the intended authoring path is through live cell-hosted meta slices rather than direct database mutation.

## Status Snapshot

The current 4.0 contract set is split between a largely locked task/materialization surface and a still-open multi-engine runtime-distribution surface.

### Locked enough to document

- logical object identity and immutable versioning
- version marks and current-pointer history
- governed tags, effective-tag provenance, and dynamic policy
- task semantic version boundaries
- `TaskDefinition`, `TaskBehaviorDeclaration`, and `TaskExtensionDeclaration`
- actor primitive baseline, task-side actor binding boundary, and actor extension boundary
- authority-native expansion-bundle reconciliation flow topology
- cell execution-security baseline and shared executable security declaration
- governed v1 cell capability registry
- `DeclaredTaskWiring` versus `ResolvedEngineWiring`
- cell/unit/replica placement vocabulary and route membership
- stem-cell desired state and reconciliation contract
- cell supply and slot-capacity model for v1 reconciliation
- manual override semantics for placement reconciliation
- cell lifecycle semantics for assignment and routing eligibility
- v1 assignment heuristics for replica-to-cell placement
- v1 bridge artifact taxonomy and derived route maps
- demand-miss and loose-end marking contract for soft outbound usage
- route-map refresh, bridge diffing, and retry-scope boundaries
- generic helper/global runtime access without alias-gated task-local bindings
- task-level authority extension and inherited authority grant context
- version-scoped soft usage declarations, inference, and observations

### Explicitly still open

- exact authority tables or projections for bridge route maps
- exact failure classification model for bridge and transport failures
- detailed stem-cell reconciliation algorithms beyond the v1 contract rules
- additional actor extension catalog entries and configs beyond residency, persistence, meta support, Postgres, and deferred browser planning
- exact capability-specific backing-resource state behind generated expansion bundles
- the exact secure VM implementation and lifecycle in the future cell repo
- detailed nested-environment bootstrap, transport signing, exact artifact-attestation formats, vulnerability/SBOM policy, evidence storage hardening, retention policy, and audit export contracts
- exact chamber transport serialization and implementation handler signatures
- whether any partial actor-owner knowledge should be projected into chambers
- exact persistent-flow schema, checkpoint payload storage, lease implementation, and recovery scheduler mechanics

The remaining architectural work should now bias upward in scope. The unresolved center of gravity is no longer local task definition; it is actor extensions, the secured cell execution environment, and the remaining operational details of how one environment-wide declared graph becomes multiple engine-local operational graphs while preserving authority, traceability, and runtime slimming.

## Materialization And Wiring

The environment database is authoritative for both executable definitions and declared graph structure, but the runtime should hydrate only the smallest operational subset it actually needs.

That should not be misread as "all authoring happens through direct database writes." The intended operating model is:

- instantiate an environment
- keep at least one cell active
- perform normal human and agent authoring through cell-hosted meta slices
- let those meta flows call privileged authority-access tasks that persist the official state

So the authority remains database-native, while the normal development loop remains live-runtime-mediated.

## Security Posture

Cadenza should not inherit the security model of a general-purpose application platform by default.

It is closer to a new operating system and development substrate than to a conventional app framework, which means security should be designed from first principles around Cadenza's own runtime model rather than added later as middleware and patchwork.

The goal for v1 should be:

- a small trusted computing base
- explicit trust boundaries
- no ambient authority
- security-relevant behavior declared and projected in authority
- unsafe states refused at placement and materialization time rather than only detected after code is already live

This should lead to the following architectural principles:

- secure by materialization, not only by execution
  - if a declared surface cannot be placed or materialized safely, it should not go live
- no ambient authority
  - host power should never leak in by default through language/runtime globals, package imports, or implicit process access
- security-relevant properties should be first-class architectural data
  - capability grants, trust levels, security profiles, provenance, generated ownership, and future attestation or revocation state should be modeled explicitly rather than left as convention
- privileged execution should be rare, isolated, and structurally obvious
  - business logic, mediated infrastructure, and trusted control-plane logic should remain distinct execution classes
- conventional substrate risks should be contained behind narrow brokers
  - databases, network stacks, filesystems, package ecosystems, crypto libraries, and OS primitives should be treated as dependency risks that must be wrapped rather than trusted ambiently
- cells should enforce security semantics, not invent them
  - authority should remain the source of declared trust and capability intent, while cells perform capability matching, secure execution, mediation, and audit

This is also the right boundary for innovation:

- Cadenza should be unconventional where its graph-native, materialization-driven architecture allows stronger security than traditional systems
- it should fall back to conventional substrate protections where the host OS, database, transport, or package ecosystem still define the real attack surface

The rest of the execution-security frontier should be read through this posture rather than as a collection of isolated controls.

## Execution Security Boundary

Security should be treated as a first-class architectural boundary, not as an implementation afterthought.

The current experimental `vm` helper in core is not part of the intended 4.0 architecture. The future secure VM should live in the cell repo and be owned by the cell runtime boundary, not by `cadenza` core.

The right split is:

- core owns primitive semantics and the execution ABI expected by those primitives
- the cell owns secure source execution, capability mediation, and privileged host integration
- privileged host access should always be explicit and capability-driven rather than ambient

### Shared executable security declaration

The security contract should be shared across executable primitive surfaces rather than reinvented per primitive type.

Recommended high-level contracts:

```ts
type ExecutionSecurityProfile = "pure" | "mediated" | "privileged";

type RuntimeCapabilityKey =
  | "authority_access"
  | "filesystem"
  | "subprocess"
  | "network_client"
  | "network_server"
  | "package_runtime"
  | "secret_access"
  | "cell_control";

type RuntimeCapabilityRequirement = {
  key: RuntimeCapabilityKey;
  mode?: "use" | "admin";
};

type RuntimeCapabilityGrant = {
  key: RuntimeCapabilityKey;
  modes?: Array<"use" | "admin">;
};

type CellTrustLevel = "standard" | "trusted";

type ExecutableSecurityDeclaration = {
  profile: ExecutionSecurityProfile;
  capabilities?: RuntimeCapabilityRequirement[];
};
```

This declaration should conceptually apply to:

- tasks
- helpers
- actor-support slices and expansion-control capabilities
- other executable support flows that the cell materializes

Recommended placement rule:

- `ExecutableSecurityDeclaration` should live as a top-level field on executable definitions
- it should not be hidden inside `behavior`, because it is broader than one behavior interpreter
- it should not be hidden inside extensions, because placement, materialization, and review need to reason about it even before extensions are resolved

For 4.0 this means:

- `TaskDefinition` should carry `security?: ExecutableSecurityDeclaration`
- future persisted helper definitions should use the same top-level field
- seeded support slices and generated executable surfaces should materialize underlying tasks/helpers that carry the same declaration explicitly
- this field is the executable surface's local source declaration, not the final placement/materialization requirement by itself

The existing executable `meta` classification should also survive as an authored semantic/runtime distinction.

It should keep its narrower meaning:

- it distinguishes business executable surfaces from meta executable surfaces
- it can continue to inform lower-level core runner and loop separation
- it should not be overloaded into the higher-level chamber/process placement decision by itself

For v1, that means:

- executable surfaces should retain an authored `meta` flag or equivalent semantic classification
- a second authored `workloadLane` field should not be introduced yet
- the higher-level lane used by the cell runtime should be derived instead

### Declared versus effective executable security

The top-level security field should be treated as the executable surface's local declaration.

Placement and materialization need a stronger derived view that accounts for hard executable dependencies.

Recommended derived contract:

```ts
type EffectiveExecutableSecurity = {
  profile: ExecutionSecurityProfile;
  capabilities: RuntimeCapabilityRequirement[];
  requiresTrustedCell: boolean;
};
```

Recommended rules:

- the declared security field remains the source of truth for one task, helper, or seeded executable surface
- effective security is derived by taking the hard dependency closure of that executable surface
- hard dependencies include executable helper dependencies and required executable support capabilities; they do not include soft runtime observations such as emitted signals, inquired intents, helper usage discovered only at runtime, or other loose-end metadata
- if any hard dependency is `mediated`, the effective profile is at least `mediated`
- if any hard dependency is `privileged`, the effective profile is `privileged` and `requiresTrustedCell = true`
- capability requirements are unioned by key, with `admin` dominating `use` when both appear
- a locally declared `pure` task may therefore still have an effective `mediated` or `privileged` requirement once its hard dependencies are accounted for

This keeps authoring explicit while still letting placement and review reason about the real operational requirement before the cell materializes anything.

### Derived execution lanes

Security and workload partitioning should be treated as two different axes.

- effective security answers how much host power and trust an executable surface needs
- the authored `meta` classification answers whether the executable surface belongs to the business layer or the meta layer

The cell runtime should derive a higher-level execution lane from those two inputs instead of reusing one field with two meanings.

Recommended derived contract:

```ts
type EffectiveExecutionLane =
  | "business"
  | "meta_support"
  | "trusted_control";
```

Recommended derivation rules:

- if `EffectiveExecutableSecurity.profile === "privileged"`, the lane is `trusted_control`
- otherwise, if the executable surface is marked `meta`, the lane is `meta_support`
- otherwise the lane is `business`

Important rules:

- `meta` remains the authored source classification; `EffectiveExecutionLane` is a derived operational projection
- a separate authored `workloadLane` field should not be introduced in v1 unless a real counterexample appears
- execution lane should not aggregate transitively the way security does
- helper dependencies may raise effective security requirements, but they should not silently convert a business task into a meta-support task
- execution lane is a chamber/process partitioning concern inside a cell, not a scaling identity and not a replacement for placement units

This gives the cell a clean three-lane runtime model:

- business chambers
- meta-support chambers
- trusted control-plane chambers

That preserves the existing business-versus-meta distinction while allowing the cell to separate those workloads into different runtime instances and processes for both isolation and performance.

### Cell host and chamber model

The cell should be treated like a very small trusted kernel:

- one narrow trusted host
- one or more isolated execution chambers
- one trusted capability-broker layer
- one separate trusted control-plane lane

Recommended high-level contracts:

```ts
type CellHost = {
  cellKey: string;
  trustLevel: CellTrustLevel;
  capabilities: RuntimeCapabilityGrant[];
};

type ExecutionChamber = {
  chamberKey: string;
  cellKey: string;
  lane: EffectiveExecutionLane;
  status: "starting" | "ready" | "draining" | "stopped";
};

type CapabilityBroker = {
  cellKey: string;
  supportedCapabilities: RuntimeCapabilityGrant[];
};
```

Important semantics:

- `CellHost` is the narrow trusted core of the cell
- source-bearing authored code should not run directly in the trusted host
- `ExecutionChamber` is the isolated runtime domain where authored executable surfaces run
- chambers are reusable lane-specific runtime domains, not one-process-per-task objects
- `CapabilityBroker` is the only path from chambers to host powers such as authority access, network, filesystem, subprocesses, packages, secrets, and cell control
- trusted control-plane execution is a distinct lane, not merely another meta-support chamber
- the host should be understood as the local cell's brokered network and safeguard:
  - it routes and brokers chamber-to-chamber execution-time traffic
  - it enforces capability and trust boundaries
  - it protects chambers from direct ambient access to one another or to host powers

This is also worth noticing as a structural pattern:

- chambers are not cells, but they are cell-like in shape
- they create bounded execution domains with explicit communication and managed lifecycle inside a larger organism
- the cell implementation does not need to be written in Cadenza, but it should still reflect Cadenza's fractal architectural principles such as declared boundaries, mediated communication, and small trusted cores

### Host-chamber data boundary

The host-chamber boundary is where the security model either stays real or collapses into decoration.

Recommended rules:

- all communication between host and chamber should cross an explicit message boundary
- values that cross the boundary should be copied or serialized into safe transport forms rather than shared by live host references
- raw host objects must never cross into authored-code chambers
- capability providers should live on the trusted host side; chambers should only receive mounted stubs or broker handles
- provider calls should be request/response by default rather than arbitrary callback channels into the chamber
- host and chamber should not share ambient mutable globals or module caches as hidden communication paths
- the host must be able to cancel, time-limit, memory-limit, kill, and replace chambers cleanly

This implies:

- no raw database clients, filesystem objects, subprocess handles, secret stores, package loaders, or socket objects inside chambers
- no hidden re-entrancy from brokered providers unless a later capability contract proves that it is safe and necessary
- no same-process object sharing that would let authored code mutate trusted host memory
- chambers should not communicate around the host; the host is the local safeguard and brokered network for the cell

The first cut should therefore aim for:

- trusted cell-host processes
- separate chamber processes for source-bearing execution
- a brokered copy-in/copy-out data boundary between them

Same-process VM or isolate approaches may still be useful as development mechanisms or stepping stones, but they should not be treated as the final claimed security boundary.

### Chamber primitive transport surface

The chamber execution plane should stay recognizably Cadenza-shaped.

It should not introduce a generic worker RPC protocol. A chamber is closer to a small local Cadenza runtime or service instance than to a generic execution engine.

The boundary should therefore be split into two layers:

- a host control plane for chamber lifecycle and materialization
- a chamber primitive transport surface for runtime activity

The host control plane is intentionally not part of the primitive execution ABI. It covers concerns such as:

- start chamber
- load or refresh chamber image
- drain chamber
- stop chamber

Those are trusted cell-host operations, not normal Cadenza runtime traffic.

The chamber primitive transport surface should stay minimal:

- `delegation`
- `signal`
- `status`

These are the chamber-local equivalents of the current service runtime's transport surface.

Recommended transport contracts:

```ts
type ChamberContext = AnyObject;

type ChamberIngressMetadata = {
  cellKey: string;
  chamberKey: string;
  lane: EffectiveExecutionLane;
  receivedAt: string;
  transport: "chamber";
};

type ChamberDelegationContext = ChamberContext & {
  __remoteRoutineName: string;
};

type ChamberSignalContext = ChamberContext & {
  __signalName: string;
};

type ChamberStatusContext = ChamberContext;
```

Important rules:

- transport payloads on the execution plane are always context objects
- the host should enrich incoming contexts by attaching chamber and cell ingress metadata in reserved metadata fields before handing them to the local chamber runtime
- the chamber should then validate and hand the request directly into local Cadenza primitives rather than interpreting it through a generic worker protocol

`delegation` semantics:

- validate and normalize the incoming delegation context
- verify that the local chamber runtime can resolve the target task
- create any needed ephemeral local resolver or progress tasks inside the chamber runtime
- hand the request directly to the local runner through key-first executable resolution, for example `Cadenza.runByKey(taskKey, context)` or an equivalent key-resolved runner path
- return a context response when the local graph completes or fails

This is intentionally slightly sharper than the current service-runtime transport pattern. The current REST/socket boundary emits `meta.rest.delegation_requested` or `meta.socket.delegation_requested` because it is bridging between service instances. Chamber ingress is an internal host-to-local-runtime boundary, so after validation it should hand off more directly into the local runner.

`signal` semantics:

- validate the incoming signal context
- verify that the local chamber runtime actually observes the named signal
- emit the signal locally into the chamber runtime

Signal delivery remains detached from the caller's execution semantics. The chamber layer itself does not need a signal response contract. If some outer network transport wants to acknowledge network receipt, that should stay a transport concern above the chamber primitive surface rather than a chamber-execution semantic.

`status` semantics:

- accept a context-shaped status query
- resolve the chamber or cell-local status snapshot from the local runtime or host view
- return that status as a context object

Important clarifications:

- progress propagation is not a fourth primitive endpoint; it remains an optional transport-local adjunct to `delegation`, the same way the current socket transport emits delegation progress separately while REST does not
- the capability broker should not appear as a generic execution-plane endpoint
- provider plumbing belongs below the primitive transport surface and should support the chamber-local runtime rather than replacing it with a second RPC system
- the chamber primitive surface is intentionally smaller than an external network transport surface because chamber ingress is an internal runtime boundary, not a public service boundary

This keeps the chamber coherent with Cadenza:

- few primitive-shaped transport contracts
- each contract hands off directly into local Cadenza activity
- no generic `execute` endpoint
- no generic `callout` endpoint

### Chamber-local materialization boundary

Tasks, helpers, globals, actor definitions, and actor-task bindings should be chamber-local runtime structure once a chamber image has been materialized.

That means:

- helper bindings should not be transported per execution
- global snapshots should not be transported per execution
- actor bindings should not be transported per execution

Those are chamber-local materialization concerns, not execution-plane payload concerns.

The execution plane should carry only the context object plus chamber-ingress metadata.

Persisted actor state still matters, but it belongs to runtime materialization and persistence support rather than to transport-level actor-binding payloads.

Recommended rule:

- actor persistence and hydration should be implemented by support slices that live in `meta_support` chambers behind exact authority-projected runtime facades
- actor-bound task execution should read or mutate local chamber actor state in the normal runtime model
- write-through completion must cross an exact runtime commit barrier; addressed signals may carry detached lifecycle or evidence work but cannot acknowledge durability
- chambers should therefore communicate with each other at execution time through the same two primitive-shaped patterns that exist at cell scope:
  - addressed signals for detached work
  - delegation of execution roots for synchronous task composition across chamber boundaries

Example:

- a task with write access mutates candidate actor state locally
- the actor wrapper invokes the authority-projected persistence facade with the stable mutation and ownership identities
- the persistence support slice validates and commits through the normal support and authority paths
- only a successful durable acknowledgement allows the task result and buffered downstream affects to become visible

This keeps actor persistence coherent with the rest of Cadenza:

- no per-execution actor-state injection protocol
- no public chamber-only persistence RPC surface
- no second inter-chamber coordination model beneath the primitive layer
- detached inter-chamber flows should still prefer unique signals plus ephemeral resolve tasks in the source chamber when no direct synchronous composition is required
- synchronous same-layer inter-chamber work should use delegated execution roots rather than forcing developers to detach pure tasks from mediated or privileged tasks merely because security split them into different chambers

### Capability broker model

The broker should stay simple, static, and deny-by-default.

Recommended contracts:

```ts
type CapabilityProviderRegistration = {
  providerKey: string;
  capabilityKey: RuntimeCapabilityKey;
  modes: Array<"use" | "admin">;
  lanes: EffectiveExecutionLane[];
  trustedOnly?: boolean;
  auditLevel: "none" | "summary" | "full";
};

type ChamberCapabilityMount = {
  chamberKey: string;
  capabilityKey: RuntimeCapabilityKey;
  mode: "use" | "admin";
  providerKey: string;
};

type CapabilityAuditEvent = {
  cellKey: string;
  chamberKey: string;
  executionId?: string;
  capabilityKey: RuntimeCapabilityKey;
  providerKey: string;
  mode: "use" | "admin";
  operation: string;
  outcome: "allowed" | "denied" | "failed";
};
```

Recommended rules:

- providers are trusted host-owned implementations; authored code must never register providers
- chambers should not discover providers dynamically
- mounts should be derived from effective security requirements, execution lane, cell grants, provider availability, and trust rules
- chamber reuse must not imply persistent capability exposure across unrelated executions
- capability mounts should therefore be execution-scoped or cleared between executions even when the chamber process itself is reused
- mount-time validation is not enough; sensitive capability calls should still be validated again at call time
- capability-provider interaction should remain below the chamber primitive transport surface rather than appearing as a fourth public runtime endpoint
- capability APIs should stay narrow and capability-specific rather than collapsing into one generic dynamic host bridge
- `authority_access`, `secret_access`, `cell_control`, and privileged-lane capability use should emit stronger audit by default
- `authority_access` providers should only be mounted into chambers that belong to the privileged authority-access slice

This gives the broker one clear job:

- mount only what the chamber is allowed to see
- validate every sensitive operation
- execute the real host operation on the trusted side
- emit audit where required

It should not become:

- a generic `invoke(anything, payload)` host tunnel
- a raw database or filesystem object forwarder
- a dynamic package or shell escape surface

### Chamber lifecycle

Chambers should be reusable enough to amortize startup cost, but disposable enough that the host can replace them aggressively.

Recommended high-level contracts:

```ts
type ChamberRuntimeImage = {
  imageRevision: string;
  lane: EffectiveExecutionLane;
  abiRevision: string;
  policyRevision: string;
  providerSetHash: string;
  materializationHash: string;
};

type ExecutionChamber = {
  chamberKey: string;
  cellKey: string;
  lane: EffectiveExecutionLane;
  status: "starting" | "ready" | "draining" | "failed" | "stopped";
  image: ChamberRuntimeImage;
  activeExecutionCount: number;
  ingressEpoch: number;
};
```

Recommended lifecycle rules:

- multiple chambers may run the same image revision
- this is explicit image reuse, not an anonymous pool abstraction
- the host should create new chambers when concurrency, ingress policy, or local responsibility distribution requires them
- `meta_support` should usually keep at least one warm chamber per active cell
- `trusted_control` should keep warm capacity only on trusted cells that actually host privileged control work
- `business` should start demand-driven in v1, with extra warm chambers added only where latency pressure justifies them
- chamber-local caches and compiled artifacts are performance optimizations only; they must never be the sole holder of important state
- execution sessions are not migrated between chambers in v1; if a chamber dies, the active executions fail and higher-level task retry semantics decide what happens next

Lifecycle semantics:

- `starting`
  - chamber process is booting, handshaking the execution ABI, and validating its runtime image
  - does not accept new executions
- `ready`
  - chamber may accept new executions
  - `activeExecutionCount` may be zero or greater than zero; readiness does not imply idleness
- `draining`
  - chamber accepts no new executions
  - existing executions may finish or be cancelled by timeout
  - preferred state during rolling refresh and controlled shutdown
- `failed`
  - chamber crashed, tripped a hard resource limit, violated a security invariant, or otherwise became untrustworthy
  - active executions are treated as failed
  - host should replace rather than repair in place
- `stopped`
  - chamber is terminated and not eligible for execution

### Host meta authority state

The host should act as the internal cell meta authority for chamber existence, readiness, ownership, forwarding eligibility, and internal generated support objects.

Recommended host-owned state:

```ts
type LocalChamberRecord = {
  chamberKey: string;
  lane: EffectiveExecutionLane;
  imageRevision: string;
  status: "starting" | "ready" | "draining" | "failed" | "stopped";
  ingressEpoch: number;
};

type SupportSliceResponsibility = {
  supportSliceKey: string;
  chamberKey: string;
  status: "assigned" | "hydrating" | "ready" | "draining";
};

type TaskEntryMember = {
  taskKey: string;
  chamberKey: string;
  status: "assigned" | "hydrating" | "ready" | "draining";
};

type TaskEntryGroup = {
  taskKey: string;
  memberChamberKeys: string[];
  selection: "single_fixed" | "round_robin" | "sticky_actor_key";
  ingressEpoch: number;
};

type ActorResidencyCapabilityMember = {
  actorObjectKey: string;
  chamberKey: string;
  lane: EffectiveExecutionLane;
  imageRevision: string;
  status: "ready" | "draining" | "inactive";
};

type ActorResidencyCapabilityGroup = {
  actorObjectKey: string;
  candidateChamberKeys: string[];
  selection: "deterministic_actor_key";
  ingressEpoch: number;
};

type ActorResidencyResponsibility = {
  actorObjectKey: string;
  actorKey: string;
  chamberKey: string;
  status: "assigned" | "hydrating" | "ready" | "draining";
  assignmentEpoch: number;
};

type InternalCallableTargetDescriptor = {
  targetKey: string;
  kind: "actor_manager_endpoint";
  actorObjectKey: string;
  supportSlot: "hydrate" | "persist" | "repair" | "evict";
  locality: "actor_owner";
  access: "read" | "write";
  callerVisibility: {
    callerLayer: "meta";
    callerLanes: EffectiveExecutionLane[];
  };
  provenance: {
    sourceKind: "actor_meta_support_opt_in";
    sourceActorObjectKey: string;
    reconcilerKey: string;
  };
};

type InternalProxyDescriptor = {
  proxyKey: string;
  targetKey: string;
  kind: "actor_manager_proxy";
  exposure:
    | { mode: "direct_task" }
    | { mode: "inquiry"; intentKey: string };
  timeoutMs?: number;
  retryPolicy?: {
    retryCount: number;
    retryDelayMs: number;
  };
  callerLanes: EffectiveExecutionLane[];
  provenance: {
    sourceKind: "actor_meta_support_opt_in";
    sourceActorObjectKey: string;
    reconcilerKey: string;
  };
};
```

Important rules:

- the host is the only local authority for chamber and responsibility ownership
- chambers do not maintain independent truth about other chambers
- one active actor residency owner may exist per `(actorObjectKey, actorKey)` inside one cell
- `TaskEntryGroup` is the host-side ingress selection surface
- `TaskEntryGroup` is explicit and task-scoped; image presence alone must not imply ingress ownership
- actor residency capability membership is explicit and host-derived; image presence alone must not imply actor-key ownership
- internal generated manager endpoints and proxies should be authoritative in host meta authority even though they are not written to environment authority
- those internal generated descriptors should be reconstructible from their source declarations and host-local control loops rather than treated as hand-authored business truth

### Host-local actor-support reconciler

Internal generated actor-manager endpoints should follow the same authority-first pattern that environment-scope generated bundle members use, but at host scope.

Recommended v1 rules:

- actor meta support is opt-in per actor; internal manager endpoints and proxies are not generated by default
- a host-local actor-support planner/reconciler should derive desired internal generated descriptors from:
  - actor declaration and meta-support opt-in
  - actor task bindings
  - derived actor `userLayer`
  - actor interaction modes
- that host-local reconciler should write internal generated endpoint descriptors into host meta authority before any chamber materializes or refreshes from them
- business-side images should materialize hidden colocated manager tasks from `InternalCallableTargetDescriptor`
- eligible meta-side images should materialize hidden local proxy tasks from `InternalProxyDescriptor`
- internal generated descriptors should not be persisted to environment authority, but they should still be visible, controllable, and auditable inside host meta authority

### Chamber-local authority projection

Each chamber should receive a runtime-only local-authority projection from the host.

Recommended chamber-local support set:

- one runtime-only local-authority actor
- one meta apply-snapshot write task
- one meta signal-forwarding task
- one generalized hidden `ProxyTask` runtime support

The host should distribute full replacement snapshots with a monotonic revision in v1 rather than fine-grained deltas.

Recommended publication split:

- static activation payload
  - chamber identity, image identity, image epoch, capability mounts, internal generated endpoint descriptors, and local inquiry/proxy generation inputs
- dynamic authority projection
  - current ownership and current foreign-routing truth for that chamber

Anything that changes local runtime shape should force a new image revision rather than trying to flow through dynamic projection only.

Recommended projection shape:

```ts
type LocalSignalRouteGroup = {
  routeGroupKey: string;
  kind: "support_slice" | "task_entry" | "actor_residency";
  candidateChamberKeys: string[];
  selection: "single_fixed" | "round_robin" | "deterministic_actor_key";
};

type LocalTargetRouteGroup =
  | {
      targetKey: string;
      mode: "direct_candidates";
      candidateChamberKeys: string[];
      selection: "single_fixed" | "round_robin";
      routeEpoch: number;
    }
  | {
      targetKey: string;
      mode: "actor_owner";
      actorObjectKey: string;
      candidateChamberKeys: string[];
      selection: "sticky_actor_key";
      routeEpoch: number;
    };

type ChamberAuthorityProjection = {
  selfChamberKey: string;
  projectionRevision: number;
  sourceHostMetaAuthorityRevision: number;
  imageEpoch: number;
  ownership: {
    supportSliceKeys: string[];
    actorResidencies: Array<{
      actorObjectKey: string;
      actorKey: string;
      status: "assigned" | "hydrating" | "ready" | "draining";
      assignmentEpoch: number;
    }>;
  };
  routesBySignal: Record<string, LocalSignalRouteGroup[]>;
  routesByTarget: Record<string, LocalTargetRouteGroup>;
};
```

Important rules:

- chambers should receive only the chamber-local projection they actually need
- chambers should not receive a full chamber directory or full actor-owner map by default
- precise actor-owner truth remains host-local authority; chambers receive candidate groups and selection rules rather than full ownership replication
- the apply-snapshot task should reject stale revisions and replace the local cache atomically
- the apply-snapshot task should also reconcile:
  - the forwarding task's observed-signal set
  - the local target-route cache used by `ProxyTask`
  - local inquiry responder registration for generated proxies when image activation changed

### Host meta-authority revision model

Host meta authority needs separate revision concepts so image changes, local-authority changes, and per-chamber projection changes do not collapse into one ambiguous number.

Recommended meanings:

- `imageRevision` is immutable chamber content identity; it changes when local runtime shape changes, including tasks, hidden proxies, support code, or capability interfaces
- `imageEpoch` is the active generation for an image or lane family; it changes when a new generation can take work while old chambers may still drain
- `hostMetaAuthorityRevision` is the monotonic host-local truth revision; it changes when chamber state, responsibilities, internal descriptors, entry groups, actor residency, or routing candidates change
- `projectionRevision` is the monotonic revision of one chamber's pushed view; it changes when that chamber's derived projection changes
- `sourceHostMetaAuthorityRevision` records which host meta-authority truth revision produced a chamber projection

Publication should be a full-snapshot replace flow in v1:

- the host mutates host meta authority
- the host increments `hostMetaAuthorityRevision`
- the host derives chamber-specific projections
- the host pushes full replacement snapshots only to affected chambers
- each projection carries `projectionRevision`, `sourceHostMetaAuthorityRevision`, relevant `imageEpoch`, ownership state, and routing state
- the chamber apply-snapshot task rejects stale `projectionRevision` values
- the chamber applies an accepted snapshot atomically
- the chamber acknowledges the applied projection revision
- the host records the applied projection revision for execution eligibility checks

Execution eligibility should require:

- chamber state is `ready`
- chamber image revision matches the intended image
- chamber image epoch is active for the relevant work class
- chamber has applied the required projection revision
- target responsibility or route membership is ready

### Inter-chamber communication model

Inter-chamber execution-time communication should mirror the larger Cadenza model:

- `signal` for detached work
- `delegation` for synchronous execution-root handoff
- `inquire` remains local and resolves through the local inquiry broker and locally registered responder tasks

Recommended rules:

- the forwarding task is the simplified cell-internal analogue of a signal transmission task
- the forwarding task should observe only signals that currently have foreign-chamber route groups
- for each route group it should choose a destination chamber and send an addressed signal envelope to the host
- the host validates sender, target, readiness, and safeguards, then forwards to the addressed chamber
- the target chamber injects the signal into its local runtime without re-forwarding it
- `ProxyTask` is the simplified cell-internal analogue of a deputy task:
  - it accepts a root `targetKey` and normal context
  - it selects an eligible chamber from `routesByTarget`
  - it sends a delegation envelope through the host
  - it waits for the final delegated graph result
- local inquiry should remain local:
  - no `routesByIntent` projection is needed
  - hidden generated proxy tasks should attach local `.respondsTo(...)` bindings at image activation time
  - the local inquiry broker then resolves to those local proxy responders using the normal Cadenza pattern

Important rules:

- source chamber selects the target chamber locally from projected candidate groups
- host validates the selection; it should not silently reroute behind the source chamber's back
- stale selection should produce structured retry/reject outcomes rather than hidden host-side reroute
- layer rules still apply:
  - business may emit meta signals
  - business may not delegate or inquire into meta semantic tasks
  - meta may not delegate or inquire into business semantic tasks
  - generated actor-manager endpoints are the narrow allowed exception described below

### Actor first-touch residency

For actor-bound ingress with `sticky_actor_key`, first-touch residency assignment should be a host-owned local-authority transaction.

Recommended rules:

- if a ready residency owner already exists for `(actorObjectKey, actorKey)`, ingress goes there
- if no owner exists, the host selects an initial owner from the `ActorResidencyCapabilityGroup` using `deterministic_actor_key`
- the host creates `ActorResidencyResponsibility` in `hydrating`
- hydration support work is triggered through normal support-slice signals
- the target chamber installs local actor runtime state
- the host marks the responsibility `ready` only after the chamber reports readiness for the matching `assignmentEpoch`
- stale readiness signals must be ignored if the epoch no longer matches

### Delegation root model

Delegation should be understood as starting a normal local Cadenza execution graph at a target chamber, not as invoking one isolated task function.

Recommended rules:

- a delegation request identifies one root `targetKey`
- the selected chamber starts the local execution graph rooted at that target
- the final returned result is the final context of that delegated graph
- if any task in that delegated graph fails, the delegation result is the graph failure result
- target-side execution should therefore preserve ordinary local Cadenza semantics once the host has accepted the delegation request

### Delegation request and result boundary

The source-facing request shape should stay small and context-shaped:

```ts
type ChamberDelegationRequest = {
  delegationId: string;
  targetKey: string;
  selectedChamberKey: string;
  routeEpoch: number;
  projectionRevision: number;
  context: AnyObject;
  deadlineAt?: string;
  actorLocator?: {
    actorObjectKey: string;
    actorKey: string;
  };
  callerTrace?: {
    sourceExecutionId?: string;
    sourceTaskKey?: string;
    sourceIntentKey?: string;
  };
};
```

Recommended rules:

- the source chamber chooses `selectedChamberKey` locally from its projected target routes
- the host validates target legality, route epoch, ownership, and caller visibility before forwarding
- exact transport/security metadata should be injected by the host into reserved trusted ingress metadata rather than trusted from caller-authored context fields
- one absolute `deadlineAt` should govern the whole delegated execution; retries must consume the same budget rather than resetting timeout per hop

Internally, the host should still distinguish:

- request accepted but execution not yet started
- delegated execution graph started
- delegated execution graph completed

That started boundary is what makes retries safe or unsafe after failure.

The source-facing outcome should be explicit about whether target execution started:

```ts
type DelegationOutcome =
  | {
      kind: "fulfilled";
      result: AnyObject;
    }
  | {
      kind: "execution_failed";
      errorContext: AnyObject;
      executionStarted: true;
    }
  | {
      kind: "retryable_reject";
      executionStarted: false;
      reason:
        | "stale_route"
        | "owner_assigning"
        | "owner_hydrating"
        | "target_draining"
        | "target_reassigned";
      refreshRequired?: boolean;
      requiredProjectionRevision?: number;
      retryAfterMs?: number;
    }
  | {
      kind: "denied";
      executionStarted: false;
      reason:
        | "layer_violation"
        | "visibility_violation"
        | "unknown_target"
        | "caller_not_eligible"
        | "invalid_request";
      message?: string;
    }
  | {
      kind: "transport_failed";
      executionStarted: boolean;
      reason:
        | "timeout"
        | "host_shutdown"
        | "channel_failed"
        | "target_chamber_failed";
      retryAfterMs?: number;
      message?: string;
    };
```

Outcome meanings:

- `fulfilled` means the delegated graph completed successfully and returned its final context
- `execution_failed` means the delegated graph started and failed semantically; `errorContext` should align with ordinary Cadenza graph failure context
- `retryable_reject` means the host rejected the request before target execution started, so retry is safe within the same overall deadline
- `denied` means a structural, policy, or visibility rule failed and blind retry is not appropriate
- `transport_failed` means the host or channel failed operationally; retry safety depends on `executionStarted`

Retryable rejection reasons should be narrow:

- `stale_route` means the caller's projected route choice is no longer legal; this generally sets `refreshRequired`
- `owner_assigning` means a singular owner is needed but no ready owner exists yet and assignment has started or is about to start
- `owner_hydrating` means an owner has been chosen but its local state is not ready
- `target_reassigned` means an exact ready owner exists and differs from the caller-selected chamber; this generally sets `refreshRequired`
- `target_draining` means the selected chamber was valid in principle but is now draining and no more specific reassignment reason applies

Host validation should return structural denials before retryable routing reasons. For otherwise valid requests, host decision precedence should be:

1. `target_reassigned`
2. `owner_hydrating`
3. `owner_assigning`
4. `target_draining`
5. `stale_route`

The host-side state model should stay simple:

- chamber service state is `starting`, `ready`, `draining`, `failed`, or `stopped`
- direct candidate route groups carry a candidate set, selection mode, and `routeEpoch`
- actor-owner targets carry singular-owner state: `unassigned`, `assigning`, `hydrating(target)`, `ready(owner)`, or `handoff_hydrating(oldOwner, newOwner)`

Direct-candidate delegation rules:

- selected chamber not in the current candidate set returns `stale_route`
- selected chamber still conceptually valid but draining returns `target_draining`
- selected ready member is accepted

Actor-owner delegation rules:

- `unassigned` moves to `assigning` on the first qualifying request and returns `owner_assigning`
- `assigning` moves toward `hydrating(target)` once an owner is chosen and returns `owner_hydrating`
- `hydrating(target)` returns `owner_hydrating` until the target is ready
- `ready(owner)` accepts that owner and returns `target_reassigned` for a different selected chamber
- `handoff_hydrating(oldOwner, newOwner)` returns `target_draining` for the old owner and `owner_hydrating` for the new owner until handoff completes
- after handoff completes, `ready(newOwner)` accepts the new owner and returns `target_reassigned` for the old owner

Internally, target chambers should report started and completed boundaries separately:

```ts
type ChamberDelegationStarted = {
  delegationId: string;
  targetChamberKey: string;
  targetKey: string;
  targetExecutionId: string;
  startedAt: string;
};

type ChamberDelegationCompleted =
  | {
      delegationId: string;
      targetChamberKey: string;
      targetExecutionId: string;
      completedAt: string;
      outcome: "fulfilled";
      resultContext: AnyObject;
    }
  | {
      delegationId: string;
      targetChamberKey: string;
      targetExecutionId: string;
      completedAt: string;
      outcome: "execution_failed";
      errorContext: AnyObject;
    };
```

Recommended internal rules:

- the host only accepts completion for a matching prior started boundary
- `delegation_started` is internal host/chamber state, not a source-facing primitive event
- the source-facing `ProxyTask` receives only the final `DelegationOutcome`
- source-facing retry safety depends on whether the started boundary occurred

Timeout and deadline rules:

- the source owns one absolute `deadlineAt` for the whole delegated operation, including retry attempts
- the host checks remaining budget before forwarding
- timeout before start returns `transport_failed` with `executionStarted: false` and `reason: "timeout"`
- timeout inside the started target graph returns `execution_failed` with `executionStarted: true` and a timeout failure context
- channel or chamber failure after start but before completion returns `transport_failed` with `executionStarted: true`
- target runtime receives the remaining budget, not a fresh timeout

Together, these rules keep first-touch residency deterministic, delegated execution Cadenza-shaped, and retries explicit instead of hidden behind host-side rerouting.

Refresh triggers should include:

- execution ABI revision changes
- security-policy or capability-broker revision changes
- provider-set changes that invalidate the current chamber image
- repeated faults or hard resource-limit trips
- suspicious behavior or explicit operator recycle

Recommended refresh behavior:

- start a compatible successor chamber first when capacity allows
- publish new authority state and successor ingress epoch
- then mark the predecessor `draining`
- stop the predecessor only after executions finish or their cancellation budget expires

This keeps chamber lifecycle compatible with the broader security posture:

- chambers are warm enough to avoid unnecessary latency
- but still disposable enough that the host can treat them as replaceable security boundaries rather than as precious long-lived runtimes

### Governed v1 capability registry

Cell capabilities should come from a small governed registry rather than arbitrary free-form strings.

Recommended high-level contract:

```ts
type RuntimeCapabilityDefinition = {
  key: RuntimeCapabilityKey;
  description: string;
  minimumProfile: "mediated" | "privileged";
  allowedModes: Array<"use" | "admin">;
};
```

Recommended v1 registry:

- `authority_access`
  - privileged access to official authority-facing persistence and query surfaces
  - `admin` covers schema/bootstrap or other authority-control operations
- `filesystem`
  - mediated local file access
- `subprocess`
  - mediated execution of approved local tools or child processes
- `network_client`
  - mediated outbound network access
- `network_server`
  - mediated or privileged listener/transport hosting surface
- `package_runtime`
  - mediated access to approved cell-installed package-backed adapters or libraries
- `secret_access`
  - mediated secret/material access
- `cell_control`
  - privileged cell lifecycle, runtime reset, or substrate control operations

This is the intended v1 sweet spot:

- small enough to stay governable and reviewable
- broad enough to avoid immediate ad hoc escape hatches
- coarse at the key level, with finer scope policies deferred to later capability-specific contracts

Scope rule for v1:

- `RuntimeCapabilityRequirement` should not carry a generic `scope` field in v1
- capability-specific implementations may still enforce narrower internal rules, but that should not be modeled as one shared generic contract yet
- if finer-grained scoping proves necessary later, it should be added deliberately after real capability implementations expose a stable pattern

Important rules:

- unknown capability keys should fail validation or materialization
- v1 should not split immediately into very fine-grained keys like `filesystem_read`, `filesystem_write`, `http_client`, `ws_client`, and similar variants
- `use` versus `admin` should carry the first level of privilege distinction, with finer-grained scoping deferred
- the capability registry should be seeded and governed by the environment layer, not invented ad hoc by runtime code
- `cell_control` should remain a privileged-only capability in v1
- `authority_access` should remain mounted only inside the privileged authority-access slice in v1
- capabilities such as `filesystem`, `subprocess`, `network_client`, `network_server`, `package_runtime`, and `secret_access` may be used from `mediated` surfaces, but their narrower sensitive behaviors should still be enforced by capability-specific implementations
- omitted requirement or grant modes should default to `use`
- a granted `admin` mode should satisfy a `use` requirement for the same capability key

### Authority access boundary

`authority_access` should be treated as a special capability rather than as a broadly usable mediated host power.

Recommended v1 rules:

- the cell should bootstrap one privileged authority-access slice through an explicit static bootstrap call from the trusted cell code
- that slice should be the only slice mounted with the `authority_access` capability
- other business, meta-support, and privileged slices should perform authority reads and writes by calling well-thought-out authority tasks exposed by that slice rather than by mounting direct `authority_access` themselves
- the authority-access slice should be narrow, seeded, and strongly audited
- broad generic CRUD exposure should not be the root authority substrate

This is intentionally sharper than the earlier PostgresActor-centered direction:

- authority access should not depend on a bootstrap authority `PostgresActor`
- the authority `PostgresActor` chicken-and-egg path should disappear from the root authority model
- `PostgresActor` remains useful as a higher-level expansion convention, but not as the foundational gateway to the environment authority

### Current-to-target database picture

The authority gateway should be designed against the full database picture rather than against one convention such as `PostgresActor`.

The current `cadenza-db` schema groups into these concept domains:

- service and distribution registry
  - `service`
  - `service_instance`
  - `service_instance_transport`
  - `service_instance_lease`
  - `service_manifest`
- graph primitive metadata
  - `task`
  - `routine`
  - `signal_registry`
  - `intent_registry`
  - `task_to_task_map`
  - `signal_to_task_map`
  - `intent_to_task_map`
- actor metadata and durable state
  - `actor`
  - `actor_task_map`
  - `actor_session_state`
- tool structure and dependency closure
  - `helper`
  - `global_registry`
  - `task_to_helper_map`
  - `helper_to_helper_map`
  - `task_to_global_map`
  - `helper_to_global_map`
  - `task_tool_dependency_snapshot`
  - `helper_tool_dependency_snapshot`
- execution evidence
  - `trace`
  - `routine_execution`
  - `task_execution`
  - `task_execution_map`
  - `signal_emission`

Those current domains imply five real end goals:

1. semantic graph authority
   - what the system is
2. operational runtime authority
   - where it is currently placed, projected, and routed
3. shared support definition authority
   - helpers, globals, actor support state, generated bundles
4. runtime evidence authority
   - executions, emissions, audits, and other history
5. bootstrap and repair authority
   - the narrow privileged substrate that can initialize or recover the rest

The 4.0 additions and transformations reorganize those goals around a new authority center:

- graph identity and semantic versions
  - `object_registry`
  - primitive version tables
  - current pointers
  - version marks and pointer history
- governed tags and policy
  - tag registry/category tables
  - direct tag assignment history
  - effective tag projections
  - policy and tag-policy rule tables
- executable semantics and support structure
  - task definitions and wiring
  - actor definitions and actor-task bindings
  - helper/global definitions
  - soft-usage and dependency projections
- placement and routing control plane
  - cells
  - cell transport and trust/capability claims
  - placement units, memberships, replicas, residencies
  - route members and reconciliation state
- generated bundle control plane
  - expansion bundles
  - expansion bundle members
  - generated provenance
- bridge and demand state
  - route-member projections
  - demand members
  - unresolved-demand markers
- runtime evidence and audits
  - executions
  - emissions
  - policy audits
  - capability audit events

This gives a clearer transformation map from current schema to target schema:

- current service/distribution tables mostly evolve into cell, placement, route, and residency authority
- current task/routine/signal/intent tables mostly evolve into object/version authority plus executable projections
- current actor tables stay conceptually important, but actor definition, task binding, and durable backing become cleaner and less service-centered
- current helper/global tables and dependency snapshots stay conceptually important, but should become authority-native support-definition and closure projections rather than service-manifest appendages
- current execution telemetry tables remain conceptually valid as runtime evidence, even though the surrounding placement and runtime vocabulary changes

This matters directly for the authority gateway:

- the gateway should not be optimized around current table names
- it should be optimized around these end-goal domains
- some calls should target semantic graph authority
- some should target runtime/control-plane projections
- some should target evidence ingestion
- some should remain bootstrap or repair only

Important 4.0 clarification:

- routine-related tables and telemetry in the current `cadenza-db` schema are historical current-state inputs to the migration picture
- routines do not survive into 4.0 as an executable primitive
- future executable identity, execution semantics, and transport contracts should be task-based only

That is the main reason the gateway surface should be task-shaped and domain-shaped rather than a generic CRUD tunnel.

### Authority-access slice contract

The privileged authority-access slice should be a gateway, not a disguised raw database tunnel.

The slice should therefore separate:

- direct capability-bearing tasks inside the slice
- exported authority tasks and intents that the rest of the environment is allowed to call

Recommended high-level contract:

```ts
type AuthorityTaskClass =
  | "graph_query"
  | "graph_command"
  | "projection_command"
  | "bootstrap_admin"
  | "repair_admin";
```

Recommended task families:

- `graph_query`
  - read object, version, mark, tag, policy, and related authority state through explicit structured queries
- `graph_command`
  - create logical objects
  - write new semantic versions
  - move current pointers
  - assign or revoke governed tags
  - persist other first-class graph mutations
- `projection_command`
  - upsert or replace authority-owned derived projections and read models
  - intended for route maps, relationship projections, and similar deterministic authority-derived state
- `bootstrap_admin`
  - schema bootstrap, migration, initial seed, trust bootstrap, and other foundational bring-up operations
- `repair_admin`
  - narrowly scoped repair and recovery actions for privileged operators and trusted control flows

Recommended non-goals:

- no arbitrary SQL execution surface
- no generic table-by-table CRUD tunnel as the root authority API
- no direct provider mounting outside this slice
- no assumption that every authority concern must be expressed through one broad generalized command shape

Recommended v1 rules:

- the exported authority surface should be explicit and task-shaped, not a raw query protocol
- graph mutations should be expressed as domainful authority tasks wherever possible
- projection writers should stay separate from semantic graph commands even if they share the same privileged slice
- bootstrap and repair operations should remain narrower and more strongly audited than ordinary graph commands
- the slice should be small enough to review as a trusted subsystem rather than as a generic persistence layer

This keeps the gateway honest:

- the slice owns direct authority access
- the rest of the environment owns calling it through explicit contracts
- higher-level conventions such as `PostgresActor` can still generate useful public surfaces, but they no longer define the root authority API

### Security profile semantics

`pure`

- executable code only receives the normal primitive runtime surfaces such as `ctx`, `emit`, `inquire`, actor access, helpers, and globals
- no host capabilities are required
- no filesystem, network, subprocess, package, or direct authority access is implied

`mediated`

- executable code may use one or more named cell capabilities
- those capabilities must be explicitly declared in `capabilities`
- host access is brokered through those capabilities rather than ambient runtime globals
- in v1 this does not include direct `authority_access`, which remains reserved for the privileged authority-access slice

`privileged`

- executable code is trusted control-plane or substrate logic
- it may require privileged cell capabilities
- it should be reserved for seeded meta slices, authority coordination, bootstrap, and other explicitly trusted environment-owned logic

### Privileged boundary

`privileged` should not mean "general superuser execution."

In 4.0 it should mean:

- trusted environment-owned control-plane or substrate logic
- logic that can influence bootstrap, trust establishment, authority administration, secret administration, cell lifecycle, or other foundational runtime control
- logic whose provenance and review path are stronger than ordinary business or agent-authored executable surfaces

Typical v1 examples:

- bootstrap substrate flows
- stem-cell and related cell-control flows
- singleton expansion-control and bundle-reconciliation flows
- authority bootstrap, repair, or migration-control paths
- secret/bootstrap trust-administration paths

Typical non-examples:

- ordinary business tasks
- user-authored or agent-authored workflow tasks
- generated CRUD tasks from `PostgresActor`
- ordinary helper functions
- legacy routine-style local orchestration or query flows

Those should remain `pure` or `mediated`.

Recommended v1 rules:

- `privileged` should be reserved for seeded environment-owned slices and explicitly trusted system-managed logic
- normal human or agent authoring should default to `pure` or `mediated`, not `privileged`
- privileged executable surfaces should require explicit trusted placement and capability matching before materialization
- privileged provenance and audit should be stricter than for ordinary executable surfaces
- unknown or weakly governed generated surfaces should not be allowed to escalate themselves into `privileged`

One important clarification:

- `privileged` is not the same thing as "system-owned"
- some seeded environment-owned slices should still be only `mediated`
- the profile answers what kind of host power the executable surface may exercise, not merely who owns it

### Seeded-slice pressure test

The current seeded and planned slices fit the model if they are classified like this:

- socket and REST listener slices
  - `mediated`
  - capabilities: `network_server` with `use`
- agent-facing API orchestration slices
  - usually `pure` or `mediated`
  - when they need authority reads or writes, they should route through the privileged authority-access slice rather than mounting `authority_access` directly
- authority-access slice
  - `privileged`
  - capabilities: `authority_access` with `use` or `admin`
  - this should be the only slice mounted with direct authority access
- execution persistence and runtime-observability writers
  - usually `pure` or narrowly `mediated`
  - authority persistence should flow through the privileged authority-access slice
- route-map, relationship, and similar deterministic authority projectors
  - usually `pure` or narrowly `mediated`
  - authority reconciliation should flow through the privileged authority-access slice rather than through direct `authority_access`
- deputy and signal-transmission support flows
  - `mediated`
  - capabilities: `network_client` with `use`
- stem-cell reconciliation and cell-lifecycle control
  - `privileged`
  - capabilities: `cell_control` with `admin`
  - authority state mutation should still route through the privileged authority-access slice
- expansion-control and managed-bundle reconciliation
  - `privileged`
  - authority writes should flow through the privileged authority-access slice
- authority bootstrap, repair, and migration-control paths
  - should live inside or directly depend on the privileged authority-access slice
  - no separate slice should mount `authority_access` directly in v1
- generated `PostgresActor` CRUD tasks
  - should not become `privileged` merely because their backing actor support is powerful
  - they may remain `pure` or `mediated` depending on whether the executable surface itself directly declares host capabilities
  - they should not be treated as the root authority substrate

This pressure test suggests the model is coherent:

- business and public executable surfaces can stay low-privilege
- direct environment authority access stays concentrated in one privileged gateway slice
- other support slices can remain narrower and route through that gateway when they need authority mutation or query
- `privileged` remains narrow enough to stay reviewable

### Capability matching and trusted placement

Security declarations should constrain both placement eligibility and runtime materialization.

Recommended derived authority-side projection:

```ts
type PlacementUnitExecutionRequirement = {
  unitKey: string;
  requiredCapabilities: RuntimeCapabilityRequirement[];
  requiresTrustedCell: boolean;
};
```

This should be derived from the executable members assigned to the unit and the hard executable dependencies reachable from them:

- `pure` members contribute no host requirements unless a hard dependency raises the effective requirement
- `mediated` members contribute their effective capability requirements
- `privileged` members contribute their effective capability requirements and set `requiresTrustedCell = true`
- helper dependencies and required executable support capabilities participate in this aggregation
- soft usage summaries and loose-end observations do not participate in placement eligibility until they become hard executable dependencies

Recommended matching rules:

- a placement unit is eligible for a cell only if the cell satisfies every required capability key and mode
- `admin` on the cell satisfies both `admin` and `use`; `use` satisfies only `use`
- a placement unit that contains any `privileged` executable surface requires a trusted cell
- capability or trust mismatches should make the unit ineligible for assignment rather than silently downgraded
- the materializer should refuse to materialize executable surfaces whose declared requirements are not satisfied by the hosting cell

This keeps the security declaration operationally meaningful instead of turning it into review-only metadata.

Important rules:

- primitive code should never receive ambient `require`, `process`, shell, filesystem, or raw network access
- npm packages and Node tools should only be reachable through named mediated capabilities
- the cell should enforce capability mediation; core should not know the secure VM implementation details
- placement and materialization should be able to reason about required capabilities from these declarations

### V1 security base

The execution boundary is only one part of the v1 security base.

Cadenza should provide a small mandatory security kernel plus governed extension points. Plugins may provide proofs, policy inputs, capability providers, secret providers, audit sinks, and business behavior, but they may not bypass the kernel's enforcement boundaries.

Kernel-owned boundaries:

- authenticated identity normalization
- trusted execution and distributed identity envelopes
- authorization decision composition
- capability broker enforcement
- secret broker enforcement
- authority gateway enforcement
- placement and materialization checks
- audit and evidence capture
- plugin trust and activation lifecycle

Security extension points should remain constrained and explicit. Provider plugins may extend how identity is proven, how secrets are backed, how audit is exported, how risk is scored, or how capabilities are implemented. The final enforcement point remains Cadenza-owned.

Security and management orchestration should follow the same core principle as the rest of Cadenza:

```text
Cadenza extends Cadenza.
```

Wherever possible, security and management behavior should be implemented as Cadenza primitive flows:

- risk signals emit Cadenza signals
- policy decisions run through seeded tasks
- authority mutations go through authority gateway tasks
- stem-cell reconciliation reacts to authority state
- plugin activation and revocation are managed graph transitions
- secret rotation and containment produce evidence and signals
- recovery and repair use trusted-control flows

The exception is the minimal static or substrate code required before Cadenza can safely run: static bootstrap, the cell host, secure chamber substrate, capability and secret brokers, transport verification, and hard local enforcement. Those substrate pieces should enforce boundaries, not become a parallel management product.

### Trust bootstrap

Trust bootstrap should be intentionally small and static. Runtime expansion starts after trust bootstrap; runtime expansion does not create trust bootstrap.

Implementation boundary clarification:

- the initial environment-bootstrap package seeds only environment identity, public trust-root state, first trusted-cell enrollment, the governed capability registry, minimal authority records, all eight canonical authority-flow declarations, one activation policy, and the authority-access slice handoff.
- it stops at `handoff_ready` and does not materialize or execute the seeded slice.
- general identity/session providers, plugin controllers, secret and audit providers, stem-cell reconciliation, agents, placement, and broader V1 security slices remain post-bootstrap work even where this proposal describes their eventual contracts.

Recommended bootstrap flow:

```text
static trusted bootstrap code
-> creates environment trust root
-> starts first trusted cell
-> seeds minimal authority/security kernel
-> activates controlled meta slices
-> then allows plugin and runtime expansion
```

Recommended trust-root shape:

```ts
type EnvironmentTrustRoot = {
  environmentKey: string;
  rootKeyId: string;
  createdAt: string;
  trustRootVersion: number;
  status: "active" | "rotating" | "revoked";
};

type CellEnrollment = {
  cellKey: string;
  environmentKey: string;
  trustProfile: "trusted_control";
  enrolledBy: "static_bootstrap";
  cellPublicKeyRef: string;
  status: "active";
  enrolledAt: string;
};
```

Bootstrap rules:

- the environment trust root is created by static environment bootstrap code, not by a Cadenza task
- the first trusted cell is enrolled by static bootstrap under that environment trust root
- the first trusted cell may host the authority-access slice, identity resolver baseline, policy evaluator baseline, secret broker baseline, audit/evidence baseline, plugin activation controller, and cell enrollment controller
- arbitrary marketplace, private-registry, or business plugins should not run during initial bootstrap
- bundled bootstrap providers may be activated only when they are pinned and verified as static bootstrap seed material
- plugins cannot activate themselves
- plugins cannot define the policy that authorizes their own activation unless a higher trusted bootstrap rule permits that exact seed

The minimal seeded kernel should include:

- authority gateway tasks
- identity and session authority state
- policy baseline
- tag registry baseline
- capability registry baseline
- secret metadata registry
- audit/evidence registry
- plugin registry and activation registry
- cell registry and enrollment registry

After bootstrap, new cells should enroll through controlled authority:

```text
new cell presents enrollment proof
-> trusted-control cell validates
-> authority records cell identity and trust profile
-> environment issues or records cell trust material
-> cell receives projection and starts assigned work
```

Cell trust profiles are assigned by authority policy. A cell cannot self-declare `trusted_control`.

Chamber trust stays local to the cell host:

- chambers do not get environment signing authority
- chambers do not enroll themselves
- chamber identity is host-local
- the host injects runtime principal metadata
- chamber compromise should not imply environment trust-root compromise

Recovery should remain first-class:

- rotate environment trust root
- revoke cell enrollment
- revoke cell keys
- suspend trusted-control cell
- start replacement trusted-control cell from static recovery material
- mark plugin activations stale
- recycle affected chambers
- record full evidence

Deferred bootstrap details:

- nested-environment bootstrap where a parent environment authorizes child environments
- delegated trust roots across environment trees
- cross-environment authority inheritance
- trust-root rotation across nested environments
- disaster recovery ceremonies and operator workflows

### Authentication and identity

Cadenza should own identity semantics. External providers only prove identity.

Recommended authority-native identity shape:

```ts
type SubjectKind = "human" | "agent" | "service" | "system";
type AssuranceLevel = "low" | "standard" | "strong";

type Subject = {
  subjectKey: string;
  kind: SubjectKind;
  status: "active" | "suspended" | "revoked";
  displayName?: string;
  createdAt: string;
};

type ExternalIdentityBinding = {
  bindingKey: string;
  subjectKey: string;
  providerKey: string;
  issuer: string;
  externalSubject: string;
  status: "active" | "revoked";
  assuranceLevel: AssuranceLevel;
  linkedAt: string;
};

type AuthSession = {
  sessionKey: string;
  subjectKey: string;
  bindingKey?: string;
  kind: "interactive" | "api" | "agent" | "system";
  assuranceLevel: AssuranceLevel;
  authenticatedAt: string;
  expiresAt: string;
  revokedAt?: string;
};
```

Important identity rules:

- a subject should never be identified by email; email is a contact claim, not identity
- the stable external identity tuple is `providerKey + issuer + externalSubject`
- Cadenza-native authentication is one provider adapter, not a bypass path
- provider tokens and refresh tokens should not enter normal business chambers by default
- account linking across providers is high-risk authority work and must be explicit and audited

Provider adapters should verify external proof and emit normalized assertions:

```ts
type AuthProviderKind =
  | "oidc"
  | "oauth2"
  | "saml"
  | "api_key"
  | "native"
  | "custom";

type AuthProviderAdapter = {
  providerKey: string;
  kind: AuthProviderKind;
  verifies: "token" | "redirect_callback" | "signed_assertion";
};

type VerifiedAuthAssertion = {
  providerKey: string;
  issuer: string;
  externalSubject: string;
  claims: Record<string, unknown>;
  assuranceLevel: AssuranceLevel;
  expiresAt?: string;
};
```

Provider adapters must not:

- create permissions
- assign roles
- authorize tasks
- directly grant privileged access
- inject trusted execution metadata
- let raw provider claims become authority automatically

The authentication flow should be:

```text
external proof
-> provider adapter verifies proof
-> VerifiedAuthAssertion
-> Cadenza identity resolver
-> Subject + AuthSession
-> ingress host injects trusted execution identity
-> authorization evaluates Cadenza policy
```

### Trusted execution identity

Every execution should separate the subject that caused work from the runtime carrying it.

```ts
type SubjectRef = {
  subjectKey: string;
  kind: SubjectKind;
};

type CellTrustProfile =
  | "edge_ingress"
  | "standard_runtime"
  | "sensitive_runtime"
  | "trusted_control";

type RuntimePrincipal = {
  cellKey: string;
  chamberKey?: string;
  lane?: "business" | "meta_support" | "trusted_control";
  taskKey?: string;
  trustProfile: CellTrustProfile;
};

type TrustedExecutionIdentity = {
  initiatingSubject: SubjectRef;
  runtimePrincipal: RuntimePrincipal;
  authSessionKey?: string;
  assuranceLevel: AssuranceLevel;
};
```

Important rules:

- user-authored context cannot set `initiatingSubject`, `runtimePrincipal`, permissions, trust profile, or delegated authority
- trusted execution identity is injected by the ingress host or current trusted host boundary
- cells and chambers are runtime principals, not normal human or service subjects
- trusting a runtime principal does not imply trusting the initiating subject

### Distributed execution envelope

Inter-cell signals, delegations, and inquiries should carry a trusted outer envelope around the normal Cadenza context.

```ts
type SensitivityLevel = "public" | "internal" | "sensitive" | "control";

type DistributedTarget = {
  targetKind: "signal" | "delegation" | "inquire";
  targetKey: string;
  targetCellKey?: string;
};

type DelegatedAuthority = {
  allowedTargetKeys: string[];
  allowedIntents?: string[];
  capabilityUse?: RuntimeCapabilityRequirement[];
  maxSensitivity: SensitivityLevel;
  expiresAt: string;
};

type DelegationHop = {
  source: RuntimePrincipal;
  target: RuntimePrincipal;
  targetKey: string;
  issuedAt: string;
};

type DistributedExecutionEnvelope = {
  envelopeKey: string;
  environmentKey: string;
  source: RuntimePrincipal;
  target: DistributedTarget;
  identity: {
    initiatingSubject: SubjectRef;
    authSessionKey?: string;
    assuranceLevel: AssuranceLevel;
  };
  authority: DelegatedAuthority;
  trace: {
    rootExecutionId: string;
    parentExecutionId?: string;
    correlationKey: string;
    delegationChain: DelegationHop[];
  };
  constraints: {
    deadlineAt?: string;
    maxSensitivity: SensitivityLevel;
  };
  integrity: {
    issuedBy: RuntimePrincipal;
    issuedAt: string;
    expiresAt: string;
    envelopeRevision: number;
  };
  context: AnyObject;
};
```

Distributed security rules:

- the envelope is host-authored, host-verified, and host-consumed
- business context may carry payload, but it cannot make security claims
- ordinary hops may narrow delegated authority, never widen it
- widening requires a privileged authority or control task that explicitly checks policy and records evidence
- a receiving cell validates the envelope before a chamber sees the request

Target validation should check:

- source cell is known and currently trusted
- envelope integrity is valid
- envelope is not expired
- target is hosted or routable by the receiving cell
- target key is allowed by delegated authority
- target sensitivity is within `maxSensitivity`
- initiating subject has sufficient assurance level
- source runtime trust profile is acceptable for the target sensitivity
- business/meta/trusted-control layer rules are respected
- required capability use is allowed
- context passes shape and size limits

### Authorization spine

Tags are the graph-native selector layer for authorization, but tags are not permissions by themselves. Tags classify subjects and resources; policy interprets the tag relationships.

The authorization model should stay allow-only and default-deny:

```text
subject identity
+ subject effective tags
+ runtime principal
+ resource effective tags
+ object type and lifecycle
+ action
+ execution mode
+ delegated authority
+ capability or secret context
= authorization decision
```

Recommended action set:

```ts
type EnvironmentAccessMode =
  | "development"
  | "simulation"
  | "staging"
  | "production";

type AuthorizationAction =
  | "read"
  | "write"
  | "run_simulation"
  | "execute"
  | "materialize"
  | "assign_tag"
  | "remove_tag"
  | "create_tag"
  | "use_capability"
  | "access_secret"
  | "mint_delegation"
  | "authority_gateway";

type ExecutionModeContext = {
  mode: EnvironmentAccessMode;
  developmentLayer?: "business" | "meta_plugin" | "trusted_control";
  branchKey?: string;
  stateClass: "synthetic" | "anonymized" | "staging" | "production";
  sideEffectClass: "none" | "simulated" | "controlled" | "live";
};

type AuthorizationRequest = {
  requestKey: string;
  environmentKey: string;
  action: AuthorizationAction;
  subject: SubjectRef;
  runtimePrincipal?: RuntimePrincipal;
  resource?: {
    objectKey: string;
    objectType: string;
    lifecycleState?: string;
    effectiveTagRevision: number;
  };
  distributedEnvelope?: DistributedExecutionEnvelope;
  requestedAuthority?: DelegatedAuthority;
  executionMode: ExecutionModeContext;
  securityContext: {
    assuranceLevel: AssuranceLevel;
    targetSensitivity: SensitivityLevel;
    executionLane?: "business" | "meta_support" | "trusted_control";
  };
};

type AuthorizationDecision = {
  decisionKey: string;
  result: "allow" | "deny";
  reason:
    | "matched_policy"
    | "no_matching_policy"
    | "subject_revoked"
    | "resource_revoked"
    | "insufficient_assurance"
    | "runtime_not_trusted"
    | "delegated_authority_too_wide"
    | "target_not_allowed"
    | "capability_not_granted"
    | "secret_not_granted"
    | "tag_management_denied"
    | "layer_violation";
  matchedPolicyKeys: string[];
  usedFacts: {
    subjectEffectiveTagRevision?: number;
    resourceEffectiveTagRevision?: number;
    envelopeKey?: string;
    authSessionKey?: string;
  };
  grant?: AuthorityGrantContext;
  delegatedAuthority?: DelegatedAuthority;
  obligations: AuthorizationObligation[];
  evidence: {
    level: "none" | "summary" | "full";
    policyDecisionAuditKey?: string;
  };
  expiresAt?: string;
};

type AuthorizationObligation =
  | { kind: "record_evidence"; level: "summary" | "full" }
  | { kind: "cap_deadline"; deadlineAt: string }
  | { kind: "require_projection_revision"; revision: number }
  | { kind: "strip_context_fields"; fields: string[] }
  | { kind: "require_strong_assurance" };
```

Authorization must be enforced at real boundaries:

- graph read
- graph write
- tag mutation
- production execute
- simulation execute
- inter-cell receive
- delegated authority minting
- materialization
- capability use
- secret access
- authority gateway access

Public boundary tasks and hosts should authorize, then mint a narrow runtime grant or delegated authority. Internal tasks should require compatible inherited authority and should not self-authorize.

### Development, simulation, staging, and production separation

Developer authority over graph structure must not imply production authority over live execution or live state.

Recommended mode meanings:

- `development` is for graph authoring, candidate versions, allowed tag assignment, and generated artifact inspection
- `simulation` is production-like execution with non-production consequences over synthetic, anonymized, or branch-local state
- `staging` is production-like execution over controlled pre-production state
- `production` is execution against live state, live users, real external effects, real secrets, and real authority

Hard separation rules:

- `write` in development does not imply `execute` in production
- `run_simulation` does not imply `execute` in production
- graph definition `read` does not imply live actor-state `read`
- generated artifact `read` does not imply `materialize`
- descriptive or domain tag assignment does not imply ownership, placement, or security tag assignment
- `materialize` authority is distinct from `execute`
- `use_capability` and `access_secret` are distinct from `execute`
- production decisions must be explicit; no fallback from development policies

Development should also split by layer:

- `business` development is the default authoring path for business graph objects
- `meta_plugin` development is special authorization for Cadenza plugins, support slices, adapters, reconcilers, and generated-bundle planners
- `trusted_control` development is rare authorization for authority gateway, bootstrap, repair, security policy internals, and privileged substrate logic

Business development authority must not imply meta-plugin development authority. Meta-plugin development authority must not imply trusted-control development authority.

### Plugin trust and activation

Plugins should be authority-managed object graphs with explicit trust and activation, not package installs with implicit power.

Recommended lifecycle:

```text
plugin package
-> imported candidate graph
-> review and policy evaluation
-> approved plugin installation
-> activated runtime slices
-> monitored execution
-> upgrade, suspend, revoke, or remove
```

Recommended plugin identity:

```ts
type PluginClass =
  | "business"
  | "meta_support"
  | "security_provider"
  | "capability_provider"
  | "trusted_control_extension";

type PluginProvenance = {
  source:
    | "marketplace"
    | "private_registry"
    | "local_development"
    | "enterprise_internal";
  signedBy?: string[];
  sourceRepository?: string;
  buildAttestation?: string;
  sbomKey?: string;
};

type PluginIdentity = {
  pluginKey: string;
  publisherKey: string;
  packageKey: string;
  version: string;
  provenance: PluginProvenance;
};

type PluginManifest = {
  pluginKey: string;
  name: string;
  class: PluginClass;
  version: string;
  exports: {
    primitives: string[];
    securityExtensionPoints?: string[];
    capabilityProviders?: string[];
    authorityTasks?: string[];
  };
  requirements: {
    capabilities: RuntimeCapabilityRequirement[];
    secrets?: string[];
    trustProfile?: CellTrustProfile;
    lanes: Array<"business" | "meta_support" | "trusted_control">;
    minAssuranceForActivation?: AssuranceLevel;
  };
  policyTemplates?: string[];
  defaultTags: string[];
  provenance: PluginProvenance;
};
```

Install and activate are separate:

- install imports inactive candidate objects, records provenance, validates manifest shape, computes requirements, and creates no runtime authority
- activate evaluates environment policy, approves an exact version, grants specific capabilities and secrets, assigns governed tags, creates placement/materialization eligibility, activates exported primitives or extension points, and records evidence

Security extension points should be explicit:

```ts
type SecurityExtensionPoint =
  | "auth_provider"
  | "policy_evaluator"
  | "secret_provider"
  | "audit_sink"
  | "supply_chain_verifier"
  | "risk_signal_provider";
```

Important plugin rules:

- installed does not mean active
- active does not mean globally trusted
- trusted for one extension point does not mean trusted for another
- plugins may provide proofs, policies, capabilities, projections, adapters, or agents
- plugins may not grant themselves authority
- marketplace plugins are candidate graphs until an environment activates them
- enterprise plugins use the same lifecycle with enterprise provenance and policy

Runtime should carry activation context:

```ts
type ActivePluginRuntimeContext = {
  pluginKey: string;
  version: string;
  activationKey: string;
  class: PluginClass;
  allowedExtensionPoints: SecurityExtensionPoint[];
  grantedCapabilities: RuntimeCapabilityRequirement[];
  grantedSecrets: string[];
  lane: "business" | "meta_support" | "trusted_control";
};
```

Revocation should be first-class:

- suspend activation
- stop new executions
- drain or cancel active executions depending on risk
- revoke capability mounts
- revoke secret access
- invalidate generated projections if needed
- mark exported primitives unavailable
- record evidence
- optionally roll back to a previous approved version

Agent plugins should fit this same model. Installing an agent plugin should declare its skills, tools, memory/state needs, exported primitives, and required authority, but should not grant ambient access.

### Supply-chain and materialization trust

Supply-chain trust should answer one question: how a cell knows that the executable graph, plugin package, dependencies, and chamber image it materializes are exactly the authority-approved inputs.

Main rule:

```text
A cell should never materialize code just because it can fetch it.
It materializes only authority-approved, provenance-checked inputs.
```

Supply-chain trust should cover three layers:

```text
source/package provenance
-> authority-approved graph objects
-> materialized runtime image
```

Recommended provenance shape:

```ts
type ArtifactProvenance = {
  source:
    | "core"
    | "marketplace"
    | "private_registry"
    | "local_development"
    | "enterprise_internal";
  publisherKey?: string;
  sourceRepository?: string;
  commitSha?: string;
  packageDigest?: string;
  signatureRefs?: string[];
  buildAttestationRef?: string;
  sbomRef?: string;
};

type ApprovedArtifact = {
  artifactKey: string;
  artifactKind:
    | "plugin"
    | "package"
    | "helper_bundle"
    | "runtime_image";
  version: string;
  digest: string;
  provenance: ArtifactProvenance;
  approvedFor: {
    environments?: string[];
    pluginActivations?: string[];
    lanes?: Array<"business" | "meta_support" | "trusted_control">;
    trustProfiles?: CellTrustProfile[];
  };
  status: "candidate" | "approved" | "revoked";
};
```

Important rules:

- signed does not mean approved
- approved does not mean approved for every lane
- marketplace provenance does not imply environment trust
- local development artifacts are allowed only in `development` and `simulation` unless explicitly promoted and approved

Every executable slice should have a resolved dependency set:

```ts
type ResolvedDependencySet = {
  dependencySetKey: string;
  rootObjectKey: string;
  dependencies: Array<{
    packageName: string;
    version: string;
    digest: string;
    source: string;
    license?: string;
    vulnerabilityStatus?: "unknown" | "allowed" | "blocked";
  }>;
  lockDigest: string;
};
```

Materialization should reject:

- floating versions
- missing digests
- unapproved sources
- dependency drift from the approved lock digest
- revoked artifacts
- package sets blocked by policy

Runtime images are derived artifacts:

```ts
type RuntimeImageAttestation = {
  imageRevision: string;
  sourceGraphRevision: string;
  dependencySetKey: string;
  materializerVersion: string;
  buildDigest: string;
  builtBy: RuntimePrincipal;
  builtAt: string;
};
```

A cell should only activate a runtime image when:

- source graph revision matches authority projection
- dependency set is approved
- materializer version is approved
- image digest matches attestation
- lane and trust-profile policy allow it
- no dependency or plugin activation has been revoked

This makes `imageRevision` a security boundary, not only a cache key.

Responsibility split:

- authority records approved artifacts, plugin activations, dependency sets, runtime image attestations, revocation state, materialization eligibility, and evidence
- stem-cell verifies provenance, resolves dependency sets, enforces source-registry policy, computes approved lock digests, produces or approves runtime image attestations, publishes materialization projections, detects stale or revoked artifacts, and coordinates rollout or rollback
- cell host verifies projections, expected digests, image revision and epoch, dependency approval, capability matching, plugin activation state, and revocation state before materializing or activating locally

Useful mental model:

```text
Stem-cell decides what should run.
Cell host decides whether it is safe to run here.
Authority records why that decision is valid.
```

Revocation should fan out:

```text
artifact revoked
-> dependent plugin activations become stale or suspended
-> dependency sets become invalid
-> runtime images become invalid
-> chambers running those images drain or stop
-> materialization rejects future use
-> evidence recorded
```

The v1 sweet spot is:

- exact versions
- package or artifact digests
- lock digests
- approved source registries
- plugin manifest provenance
- runtime image attestation
- revocation propagation
- stronger enterprise checks through policy and supply-chain verifier plugins

Deferred supply-chain details:

- exact attestation format
- registry protocol
- vulnerability policy
- SBOM schema
- signing and verification mechanics
- enterprise approval workflows

### Secrets and sensitive material

Secrets are brokered references, not ordinary context values.

Recommended secret model:

```ts
type SecretRef = {
  secretKey: string;
  environmentKey: string;
};

type SecretDefinition = {
  secretKey: string;
  name: string;
  class:
    | "api_key"
    | "oauth_client_secret"
    | "database_credential"
    | "signing_key"
    | "encryption_key"
    | "webhook_secret"
    | "provider_token"
    | "other";
  sensitivity: "internal" | "sensitive" | "control";
  provider:
    | "native"
    | "vault"
    | "aws_secrets_manager"
    | "gcp_secret_manager"
    | "azure_key_vault"
    | "onepassword"
    | "custom";
  ownerSubjectKey?: string;
  ownerTagSelectors?: TagSelector[];
  status: "active" | "rotating" | "revoked";
  createdAt: string;
  rotatedAt?: string;
};

type SecretVersion = {
  secretKey: string;
  versionKey: string;
  providerVersionRef: string;
  status: "active" | "previous" | "staged" | "revoked";
  createdAt: string;
  expiresAt?: string;
};
```

The authority database should store metadata and provider references. Actual secret values should live in a secret provider, not in ordinary graph records.

The secret broker should prefer non-extractive use:

```ts
type SecretUseRequest = {
  secretKey: string;
  purpose:
    | "connect"
    | "sign"
    | "decrypt"
    | "encrypt"
    | "call_provider"
    | "issue_token"
    | "verify_webhook";
  subject: SubjectRef;
  runtimePrincipal: RuntimePrincipal;
  pluginContext?: ActivePluginRuntimeContext;
  executionMode: ExecutionModeContext;
};

type SecretUseResult =
  | { kind: "performed"; result: AnyObject }
  | { kind: "leased_value"; leaseKey: string; expiresAt: string }
  | { kind: "denied"; reason: string };
```

Default rules:

- business context must not carry raw secrets
- chambers receive secret references, capability handles, and broker permissions, not raw long-lived secret values
- provider tokens, refresh tokens, private keys, database passwords, and long-lived API keys should not be projected into chambers by default
- raw value leases should be exceptional, short-lived, policy-gated, and fully audited
- secret access is distinct from graph read/write/execute authority

Secret policy should check:

- initiating subject
- runtime principal
- execution lane
- access mode
- plugin activation context
- secret class and sensitivity
- requested purpose
- delegated authority
- cell trust profile
- assurance level

Rotation and revocation should:

- stage new versions before cutover
- let the broker resolve active versions
- retire old versions
- revoke active leases where possible
- notify affected plugin and capability activations
- mark dependent runtime images stale if needed
- recycle chambers if leakage risk exists
- record evidence

Persist full evidence for secret creation, rotation, revocation, policy changes affecting secrets, denied access, raw value leases, signing, decrypting, and token issuing. Lower-risk brokered provider use may persist summary evidence unless policy requires full evidence.

The key architectural rule is that secrets are controlled operations over protected material, not ordinary data.

### Audit and evidence

Audit should not be treated as ordinary logging. Logs are operational text; evidence is structured security memory.

Core rule:

```text
Every high-value trust boundary must leave structured evidence.
```

Evidence should always be created for:

- authentication success and failure
- account linking and unlinking
- session creation, refresh, and revocation
- authorization allow and deny for high-value actions
- delegated authority minting
- inter-cell envelope acceptance and denial
- plugin install, activation, suspension, and revocation
- secret creation, access, lease, rotation, and revocation
- high-value capability use
- authority gateway reads and writes
- cell enrollment, revocation, and key rotation
- chamber image activation, drain, failure, and recycle
- supply-chain artifact approval, rejection, and revocation
- runtime image attestation and activation
- policy changes
- tag-management actions
- trusted-control task execution

Evidence levels should be explicit:

```ts
type EvidenceLevel = "summary" | "full";
```

`summary` evidence is compact structured traceability for frequent or lower-risk events. `full` evidence carries decision inputs and outputs, selected effective tag revisions, matched policy keys, envelope keys, artifact digests, secret references, reason codes, runtime principal, initiating subject, and before/after references when relevant.

Recommended base record:

```ts
type EvidenceRecord = {
  evidenceKey: string;
  environmentKey: string;
  occurredAt: string;
  category:
    | "auth"
    | "authorization"
    | "delegation"
    | "envelope"
    | "plugin"
    | "secret"
    | "capability"
    | "authority_gateway"
    | "cell"
    | "chamber"
    | "supply_chain"
    | "policy"
    | "tag_management"
    | "trusted_control";
  action: string;
  level: EvidenceLevel;
  outcome: "success" | "failure" | "denied" | "revoked" | "expired";
  initiatingSubject?: SubjectRef;
  runtimePrincipal?: RuntimePrincipal;
  trace?: {
    rootExecutionId?: string;
    executionId?: string;
    taskKey?: string;
    envelopeKey?: string;
    correlationKey?: string;
  };
  refs?: {
    resourceKeys?: string[];
    policyKeys?: string[];
    pluginActivationKey?: string;
    secretKeys?: string[];
    capabilityKeys?: string[];
    artifactKeys?: string[];
    imageRevision?: string;
  };
  reason?: string;
};

type EvidenceDetail = {
  evidenceKey: string;
  detailKind:
    | "auth_assertion"
    | "policy_decision"
    | "delegation_authority"
    | "secret_use"
    | "plugin_activation"
    | "supply_chain_verification"
    | "cell_enrollment"
    | "image_activation"
    | "authority_mutation";
  data: AnyObject;
  redactionProfile: "none" | "standard" | "sensitive";
};
```

Evidence should reference sensitive things rather than copying them:

- store `secretKey`, not secret value
- store artifact digest, not package contents
- store `policyDecisionAuditKey`, not every raw policy input when a reference is enough
- store `authSessionKey`, not raw provider token
- redact raw provider claims by default

Evidence must correlate with execution:

```text
subject
-> envelope
-> task execution
-> delegated graph
-> capability, secret, or authority action
-> evidence
```

Every evidence-producing boundary should include at least one of:

- `rootExecutionId`
- `executionId`
- `envelopeKey`
- `correlationKey`
- `policyDecisionAuditKey`

Tamper-resistance should be practical in v1:

- evidence records are append-only
- security events are not updated in place
- redaction is represented by a new redaction marker, not destructive edit
- each environment or authority partition has a monotonic evidence sequence
- hash chaining is optional in v1 but recommended for high-security mode

Enterprise or hardened mode may add:

- hash chains
- signed batches
- external WORM storage
- SIEM export
- transparency logs

Evidence is itself sensitive. Privacy and retention rules should:

- minimize copied claims
- avoid storing raw context unless policy requires it
- support retention classes
- support legal or privacy redaction through appended redaction markers
- preserve security-critical references even if detail payload is redacted

Audit plugins should be sinks, not authorities. Cadenza creates evidence; plugins may export or mirror it to SIEM, OpenTelemetry, Splunk, Datadog, cloud audit logs, or enterprise compliance systems.

Deferred audit details:

- exact evidence table schema
- hash-chain and batch-signing mechanics
- retention class catalog
- export format contracts
- SIEM and compliance sink adapter contracts

### Response and containment

Response and containment should be modeled as controlled trust reduction.

Core rule:

```text
If trust is uncertain, the system should narrow, pause, or revoke authority before it tries to repair.
```

Containment targets should map to authority and runtime objects Cadenza already understands:

- `subject`
- `auth_session`
- `external_identity_binding`
- `cell`
- `chamber`
- `plugin_activation`
- `runtime_image`
- `artifact`
- `dependency_set`
- `secret`
- `capability_grant`
- `delegated_authority`
- `policy_rule`
- `tag_assignment`
- `authority_slice`

Recommended action vocabulary:

```ts
type ContainmentAction =
  | "observe"
  | "require_reauth"
  | "suspend"
  | "drain"
  | "stop"
  | "recycle"
  | "quarantine"
  | "revoke"
  | "rotate"
  | "rollback"
  | "freeze"
  | "repair_mode";
```

Action meanings:

- `observe` increases evidence and risk tracking without changing authority
- `require_reauth` forces stronger proof before continuing
- `suspend` stops new use while preserving state
- `drain` stops new work and lets safe current work finish
- `stop` terminates active work
- `recycle` replaces a runtime boundary
- `quarantine` isolates and prevents trust propagation
- `revoke` invalidates authority or trust
- `rotate` replaces keys or secrets
- `rollback` returns to a prior approved version
- `freeze` blocks mutations in a scope
- `repair_mode` allows only explicitly trusted repair or control tasks

Risk signals may come from:

- policy denial spikes
- failed authentication or session anomalies
- suspicious delegated-authority requests
- unexpected capability or secret use
- cell heartbeat or attestation failure
- chamber crash loops
- artifact or plugin revocation
- vulnerability feeds or supply-chain verifier plugins
- manual operator action
- trusted-control task decisions
- audit/evidence anomaly detection
- resource-limit violations
- sandbox escape suspicion

Risk signals are not automatic guilt. Containment policy decides response.

Recommended containment rule shape:

```ts
type ContainmentRule = {
  ruleKey: string;
  trigger: RiskSignalSelector;
  targetSelector: ContainmentTargetSelector;
  action: ContainmentAction;
  severity: "low" | "medium" | "high" | "critical";
  modeScope?: EnvironmentAccessMode[];
  evidenceLevel: EvidenceLevel;
};
```

Containment should be authority-first and runtime-second:

```text
risk signal
-> containment decision
-> authority state transition
-> projection update
-> runtime enforcement
-> evidence
```

Examples:

- plugin activation status becomes `suspended`
- runtime image revision becomes `revoked`
- cell enrollment becomes `suspended`
- secret status becomes `rotating` or `revoked`
- policy scope enters `freeze`

Runtime enforcement should reuse existing mechanisms:

- stem-cell publishes new desired state
- cells reject stale or revoked projections
- chambers stop accepting new work
- ingress rejects affected targets
- capability and secret brokers deny affected requests
- delegated envelopes expire or are invalidated
- affected images drain or stop
- explicitly allowed trusted-control repair slices remain available

Containment should use the narrowest effective scope:

- prefer session over subject
- prefer plugin activation over whole plugin package
- prefer image revision over whole cell
- prefer chamber over cell
- prefer capability grant over all execution

But containment must be able to escalate:

```text
chamber
-> image revision
-> plugin activation
-> cell
-> environment repair mode
```

Repair mode is the architecture equivalent of safe mode. It should:

- freeze normal authority mutations
- allow only trusted-control repair tasks
- require strong assurance
- record full evidence
- preserve read access needed for diagnosis
- prevent plugin or security-provider self-repair unless explicitly trusted
- support future multi-party approval without changing the core containment model

Every containment action should create full evidence with:

- trigger signal
- decision rule
- target
- action
- authority state before and after references
- runtime projection revision
- initiating subject or system principal
- repair or rollback references when applicable

Containment should be reversible where possible, but revocation remains explicit:

- `suspend` is reversible
- `drain` is operational
- `quarantine` is isolating
- `revoke` is invalidating
- `repair_mode` is scoped emergency authority

Because security and management orchestration should be Cadenza primitive flows, containment should normally be implemented as graph-native policy and reconciliation:

```text
risk signal
-> trusted-control/meta containment task
-> authority gateway mutation
-> stem-cell projection update
-> cell/chamber/broker local enforcement
-> evidence
```

The substrate still enforces hard local stops, but the decisioning and orchestration should remain Cadenza-native.

### Persistent and resumable flows

Persistent and resumable flows should be opt-in execution policy over a Cadenza graph, not a new executable primitive and not a separate workflow engine.

Core rule:

```text
Cadenza resumes at primitive boundaries, not inside arbitrary task code.
```

A persistent flow is still normal Cadenza execution:

```text
root task, signal, or intent
+ persistence policy
+ durable flow instance
+ checkpointed primitive steps
+ resumable dispatch
```

Default execution should remain lightweight. Persistence should be used where interruption would be expensive or unsafe, such as:

- long-running agent work
- multi-cell orchestration
- security repair flows
- plugin activation and upgrade
- stem-cell reconciliation
- external side-effect workflows
- authority migrations
- actor recovery and hydration
- production operations that must not be duplicated blindly

Recommended policy shape:

```ts
type PersistencePolicy = {
  mode: "none" | "checkpointed" | "durable_orchestration";
  resume:
    | "never"
    | "from_last_completed_step"
    | "from_last_safe_boundary"
    | "manual_repair_only";
  ownership: {
    claimMode: "single_owner";
    leaseMs: number;
    takeover: "same_cell_only" | "any_eligible_cell" | "trusted_control_only";
  };
  checkpoint: {
    strategy:
      | "step_boundary"
      | "authority_commit"
      | "external_effect"
      | "custom";
    persistInput: "reference" | "snapshot";
    persistResult: "reference" | "snapshot";
  };
  idempotency: {
    required: boolean;
    keyScope: "flow_instance" | "step" | "external_operation";
  };
  recovery: {
    maxAttempts: number;
    onExhausted: "fail" | "repair_required" | "manual_review";
  };
};

type ResumeGuarantee =
  | "at_most_once"
  | "at_least_once"
  | "effectively_once_with_idempotency"
  | "manual_repair_only";
```

Mode meanings:

- `none` is the default lightweight execution mode
- `checkpointed` records durable step boundaries and can resume from the last completed safe boundary
- `durable_orchestration` explicitly manages waits, external effects, delegated responses, and long-running coordination

Resume guarantees should be honest:

- `at_most_once` does not repeat uncertain steps and may fail into repair
- `at_least_once` may retry and the caller accepts possible duplicate effects
- `effectively_once_with_idempotency` retries only with idempotency keys or completion records that suppress duplicates
- `manual_repair_only` does not automatically resume after ambiguous failure

The persistence declaration should sit beside executable security and behavior declarations:

```ts
type ExecutableResilienceDeclaration = {
  persistence?: PersistencePolicy;
};
```

Effective persistence should be derived over the hard execution graph, like effective security. If a root declares durable orchestration but a reachable hard dependency performs a non-idempotent external effect with no completion record, validation should downgrade the effective guarantee or require repair-only behavior.

Good checkpoint boundaries are Cadenza boundaries:

- before dispatching a durable step
- after a task graph returns successfully
- after receiving an expected unique signal response
- after authority mutation commits
- after external side effect is confirmed
- after projection publication is acknowledged

Bad checkpoint boundaries are implementation internals:

- arbitrary helper calls
- arbitrary source-code lines
- serialized JS call stacks
- chamber memory snapshots

Recommended checkpoint kinds:

```ts
type CheckpointKind =
  | "step_started"
  | "step_completed"
  | "authority_committed"
  | "external_effect_requested"
  | "external_effect_confirmed"
  | "signal_wait_started"
  | "signal_received"
  | "delegation_started"
  | "delegation_completed"
  | "projection_acknowledged";
```

The durable runtime object can stay conceptually simple:

```ts
type PersistentFlowInstance = {
  flowInstanceKey: string;
  rootExecutionId: string;
  rootTargetKey: string;
  status:
    | "running"
    | "waiting"
    | "resuming"
    | "completed"
    | "failed"
    | "cancelled"
    | "repair_required";
  ownerCellKey?: string;
  leaseUntil?: string;
  lastCheckpointKey?: string;
  createdAt: string;
  updatedAt: string;
};

type FlowCheckpoint = {
  checkpointKey: string;
  flowInstanceKey: string;
  stepKey: string;
  kind: CheckpointKind;
  status: "started" | "completed" | "failed";
  inputRef?: string;
  resultRef?: string;
  idempotencyKey?: string;
  occurredAt: string;
};
```

The exact tables and payload storage are deferred. The important architectural role is durable ownership and durable primitive-boundary progress.

Resume should work through normal Cadenza primitives:

```text
cell or chamber fails
-> flow lease expires or failure is reported
-> flow manager loads last durable checkpoint
-> flow manager determines next safe step
-> flow manager re-dispatches through normal Cadenza primitives
-> evidence is recorded
```

The flow manager should be a seeded meta or trusted-control support slice, not part of core primitive semantics. Its responsibilities are:

- create flow instances
- claim leases
- write checkpoints
- detect expired leases
- decide safe resume point
- re-dispatch through normal primitives
- move ambiguous cases to repair
- emit evidence

Core only needs the metadata hooks and runtime events required to make this possible.

Important invariants:

- persistent flows resume only at declared Cadenza boundaries
- only flow-manager support slices resume persistent flow instances
- each flow instance has one leased owner at a time
- takeover happens only after lease expiry, explicit failure, or containment transition
- resume revalidates current authority
- ambiguous started side effects require idempotency or repair
- durable signal waits require persisted unique signal or correlation records
- checkpoints store references by default
- snapshots are allowed only when policy says the context is safe and useful to persist
- containment can suspend, cancel, or move persistent flows to repair mode

Resume must re-check current authority and runtime state:

- subject and session state when relevant
- delegated authority
- target availability
- actor ownership
- plugin activation
- image and artifact status
- capability and secret grants
- containment state

This avoids stale long-running flows continuing under authority that has since changed.

Side-effect rule:

```text
A persistent flow may retry a step only if the step is idempotent or has a durable completion record.
```

Otherwise the flow should move to `repair_required` instead of blindly repeating the operation.

Distributed fit:

- after chamber failure, the same cell or another chamber may resume from checkpoint if policy allows
- after cell failure, another eligible cell may claim the flow instance if takeover policy allows
- actor-owner resume must respect current actor residency, not stale ownership
- delegated graph resume uses the started/completed boundary to decide retry safety
- containment can suspend, cancel, or repair persistent flows through authority state

Durability belongs to the flow instance. Execution belongs to cells and chambers.

This preserves disposable chamber architecture while allowing opt-in resilience for work that needs it.

Example plugin-activation flow:

```text
start activation flow
checkpoint: manifest validated
checkpoint: dependencies resolved
checkpoint: policy approved
checkpoint: runtime image attested
checkpoint: projection published
wait: cells acknowledge
checkpoint: activation active
```

If the stem-cell dies after publishing projection, another eligible cell can resume by checking the last checkpoint and waiting for or re-sending projection safely.

Deferred persistent-flow details:

- exact authority tables
- payload storage format
- checkpoint retention
- lease implementation
- recovery scheduler mechanics
- cross-environment persistent flow behavior

### Placement vocabulary

The old service boundary collapsed too many concerns into one identity. The 4.0 model should separate:

- logical primitive identity
- placement unit identity
- placement replica identity
- cell identity

`Cell` is the runtime host/process boundary. It is not the semantic execution engine itself. A cell hosts materialized runtime slices and runs a local Cadenza runtime engine.

Recommended high-level contracts:

```ts
type Cell = {
  key: string;
  environmentId: string;
  status: "starting" | "ready" | "draining" | "stopped";
  trustLevel?: CellTrustLevel;
  capabilities?: RuntimeCapabilityGrant[];
};

type PlacementUnit = {
  key: string;
  mode: "singleton" | "scaled";
  desiredReplicaCount: number;
  minReplicaCount?: number;
  maxReplicaCount?: number;
  tags?: string[];
  placementPolicy?: {
    requiredCellTags?: string[];
    preferredCellTags?: string[];
  };
};

type PlacementMembership = {
  unitKey: string;
  objectUuid: string;
  role: "primary" | "support";
};

type PlacementReplica = {
  key: string;
  unitKey: string;
  status: "starting" | "ready" | "degraded" | "draining" | "stopped";
  assignedCellKey?: string;
  routingWeight?: number;
};
```

Important semantics:

- placement units are the thing that scales together
- tags can annotate units, but tags do not define unit identity
- membership binds tasks and support objects to units explicitly
- helpers and globals are support members, not scaling identities of their own
- cells provide runtime hosting capacity; they are not the primary architectural boundary
- cell capability claims should come from the governed runtime capability registry
- executable security declarations impose materialization constraints alongside placement policy and tags
- trusted placement for `privileged` execution should be an explicit cell property, not inferred from ordinary tags

### Stem-cell unit

Each environment should have one singleton control-plane placement unit that owns ongoing self-management after bootstrap.

Recommended high-level contracts:

```ts
type StemCellUnit = PlacementUnit & {
  role: "stem_cell";
  mode: "singleton";
  desiredReplicaCount: 1;
  tags?: ["meta", "control-plane", "stem-cell"];
  automationMode?: "automatic" | "automatic_with_overrides";
};

type ActiveStemCell = {
  unitKey: string;
  replicaKey: string;
  cellKey: string;
  status: "ready" | "degraded";
};
```

Important semantics:

- the stem cell is a singleton placement unit, not a separate primitive type
- the active stem cell is whichever cell currently hosts the ready singleton replica
- parent environments may initialize child environments, but ongoing reconciliation should be owned by the environment itself
- humans and agents can override desired state, but automation should be the default mode

The stem-cell unit should own:

- cell reconciliation
- placement-replica reconciliation
- replica-to-cell assignment
- routing-state convergence

It should not own:

- business-flow authority
- semantic task execution
- permanent parent-environment governance
- advanced global optimization in v1

### Stem-cell reconciliation contract

The stem-cell unit needs a desired-state and action contract. Without that layer, it is only a role label and not an actual environment-local scaling mechanism.

Recommended high-level contracts:

```ts
type CellType = {
  key: string;
  trustLevel?: CellTrustLevel;
  capabilities?: RuntimeCapabilityGrant[];
  isDefault?: boolean;
};

type PlacementDesiredState = {
  unitKey: string;
  desiredReplicaCount: number;
  allowedCellTypes?: string[];
  pinnedCellKeys?: string[];
  automationMode: "automatic" | "automatic_with_overrides" | "manual";
};

type PlacementOverride = {
  unitKey: string;
  desiredReplicaCount?: number;
  pinnedCellKeys?: string[];
  blockedCellKeys?: string[];
  automationLocked?: boolean;
  reason?: string;
};

type PlacementObservationSnapshot = {
  cells: string[];
  replicas: string[];
  residencies: string[];
  routeMembers: string[];
};

type CellLifecycleRequest = {
  action: "start_cell" | "drain_cell" | "stop_cell";
  cellTypeKey?: string;
  cellKey?: string;
  reason?: string;
};

type ReplicaLifecycleRequest = {
  action: "start_replica" | "drain_replica" | "stop_replica";
  unitKey: string;
  replicaKey?: string;
  reason?: string;
};

type ReplicaAssignmentRequest = {
  replicaKey: string;
  targetCellKey: string;
  reason?: string;
};

type RouteConvergenceRequest = {
  unitKey: string;
  reason?: string;
};

type ReconciliationAction =
  | CellLifecycleRequest
  | ReplicaLifecycleRequest
  | ReplicaAssignmentRequest
  | RouteConvergenceRequest;
```

Important semantics:

- `CellType` describes a launchable class of cell, not a live runtime object
- `PlacementDesiredState` is the automation target for one unit
- `PlacementOverride` is the explicit human or agent steering layer and should remain narrow and auditable
- `PlacementObservationSnapshot` represents current runtime reality and is not semantic content
- reconciliation should produce explicit actions rather than hidden side effects
- routing convergence is part of placement reconciliation, not a separate control plane

The v1 stem-cell loop should conceptually consume:

- placement desired state
- placement overrides
- observed cells, replicas, residencies, and route members
- available cell types

It should conceptually produce:

- explicit reconciliation actions

This keeps automation observable and leaves room for better planning algorithms later without changing the contract boundary.

### Manual override semantics

The override layer should be explicit and predictable. The stem cell should not apply surprising merge behavior or silently ignore operator intent.

Recommended derived contract:

```ts
type EffectivePlacementDirective = {
  unitKey: string;
  desiredReplicaCount: number;
  allowedCellTypes?: string[];
  pinnedCellKeys?: string[];
  blockedCellKeys?: string[];
  automationMode: "automatic" | "automatic_with_overrides" | "manual";
  automationLocked: boolean;
};
```

Important semantics:

- `PlacementDesiredState` is the baseline intent
- `PlacementOverride` is a sparse, auditable patch layer over that baseline
- the effective desired replica count is `override.desiredReplicaCount ?? desiredState.desiredReplicaCount`
- `pinnedCellKeys` in an override should replace the baseline pinned set rather than merge with it
- `blockedCellKeys` should be applied as an explicit deny set for assignment
- a cell may not be both pinned and blocked in the effective directive; that conflict should be treated as invalid operator input rather than resolved silently
- `automationLocked` should prevent higher-level automation from mutating effective desired state, but it should not disable ordinary reconciliation toward that desired state
- `manual` mode should disable automatic desired-state evolution, not assignment or health repair

Operational consequences:

- if `pinnedCellKeys` are set and those cells do not have enough eligible capacity, the stem cell must leave demand unsatisfied rather than spilling work onto unpinned cells
- if `blockedCellKeys` are set, the stem cell must avoid new assignment there and should drain or reassign existing replicas when alternative capacity exists
- if no override is present, reconciliation should use the baseline desired state directly
- in v1, all automation modes still reconcile explicitly stored desired state; the mode distinction mainly protects the design from future adaptive scaling layers

This keeps manual control narrow and predictable while preserving one reconciliation path for both automated and operator-steered units.

### Cell supply and capacity model

The stem-cell loop also needs a minimal capacity model. Without one, cell reconciliation cannot answer the basic question of whether enough eligible cell capacity exists to host the desired replicas.

The v1 model should stay intentionally simple:

- cells are multi-replica hosts
- capacity is modeled as integer slots
- each placement-unit replica consumes a small slot cost
- the stem cell is demand-driven rather than predictive
- cells are drained only when empty, blocked, or explicitly unnecessary

Recommended contract refinements:

```ts
type CellType = {
  key: string;
  trustLevel?: CellTrustLevel;
  capabilities?: RuntimeCapabilityGrant[];
  slotCapacity: number;
  isDefault?: boolean;
};

type PlacementUnit = {
  key: string;
  mode: "singleton" | "scaled";
  desiredReplicaCount: number;
  replicaSlotCost?: number;
  minReplicaCount?: number;
  maxReplicaCount?: number;
  tags?: string[];
  placementPolicy?: {
    requiredCellTags?: string[];
    preferredCellTags?: string[];
  };
};

type CellCapacitySnapshot = {
  cellKey: string;
  slotCapacity: number;
  usedSlots: number;
  freeSlots: number;
};

type CellPoolDesiredState = {
  cellTypeKey: string;
  minReadyCells?: number;
  maxReadyCells?: number;
};
```

Important semantics:

- `slotCapacity` is the total hostable workload capacity for one cell type
- `replicaSlotCost` defaults to `1` in v1 and lives at the placement-unit level
- `CellCapacitySnapshot` is observed runtime state, not semantic content
- `CellPoolDesiredState` is an optional floor/ceiling layer and should remain minimal
- most environments can start with one initial cell and demand-driven expansion

The conceptual v1 supply loop is:

1. compute desired replicas per unit
2. compare against ready and assigned replicas
3. identify placeable replicas and their slot costs
4. check whether existing eligible cells have enough free slots
5. emit `start_cell` requests if supply is insufficient
6. assign replicas onto cells
7. drain cells only when empty, blocked, or explicitly above desired pool state

One important boundary should stay explicit:

- if every cell dies, full extinction recovery is still a bootstrap or substrate concern rather than a pure in-environment self-healing loop

That limitation is acceptable in v1 and should be documented rather than hidden.

### Cell lifecycle semantics

Cell lifecycle semantics should be explicit because assignment and routing depend on them directly.

Recommended refinement:

```ts
type Cell = {
  key: string;
  environmentId: string;
  status: "starting" | "ready" | "degraded" | "draining" | "stopped";
  trustLevel?: CellTrustLevel;
  capabilities?: RuntimeCapabilityGrant[];
};

type EffectiveCellDisposition = {
  cellKey: string;
  status: "starting" | "ready" | "degraded" | "draining" | "stopped";
  acceptsNewAssignments: boolean;
  servesExistingTraffic: boolean;
};
```

Operational meaning:

- `starting`
  - the cell exists but is not yet eligible for new replica assignment
  - the cell should not be treated as a routable target
- `ready`
  - the cell is eligible for new assignment if it also satisfies capability and override constraints
  - the cell may serve routed traffic for hosted ready replicas
- `degraded`
  - the cell may continue serving existing traffic
  - the cell should not receive new assignments in v1
  - the stem cell should prefer replacement or evacuation when alternative capacity exists
- `draining`
  - the cell must not receive new assignments
  - the cell may continue serving existing traffic until hosted replicas are drained or reassigned
  - `stop_cell` should normally follow only after the cell becomes empty
- `stopped`
  - the cell is not eligible for assignment
  - the cell must not serve traffic
  - any surviving route or residency records should converge away from it

Recommended v1 disposition table:

- `starting`: `acceptsNewAssignments = false`, `servesExistingTraffic = false`
- `ready`: `acceptsNewAssignments = true`, `servesExistingTraffic = true`
- `degraded`: `acceptsNewAssignments = false`, `servesExistingTraffic = true`
- `draining`: `acceptsNewAssignments = false`, `servesExistingTraffic = true`
- `stopped`: `acceptsNewAssignments = false`, `servesExistingTraffic = false`

Important semantics:

- lifecycle status is cell-global and separate from per-unit override rules such as `blockedCellKeys`
- `drain_cell` is the standard operator or automation path for maintenance and scale-down
- route membership should be derived so that cells in `stopped` never remain routable
- singleton units hosted on a draining cell must be re-established elsewhere before the cell can be fully stopped

This is intentionally conservative. It avoids assigning new work to uncertain hosts while still allowing orderly drain and failover behavior.

### V1 assignment heuristics

Assignment should be deterministic, conservative, and simple enough to implement directly inside the stem-cell slice without introducing a general-purpose scheduler.

Recommended derived contract:

```ts
type AssignmentCandidate = {
  cellKey: string;
  status: "ready";
  freeSlots: number;
  hostsSameUnitReplica: boolean;
  pinned: boolean;
};
```

Recommended v1 assignment procedure:

1. Start from the `EffectivePlacementDirective` for the unit.
2. Filter cells by hard constraints:
   - lifecycle must permit new assignment
   - cell type and capability requirements must match
   - blocked cells are excluded
   - if pinned cells are present, only pinned cells remain eligible
   - the cell must have enough free slots for the unit's `replicaSlotCost`
3. If the replica is already assigned to an eligible ready cell and no override or lifecycle rule requires movement, keep it there.
4. For new or displaced replicas, rank remaining candidates using this precedence:
   - pinned cells before unpinned cells
   - cells that do **not** already host a replica of the same unit before cells that do
   - among the remaining cells, prefer the one with the **highest used capacity** that can still fit the replica
   - break ties deterministically by `cellKey`
5. If no eligible cell remains, leave the replica unassigned and let cell-supply reconciliation request more capacity.

Important semantics:

- the first assignment principle is **avoid unnecessary churn**
- the first placement principle for scaled units is **soft anti-affinity across cells**
- after anti-affinity, the packing principle is **prefer fuller cells** so emptier cells remain available for future work or draining
- singleton units still use the same eligibility logic, but should prefer staying on their current healthy cell unless reassignment is required
- `degraded`, `draining`, and `stopped` cells are not assignment candidates in v1

This gives v1 a clear bias:

- spread replicas of the same unit when possible
- otherwise pack conservatively
- never violate explicit operator constraints
- never hide insufficient capacity by forced spillover

That is enough detail for an initial implementation of the stem-cell assignment logic.

### Declared environment wiring

The database represents one unified environment graph. That declared graph includes:

- task links
- observed signals
- handled intents
- richer structural relationships used for reasoning and visualization
- placement that determines which cell hosts which executable slice or replica

This is the authority layer. It is not yet the engine-local runtime graph.

### Cell transport and route membership

The useful replacement for `service_instance` and `service_instance_transport` is not a replica-address model. Addresses belong to cells, while replicas carry workload identity.

Recommended high-level contracts:

```ts
type CellTransport = {
  cellKey: string;
  role: "internal" | "public";
  address: string;
  protocols: string[];
  status: "ready" | "degraded" | "offline";
};

type PlacementReplicaResidency = {
  replicaKey: string;
  unitKey: string;
  cellKey: string;
  status: "assigned" | "materializing" | "ready" | "draining" | "stopped";
};

type UnitRouteMember = {
  unitKey: string;
  replicaKey: string;
  cellKey: string;
  internalAddress: string;
  publicAddress?: string;
  status: "ready" | "degraded";
  routingWeight?: number;
};
```

Important semantics:

- cells own addresses
- replicas inherit reachability from the cell hosting them
- replica residency is runtime state, not semantic task content
- route membership should be derived from replica residency, cell transport, and readiness
- deputies and other bridge artifacts should route through unit route members rather than raw cell rows

### Deputy routing contract

Deputies should stay low-level and explicit in v1.

The current `serviceKey + taskKey` targeting model should become:

- `unitKey`
- `taskKey`

Important semantics:

- `taskKey` must resolve to a task that belongs to the target unit
- routing chooses a ready replica from the target unit's route members
- the actual network hop uses the hosting cell's internal address
- this remains a bridge/runtime contract, not a new high-level authoring abstraction

### Bridge artifact taxonomy

The v1 bridge model should stay aligned with the currently working runtime rather than inventing new bridge classes.

Recommended high-level contracts:

```ts
type DeputyTaskArtifact = {
  kind: "deputy_task";
  localCellKey: string;
  targetUnitKey: string;
  targetTaskKey: string;
  isMeta: boolean;
  routeBy: "unit_route_members";
};

type SignalTransmissionArtifact = {
  kind: "signal_transmission";
  localCellKey: string;
  signal: string;
  targetUnitKey: string;
  targetTaskKey: string;
  isMeta: boolean;
  routeBy: "unit_route_members";
};

type RuntimeOwnedBridgeArtifact =
  | DeputyTaskArtifact
  | SignalTransmissionArtifact;
```

Important semantics:

- there is no separate intent-deputy artifact in v1
- a foreign task link synthesizes a deputy task artifact
- a foreign intent handler also synthesizes a deputy task artifact, specifically one meta deputy task per foreign handler that must register locally in the inquiry broker
- deputy tasks keep the current inner model: they redirect into a lower-level meta flow, through local load balancing, then into the transport slice, and resolve locally on response
- if the bridged path is on the business layer, the deputy remains a business deputy task
- if the bridged path is on the meta layer, the deputy is marked meta
- signal transmission tasks remain the dedicated cross-cell artifact for foreign signal observers
- helpers and globals are still not remote execution targets in v1
- signal names do not normally carry routing semantics in 4.0
- `local.*` is the explicit cell-local exception and must never cross cell boundaries

### Derived route maps

The current system relies on global maps for intent handlers and signal observers. In the environment-native model, those maps should remain, but as database-authoritative derived route projections rather than service-scoped runtime registries.

Recommended high-level contracts:

```ts
type IntentHandlerRouteMember = {
  intent: string;
  taskKey: string;
  unitKey: string;
  cellKey: string;
  internalAddress: string;
  isMeta: boolean;
};

type SignalObserverRouteMember = {
  signal: string;
  taskKey: string;
  unitKey: string;
  cellKey: string;
  internalAddress: string;
  isMeta: boolean;
};

type IntentInquiryDemandMember = {
  intent: string;
  taskKey: string;
  unitKey: string;
  cellKey: string;
  isMeta: boolean;
};

type SignalEmissionDemandMember = {
  signal: string;
  taskKey: string;
  unitKey: string;
  cellKey: string;
  isMeta: boolean;
};
```

Important semantics:

- these are derived from declared intent and signal wiring, placement membership, replica residency, and cell transport
- inquiry demand and signal-emission demand should be derived from the locally hosted units' outbound-usage projections
- outbound-usage projections can be assembled from declared, inferred, and observed soft usage without making them hard runtime prerequisites
- local handler tasks register directly with the inquiry broker
- foreign handler tasks require synthesized meta deputy tasks, one per foreign handler, and those deputies register locally
- local signal observers subscribe directly
- foreign observers of any emitted signal may require synthesized signal transmission tasks
- `local.*` signals must only resolve against observers on the same cell and must never synthesize transmission artifacts
- cells should determine whether a given signal or intent needs cross-cell bridging by joining local demand members with foreign route members
- these maps replace the old service/global registry dependency without changing the currently working deputy and transmission behavior

This keeps v1 bridge behavior familiar while moving route authority into environment-derived projections instead of service identity.

### Demand miss and loose-end marking

Soft outbound usage must never be the sole correctness mechanism. Declared, inferred, and observed soft usage should drive prewarming and reasoning, but first-use misses must still resolve correctly at runtime.

At the same time, confirmed loose ends must not trigger repeated authority lookups on every use.

Recommended high-level contracts:

```ts
type DemandMissKind = "intent" | "signal" | "helper" | "global";

type UnresolvedDemandMarker = {
  kind: DemandMissKind;
  key: string;
  cellKey: string;
  sourceTaskKey?: string;
  isMeta: boolean;
  state: "confirmed_absent";
  authorityRevision?: string;
};
```

Important semantics:

- lazy resolution is still required for correctness on first use
- an `UnresolvedDemandMarker` is created only after local resolution fails and authority confirms that no matching foreign handlers, observers, or definitions currently exist
- the marker should suppress repeated authority pulls for that `(kind, key, cellKey)` while the relevant authority revision remains unchanged
- markers should be surfaced to the console and reasoning layer as loose ends rather than hidden runtime noise
- markers must be invalidated when the relevant authority-side route or definition set changes

Behavior by demand kind:

- `intent`
  - if no local handlers exist and no foreign handler routes exist, record a marker
  - the inquiry should then follow the normal no-handler outcome rather than repeatedly pulling authority
- `signal`
  - if no local observers exist and no foreign observer routes exist, record a marker
  - signal emission then remains a no-op unless wiring appears later
- `helper`
  - if the helper is not materialized locally and no authority definition exists, record a marker
  - helper access should then fail with the normal missing-helper error without repeated authority pulls
- `global`
  - if the global is not materialized locally and no authority definition exists, record a marker
  - global access should then fail with the normal missing-global error without repeated authority pulls

One important sequencing rule:

- local direct resolution always takes precedence
- negative markers only suppress repeated authority lookups after local resolution has already failed

This keeps soft usage advisory, preserves lazy resolution for correctness, and turns unwired or undefined outbound dependencies into explicit cached loose ends instead of repeated authority misses.

### Route-map refresh and bridge diffing

Bridge realization should use two projection layers with different refresh responsibilities.

Authority-side supply projections:

- `UnitRouteMember`
- `IntentHandlerRouteMember`
- `SignalObserverRouteMember`
- helper and global definition availability

Cell-local demand projections:

- `IntentInquiryDemandMember`
- `SignalEmissionDemandMember`

Important semantics:

- authority owns the supply projections because they depend on declared wiring, placement, replica residency, cell transport, and lifecycle state
- each cell owns its local demand projections because they depend on hosted units, materialized task versions, soft-usage sidecars, and observed demand misses
- authority-side supply projections should refresh incrementally on post-commit changes and may use squashing or debouncing on noisy state churn
- cells should rerun bridge diffing when:
  - local demand changes
  - relevant foreign supply projections change
  - an unresolved-demand marker is invalidated

Bridge artifacts should be fully derived and diff-based.

Per cell:

1. compute the desired bridge set from local demand and foreign supply
2. compare it with the currently materialized runtime-owned bridge artifacts
3. create missing artifacts
4. retire stale artifacts

Important semantics:

- create-before-retire should be preferred when it avoids brief routing gaps
- artifact identity should be deterministic per local cell and target contract
- bridge artifacts are never semantic task content and should always be recomputed from current projections

### Retry scope boundary

Deputy tasks are still ordinary tasks. Their retry policy should remain task-owned and follow the core task retry contract.

At the same time, the currently working deputy model includes a lower-level route-selection loop that happens inside the extension repo's meta flow between local load balancing and transport dispatch.

That split should remain in 4.0:

- outer retry scope:
  - owned by the deputy task itself
  - uses normal task retry policy
- inner dispatch round:
  - owned by the low-level extension-repo subflow
  - works over one bounded snapshot of currently available routes
  - may try the available candidate routes before surfacing failure back to the deputy task

Important semantics:

- the inner dispatch round is not a second general retry framework
- it should stay bounded to the currently known route set for one deputy-task attempt
- once the inner round is exhausted, the deputy task may decide to retry the whole task according to its normal retry policy
- signal transmission tasks are also ordinary tasks, so their broader retry behavior should remain task-owned as well
- the detailed failure classification model for bridge and transport outcomes is intentionally deferred until implementation compares the current runtime with the 4.0 contract
- this behavior belongs in the extension repo, not in `cadenza` core

This preserves the current working deputy structure while keeping retry policy ownership centered on task execution.

### Resolved engine wiring

Each engine resolves declared environment wiring into an engine-local operational graph only after local tasks have been materialized.

That resolved wiring includes only relationships that affect the runtime directly:

- task links that the graph runner must traverse
- observed signals that the signal broker must subscribe to
- handled intents that the inquiry broker must register

This wiring phase stays outside `cadenza` core because it depends on environment placement and engine-local resolution.

### Runtime-owned bridge artifacts

Wiring resolution may synthesize runtime-owned bridge artifacts when declared edges cross engine boundaries.

Examples include:

- deputy tasks for foreign task links
- meta deputies for foreign intent resolvers
- signal transmission tasks for cross-engine global signals

These are not part of the canonical task definition. They are engine-side operational artifacts produced during wiring resolution.

### Runtime slimming rule

Task materialization and task wiring are separate phases:

1. materialize all local executable tasks from definitions
2. resolve engine-local wiring
3. synthesize any required bridge artifacts
4. register links, signal observers, and intent handlers

This keeps core primitive materialization storage-agnostic and keeps runtime memory free of reasoning-only relationship data.

### DB caches versus runtime hydration

The task row should still retain rich JSONB relationship caches for:

- console visualization
- agent reasoning
- simple structural queries

But the runtime should hydrate only the hard operational subset. Richer declared relationships remain in the database as queryable metadata and should not be loaded into runtime memory by default.

## Task Definition And Materialization Contract

The task contract should be explicit before 4.0 implementation starts because task materialization sits at the boundary between the database, the engine, and core runtime behavior.

### Task semantic version

Tasks have one semantic version stream.

That semantic version is the rollbackable unit and should include:

- `TaskDefinition`
- `DeclaredTaskWiring`

It should not include:

- `ResolvedEngineWiring`
- runtime-owned bridge artifacts
- task-row JSONB caches
- ephemeral runtime state

This keeps compare and rollback meaningful while treating cross-engine bridge artifacts and query caches as derived operational outputs rather than semantic content.

### TaskDefinition

`TaskDefinition` should contain only executable task-local semantics.

Recommended shape:

```ts
type TaskDefinition = {
  schemaVersion: 1;
  name: string;
  description?: string;
  meta?: boolean;
  behavior: TaskBehaviorDeclaration;
  security?: ExecutableSecurityDeclaration;
  execution?: {
    concurrency?: number;
    timeoutMs?: number;
    retry?: {
      count?: number;
      delayMs?: number;
      maxDelayMs?: number;
      factor?: number;
    };
    validation?: {
      inputSchema?: Schema;
      validateInput?: boolean;
      outputSchema?: Schema;
      validateOutput?: boolean;
    };
    signals?: {
      after?: string[];
      onFail?: string[];
    };
  };
  extensions?: TaskExtensionDeclaration[];
};
```

Important boundaries:

- `TaskDefinition` is executable-only.
- It does not contain object identity, environment identity, placement, tags, policy, or wiring.
- core runtime resolution should move toward `taskKey` as the canonical executable identity in 4.0; `name` should remain human-facing metadata and compatibility lookup sugar rather than the authoritative execution key
- `meta` remains the authored executable classification that distinguishes business from meta surfaces; higher-level chamber lanes are derived separately from `meta` plus effective security.
- `emitsAfter` and `emitsOnFail` belong here because they are execution-attached behavior, not free-form outbound usage.
- `security` belongs here as a top-level executable contract because placement, materialization, and review need to reason about it directly.

### TaskBehaviorDeclaration

Behavior should be declared as:

```ts
type TaskBehaviorDeclaration = {
  id: string;
  payload: Record<string, unknown>;
};
```

This avoids baking a script-shaped contract into every future behavior.

The first behavior should be:

```ts
{
  id: "cadenza.task.script.v1",
  payload: {
    language: "js" | "ts",
    handlerSource: string
  }
}
```

Behavior resolution belongs in core, not in the engine and not in the extension package.

### TaskExtensionDeclaration

Extensions should be explicit, ordered, and storage-facing.

Recommended shape:

```ts
type TaskExtensionDeclaration = {
  id: string;
  order: number;
  config?: Record<string, unknown>;
};
```

Important semantics:

- extensions are resolved by stable ids, not TypeScript class names
- ordering is explicit and behaviorally meaningful
- unknown extension ids should fail materialization
- extension config is opaque to core and validated by the extension package

The first extension family already locked conceptually is:

- `cadenza.authority.v1`

### Extension capability model

Extensions should be understood primarily as declarations of participation in capabilities, not only as class-style wrappers.

The general model is:

1. extension declaration
   - persisted on the primitive definition
   - says the primitive opts into capability `X`
2. local runtime adapter
   - optional lightweight wrapper or hook on the materialized primitive
3. shared support slice
   - optional per-cell or singleton meta flow that provides the capability for many participating primitives
4. expansion bundle
   - optional companion objects created when the capability needs additional public executable surfaces

An extension capability may use one or more of these implementation shapes at the same time.

This keeps the contract general enough for both task and actor cases:

- task authority is mostly a local runtime adapter
- deputy and signal transmission behavior combine a primitive-local participation point with shared support flows for routing, load balancing, and transport
- actor session and hydration behavior are better modeled as shared actor-supporting meta slices than as one-off per-actor hidden flow stacks
- specialized actors such as PostgresActor and browser runtime actor are expansion bundles because they create companion tasks, intents, and signals

The extension repo should therefore own:

- extension declaration schemas
- local runtime adapters where needed
- seeded support-slice definitions required by those capabilities
- expansion generators or bundles where the capability creates companion surfaces

Core should only need to understand:

- the primitive baseline
- the persisted extension declarations

It should not need to understand how every extension capability is implemented.

### DeclaredTaskWiring

`DeclaredTaskWiring` is the hard runtime-affecting subset of task relationships that belongs to the semantic version.

Recommended shape:

```ts
type DeclaredTaskWiring = {
  schemaVersion: 1;
  links?: Array<{
    toTaskKey: string;
  }>;
  observesSignals?: Array<{
    signal: string;
  }>;
  handlesIntents?: Array<{
    intent: string;
  }>;
};
```

This currently includes only:

- task links
- observed signals
- handled intents

These are the relationships that directly affect:

- the graph runner
- the signal broker
- the inquiry broker

Important semantics:

- task links are stored as outgoing links only
- predecessor relationships are derived and should not be part of semantic content
- task references should use stable task keys, not runtime ids or version UUIDs
- signal and intent references remain plain strings
- object-array entries are preferred over bare string arrays so future edge metadata can be added without changing the top-level contract

It does not include:

- inquired intents
- helper/global usage
- emitted signal summaries from inside handler code
- broader reasoning-only structural metadata

### ResolvedEngineWiring

`ResolvedEngineWiring` is computed per engine after all local tasks have been materialized.

It is an operational result, not semantic task content.

Recommended shape:

```ts
type ResolvedEngineWiring = {
  localLinks: Array<{
    fromTaskKey: string;
    toTaskKey: string;
  }>;
  signalObservations: Array<{
    taskKey: string;
    signal: string;
  }>;
  intentHandlers: Array<{
    taskKey: string;
    intent: string;
  }>;
};
```

It includes only the engine-local operational subset:

- engine-local links
- engine-local signal subscriptions
- engine-local intent registrations

Important semantics:

- `ResolvedEngineWiring` is aggregated per engine, not embedded into each task definition
- it contains only relationships that the local engine will actually register
- it excludes richer reasoning metadata and excludes unresolved cross-engine gaps

This phase remains outside core because it depends on placement and engine-local graph realization.

### WiringResolutionResult

Because wiring resolution may need to synthesize runtime-owned bridge artifacts, the engine-side resolver should conceptually return both resolved local wiring and generated operational artifacts.

Recommended shape:

```ts
type WiringResolutionResult = {
  wiring: ResolvedEngineWiring;
  generatedArtifacts: RuntimeOwnedBridgeArtifact[];
};
```

`RuntimeOwnedBridgeArtifact` remains intentionally deferred. It will cover things like deputies and signal transmission tasks once the cross-engine bridge planner is designed explicitly.

### Task row caches

The task row should continue to retain denormalized JSONB caches for reasoning and visualization.

These caches may be richer than the runtime wiring and can include:

- hard runtime relationships
- soft outbound usage summaries
- structural flags
- console-facing graph summaries

They are query models, not execution prerequisites.

### Inbound versus outbound task relationships

The runtime contract should distinguish four categories:

- runtime wiring
  - task links
  - observed signals
  - handled intents
- execution-attached behavior
  - `emitsAfter`
  - `emitsOnFail`
- free outbound usage
  - `emit(signal, ctx)`
  - `inquire(intent, ctx, ...)`
  - helper access
  - global access
- reasoning metadata
  - declared or inferred soft usage
  - visualization summaries
  - richer denormalized graph caches

Only the first two categories belong in the executable runtime contract.

### Generic helper and global access

Helper/global access should not depend on task-local alias declarations.

The old alias-driven tool injection model was useful in the repo-centered manifest flow, but in the database-native architecture it creates unnecessary execution coupling and weak authoring ergonomics.

Recommended public shape:

```ts
type RuntimeTools = {
  helpers: RuntimeHelperAccess;
  globals: RuntimeGlobalAccess;
};

type RuntimeHelperAccess = {
  has(key: string): boolean;
  get(key: string): HelperInvoker | undefined;
  require(key: string): HelperInvoker;
  call<TResult = TaskResult>(
    key: string,
    context?: AnyObject,
  ): TResult | Promise<TResult>;
};

type RuntimeGlobalAccess = {
  has(key: string): boolean;
  get<T = unknown>(key: string): T | undefined;
  require<T = unknown>(key: string): T;
};
```

Important semantics:

- use stable helper/global keys, not task-local aliases
- helper/global access is backed by registries, not prebound per-task maps
- layer-boundary enforcement happens at lookup time
- helper/global usage remains soft metadata and row-cache data rather than a runtime prerequisite
- `get(...)` is probe-oriented and may return `undefined`
- `require(...)` and `call(...)` are hard-fail access paths

The same public `RuntimeTools` shape should be visible to both task handlers and helper handlers.

Host capabilities should not be folded into `RuntimeTools`.

They should be exposed through a separate cell-owned capability surface so application reuse and host power remain clearly separated.

Conceptually:

```ts
type RuntimeCapabilitiesAccess = {
  has(key: RuntimeCapabilityKey): boolean;
  require<T = unknown>(key: RuntimeCapabilityKey): T;
};
```

Executable code should therefore conceptually receive:

- normal runtime surfaces such as `ctx`, `emit`, `inquire`, actor access, and `tools`
- plus a separate `capabilities` surface when the executable security declaration allows it

Important rules:

- undeclared capabilities should not be injected
- effective transitive security requirements should gate injection, not only the local declaration on the currently executing surface
- `capabilities` should expose mediated provider APIs, not raw Node or OS primitives
- `use` versus `admin` should be resolved at materialization time rather than negotiated dynamically at runtime
- helpers/globals remain application-facing shared logic and data; they should not become a hidden privilege channel for host capabilities

Typical provider shapes should stay narrow and cell-owned:

- `authority_access`
  - privileged authority gateway provider mounted only into the authority-access slice, not a raw database client
- `filesystem`
  - mediated read/write provider, not raw `fs`
- `subprocess`
  - mediated tool runner, not raw child-process access
- `network_client`
  - mediated request client, not raw sockets
- `package_runtime`
  - approved package-backed adapters, not arbitrary package import

### Internal helper execution frame

Although the public tools API stays slim and uniform, helper invocation should carry a richer internal execution frame under the hood so nested helper calls preserve task-scoped runtime behavior and tracing attribution.

Recommended internal shape:

```ts
type ToolExecutionFrame = {
  ownerTaskKey: string;
  ownerTaskVersion?: number;
  taskNodeId: string;
  emit: (signal: string, context: AnyObject) => void;
  inquire: (
    intent: string,
    context: AnyObject,
    options: InquiryOptions,
  ) => Promise<AnyObject>;
  progress: (progress: number) => void;
  baseContext: AnyObject;
  tools: RuntimeTools;
  helperStack: string[];
};
```

Important semantics:

- `taskNodeId` is required so helper-driven signals and inquiries can still be attributed to the concrete `task_execution` record rather than only to the logical task object
- helper calls inherit the invoking task's `emit(...)` and `inquire(...)` functions
- nested helper calls preserve the same root task execution frame and extend `helperStack`
- helper provenance is internal runtime metadata in v1, while externally visible signal and inquiry activity still belongs to the invoking task execution
- business code should never assemble this frame manually; the runtime injects and propagates it automatically

This keeps helper/global access ergonomic while preserving traceability and avoiding the old alias-driven coupling.

### Authority grant context

Authority inheritance should use one narrow internal grant payload carried in invocation context rather than repeated policy-evaluation plumbing in every business flow.

Recommended internal shape:

```ts
type AuthorityGrantTrace = {
  grantingTaskNodeId: string;
  operationKey?: string;
  policyDecisionAuditUuid?: string;
};

type ResourceActionGrant = {
  schemaVersion: 1;
  grantId: string;
  source: "policy" | "system";
  environmentId: string;
  subjectObjectUuid: string;
  family: "resource_action";
  action: "read" | "write" | "execute" | "materialize";
  scope: {
    resourceObjectUuid: string;
  };
  trace: AuthorityGrantTrace;
};

type TagManagementGrant = {
  schemaVersion: 1;
  grantId: string;
  source: "policy" | "system";
  environmentId: string;
  subjectObjectUuid: string;
  family: "tag_management";
  action: "assign_tag" | "remove_tag" | "create_tag";
  scope: {
    targetObjectUuid?: string;
    targetTagUuid?: string;
    targetCategoryUuid?: string;
  };
  trace: AuthorityGrantTrace;
};

type AuthorityGrantContext = ResourceActionGrant | TagManagementGrant;
```

Important semantics:

- the grant lives only in runtime invocation context, not in semantic task content
- `grantingTaskNodeId` is required so inherited authority can still be correlated to the concrete `task_execution` record that minted the grant
- `policyDecisionAuditUuid` is a reference only, not an embedded full decision envelope
- one active grant per invocation branch is sufficient in v1
- nested tasks inherit or replace grants explicitly rather than accumulating an unbounded stack

### Authority compatibility

Compatibility should stay strict in v1.

Required matches:

- same `environmentId`
- same `subjectObjectUuid`
- same `family`
- same `action`

Additional scope rules:

- `resource_action` requires exact `resourceObjectUuid` match
- `tag_management` requires every scope field needed by the receiving task to be present and equal
- more specific grants are acceptable when they satisfy the receiving task's scope requirements
- less specific grants are not

This keeps inherited authorization deterministic and avoids silent scope widening.

### Authority lifecycle

The task-extension pattern should use the grant context like this:

- public task
  - use a compatible inherited grant if present
  - otherwise inquire policy
  - if allowed, mint a new grant into child context
- internal task
  - require a compatible inherited grant
  - never self-authorize
- system task
  - require trusted system/bootstrap context
  - may mint a `source: "system"` grant for downstream internal tasks

The grant is a runtime cooperation mechanism between task extensions. It is not a public business-facing context contract.

### Soft usage declarations and inference

Soft usage should be modeled as a version-scoped advisory sidecar, not as part of `TaskDefinition`.

This is the correct placement because:

- soft usage describes a specific task version's code
- soft usage should not affect semantic task version hashing or rollback
- declaration-only or inference-only updates should not require a new semantic task version
- runtime should not hydrate soft usage into execution memory by default

The soft-usage subsystem should stay loose and advisory in v1.

#### Declared soft usage

Optional, partial, human- or agent-authored declarations:

```ts
type TaskSoftUsageDeclaration = {
  schemaVersion: 1;
  signals?: {
    emits?: string[];
  };
  intents?: {
    inquires?: string[];
  };
  tools?: {
    helpers?: string[];
    globals?: string[];
  };
};
```

Important semantics:

- declarations are fully optional
- declarations may be partial
- declarations do not block execution
- declarations are useful for reasoning, review, and authoring guidance

#### Inferred soft usage

Produced by static analysis or later richer inference:

```ts
type TaskSoftUsageInference = {
  schemaVersion: 1;
  source: "static_analysis" | "agent_inference";
  signals?: Array<{
    signal: string;
    confidence: number;
  }>;
  intents?: Array<{
    intent: string;
    confidence: number;
  }>;
  helpers?: Array<{
    helper: string;
    confidence: number;
  }>;
  globals?: Array<{
    global: string;
    confidence: number;
  }>;
};
```

Important semantics:

- inference is advisory only
- confidence values are first-class
- inference may be incomplete or noisy
- inference must never block materialization

#### Observed soft usage

Captured from real outbound execution behavior:

```ts
type TaskSoftUsageObservation = {
  schemaVersion: 1;
  signals?: string[];
  intents?: string[];
  helpers?: string[];
  globals?: string[];
};
```

Important semantics:

- observations are aggregated by task version
- runtime may still use task node ids internally to attribute concrete executions
- helper-stack provenance may be retained internally without becoming part of the public soft-usage contract

#### Runtime capture

The runtime should capture outbound soft usage under the hood for:

- `emit(signal, ctx)`
- `inquire(intent, ctx, ...)`
- helper access through `tools.helpers.*`
- global access through `tools.globals.*`

This capture is a reasoning side channel, not execution semantics.

#### Reconciled summary

The console and agent-facing cache should expose a reconciled summary rather than forcing consumers to compare raw sources manually.

Recommended shape:

```ts
type TaskSoftUsageSummary = {
  declared?: TaskSoftUsageDeclaration;
  inferred?: TaskSoftUsageInference[];
  observed?: TaskSoftUsageObservation;
  gaps?: {
    observedButUndeclared?: string[];
    declaredButUnobserved?: string[];
    inferredButUndeclared?: string[];
  };
};
```

This gives humans and agents a practical view of:

- what was declared
- what was inferred
- what actually happened
- where the mismatches are

### Materialization sequence

The recommended 4.0 sequence is:

1. assemble a storage-agnostic task materialization envelope in the engine
2. materialize local support and state-authority primitives such as actors, helpers, and globals
3. call `createTaskFromDefinition(definition)` in the extended core interface
4. materialize local executable tasks, including actor-bound tasks
5. resolve engine-local wiring
6. synthesize any required bridge artifacts
7. register links, observed signals, and handled intents

This preserves a dumb engine, a storage-agnostic core, and a slim runtime.

### Explicit deferred loose ends

The following subcontracts are still intentionally open and should be documented later rather than guessed now:

- the concrete shape of `RuntimeOwnedBridgeArtifact`
- the detailed bridge-planning algorithm for cross-engine deputies and signal transmission tasks

## Actor Model

Actors remain first-class primitives in 4.0, but they should shrink back to their real semantic role.

### Primitive baseline

An actor is:

- a keyed state authority
- not an executable primitive
- materialized locally by the runtime from an actor definition
- accessible through normal tasks that bind to that actor

An actor is not:

- a graph node
- a service boundary
- a generated task bundle
- a persistence adapter by itself

Tasks remain the only executable primitive. An actor-bound task is still a normal task whose execution semantics include actor access.

### Semantic version boundary

Actor semantic versioning should be narrow.

The semantic actor payload is:

```ts
type ActorSemanticVersion = {
  definition: ActorDefinition;
};
```

It should not include:

- actor-bound task bindings
- session rows or durable state snapshots
- runtime state
- derived metadata rows such as `actor_task_map`
- autogenerated companion tasks, intents, or signals

This keeps actor versioning focused on state authority semantics rather than runtime expansions around the actor.

### `ActorDefinition`

The recommended 4.0 baseline is:

```ts
type ActorKeyDeclaration =
  | { source: "path"; path: string }
  | { source: "field"; field: string }
  | { source: "template"; template: string };

type ActorExtensionDeclaration = {
  id: string;
  order: number;
  config?: Record<string, unknown>;
};

type ActorDefinition = {
  schemaVersion: 1;
  name: string;
  description?: string;

  keying: {
    defaultKey: string;
    resolver?: ActorKeyDeclaration;
  };

  state?: {
    durable?: {
      initState?: Record<string, unknown>;
      schema?: Record<string, unknown>;
      description?: string;
    };
    runtime?: {
      schema?: Record<string, unknown>;
      description?: string;
      readGuard?: "none" | "freeze_shallow";
    };
  };

  extensions?: ActorExtensionDeclaration[];
};
```

Important rules:

- persisted actor definitions should stay declarative
- persisted `initState` should be data, not executable functions
- persisted key resolution should use declarative resolver objects, not arbitrary runtime functions
- service-era fields such as generated task lists, consistency profiles, and service identity do not belong in the minimal actor semantic body

### Current field classification

The current actor fields should be classified explicitly rather than carried forward by inertia.

Keep in `ActorDefinition`:

- `name`
- `description`
- `defaultKey` as `keying.defaultKey`
- declarative `key` as `keying.resolver`
- durable state schema and bootstrap data
- runtime state schema and description
- runtime read guard
- actor extensions

Move out of `ActorDefinition` into actor extensions or materialization policy:

- `loadPolicy`
- `session`

These fields still affect runtime behavior today, but they do not define the actor's semantic state-authority contract cleanly enough to live inside the minimal actor semantic version body.

Drop from actor semantics and relocate elsewhere:

- `writeContract`
- `retry`
- `consistencyProfile`
- `kind` / `is_meta`
- `tasks` / `taskBindings`

These belong elsewhere because:

- `writeContract` and `retry` are task or execution-policy concerns
- `consistencyProfile` is a distributed/runtime hint
- `kind` / `is_meta` should become tags, placement, or other non-actor-semantic metadata
- `tasks` / `taskBindings` belong to task-side binding and should be projected into `actor_task_map`

### `loadPolicy`

`loadPolicy` should not survive as part of semantic `ActorDefinition`.

Reason:

- it changes cell-local runtime timing, not actor meaning
- the database-native model makes default-key prewarming an operational concern rather than a semantic one
- when an actor needs eager/default-key setup, that usually belongs to an explicit bootstrap or initialization flow rather than a hidden materialization flag

The recommended 4.0 rule is:

- actor key materialization is lazy by default
- no semantic `loadPolicy` field remains in `ActorDefinition`
- eager or prewarmed actor setup should be expressed through extensions or seeded meta flows when it is actually needed

### `session`

The current `session` field mixes two different concerns and should not survive intact in 4.0.

Those concerns are:

1. local actor-key residency
   - idle TTL
   - absolute TTL
   - touch-on-read
   - local in-memory eviction
2. durable backing
   - first-touch hydration
   - durable persistence policy
   - persistence timeout and backing contract

The recommended early actor extension catalog is:

- `cadenza.actor.residency.v1`
- `cadenza.actor.persistence.v1`
- `cadenza.actor.meta_support.v1`
- `cadenza.actor.postgres.v1`

`cadenza.actor.browser.v1` is expected, but should be deferred until UI console planning because its security and runtime requirements need to be designed with that surface.

Memory and projection-style actor extensions should remain deferred until the knowledge graph, facts, and agent development methodology are revisited.

#### `cadenza.actor.residency.v1`

This should be a shared per-cell actor support slice. It governs local actor-key residency, not durable state.

Core rule:

```text
Cell-local eviction is not semantic expiry.
```

If `(actorObjectKey, actorKey)` is evicted from a chamber, the actor still exists semantically. A future first touch can assign and hydrate it again.

It owns:

- idle TTL
- absolute TTL
- touch-on-read
- local eviction of materialized actor-key state

It does not own durable persistence or hydration.

Recommended config:

```ts
type ActorResidencyConfig = {
  idleTtlMs?: number;
  absoluteTtlMs?: number;
  touchPolicy: {
    onRead: boolean;
    onWrite: boolean;
    onSignal?: boolean;
  };
  eviction: {
    mode:
      | "never_while_ready"
      | "after_idle"
      | "memory_pressure_allowed"
      | "manual_only";
    requireCleanState: boolean;
  };
  drainBehavior:
    | "wait_for_clean"
    | "evict_after_flush"
    | "force_repair_if_dirty";
  prewarm?: {
    enabled: boolean;
    keys?: string[];
    selector?: ActorKeySelector;
  };
};
```

Recommended defaults:

- `touchPolicy.onRead = false`
- `touchPolicy.onWrite = true`
- `touchPolicy.onSignal = false`
- `eviction.requireCleanState = true`
- persisted actors default to `drainBehavior = "wait_for_clean"`

TTL semantics:

- `idleTtlMs` measures time since last configured touch
- `absoluteTtlMs` bounds local residency lifetime even if touched
- neither TTL is semantic environment-wide expiry

Eviction modes:

- `never_while_ready` is safest but can grow memory
- `after_idle` evicts after idle TTL when state is clean
- `memory_pressure_allowed` lets the host evict clean actors under pressure
- `manual_only` limits eviction to support or control flows

Prewarm is operational, not semantic. It creates or hydrates residency early through the same host assignment and hydration path as first-touch residency.

Prewarm must obey:

- actor residency capability membership
- host assignment
- persistence hydration policy
- current placement and projection
- authorization when initiated by a human or agent
- containment state

Recommended extended internal residency states:

```ts
type ActorResidencyState =
  | "assigned"
  | "hydrating"
  | "ready"
  | "draining"
  | "evicting"
  | "evicted"
  | "degraded"
  | "repair_required";
```

The existing host-local projection may keep the smaller public state set until the implementation needs these extended internal states.

#### `cadenza.actor.persistence.v1`

This should be a separate actor support capability with authority-facing behavior.

It owns:

- durable hydration
- durable write-through or write-behind policy
- persistence timeout and backing contract
- stale-write guards and related persistence semantics

It does not own cell-local residency TTL or eviction.

Important rule:

- cell-local actor-key eviction must not imply semantic environment-wide expiry

If true environment-wide expiry is needed, it should be modeled explicitly in durable actor state or higher-level flows rather than inferred from cell-local eviction.

Actor persistence should be a support capability, not part of the actor primitive and not a special execution path.

Business tasks should not call persistence directly. Actor-bound tasks use local actor state normally. The runtime and support slices turn local actor state events into hydration, persistence, repair, and evidence flows.

Recommended config:

```ts
type ActorPersistenceConfig = {
  backing:
    | {
        kind: "authority";
        surfaceKey: string;
      }
    | {
        kind: "postgres";
        actorObjectKey: string;
        schemaRef?: string;
      }
    | {
        kind: "plugin";
        providerKey: string;
        configRef?: string;
      };
  hydration: {
    mode: "first_touch" | "prewarm" | "manual";
    readyGate: "required" | "not_required";
    timeoutMs?: number;
    createOnFirstTouch?: boolean;
  };
  writes: {
    mode: "write_through" | "write_behind" | "checkpointed";
    flushIntervalMs?: number;
    maxPendingWrites?: number;
    staleWriteGuard: "assignment_epoch" | "state_version" | "both";
  };
  recovery: {
    maxAttempts: number;
    onHydrationFailure: "retry" | "repair_required" | "fail_residency";
    onWriteFailure:
      | "fail_execution"
      | "mark_degraded"
      | "retry_then_repair";
  };
  evidence?: {
    successfulHydration?: "summary" | "full";
    successfulWrite?: "summary" | "full";
    failure: "summary" | "full";
  };
};
```

Recommended defaults:

- `hydration.mode = "first_touch"`
- `hydration.readyGate = "required"`
- `hydration.createOnFirstTouch = false` unless explicitly allowed
- `writes.mode = "write_through"` unless policy allows weaker durability
- `writes.staleWriteGuard = "both"`
- `recovery.onHydrationFailure = "repair_required"`
- `recovery.onWriteFailure = "fail_execution"` for `write_through`
- `recovery.onWriteFailure = "retry_then_repair"` for `write_behind` and `checkpointed`
- failure evidence is `full`

`prewarm` is early first-touch-like preparation, not a different owner model.

##### First-touch hydration and ready gate

For persisted local-residency actors, first-touch residency is not ready until durable state is hydrated and installed for the matching `assignmentEpoch`.

Recommended flow:

```text
first touch for actor key
-> host assigns owner chamber
-> host records ActorResidencyResponsibility(status = hydrating, assignmentEpoch)
-> hydration support slice receives signal
-> support slice loads durable state
-> owner chamber installs local actor state
-> owner chamber reports ready with assignmentEpoch
-> host marks residency ready
```

Hydration requests are generated by host or support flows, not by business tasks:

```ts
type ActorHydrationRequest = {
  requestKey: string;
  actorObjectKey: string;
  actorKey: string;
  targetChamberKey: string;
  assignmentEpoch: number;
  actorVersion: number;
  stateSchemaHash?: string;
  deadlineAt?: string;
};

type ActorHydrationResult =
  | {
      kind: "hydrated";
      actorObjectKey: string;
      actorKey: string;
      assignmentEpoch: number;
      durableVersionRef?: string;
      stateVersion: number;
      stateRef?: string;
      stateSnapshot?: AnyObject;
    }
  | {
      kind: "empty_initialized";
      actorObjectKey: string;
      actorKey: string;
      assignmentEpoch: number;
      stateVersion: 0;
      stateSnapshot: AnyObject;
    }
  | {
      kind: "failed";
      actorObjectKey: string;
      actorKey: string;
      assignmentEpoch: number;
      reason:
        | "not_found"
        | "schema_mismatch"
        | "backing_unavailable"
        | "timeout"
        | "permission_denied"
        | "corrupt_state";
      repairable: boolean;
    };
```

The owner chamber should install hydrated state only if:

- assignment epoch matches current host projection
- actor object and version match the materialized actor
- schema hash is compatible
- state version is not older than already-installed state
- chamber is still eligible owner
- containment state allows install

Ready reporting should include:

```ts
type ActorResidencyReadySignal = {
  actorObjectKey: string;
  actorKey: string;
  chamberKey: string;
  assignmentEpoch: number;
  stateVersion: number;
  durableVersionRef?: string;
  readyAt: string;
};
```

The host marks ready only if the chamber is still assigned owner, the assignment epoch matches, the chamber is ready, actor state install succeeded, and no containment or revocation invalidated the residency.

Hydration failure should not silently fall through to empty state unless policy explicitly permits it:

- `not_found` may become `empty_initialized` only if `createOnFirstTouch` allows it
- `schema_mismatch` moves to repair or explicit migration
- `backing_unavailable` remains hydrating until timeout, then retries or repairs
- `timeout` retries according to policy, then repairs
- `permission_denied` fails and emits security evidence
- `corrupt_state` is quarantined or repaired; it must not be overwritten by empty initialization

V1 schema compatibility rule:

```text
If durable state schema hash does not match the materialized actor schema hash, hydration fails into repair or explicit migration.
```

Implicit migrations should not run inside ordinary hydration unless the persistence extension declares a migration capability and policy allows it.

Partial hydration is deferred for v1. Actor `ready` means required state is installed.

##### Write policy and stale-owner guards

Persistence write modes are:

```ts
type ActorPersistenceWriteMode =
  | "write_through"
  | "write_behind"
  | "checkpointed";
```

`write_through` means task completion waits for durable persistence. It is appropriate when loss or ambiguity is unacceptable, including control state, security-sensitive state, money or billing state, authority-adjacent actor state, and state used for production decisions.

`write_behind` means task completion may follow local mutation while persistence support flushes later. It is appropriate only when policy accepts a short loss or repair window, such as cache-like state, UI/session state, low-risk agent scratch state, or recoverable derived state.

`checkpointed` means actor state changes are persisted at declared checkpoints and should reuse the persistent-flow model. It is appropriate for long-running agent sessions, repair flows, plugin activation flows, multi-step reconciliations, and state where every small mutation does not need a durable commit but declared checkpoints do.

The runtime should emit a structured internal event after local persisted actor state mutation:

```ts
type ActorStateMutationEvent = {
  eventKey: string;
  actorObjectKey: string;
  actorKey: string;
  mutationKey: string;
  stateVersion: number;
  assignmentEpoch: number;
  access: "write";
  writeMode: ActorPersistenceWriteMode;
  writeSetRef?: string;
  fullStateRef?: string;
  taskExecutionId: string;
  rootExecutionId: string;
  occurredAt: string;
};
```

Rules:

- `mutationKey` is stable for idempotency
- `stateVersion` is monotonic per `(actorObjectKey, actorKey)` on the current owner
- `assignmentEpoch` ties the mutation to the host-owned residency assignment
- `writeSetRef` is preferred over full snapshots
- `fullStateRef` is allowed for small/simple actors or checkpoint snapshots
- business tasks do not emit this manually; the runtime emits it

Stale-owner protection is mandatory:

```ts
type ActorPersistenceGuard = {
  actorObjectKey: string;
  actorKey: string;
  expectedAssignmentEpoch: number;
  expectedStateVersion?: number;
  idempotencyKey: string;
};
```

The persistence support slice must verify:

- actor residency still belongs to the emitting chamber
- assignment epoch matches
- state version ordering is valid
- mutation idempotency key has not already committed differently

If a chamber was the old owner and tries to flush after reassignment, persistence must reject the write.

Persistence needs durable completion records for idempotency and recovery:

```ts
type ActorPersistenceCommit = {
  commitKey: string;
  mutationKey: string;
  actorObjectKey: string;
  actorKey: string;
  assignmentEpoch: number;
  stateVersion: number;
  backingVersionRef: string;
  committedAt: string;
};
```

Retry can then answer:

- already committed: no-op success
- not committed: attempt if guard is still valid
- committed differently: `repair_required`

Failure semantics by write mode:

- `write_through` failure fails the task or delegated graph; no successful task result should imply durable write if persistence failed
- `write_behind` failure marks actor persistence state degraded, retries through the support slice, and moves to repair if attempts are exhausted
- `checkpointed` checkpoint failure fails or pauses the persistent flow and ambiguous checkpoint state moves to repair

Important ownership split:

```text
Actor owner chamber owns current local runtime state.
Host owns actor residency and assignment epoch.
Persistence backing owns durable committed state.
```

Persistence never decides ownership or routing. It only accepts or rejects reads and writes according to host-owned residency truth and persistence policy.

### `idempotency`

`idempotency` should not survive as an actor concern in 4.0.

Reason:

- the current behavior is already scoped to task execution, not to the actor in isolation
- duplicate suppression semantics belong with task execution policy and retry semantics
- actor-bound tasks may use actor key as one scope dimension, but that does not make idempotency an actor capability

The recommended 4.0 rule is:

- idempotency becomes a general task capability
- actor-bound tasks may specialize that capability with actor key as part of dedupe scope
- `ActorDefinition` should not carry idempotency policy

This likely fits best as a task extension or shared task-support capability rather than a core actor feature.

### Task-side actor binding

Actor-task binding should move to task semantics.

That means:

- the source of truth for actor binding belongs on the task side
- `actor_task_map` should remain as a derived projection or reasoning cache
- changing actor binding should change task semantics, not actor semantics

The current `actor.task(...)` API remains useful as authoring sugar, but in a DB-native model it should compile down to:

- a normal task semantic definition
- plus an explicit actor-binding contract on the task side

The recommended task-side binding shape is an explicit task extension capability rather than a new top-level task field.

Conceptually:

```ts
{
  id: "cadenza.actor.binding.v1",
  order: 20,
  config: {
    actorObjectKey: string,
    access: "read" | "write",
    role: "user" | "manager",
    interaction: "local_residency" | "signal_mediated"
  }
}
```

Important rules:

- the binding references the logical actor object, not a specific actor version and not a per-invocation actor key
- actor instance key resolution still happens at invocation time through the actor's keying contract
- `meta` should not be part of actor binding; meta/business/system classification belongs elsewhere in task semantics
- `role = "user"` means semantic use of actor state
- `role = "manager"` means operational management such as persistence, hydration, eviction, repair, or similar support behavior
- `interaction = "local_residency"` means the task expects direct local actor access on the owning chamber
- `interaction = "signal_mediated"` means the task may interact with the actor through unique signals plus ephemeral resolve tasks when cross-chamber interaction is required

Derived validation rules:

- actor `userLayer` should be derived from all `role = "user"` bindings for that actor object
- all user bindings for one actor must resolve to the same layer
- if business user bindings exist, meta bindings may only be `manager`
- if meta user bindings exist, business user bindings are invalid
- manager bindings are meta-only in v1
- `sticky_actor_key` ingress and direct actor residency derive from `role = "user" + interaction = "local_residency"`
- signal-mediated actor interaction does not imply direct actor residency ownership

Important generated-support clarification:

- business-owned actors may still opt into generated meta-support endpoints
- those endpoints are manager-only surfaces, not business semantic tasks
- they execute where the actor owner lives, even when that is a business chamber
- they are callable only from eligible meta callers through generated hidden proxies
- they should be generated into host meta authority, not authored into semantic task registry and not generated by default for every actor

For reasoning and DB-first introspection, `actor_task_map` should remain a first-class normalized projection.

But its derivation point should change:

- not runtime-published by cells
- not manifest-derived
- authority-derived directly from task semantic content at write time

That keeps:

- task-side actor binding as the canonical source of truth
- pre-materialization reasoning strong in the database
- cell materialization simpler because it does not need to publish binding metadata back to authority

### Extension boundary

Core should only materialize the local actor runtime baseline:

- per-key durable state
- per-key runtime state
- declarative key resolution
- local read/write guard behavior required by actor-bound tasks

Everything else should move outward into actor extensions or environment-owned flows.

Under the general extension capability model, actors should mostly rely on shared support slices rather than one-off per-actor hidden flows.

The useful actor-specific split is:

1. `local runtime adapters`
   - enrich the local materialized actor runtime when truly needed
   - examples: runtime read shaping or lightweight actor-access hooks
2. `shared actor support slices`
   - per-cell or singleton support flows that implement reusable actor capabilities for many actors
   - examples: session TTL/eviction, durable hydration, durable persistence backing
3. `expansion bundles`
   - generate or manage companion objects around the actor
   - examples: PostgresActor CRUD surfaces, browser runtime setup/readiness/projection flows

Specialized actors such as PostgresActor and browser runtime actor should therefore be treated as extension bundles, not core actor subtypes.

This is also closer to how some task capabilities already work:

- deputy tasks and signal transmission tasks are primitive-local participation points in broader support flows for route selection and transport
- they are not the whole capability by themselves

### Authority-native generated expansion lifecycle

Some actor extensions will need to generate durable companion surfaces such as official tasks, intents, signals, and supporting database structures.

The intended 4.0 model is not:

- cells generate those durable objects locally and then publish manifests back outward

The intended model is:

1. an actor definition is written to authority
2. a live cell materializes that actor and the relevant expansion capability
3. a cell-hosted meta slice reconciles the desired generated bundle through the privileged authority-access tasks
4. those generated tasks, intents, signals, and related structures are written to authority as first-class objects and versions
5. normal projection and materialization passes pick them up as real runtime objects

This means the durable generated bundle is still authority-native even though a live cell performs the reconciliation work.

#### Bootstrap note: privileged authority-access slice first

The environment should not seed an authority `PostgresActor` as the root authority substrate.

Instead:

1. trusted static cell bootstrap should perform one explicit bootstrap call
2. that bootstrap call should materialize the privileged authority-access slice
3. that slice becomes the sole holder of direct `authority_access`
4. actor expansion and other meta reconciliation flows should write to authority through that slice

This removes the earlier authority-`PostgresActor` chicken-and-egg path from the root authority model.

#### Authoring example: user-created PostgresActor

Normal development should follow the same pattern.

When a human or agent adds a new `PostgresActor` to authority through the live meta system:

1. the actor object is written to authority
2. a live cell observes and materializes the new actor definition
3. the expansion reconciler generates the official bundle in authority
4. the next materialization pass brings that bundle into runtime

The intended result is near-live convergence: a newly added actor should become materially testable within seconds, without requiring direct database authoring or retroactive manifest publishing from cells.

Important rules:

- the generated bundle must be written to authority as first-class graph content
- generation must be idempotent and reconciliatory rather than append-only
- cells perform the reconciliation work, but they do not become the long-term authority for the generated bundle
- the same authority-native lifecycle should apply to future dynamic flow generators whose outputs should outlive one execution or one cell

### Expansion-bundle reconciliation contract

The actor extension declaration should remain the source of truth for what durable generated bundle is desired.

The minimal source identity is:

- `sourceObjectKey`
- `sourceVersion`
- `capabilityId`
- extension `config`

That combination should declare the desired generated bundle. There should not be a second hand-authored durable bundle definition beside it.

The recommended authority-side projections are:

```ts
type ExpansionBundle = {
  bundleKey: string;
  sourceObjectKey: string;
  sourceVersion: number;
  capabilityId: string;
  status:
    | "pending"
    | "reconciling"
    | "ready"
    | "error"
    | "superseded"
    | "retiring"
    | "retired";
  desiredHash: string;
  appliedHash?: string;
  predecessorBundleKey?: string;
  successorBundleKey?: string;
  lastError?: string;
};

type ExpansionBundleMember = {
  bundleKey: string;
  memberKey: string;
  memberHash: string;
  objectType: "task" | "intent" | "signal" | "helper" | "global" | "actor";
  objectKey: string;
  objectVersion?: number;
  status: "planned" | "active" | "retiring" | "retired" | "error";
  reusedFromBundleKey?: string;
};

type GeneratedObjectProvenance = {
  objectKey: string;
  objectVersion: number;
  sourceObjectKey: string;
  sourceVersion: number;
  capabilityId: string;
  bundleKey: string;
  memberKey: string;
  ownership: "managed";
};
```

Important semantics:

- `bundleKey` identifies one reconciled generated bundle for one source object version plus capability
- `memberKey` is the stable semantic slot for one generated artifact inside the bundle
- `GeneratedObjectProvenance` should let the system answer which source version and capability produced a given managed object version
- generated members should be treated as managed, not as ad hoc authored objects
- these should be modeled as standalone authority-side control-plane tables or projections in v1 rather than folded into a generic reconciliation framework

The critical stability rule is that `memberKey` should remain stable across reconciliations. Typical examples are:

- `table:telemetry:task:query`
- `table:telemetry:intent:insert`
- `table:telemetry:signal:updated`

That lets reconciliation distinguish:

- same `memberKey`, changed definition: create a new version of the same logical object
- new `memberKey`: create a new logical object and add it to the bundle
- removed `memberKey`: retire that managed member from the active bundle while keeping history

So durable generated updates should normally be version bumps of stable logical objects, not duplicate object creation.

Recommended lifecycle rules:

- for one `(sourceObjectKey, capabilityId)`, at most one bundle should be `ready`
- a source-version change should create a successor bundle linked by `predecessorBundleKey` and `successorBundleKey`
- when the successor becomes `ready`, the predecessor becomes `superseded`
- if the source object is deleted or the capability disappears, the active bundle should move through `retiring` to `retired`
- for one `memberKey`, unchanged `memberHash` should reuse the current object version, while changed `memberHash` should create a new version of the same logical object

### Expansion-bundle reconciliation flow

The intended authority-native loop is:

1. source actor version lands in authority
2. a live cell materializes the actor and expansion capability
3. the expansion reconciler computes the desired member set and `desiredHash`
4. it diffs against the current active bundle membership
5. changed members produce new versions of existing logical objects
6. new members create new logical objects
7. removed members are retired from the active managed bundle
8. the bundle becomes `ready` only when both generated graph members and required backing resources have converged

This is especially important for `PostgresActor`:

- the reconciler should own both backing database structures and official generated graph surfaces
- the bundle should not be considered `ready` until both are in place
- that is what makes the actor feel almost immediately live and testable after it is added

For v1, backing-resource details should stay capability-specific rather than introducing a generic backing-resource table. Bundle status can summarize whether those capability-specific resources have converged.

### Expansion-control flow topology

For v1, durable generated bundle reconciliation should be owned by one singleton environment meta slice rather than by every cell independently.

That means:

- the work is still live-cell-hosted
- the active host cell may change over time
- but only one ready replica should own the durable bundle reconciliation loop at a time

This is the simplest way to avoid duplicate bundle writes, competing retirement passes, and unnecessary distributed coordination for authority-native generated surfaces.

The recommended split is:

1. `generic expansion-control flow`
   - singleton environment slice
   - owns bundle lifecycle orchestration, bundle rows, member rows, provenance writes, and final readiness/supersession transitions
2. `capability planner`
   - extension-owned
   - computes the desired generated bundle for one `(sourceObjectKey, sourceVersion, capabilityId)`
3. `capability backing reconciler`
   - extension-owned
   - converges any backing resources required before the bundle can become `ready`

The generic control flow should consume a transient planning contract like:

```ts
type DesiredExpansionMember = {
  memberKey: string;
  memberHash: string;
  objectType: "task" | "intent" | "signal" | "helper" | "global" | "actor";
  objectKey: string;
  semanticPayload: Record<string, unknown>;
};

type ExpansionPlan = {
  sourceObjectKey: string;
  sourceVersion: number;
  capabilityId: string;
  desiredHash: string;
  members: DesiredExpansionMember[];
  backingStateHash?: string;
};
```

The recommended seeded flow set is:

1. `source change detector`
   - observes source object version changes, current-pointer changes, capability declaration changes, source deletion, and manual reconcile requests
   - emits one reconcile request for the affected `(sourceObjectKey, capabilityId)`
2. `bundle reconciler`
   - loads the source object/version and active predecessor bundle
   - requests the capability planner
   - creates or updates the `ExpansionBundle` row in `reconciling`
3. `backing reconciler`
   - runs capability-specific backing convergence such as schema migration or setup
   - reports whether backing resources are converged for the planned hash
4. `generated member applier`
   - diffs desired members against active bundle membership
   - creates new logical objects where needed
   - creates new versions for changed stable members
   - reuses unchanged members
   - marks missing members as `retiring`
   - writes `ExpansionBundleMember` and `GeneratedObjectProvenance`
5. `bundle finalizer`
   - marks the bundle `ready` only when members and backing resources are both converged
   - marks the predecessor `superseded`
   - emits a ready or failed signal for observability
6. `bundle retirement reconciler`
   - handles source deletion, capability removal, or explicit retirement requests
   - moves members through `retiring` to `retired`
   - then moves the bundle to `retired`

Recommended trigger cases for the source change detector:

- source actor object created
- source actor current version changed
- expansion capability config changed on the current source version
- source actor deleted or deactivated
- backing reconcile failure or recovery signal
- explicit human or agent reconcile request

Important rules:

- the generic control flow should not know how to build a `PostgresActor` CRUD surface or any other capability-specific bundle
- the capability planner should not write authority rows directly except through the privileged authority-access tasks owned by the reconciliation flow
- the active singleton expansion-control slice should remain idempotent and safe to rerun at any point
- normal materialization should remain downstream of authority writes; the bundle control flow should not inject durable generated tasks directly into runtime

### First shipped capability-specific contract: `PostgresActor`

The first concrete planner and backing-reconciler contract should be defined for the `PostgresActor` expansion capability.

Conceptually:

- the source actor declares a Postgres-backed schema capability
- the capability planner computes the official generated CRUD surface and related intents/signals
- the capability backing reconciler converges the physical database and schema state required before that surface is considered `ready`

The planner should produce a capability-specific plan shaped like:

```ts
type PostgresExpansionPlan = {
  sourceObjectKey: string;
  sourceVersion: number;
  capabilityId: "cadenza.actor.postgres.v1";
  actorObjectKey: string;
  actorName: string;
  actorToken: string;
  databaseName: string;
  schemaVersion: number;
  schemaHash: string;
  desiredHash: string;
  members: DesiredExpansionMember[];
  backingStateHash: string;
};
```

The minimal member classes for v1 should be:

- generated CRUD tasks per table
  - `query`
  - `insert`
  - `update`
  - `delete`
- generated macro intents where the capability exposes them
  - `count`
  - `exists`
  - `one`
  - `aggregate`
  - `upsert`
- generated CRUD intents
- generated operation signals when the capability declares them as official surfaces

Typical stable `memberKey` shapes should be:

- `table:{table}:task:query`
- `table:{table}:task:insert`
- `table:{table}:intent:query`
- `table:{table}:intent:upsert`
- `table:{table}:signal:inserted`

The backing reconciler should own a capability-specific state contract such as:

```ts
type PostgresExpansionBackingState = {
  actorObjectKey: string;
  sourceVersion: number;
  databaseName: string;
  schemaVersionTarget: number;
  schemaHash: string;
  databaseReady: boolean;
  migrationLedgerReady: boolean;
  schemaReady: boolean;
  lastAppliedMigrationVersion?: number;
  status: "pending" | "reconciling" | "ready" | "error";
  lastError?: string;
};
```

The v1 backing reconciler for `PostgresActor` should be responsible for:

1. ensuring the target database exists
2. ensuring the migration ledger exists
3. applying pending migrations or baseline logic
4. reconciling additive schema snapshot state
5. reporting whether the backing state matches the planned `schemaHash`

The generic expansion-control flow should then use:

- `PostgresExpansionPlan.desiredHash` for generated member reconciliation
- `PostgresExpansionPlan.backingStateHash` plus the backing reconciler status for readiness

Recommended readiness rule for `PostgresActor`:

- bundle `ready` requires:
  - all generated members reconciled
  - backing reconciler status `ready`
  - backing reconciler hash matching the planned `backingStateHash`

This keeps graph-surface convergence and backing-resource convergence separate, while still giving one clear bundle-level readiness outcome.

Important non-goals for this first contract:

- introducing unit-level scaling rules for generated bundles

The root authority bootstrap path is intentionally outside this actor contract:

- the privileged authority-access slice should come from static cell bootstrap rather than from a generated authority `PostgresActor`
- `PostgresActor` remains a higher-level expansion convention once the authority-access slice already exists

Generated bundle scaling should stay deferred for now. In v1, generated members should inherit the placement behavior of the surfaces that materialize them rather than becoming a separate placement abstraction immediately.

Managed generated objects should also follow one edit-ownership rule:

- direct manual edits to a managed generated object should be blocked, rejected, or overwritten by reconciliation
- if a human or agent wants to customize one permanently, they should fork it into a normal authored object instead

This contract only applies to durable generated surfaces that should outlive one execution or one cell.

It does not apply to:

- execution-scoped ephemeral helper tasks
- runtime-owned bridge artifacts such as deputies and signal transmission tasks

### Materialization consequence

Cells should materialize actor definitions before tasks that depend on them.

At a high level:

1. materialize local actors, helpers, and globals
2. materialize tasks, including actor-bound tasks
3. resolve task wiring and any bridge artifacts

This keeps actor state authority available before task materialization starts depending on it.

### Explicit deferred loose ends

The following actor-specific details remain intentionally open:

- additional actor extension catalog entries beyond the early v1 set
- `cadenza.actor.browser.v1` details, deferred until UI console planning
- memory and projection-style actor extensions, deferred until knowledge graph, facts, and agent methodology work
- unit-level placement and scaling rules for durable generated bundles
- additional capability-specific planner and backing-reconciler contracts beyond the first `PostgresActor` cut
- exact backing schemas and provider contracts for actor persistence implementations

Implementation details are still open, but the intended direction is now fixed:

- durable generated companion objects should be reconciled by live cell-hosted meta slices
- those slices should write the official bundle through the privileged authority-access tasks
- normal projection and materialization should then make the bundle live
- v1 should use standalone authority-side bundle, bundle-member, and generated-provenance rows rather than a generic reconciliation framework
- the first shipped capability-specific planner/backing contract should be `PostgresActor`

## Object And Version Foundation

### Object identity

`object_registry` is the canonical attachment point for:

- tags
- policy
- audit
- routing
- search
- future version selection and promotion workflows

Every persistent logical object gets one registry row and one primitive-specific semantic body.

Important 4.0 goal:

- core runtime identity should become logical-object-key-first rather than name-first
- for executable primitives, the canonical local runtime identity should be the logical object key such as `taskKey`
- human-facing names should remain labels and convenience aliases, not the authoritative execution identity
- registry lookup and runner APIs should therefore move toward key-first contracts, with name-based lookup retained only as compatibility sugar during migration
- name collisions must never define runtime correctness
- during migration, any remaining name-based lookup must either resolve unambiguously or fail as ambiguous; callers must switch to key-based resolution instead of relying on colliding names

### Governed object metadata

The cross-cutting layer starts with:

- `object_type`
- `object_lifecycle_state_definition`
- `object_registry`

These tables define what a thing is, whether it is taggable, whether it can be a policy subject or resource, and what lifecycle state it is currently in.

### Versioning

Versioning is modeled as:

- `object_version`
- primitive-specific version tables such as `task_version`, `intent_version`, `helper_version`, `global_version`, and `actor_version`
- `version_mark_definition`
- `object_version_mark_assignment`
- `object_version_pointer`
- `object_version_pointer_history`

Important semantics:

- versions are immutable
- every persisted semantic edit creates a new version unless the semantic payload is identical and resolves to an existing version for that logical object
- `content_hash` is computed from canonicalized semantic payload only
- version creation requires a base version and should reject stale-base writes by default
- rollback is a pointer move to an existing version, not creation of a new version row
- pointer changes and version marks are separate concerns
- every version has exactly one active primary mark per environment

Version marks are environment-scoped judgments such as:

- `candidate`
- `stable`
- `unstable`
- `rejected`
- `rolled_back`

They are governed and append-only in history, but separate from the main tag system.

## Tag Foundation

The tag subsystem is a control-plane system, not a decorative label feature.

It is built around:

- `tag_category`
- `tag`
- `tag_assignment_reason_definition`
- `object_tag_assignment`
- `effective_object_tag`
- `effective_object_tag_source`

### Tag categories

Categories are governed and environment-scoped. They carry the main semantics for:

- cardinality
- policy relevance
- materialization relevance
- system-only vs user-assignable defaults
- default UI color

The initial category set should stay small:

- `descriptive`
- `ownership`
- `placement`
- `security`
- `operational`

### Direct assignments and effective tags

`object_tag_assignment` is the authority for direct tag assignment history.

`effective_object_tag` is the authority for the current effective tag set per logical object.

`effective_object_tag_source` records the current provenance paths that make an effective tag exist, for example:

- direct assignment
- derivation from another object
- system attachment

### Cache strategy

Caches are projections only.

The first shared cache surface is:

- `object_registry.effective_tags_cached`

Native-table cache columns may be added later where profiling proves they help, but policy and authority should always be driven by normalized rows first.

## Policy Foundation

The initial policy system is split into two core rule families. The broader v1 security base extends these with capability, secret, delegation, plugin, and authority-gateway decisions, but resource access and tag management remain the foundation.

### Resource-access policy

Resource-access rules cover:

- `read`
- `write`
- `execute`
- `materialize`

The base tables are:

- `policy_rule`
- `policy_rule_subject_tag`
- `policy_rule_resource_tag`

These rules evaluate:

- subject effective tags
- resource effective tags
- subject object type
- resource object type
- subject lifecycle
- resource lifecycle

### Tag-management policy

Tag-management rules cover:

- `assign_tag`
- `remove_tag`
- `create_tag`

The base tables are:

- `tag_policy_rule`
- `tag_policy_rule_subject_tag`
- `tag_policy_rule_target_object_tag`
- `tag_policy_rule_target_tag`
- `tag_policy_rule_target_category`

These rules are stricter than generic `write`. They must determine:

- whether the subject may manage the target object
- whether the subject may manage the target tag or category
- whether system-only or category-level guards prevent the operation

### Audits

`policy_decision_audit` persists high-value evaluations and their explanation envelope.

Persist by default for:

- `write`
- `execute`
- `materialize`
- `assign_tag`
- `remove_tag`
- `create_tag`
- `use_capability`
- `access_secret`
- `mint_delegation`
- `authority_gateway`

For `read`, evaluate dynamically and persist only in debug mode or explicit tracing flows.

## Authority Persistence And Generated Persistence Integration

This schema preserves lessons from existing PostgresActor capabilities, but root authority persistence should flow through the privileged authority-access slice.

### Root authority substrate

The privileged authority-access slice is the low-level authority persistence substrate.

It should expose task-shaped, domain-shaped operations such as:

- graph queries
- graph commands
- projection commands
- bootstrap administration
- repair administration

It should not expose a generic table-by-table CRUD tunnel as the root authority API.

### Generated persistence surfaces

Autogenerated PostgresActor primitives should provide:

- CRUD tasks
- default read/query intents
- post-commit table signals with full inserted/updated row context

These primitives are higher-level generated persistence surfaces. They are useful for mechanical table operations once the authority-access slice and expansion system already exist, but they are not the foundational gateway to environment authority.

### Custom meta tasks

Custom tasks should exist only where Cadenza needs higher-level semantics:

- invariant enforcement
- context shaping before inserts or updates
- multi-row atomic operations
- policy evaluation
- projection and recompute orchestration

Examples:

- `Tag.Assign`
- `Tag.Remove`
- `Tag.RecomputeEffectiveForObject`
- `Version.CreateInitialObject`
- `Version.CreateNextVersion`
- `Version.SetCurrent`
- `Version.Mark`
- `Policy.EvaluateResourceAction`
- `Policy.EvaluateTagAction`

### Recommended split of responsibility

Use generated persistence tasks plus signals when:

- the operation is a single-row mechanical persistence step
- the generated surface is an official managed graph object
- downstream recomputation can happen after commit

Use privileged authority-access tasks when:

- the operation belongs to root authority
- the operation mutates graph, policy, placement, projection, security, plugin, evidence, bootstrap, or repair authority
- domain-shaped validation, authorization, and evidence are required

Use one orchestrating task when:

- a hard invariant spans multiple rows
- partial success would create an invalid state

Examples of hard invariant boundaries:

- create logical object + first version + current pointer + initial primary mark
- create next version and mark it `candidate` under one semantic operation

Examples of reactive flows:

- insert a direct tag assignment row
- listen to the post-commit insert signal
- recompute effective tags
- update caches

## Practical Use

This schema supports a few concrete operational goals immediately:

- agents can compare semantic versions and roll back by moving version pointers
- humans can filter candidate vs stable versions without conflating them with policy tags
- engines can materialize slices according to policy and placement tags
- team or domain ownership can be expressed without hard service boundaries
- tag mutation can be governed independently from ordinary object editing

## Deferred Items

These are intentionally left out of the first proposal:

- version taggability
- execution-trace taggability
- tag-to-tag implication
- category applicability restrictions by object type
- nested-environment rule inheritance
- precomputed authorization graphs
- final fact versioning model
- final meta-memory storage schema, query language, and UI console

## Related Documents

- [cadenza-meta-memory.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-meta-memory.md)
- [cadenza-environment.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-environment.md)
- [cadenza-flow-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-flow-design.md)
- [vision.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/vision.md)
