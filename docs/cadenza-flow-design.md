# Cadenza Flow Design

This document captures the first flow-design framework for building higher-level behavior with Cadenza primitives on top of the seeded environment authority and generated persistence surfaces.

It is a best-practice reference for humans and agents. It is intentionally small in its first version and should evolve as the system and norms mature.

## Purpose

The point of this framework is to help decide:

- when a flow should be orchestrated vs reactive
- how strict or loose a flow should be
- what belongs inside an invariant boundary
- what should be deferred to post-commit reactions, projections, or scheduled follow-up work

The goal is not to maximize explicitness everywhere. The goal is to use the least strict flow that still preserves the required semantic contract.

## Substrate Assumptions

This flow model assumes:

- the environment database is authoritative
- privileged authority-access tasks are the root authority persistence substrate
- PostgresActor-generated CRUD tasks, intents, and table signals are higher-level expansion conventions, not the root authority substrate
- generated persistence surfaces emit post-commit signals only after successful commit and include enough context to drive follow-up work
- custom meta tasks exist where semantics exceed raw persistence operations
- seeded meta slices are database-native seed data, not manifest-promoted file objects

The authority gateway should be task-shaped and domain-shaped. It should not be modeled as a generic table-by-table CRUD tunnel. Generated CRUD surfaces remain useful when they are official managed graph objects, but they depend on the privileged authority-access slice already existing.

## Seed Representation

The current recommended seeding approach is hybrid.

Use `initialRows` for:

- minimal bootstrap vocabulary
- structural defaults that the schema itself depends on
- foundational catalogs such as object types, lifecycle states, version marks, and reason definitions

Use external seed packs for:

- richer meta subsystems
- higher-level wrapper tasks
- policy flows
- versioning flows
- tag flows
- agent API flows

This keeps bootstrap coherent without burying large meta behavior inside schema files.

## Flow Design Framework

Every flow should be designed by choosing:

1. shape
2. strictness

### Shape

#### Orchestrated

One task coordinates the operation.

Use this when:

- one semantic action spans several checks or writes
- a hard invariant must be preserved
- the flow needs a deliberate coordination point before low-level CRUD work happens

An orchestrating task may still use:

- `inquire(intent, ctx, ...)`
- `emit(signal, ctx)`
- generated persistence intents and the tasks/flows linked behind them
- generated read intents
- custom wrapper tasks

This is the main shape for high-level coordination in Cadenza. The coordinator task uses inquiry to trigger request/response work through intents and may emit detached signals when later work should fan out or run conditionally outside the invariant boundary.

Important detail:

- `inquire(intent, ctx, ...)` does not target one specific task directly
- it triggers all tasks and sub-flows that can handle the specified intent
- their results are merged and returned to the caller
- in many cases only one task is linked to an intent, but the model is not limited to one

When this document says that a coordinator task "uses" a generated persistence task, it means the coordinator inquires the generated intent that triggers and returns the result of that generated task or flow. For root authority operations, the coordinator should instead call the explicit privileged authority-access tasks for the relevant authority domain.

#### Invocation Rule

It is forbidden to call or run tasks directly from within other tasks.

Within task logic, triggering is reserved for:

- `inquire(intent, ctx, ...)` for request/response work
- `emit(signal, ctx)` for fire-and-forget fan-out

This rule is important because confusion at this boundary leads agents to model Cadenza as direct function-calling rather than intent- and signal-driven graph execution.

#### Reactive

Work is broken into post-commit reactions or chained follow-up tasks.

Use this when:

- the core write can commit first
- recomputation or projection can happen later
- observability or fan-out is valuable
- eventual convergence is acceptable

Reactive flows can still be explicit and rich. They are not synonymous with weak behavior.

Reactive chained flows follow the standard Cadenza graph API shape. They are driven by task-to-signal, signal-to-task, and other graph relationships rather than one coordinator task holding the whole operation together.

In this shape, detached work is triggered by graph relationships and emitted signals, not by direct task-to-task invocation.

### Strictness

#### Strict

Use strict flows when partial semantic success would violate a meaningful invariant.

Typical characteristics:

- hard invariant boundary
- failure must prevent partial semantic success
- rollback or compensating behavior may be needed
- immediate consistency matters for the semantic core of the operation

Examples:

- create logical object + first version + current pointer + initial primary mark
- replace an active primary version mark
- tag assignment when cardinality and policy must hold immediately

#### Bounded

Use bounded flows when the primary semantic action must be clean, but secondary effects may happen afterward.

Typical characteristics:

