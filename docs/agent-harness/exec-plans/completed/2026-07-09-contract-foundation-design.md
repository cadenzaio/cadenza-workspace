# Design Proposal: Contract Foundation

## Status

done

Approved on 2026-07-10 and completed on 2026-07-12 through Sprint 1A TypeScript Contract Foundation and Sprint 1B official core translations.

## Context

- Problem:
  - `cadenza` is becoming the official near-term foundation repo for the next Cadenza direction, but the current core still carries legacy and transitional concepts from earlier architecture phases.
  - The repo must be stabilized before environment bootstrap, chamber runtime, cells, orchestration, authority, tags, actor persistence, generated bundles, memory, UI/UX, and agent-facing layers build on top of it.
  - Existing concepts such as routines, name-first identity, alias-shaped helper/global access, actor-bound execution semantics, runtime CLI work, and `engine` terminology need to be reviewed against the intended whole rather than preserved by inertia.
  - Once the TypeScript core contract is spotless, Cadenza should not remain only a TypeScript runtime. The core model should be translated into a small set of strategically useful languages so the primitives become language-independent rather than TypeScript-specific.
- Why now:
  - Planning Hygiene Sprint 0 reduced active planning noise and established the intended whole.
  - The next implementation sprint should not start by adding features; it should make the core coherent enough to inherit.
  - This is a new major version direction, so backwards compatibility with legacy consumers is not a blocking constraint.
