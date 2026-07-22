# Cadenza Python Translation Readiness

Date: 2026-07-10

## Purpose

This note defines the pre-translation scan rule for language implementations and applies it to the first Python translation of the official `cadenza` core.

The TypeScript `cadenza` repo is the current contract authority. Legacy repos, demo repos, CLI-era contracts, memory work, and old runtime-host architecture are out of scope.

The intended whole remains: reduce accidental coding complexity so humans and AI can focus on business logic, intended application function, workflow shape, and the logic inside individual tasks. Deployment, scale, distribution, placement, persistence, and orchestration should be abstracted into later Cadenza layers instead of leaking into the core authoring model.

## Translation Scan Rule

Before translating Cadenza into any new language, scan the reference repo through three categories:

1. Shared Core: concepts, invariants, contracts, and behaviors that must exist across official language implementations.
2. Native Expression: idioms and language-specific shapes that preserve the same meaning without copying TypeScript mechanically.
3. Language Enrichment: optional language-native features that strengthen the intended whole but are not required in other implementations.

The scan must also record exclusions: internals, legacy surfaces, deferred layers, and implementation details that should not become part of the new language contract by accident.

## Python Shared Core

Python must preserve these core meanings from the TypeScript reference.

- `Cadenza` remains the user-facing coordination surface for creating and running primitives.
- `Task` remains the executable business-logic primitive.
- `Actor` remains the local state authority primitive.
- `HelperDefinition` and `GlobalDefinition` remain explicit task/tool dependency definitions.
- Stable keys are the identity authority for tasks, actors, helpers, and globals.
- Names remain human labels, not identity.
- Intents and signals remain name-keyed because their names are already key-like.
- Intent names are unique lowercase kebab-case names.
- Signal names are unique lowercase dot-separated names with lowercase or snake_case segments and optional exact tags using `:<tag>`.
- Task-rooted flow composition must support successor links, branch fan-out, branch filtering, fan-in through unique tasks, retries, concurrency limits, timeout policy, async execution, and context propagation.
- Signal choreography must support observing signals, emitting signals, emitting after success, emitting on failure, scheduling, debounce/squash behavior, and delivery metadata where applicable.
- Inquiry/intent behavior must support request-response flow, timeouts, partial results, and responders.
- Helpers and globals must be attached through explicit aliases and resolved by dependency key.
- Globals must remain JSON-serializable and immutable from task code.
- Business and meta layers must remain separated; cross-layer helper/global dependency use must be rejected.
- Actor tasks must preserve keyed state resolution, durable/runtime state separation, read/write mode enforcement, idempotency semantics, and explicit runtime-state initialization.
- Definition-backed task/helper materialization must accept already-materialized callable slots; converting serialized callable declarations into callables belongs outside core in a controlled cell/runtime environment.
- Runtime snapshots must expose a key-first description of tasks, helpers, globals, intents, signals, actors, actor tasks, and links.
- Schema support must preserve the existing lightweight Cadenza schema contract: primitive types, required fields, nested object/array schemas, constraints, strict mode, and schema-map variants.

## Python Native Expression

Python should not be a literal TypeScript port. These are preferred Python expressions of the same core meaning.

- Use `dataclass`, `TypedDict`, `Protocol`, and type aliases for definitions, options, snapshots, and handler contracts.
- Use `dict[str, Any]` as the normal context representation unless a richer typed context is explicitly provided.
- Support both sync and async task/helper handlers through `inspect` and `asyncio`.
- Prefer Python exceptions for runtime failures while keeping exported error context compatible with shared conformance tests.
- Use `MappingProxyType`, tuples, recursive copying, or equivalent mechanisms to enforce immutable global values.
- Use snake_case as the natural Python method and option spelling unless a design decision explicitly adds camelCase aliases.
- Prefer Python-native callable signatures, with wrapper support where needed for already-materialized callable definitions.
- Treat decorators as a natural definition surface, provided they compile down to the same core definitions.
- Use context managers where they improve runtime isolation, reset behavior, or temporary policy scopes.
- Use module docstrings and function docstrings as optional descriptions when explicit descriptions are not provided.

## Python Enrichment Candidates

These may be valuable because Python can express them well, but they are optional enrichments, not shared-core requirements.

- Decorator-first task/helper/actor definitions, for example `@cadenza.task(...)`.
- Type-hint assisted schema derivation from Python annotations.
- Dataclass or Pydantic adapter support for structured contexts, kept optional.
- Context-managed runtime instances for tests and local isolated execution.
- Introspection-assisted source capture through `inspect.getsource`.
- Async iterator support for branch-producing tasks.
- Python package/module discovery for registering local flows, deferred until it clearly serves the whole.

## Exclusions

The Python implementation must not translate these TypeScript details as contract unless a later design explicitly reintroduces them.

- Internal runners, brokers, registries, graph contexts, graph nodes, and task variant subclasses as public API.
- CLI contracts and runtime-daemon behavior.
- Legacy service/database/demo repo contracts.
- Runtime host, subscription manager, and remote transport behavior.
- Vue Flow export, color layout, UI-specific graph export, or custom exporter hooks.
- Routine primitives; grouping will be handled through tags later.
- Memory features.
- Chamber runtime, cells, distribution, placement, orchestration, and scale mechanics.
- TypeScript build/release machinery such as `tsup`, declaration stripping, and semantic-release configuration.

## Python Decision Gates

The following decisions should be made before writing the Python package skeleton.

- API spelling: use snake_case only, or snake_case with camelCase aliases for cross-language familiarity.
- Runtime shape: expose only a `Cadenza` facade, or also expose isolated runtime instances for tests and embedded use.
- Run result: keep TypeScript's current public `run(...)` fire-and-forget shape, or return an awaitable run/result object in Python.
- Callable materialization boundary: keep `exec`/`eval`-based source loading out of core; a controlled cell/runtime layer may convert serialized callable declarations into callable objects before calling core.
- Dependency policy: keep the first Python core standard-library only, or allow a small optional dependency for schema/type validation.
- Conformance packaging: decide whether shared tests live in a language-neutral spec fixture repo, in each language repo, or both.

## Initial Python Conformance Scope

The first Python translation should be validated against a small shared conformance suite before adding enrichment.

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

## Recommendation

Start the Python repo with the shared core and the minimal native Python expression needed to make it feel honest in Python. Do not implement all enrichment candidates in the first pass.

The first implementation slice should be:

1. Package skeleton and public contract types.
2. Task creation, key identity, context execution, and task chaining.
3. Shared conformance fixtures for identity and basic execution.
4. Signal and intent naming validation.
5. Helpers/globals and runtime snapshots.
6. Actors after the basic execution and tool surface is stable.

Enrichment should be added only after the shared conformance suite passes and each enrichment can be justified against the intended whole.