- the core operation must succeed coherently
- some side effects can lag
- rollback is not always required
- immediate consistency is needed only for the direct object being changed

Examples:

- create a new version and mark it `candidate`, while auxiliary cache refreshes happen afterward
- move a current version pointer now, then run health or review follow-up work after commit

#### Loose

Use loose flows when eventual convergence is acceptable and stricter behavior would only add noise or cost.

Typical characteristics:

- partial completion is acceptable
- downstream recomputation can be debounced, squashed, or scheduled
- the flow mostly exists for projections, summaries, notifications, or secondary indexes

Examples:

- refresh cached effective tag arrays
- recompute downstream derived tags
- build monitoring summaries
- emit advisory follow-up signals

## Flow Design Principles

- Use the least strict flow that still preserves the semantic contract.
- Do not make a projection flow strict if eventual convergence is enough.
- Do not make an invariant flow loose just because signals are convenient.
- Prefer explicit rollback behavior only when partial success would violate a real invariant.
- Prefer signals, debouncing, squashing, and scheduling when they simplify the system without weakening the required contract.
- Use generated persistence primitives when they are official managed graph surfaces and already express the needed table operation.
- Use privileged authority-access tasks for root authority operations.
- Add custom meta tasks only where the system needs policy enforcement, context shaping, invariant coordination, or projection orchestration.
- Never call tasks directly from within tasks. Use `inquire(...)` for request/response and `emit(...)` for detached work.

## Practical Split Of Responsibility

Use generated persistence tasks and post-commit signals when:

- the operation is a mechanical row insert, update, or delete
- the generated surface is an official managed graph object
- the backing schema already expresses the direct write
- downstream work can happen after commit

In practice this means:

- the coordinator or wrapper task inquires the generated intent
- the generated low-level task or flow performs the DB operation
- post-commit generated signals then drive downstream reactions

Use privileged authority-access tasks when:

- the operation is part of the root authority substrate
- the operation mutates graph, policy, placement, projection, security, plugin, evidence, or bootstrap authority
- the surface needs domain-shaped policy and audit rather than generic CRUD behavior

Use a custom orchestrating task when:

- the operation spans multiple tables
- policy and copied context fields must be prepared before write
- object creation must remain atomic across several rows
- stale-base or other invariant checks must happen before the write commits

## Worked Example: `Version.CreateInitialObject`

This is the first canonical strict flow because it establishes the basic logical-object invariant.

### Semantic boundary

Create a new logical object such that it is born in a valid state:

- one `object_registry` row exists
- one first semantic version exists
- one current version pointer exists
- one active primary version mark exists, defaulting to `candidate`

If any of those fail, the object should not exist semantically.

### Shape

Orchestrated.

### Strictness

Strict.

### Why it is strict

An object with no first version, no current pointer, or no primary mark is an invalid semantic shell. That is not a case for eventual convergence.

### Recommended choreography

1. `Version.CreateInitialObject` receives the high-level request.
2. It loads and validates:
   - target `object_type`
   - initial lifecycle state
   - initial version mark definition for `candidate`
   - relevant reason definitions
   - caller identity and policy context
3. It prepares:
   - canonical object key and display name
   - canonicalized version payload
   - `content_hash`
4. Inside one atomic operation, it calls the relevant authority-access or generated persistence tasks to:
   - inquire the generated intent that inserts `object_registry`
   - inquire the generated intent that inserts `object_version`
   - inquire the generated intent that inserts the primitive-specific version row such as `task_version` or `intent_version`
   - inquire the generated intent that inserts `object_version_pointer` with `pointer_kind = current`
   - inquire the generated intent that inserts `object_version_mark_assignment` with primary mark `candidate`
5. The atomic operation commits or fails as one semantic unit.
6. After commit, autogenerated table signals fire.
7. Reactive follow-up work may then:
   - record audits
   - update caches
   - emit higher-level notifications
   - schedule downstream projections

### What belongs inside the invariant

Inside:

- logical object creation
- first version creation
- current pointer creation
- initial primary mark assignment

Outside:

- non-essential projections
- summaries
- notifications
- expensive downstream recomputation

### Why this should not be a loose reactive chain

If these writes were split into separate post-commit reactions, failure in the middle could leave an object that exists physically but not semantically. That weakens rollback, audit, and agent reasoning immediately.

## Worked Example: `Tag.Assign`

This is the first canonical bounded flow.

### Semantic boundary

Assign one direct tag to one logical object while preserving:

- tag policy
- category cardinality
- copied denormalized assignment context

### Shape

Orchestrated at the boundary, reactive for follow-up projections.

### Strictness

