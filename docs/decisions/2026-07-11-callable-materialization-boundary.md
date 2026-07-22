# Callable Materialization Boundary

## Context

During Sprint 1B Python translation, the user clarified the intended materialization boundary:

- Definition is the serialized authority.
- Materialization of serialized callable declarations into actual callables happens in a controlled cell/runtime environment.
- Materialization of Cadenza primitives from already-callable definitions happens in core.

The TypeScript `cadenza` authority repo and the new `cadenza-python` translation both still contained core-owned source compilation paths.

## Decision

Core repos must not compile or evaluate serialized callable source.

Core definition materialization accepts already-materialized callable slots, validates that those slots are callable, and uses them to create primitives such as tasks and helpers.

Source/language fields may remain as metadata for snapshots, inspection, visualization, and coherence review, but they are not execution material inside core.

## Consequences

- Cell/runtime layers own source-to-callable materialization, sandboxing, permissions, dependency access, language runtime policy, and failure isolation.
- TypeScript `Cadenza.createTaskFromDefinition(...)` and `createHelperFromDefinition(...)` now use callable handlers instead of compiling source strings.
- Python `Cadenza.create_task_from_definition(...)` and `create_helper_from_definition(...)` now use callable handlers instead of `eval`/`exec`.
- JSON conformance fixtures may keep serialized callable metadata, but language-local runners must attach materialized callables before invoking core.

## Alternatives

- Keep core source compilation with sandbox restrictions. Rejected because it puts security and language materialization policy in the primitive core.
- Remove source/language metadata entirely. Rejected because snapshots and visualization can still benefit from observational metadata.

## Links

- Completed plan: [Official Core Translation Sprint 1B](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-10-official-core-translation-sprint-1b.md)
- TypeScript architecture note: [cadenza/docs/architecture.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/cadenza/docs/architecture.md)
- Python readiness note: [docs/cadenza-python-translation-readiness.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-python-translation-readiness.md)
