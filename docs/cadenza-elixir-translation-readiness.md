# Cadenza Elixir Translation Readiness

Date: 2026-07-11

## Purpose

This note records the post-Python translation lessons and applies the standard pre-translation scan to the next official language target: Elixir.

The TypeScript `cadenza` repo remains the current contract authority. The Python repo is the first translation and the first proof that official Cadenza cores should preserve shared meaning while expressing themselves idiomatically in their host language.

The intended whole remains: reduce accidental coding complexity so humans and AI can focus on business logic, intended application function, workflow shape, and the logic inside individual tasks. Deployment, scale, distribution, placement, persistence, session lifecycle, and orchestration belong in later Cadenza layers rather than the core authoring model.

## Readiness Verdict

Elixir translation is ready to start after this readiness pass.

Known caveat: TypeScript performance tests remain deferred until after a computer restart. This does not block translation because the non-performance TypeScript suite, TypeScript build/typecheck, Python tests, and coherence review have passed.

## Implementation Passes

The Elixir translation should proceed in two passes.

### Pass 1: Boring Core Parity

Purpose: prove Elixir can express the same official primitive contract without smuggling BEAM architecture, chamber runtime, distribution, persistence, or supervision strategy into the core surface.

Pass 1 should prioritize:

- repo skeleton and repo-local agent contract
- task/helper/global/actor/schema/snapshot structs or modules as needed
- stable key and name validation
- task creation, execution, context propagation, and task chaining
- minimal shared conformance runner or fixture-compatible test structure
- signal and intent naming after task execution is stable
- helpers/globals and key-first snapshots after task identity is stable
- actors after task/tool/snapshot behavior is stable

Pass 1 should avoid:

- macro DSL as the primary API
- process-per-task architecture
- distribution-style registries
- persistence, session lifecycle, hydration, placement, orchestration, or chamber concerns
- BEAM supervision strategy as a public contract

### Pass 2: Focused Elixir Expression

Purpose: make the implementation complete and genuinely Elixir-native while preserving the shared core contract proven in Pass 1.

Pass 2 may introduce:

- BEAM-native concurrency where it improves shared task semantics
- supervised isolated runtimes
- process-backed runtime internals where justified
- message-passing signal delivery internals
- `Registry` or ETS-backed lookup internals
- macro DSL for tasks/helpers/actors, compiling down to the same definitions
- behaviours for handler modules
- property or invariant tests where dependency cost is justified

Pass 2 may enrich the implementation, but it must not change shared primitive meaning.

## Translation Lessons From Python

### 1. Translate Meaning, Not Surface Shape

The Python work confirmed that a useful translation is not a mechanical port.

- Shared core meaning must remain stable.
- Public API may differ when the language has a clearer native expression.
- Language-native enrichments are allowed when they serve the intended whole.
- Each deviation from TypeScript should be deliberate and documented.

### 2. Run The Three-Category Scan First

Every new language repo must start with the same scan:

1. Shared Core: concepts, invariants, contracts, and behaviors that official language implementations must preserve.
2. Native Expression: language idioms that preserve the same meaning without copying TypeScript mechanically.
3. Language Enrichment: optional language-native features that strengthen the intended whole without becoming cross-language requirements.

The scan must also record exclusions so legacy, internal, or deferred surfaces do not enter the new repo by accident.

### 3. Keep Core Persistence-Agnostic

The TypeScript coherence review removed actor session policy, session TTL eviction, strict write-through persistence, and external durable-state hydration from core.

For all language cores:

- actor durable state means local in-memory primitive state
- persistence is not a core contract
- external hydration is not a core contract
- actor session lifecycle is not a core contract
- distributed actor synchronization belongs in chamber/cell/distribution extensions

### 4. Preserve The Callable Materialization Boundary

Definitions are serialized authority for primitive shape, identity, schemas, options, wiring, and callable slots.

Core receives already-materialized callables and materializes primitives from them. Core must not compile, eval, or otherwise convert serialized source strings into callable runtime code.