Bounded.

### Recommended choreography

1. `Tag.Assign` receives the request.
2. It loads:
   - the target object
   - the target tag
   - the governing tag category
   - the caller identity and effective tags
3. It evaluates tag-management policy.
4. It prepares copied assignment fields such as:
   - `category_uuid`
   - `category_cardinality_mode`
   - `assignment_source_type`
5. It calls the relevant authority-access or generated insert task for `object_tag_assignment`.
   - more precisely: it inquires the generated insert intent for `object_tag_assignment`
6. The insert commits.
7. The autogenerated insert signal fires after commit.
8. Reactive tasks then:
   - recompute `effective_object_tag`
   - update `effective_object_tag_source`
   - project `object_registry.effective_tags_cached`
   - fan out downstream recomputation if derivation rules require it

### Why it is bounded rather than strict

The direct assignment itself must be correct immediately. Downstream effective-tag projections and caches can converge after commit without violating the semantic core of the assignment.

## Worked Example: `Version.CreateNextVersion`

This is the first canonical bounded versioning flow because it combines stale-base protection, immutable version creation, and post-commit follow-up work without requiring the whole versioning lifecycle to complete synchronously.

### Semantic boundary

Create the next semantic version for an existing logical object while preserving:

- the target object is versioned
- the caller is allowed to edit it
- the submitted `base_version_uuid` is still current
- identical semantic payload reuses an existing version instead of creating a duplicate
- if a new version is created, it is born valid with a primary mark of `candidate`

This flow does not:

- move the current version pointer
- automatically rewrite marks on existing versions
- eagerly run every auxiliary projection inside the core boundary

### Shape

Orchestrated.

### Strictness

Bounded.

### Why it is bounded

The version operation itself must be coherent, but downstream audits, summaries, notifications, and secondary projections can safely happen after commit. The semantic contract is "produce or resolve the next candidate version," not "fully propagate every consequence immediately."

### Recommended choreography

1. `Version.CreateNextVersion` receives:
   - `object_uuid`
   - `base_version_uuid`
   - semantic payload
   - optional `version_note`
   - caller identity
2. It loads and validates:
   - `object_registry`
   - `object_type`
   - current version pointer
   - caller policy context
   - primary `candidate` mark definition
   - relevant reason definitions
3. It enforces the base-version rule:
   - if `base_version_uuid` is not the current version, reject
   - return a clear stale-base rejection envelope
4. It canonicalizes the semantic payload and computes `content_hash`.
5. It checks for an existing version for `(object_uuid, content_hash)`.
6. It branches:
   - if the payload matches the current version exactly, return `no_change_current`
   - if the payload matches another existing version, return `reused_existing`
   - if no identical version exists, create a new immutable version
7. In the create branch, inside one atomic operation, it calls the relevant authority-access or generated persistence tasks to:
   - inquire the generated intent that inserts `object_version`
   - inquire the generated intent that inserts the primitive-specific version row such as `task_version`, `intent_version`, `helper_version`, `global_version`, or `actor_version`
   - inquire the generated intent that inserts `object_version_mark_assignment` with primary mark `candidate`
8. The atomic operation commits or fails as one semantic unit for the create branch.
9. After commit, autogenerated table signals fire.
10. Reactive follow-up work may then:
   - record audits
   - emit higher-level `version.created` or `version.reused` signals
   - schedule comparisons or summaries
   - refresh nonessential projections

### Outcome modes

This flow should expose three clear outcomes:

- `created`
- `reused_existing`
- `no_change_current`

These outcomes are operationally different and should not be collapsed into one generic success case.

### What belongs inside the invariant

Inside:

- stale-base check
- semantic payload canonicalization and hash computation
- duplicate-version lookup
- new version row creation if needed
- primitive-specific version payload insert if needed
- initial primary `candidate` mark if needed

Outside:

- audits
- notifications
- comparisons
- summaries
- pointer movement
- nonessential projections

### Why pointer movement is not part of this flow

Creating a candidate version and selecting it as current are different semantic actions. Keeping them separate preserves clearer audit history and lets higher-level rollout flows decide when a candidate should become current.

## Documentation Norm

When documenting a new flow, use this structure:

- semantic boundary
- shape
- strictness
- why that strictness is justified
- primitive choreography
- what belongs inside the invariant
- what is safely reactive or deferred

This keeps flow discussions comparable and helps future agents avoid overbuilding or under-protecting operations.

## Related Documents

- [cadenza-environment.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-environment.md)
- [cadenza-schema-proposal.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-schema-proposal.md)
- [vision.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/vision.md)