- Evidence:
  - [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
  - [docs/agent-harness/exec-plans/contract-foundation-backlog-2026-07-09.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/contract-foundation-backlog-2026-07-09.md)
  - [docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md)
  - `cadenza/README.md`
  - `cadenza/src/`

## Coherence Standard

Sprint 1 must preserve the intended whole:

> Cadenza exists to reduce almost all accidental complexity around software creation, operation, deployment, scale, and distribution so humans and agents can focus their attention on the highest-value part of an application: the intended function, the business logic, and the logical flow of work.

Design implication:

- the core should make business workflow and task logic clearer, not harder to read
- operational substrate concerns should not leak into ordinary business-flow authoring
- every retained module, API, test, and doc must serve the intended whole
- legacy or exploratory code should be removed when its purpose is no longer coherent

## Proposed Approach

- Change summary:
  - Split Sprint 1 into two linked sprints:
    - Sprint 1A: TypeScript Contract Foundation.
    - Sprint 1B: Polyglot Foundation.
  - Audit the current `cadenza` repo for public concepts, source modules, tests, and docs.
  - Make TypeScript spotless as the canonical reference implementation first.
  - After TypeScript is spotless, begin the polyglot foundation for at least three additional language implementations.
  - Define and implement the new core contract around:
    - task-only executable primitive taxonomy
    - key-first runtime identity
    - storage-agnostic task definitions and materialization
    - stable helper/global access direction
    - minimal actor semantics and task-side actor binding direction
    - clean terminology around current graph runner versus future chamber runtime
    - purposeful-code cleanup
    - cross-language conformance expectations.
- Why this shape:
  - The future Cadenza architecture is fractal; incoherence in the core will propagate upward into environment, cells, chambers, authority, and memory.
  - A narrow, deep sprint is safer than mixing core cleanup with bootstrap, distribution, or UI concerns.
  - Removing legacy compatibility pressure lets the core become clean instead of carrying ambiguous wrappers forward.
  - A polyglot foundation supports the intended whole by making Cadenza a workflow and runtime model rather than a TypeScript library only.
- Non-goals:
  - CLI and runtime subscription implementation.
  - Memory or meta-memory implementation.
  - UI/UX or agent-facing API implementation.
  - `cadenza-service`, `cadenza-db`, demo, or legacy repo implementation.
  - Chamber runtime repo creation.
  - Cells, placement, scale, distribution, bridge artifacts, or orchestration.
  - Authority/tag/policy schema implementation.
  - Actor residency, hydration, persistence, assignment epochs, or distributed lifecycle.
  - Plugin, secret, evidence, containment, or supply-chain implementation.
  - Full production maturity for all language ports.
  - Cross-language distributed execution.
  - Language ports before the TypeScript contract is coherent.

## Sprint Split

### Sprint 1A: TypeScript Contract Foundation

Scope:

- clean and stabilize the official TypeScript `cadenza` core
- remove legacy/exploratory/dead code
- establish task-only executable primitive taxonomy
- implement key-first identity
- implement task definition/materialization contract
- clarify helper/global and actor core semantics
- align docs and tests.

Exit criterion:

- TypeScript is spotless.

Definition of spotless:

- every source module, public API, test, and doc serves the intended whole
- no dead, exploratory, or legacy code remains without an explicit current purpose
- public docs match exported behavior
- tests cover every changed primitive contract
- names are labels, not correctness-bearing identity
- routines are not treated as future executable primitive structure
- future chamber/cell/DB concerns do not leak into core
- the core is suitable as the canonical contract reference for other language implementations.

### Sprint 1B: Polyglot Foundation

Scope:

- create one official repo per language implementation
- implement the spotless TypeScript core contract in:
  - Python
  - Elixir
  - one additional language selected later
- define and run shared language-neutral conformance specs/fixtures
- keep first-pass ports focused on primitive semantics, not environment bootstrap, distribution, memory, or UI/UX.

Entry criterion:

- Sprint 1A is complete and TypeScript is spotless.

Exit criterion:

- language repos exist for selected targets
- each port can materialize handler source strings into runtime functions
- each port passes the shared conformance specs for the first primitive set.

## Sprint Scope

### 1. API And Code Purpose Inventory

- Inventory current public exports, source modules, tests, and docs.
- Classify each as:
  - core purpose
  - needs redesign
  - legacy/remove
  - deferred/later layer
  - unclear.
- Output:
  - a repo-local inventory note or design appendix before broad edits.

### 2. Primitive Taxonomy Cleanup

- Make `Task` the only official executable primitive.
- Reclassify or remove routine-like concepts unless they serve a clear current purpose.
- Clarify signals as detached fan-out.
- Clarify intents/inquiries as request/response contracts.
- Clarify actors as keyed state authority, not executable graph nodes.
- Keep helpers/globals as support surfaces below first-class primitive execution.

### 3. Key-First Runtime Identity

- Introduce or formalize stable keys for tasks, actors, helpers, and globals.
- Treat names as labels, not correctness-bearing identity.
- Remove or reject ambiguous name-based resolution where it would preserve legacy behavior.
- Add tests for deterministic key lookup and unsupported/ambiguous name lookup.

### 4. Task Definition And Materialization

- Define storage-agnostic contracts such as:
  - `TaskDefinition`
  - `TaskBehaviorDeclaration`
  - `TaskExtensionDeclaration`
  - `DeclaredTaskWiring`.
- Add a materialization path such as `createTaskFromDefinition(...)` or an equivalent core API.
- Keep all database, authority, placement, and chamber-local resolved wiring out of core materialization.

### 5. Helper And Global Access Direction

- Review current alias-based helper/global dependency declarations.
- Move toward stable-key runtime access where possible.
- Keep helpers/globals separate from future host capabilities.
- Ensure helper/global use remains attributable and cannot become an invisible privilege channel.

### 6. Actor Core Semantic Cleanup

- Keep actors minimal:
  - keyed state authority
  - durable/runtime state only where coherent
  - actor-bound tasks remain ordinary tasks.
- Move toward task-side actor binding semantics.
- Defer distributed residency/persistence behavior to later cell/chamber and orchestration layers.

### 7. Terminology And Module Cleanup

- Distinguish current in-process graph runner code from future chamber runtime terminology.
- Avoid using `engine` for future chamber/runtime-host concepts.
- Decide whether `src/engine` should be renamed now or documented as current internal runner terminology.
- Remove dead, exploratory, or legacy modules that do not serve the intended whole.

### 8. Polyglot Core Foundation

- Translate the finalized TypeScript core contract into at least three strategically useful languages.
- Treat spotless TypeScript as the canonical reference implementation.
- Use one repo per language implementation.
- Required secondary language:
  - Python, as the secondary general-purpose language.
- Required Beam language:
  - Elixir, because Cadenza's distributed and resilience model is deeply aligned with Beam concepts. One useful way to understand Cadenza is that it lets TypeScript and other languages behave more like they are running on Beam-like primitives; therefore an Elixir implementation should eventually take direct advantage of Beam strengths while extending them with Cadenza primitives.
- Third language:
  - TBD during Sprint 1 design finalization.
  - Hard requirement: the language must be able to materialize a string into a function at runtime.
  - Initial candidates:
    - Ruby: popular dynamic language with runtime eval and mature web/application ecosystem.
    - Lua: small embeddable runtime with `load`/runtime function materialization, useful for lightweight chambers or embedded execution.
    - Clojure: strong runtime eval and functional/concurrency fit, but less broadly popular than Ruby or Lua.
- First-pass language-port scope:
  - primitive API shape
  - task execution
  - signal emission/observation
  - intent/inquiry request/response
  - actor baseline where practical
  - helper/global access where practical
  - handler materialization from source string
  - conformance tests or shared behavioral examples.
- Conformance strategy:
  - language-neutral markdown behavior specs
  - JSON fixtures for shared examples and expected outcomes
  - each language repo runs those fixtures through its local runtime implementation.
- Out of first-pass language-port scope:
  - full environment bootstrap
  - cells/chambers
  - distributed placement
  - authority/tag/policy runtime
  - memory
  - plugin/security/secrets/evidence.

## Impacted Repos

- Authority repo:
  - `cadenza`
- Direct consumers:
  - none required in this sprint
  - legacy consumers may stay on previous major versions
- Follow-up repos or deferred tasks:
  - future chamber runtime repo after environment bootstrap
  - future official language repos for Python, Elixir, and the third selected language
  - later memory sprint track
  - later UI/UX and agent-facing work

## Risks

- Breaking change risk:
  - high by design; this is a new major core direction.
  - acceptable because backwards compatibility is not required for legacy consumers.
- Migration or rollout risk:
  - moderate; old service/db/demo repos may not consume the new core.
  - acceptable because they are legacy/reference-only for this roadmap.
- Testing risk:
  - high if semantic cleanup is broad and not covered by focused contract tests.
  - mitigated by inventory-first work, small implementation slices, and tests per changed primitive contract.
- Coherence risk:
  - removing too much without replacing the actual useful role.
  - mitigated by requiring every retained or removed part to be justified against the intended whole.
- Polyglot risk:
  - translating too early could freeze the wrong abstractions across multiple languages.
  - mitigated by making TypeScript spotless first and using conformance specs/fixtures before broad language-specific optimization.

## Migration Strategy

- Order of operations:
  1. Inventory current API and module purpose.
  2. Decide remove/redesign/retain status for routines, name lookup, helper/global aliases, actor binding, and `src/engine` terminology.
  3. Implement key-first identity foundation.
  4. Implement task definition/materialization contracts.
  5. Adjust helper/global access and actor semantics in small slices.
  6. Remove dead/legacy/exploratory code.
  7. Update README, repo docs, and tests to match the new core contract.
  8. Define shared conformance specs and JSON fixtures for the core primitives.
  9. Create one repo per language implementation for Python, Elixir, and the third selected language.
  10. Start the language ports against the spotless TypeScript contract.
- Backward compatibility plan:
  - None required.
  - Legacy dependencies remain on previous core versions.
  - Retained compatibility-like APIs must justify a current purpose, not legacy convenience.
- Validation plan:
  - `cd cadenza && yarn test`
  - `cd cadenza && yarn tsc --noEmit`
  - `cd cadenza && yarn build`
  - targeted contract tests for:
    - key-first identity
    - task definition materialization
    - primitive taxonomy behavior
    - helper/global access
    - actor-bound task semantics where changed.
  - language-port validation commands TBD per repo.
  - shared conformance specs and JSON fixtures should run against TypeScript and each language port.

## Alternatives

- Option A:
  - Compatibility-first incremental evolution.
- Option B:
  - New-major coherent core cleanup.
- Option C:
  - Start with authority/bootstrap implementation before core cleanup.
- Option D:
  - Keep Cadenza TypeScript-only until much later.
- Why they were not chosen:
  - Option A preserves legacy ambiguity and conflicts with the user's major-version direction.
  - Option C risks building future layers on an unstable primitive foundation.
  - Option D weakens the language-independent nature of Cadenza's intended model and delays learning from runtimes such as Beam.
  - Option B best serves the intended whole by making the core clean before higher layers inherit it, then letting other languages implement that clean contract.

## Assumptions

- Assumption 1:
  - Backwards compatibility is not required for Sprint 1.
- Assumption 2:
  - Legacy consumers can remain on previous versions of `@cadenza.io/core`.
- Assumption 3:
  - All code in `cadenza` must serve a purpose in the intended whole or be removed.
- Assumption 4:
  - Sprint 1A should be narrow and deep; later sprints handle authority, bootstrap, chamber runtime, cells, memory, UI/UX, and agents.
- Assumption 5:
  - Polyglot work should start only after the TypeScript contract is spotless enough to act as the reference implementation.
- Assumption 6:
  - Python and Elixir are mandatory language targets for the first polyglot foundation.
- Assumption 7:
  - The third language must support materializing source strings into runtime functions.

## Resolved Decisions

- Third language:
  - C# was selected and implemented during Sprint 1B because the language fit review showed it is likely to serve policy evaluation, expansion-control reconciliation, capability planners, PostgresActor backing reconcilers, enterprise plugins, typed SDKs, generated surfaces, and runtime adapter validation.
- Repository/package layout:
  - one official repo per language implementation.
- Conformance strategy:
  - language-neutral JSON fixtures exist in the translation repos; shared conformance authority should be strengthened in the next preparation sprint.

## Approval

Approved by the user on 2026-07-10:

```text
Design approved. Proceed.
```

Decision log:

- [docs/decisions/2026-07-10-contract-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-10-contract-foundation.md)

Implementation plans:

- [2026-07-10-contract-foundation-sprint-1a.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-10-contract-foundation-sprint-1a.md)
- [2026-07-10-official-core-translation-sprint-1b.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-10-official-core-translation-sprint-1b.md)