Source/language fields may remain metadata for inspection and visualization, but they are not execution authority inside core.

### 5. Treat Identity As A Contract

Stable identity rules must carry across languages:

- tasks, actors, helpers, and globals use stable keys
- names are human labels, not identity
- intents are unique lowercase kebab-case names and do not have separate key fields
- signals are unique lowercase dot-separated names and do not have separate key fields
- signal exact tags use `:<tag>` with lowercase letters, numbers, underscores, or hyphens

The first Elixir pass keeps intent authority explicit: an intent should be defined before tasks register as responders or inquiries execute. This differs from older TypeScript broker convenience behavior that can auto-create intents during observation, but it better serves the current key/name authority principle.

### 6. Keep The Public Surface Small

The TypeScript cleanup showed that internal runners, brokers, registries, graph nodes, task variant classes, build tooling, CLI hosts, and old runtime-host machinery should not become translation-source API.

New translations should expose the primitive authoring surface and contract types, not every internal mechanism needed to implement them.

### 7. Use Conformance Fixtures For Shared Behavior

Language-neutral JSON fixtures should remain the shared validation shape.

- Fixtures should test shared core semantics only.
- Language-local tests should cover idioms such as Python decorators or Elixir macros.
- When fixtures include callable metadata, the language-local runner may attach already-materialized callables before invoking core.
- Conformance should grow with shared behavior, not with language-specific conveniences.

JSON is the shared conformance/interchange boundary, not the internal truth model of each implementation. Future relational/database authority may project definitions, snapshots, schemas, and fixtures into JSON. Core implementations should normalize language-native values before crossing this boundary and must never use JSON as executable authority for callable materialization.

## Elixir Shared Core

Elixir must preserve these core meanings from the TypeScript reference and Python translation.

- `Cadenza` remains the user-facing coordination surface for creating and running primitives.
- `Task` remains the executable business-logic primitive.
- `Actor` remains the local state authority primitive.
- Helpers and globals remain explicit task/tool dependency definitions.
- Stable keys are the identity authority for tasks, actors, helpers, and globals.
- Signals and intents remain name-keyed coordination primitives.
- Task-rooted flow composition must support successor links, branch fan-out, branch filtering, fan-in through unique tasks, retries, concurrency limits, timeout policy, async execution, and context propagation.
- Signal choreography must support observing signals, emitting signals, emitting after success, emitting on failure, scheduling, debounce/squash behavior, and local delivery metadata where applicable.
- Inquiry/intent behavior must support request-response flow, timeouts, partial results, and responders.
- Helpers and globals must be attached through explicit aliases and resolved by dependency key.
- Globals must remain JSON-serializable and immutable from task code.
- Business and meta layers must remain separated; cross-layer helper/global dependency use must be rejected.
- Actor tasks must preserve keyed state resolution, durable/runtime state separation, read/write mode enforcement, idempotency semantics, and explicit runtime-state initialization.
- Definition-backed task/helper materialization must accept already-materialized callable slots.
- Runtime snapshots must expose a key-first description of tasks, helpers, globals, intents, signals, actors, actor tasks, and links.
- Schema support must preserve the lightweight Cadenza schema contract: primitive types, required fields, nested object/array schemas, constraints, strict mode, and schema-map variants.

## Elixir Native Expression

Elixir should not look like TypeScript with different syntax. It should express the same core in natural Elixir.

- Use maps as the default context shape.
- Use atoms only for local option names and internal tags; do not use atoms for dynamic user-authored keys, signal names, or intent names.
- Prefer structs for core definitions and snapshots where they improve clarity.
- Prefer modules and behaviours for handler contracts where that improves explicitness.
- Support anonymous functions as already-materialized callable slots.
- Support async execution through `Task`, supervised tasks, or equivalent BEAM-native primitives where appropriate.
- Use pattern matching and tagged tuples for local success/error shapes, while preserving shared conformance output semantics.
- Use immutable data structures as the natural enforcement mechanism for global values.
- Use ExUnit for local tests and a local JSON fixture runner for shared conformance.

## Elixir Enrichment Candidates

These may be valuable because Elixir and the BEAM can express them well, but they are optional enrichments, not shared-core requirements.

- Macro-based task/helper/actor definition DSL that compiles down to the same core definitions.
- Behaviours for task/helper handler modules.
- Supervised isolated runtimes for tests and embedded flows.
- BEAM process-backed execution internals, provided core still presents local primitive semantics.
- Message-passing based signal delivery internals, provided public signal semantics remain coherent with shared conformance.
- Registry-backed lookup internals for key-indexed primitives.
- Property-based tests for graph and signal invariants, if a dependency is justified later.

## Exclusions

The Elixir implementation must not translate these details as core contract unless a later design explicitly reintroduces them.

- Memory.
- CLI.
- Chamber runtime.
- Cells, distribution, placement, persistence, actor sessions, broadcast/delivery transport metadata, orchestration, and scale.
- External durable-state hydration.
- Strict write-through persistence intents.
- Legacy service, DB, demo, and old runtime-host contracts.
- Internal TypeScript runner, broker, registry, graph-node, and task-variant class structure as public API.
- TypeScript build/release machinery.
- Python-specific decorators, context managers, package layout, or snake_case choices as mandatory Elixir API.

## Elixir Decision Gates

These decisions should be made before writing the Elixir repo skeleton.

- Repo name and package identity: likely `cadenza-elixir`, with a Hex package name decided later.
- Minimum Elixir/OTP version for the first implementation.
- Public facade shape: `Cadenza` module only, or explicit runtime structs plus facade functions.
- Handler shape: anonymous functions first, behaviours first, or both from the first slice.
- Error shape: raise exceptions for failures, return tagged tuples, or provide both with a clear convention.
- Async boundary: how much BEAM task/supervision machinery belongs in core without drifting into chamber/runtime concerns.
- Dependency policy: standard-library first, or allow JSON/schema/property-test dependencies from the start.
- Conformance fixture location: reuse/copy current JSON fixtures initially, then extract a shared fixture source when multiple language repos need synchronized updates.

## Initial Elixir Conformance Scope

The first Elixir translation should start with a focused shared core slice before adding BEAM-specific enrichments.

- Stable identity: duplicate labels with different keys for tasks, actors, helpers, and globals.
- Task execution: context propagation, return-value merge behavior, branch filtering, branch fan-out, fan-in, retry, and async execution.
- Naming policy: lowercase kebab-case intents and lowercase dot-separated signals with optional exact tags.
- Signals: observe, emit, emit-after, emit-on-fail, schedule, squash/debounce behavior.
- Inquiry: intent definition, responder execution, timeout handling, and partial-result handling.
- Tools: helper/global alias binding by key, immutable globals, and layer-boundary rejection.
- Actors: key resolution, durable/runtime state separation, read/write enforcement, idempotency, and runtime-state initialization.
- Definitions: callable-backed task/helper primitive materialization by stable key, with optional source metadata retained for inspection.
- Snapshots: key-first runtime snapshot shape.
- Schemas: primitive validation, required fields, strict mode, nested arrays/objects, and schema-map variants.

## Recommended First Slice

Start the Elixir repo with the smallest coherent expression of the shared core:

1. Repo skeleton, `AGENTS.md`, README, formatter config, and ExUnit setup.
2. Core structs/types for task, helper, global, actor, schema, and runtime snapshot definitions.
3. Key/name validation and identity registries.
4. Task creation, execution, context propagation, and task chaining.
5. Shared conformance runner for identity and basic execution fixtures.
6. Signals and intents after task execution is stable.
7. Helpers/globals and snapshots.
8. Actors after task/tool/snapshot behavior is stable.
9. BEAM-native enrichments only after shared conformance passes.

## Recommendation

Proceed to Elixir next, but keep the first implementation deliberately boring. The BEAM alignment matters, but the core repo should first prove that Elixir can express the same primitive contract without smuggling chamber, distribution, persistence, or supervision strategy into the official core surface.
