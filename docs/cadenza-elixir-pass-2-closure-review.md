# Cadenza Elixir Pass 2 Closure Review

Date: 2026-07-12

## Purpose

This review evaluates whether `cadenza-elixir` Pass 2 should close before selecting the next official language translation.

The review uses the current intended whole:

> Cadenza should reduce accidental coding complexity so humans and AI can focus on business logic, intended application function, workflow shape, and the logic inside individual tasks. Deployment, scale, distribution, placement, persistence, session lifecycle, and orchestration belong in later Cadenza layers rather than the core authoring model.

## Closure Verdict

`cadenza-elixir` Pass 2 is ready to close pending user approval.

The repo now proves the Elixir core can preserve shared primitive meaning while expressing appropriate BEAM-native internals privately:

- the public `Cadenza` facade remains primitive-first
- execution, signal routing, snapshots, actor state handling, scheduling, and registry state are separated into private runtime modules
- OTP supervision owns local runtime services without exposing process topology as public contract
- JSON conformance covers the intended Pass 2 scheduler and signal fixture set
- memory, CLI, chamber runtime, cells, distribution, persistence, actor sessions, orchestration, and public process topology remain outside this repo phase

## Coherence Review

### Intended Whole

The implementation serves the intended whole when it lets authors focus on workflow and task logic while hiding local runtime mechanics.

False success would be an impressive BEAM architecture that forces users to think in supervisors, GenServers, process IDs, persistence, placement, or distribution before they can express a task flow.

The current repo avoids that false success.

### Participating Identities

Core identities are now clear:

- `Cadenza`: public composition surface
- `Task`: executable business-logic primitive
- `Actor`: local state authority primitive
- `Intent` and `Signal`: name-keyed coordination primitives
- `Helper` and `Global`: explicit task dependencies
- `Schema`: lightweight validation boundary
- `Runtime`: private supervision/runtime boundary
- `Runtime.Registry`: private local state owner
- `Runtime.Executor`: private graph execution owner
- `Runtime.SignalBus`: private local signal routing owner
- `Runtime.SignalScheduler` and `Runtime.TaskScheduler`: private timer/policy owners
- `Runtime.Snapshot`: private interpretation/export owner
- `Runtime.ActorRunner`: private actor context and mutation owner

This is coherent: public identities express the core; private identities preserve implementation stewardship.

### Relationship And Boundary Assessment

The strongest current boundary is between primitive contract and runtime mechanics.

- Public API stays task/actor/helper/global/intent/signal/schema oriented.
- Runtime process topology stays private.
- Callable source materialization stays outside core.
- Persistence and distribution stay outside core.
- JSON remains a conformance/interchange boundary, not executable authority.

The main repair already completed was splitting broad modules:

- `Cadenza` no longer owns execution, signal routing, snapshots, and actor mutation mechanics.
- `Cadenza.Runtime` no longer owns Agent storage directly; `Cadenza.Runtime.Registry` owns local state.

### Temporal Stewardship

The repo leaves future agents enough traces to continue safely:

- README states current scope and exclusions.
- `AGENTS.md` states repo-local translation principles.
- Pass 2 design and proposal record private-runtime decisions and implementation lessons.
- Tests and fixtures guard the current shared behavior.

The remaining temporal risk is documentation drift between the broad readiness note and the narrower closure boundary. This review resolves that by classifying readiness-list items below.

## Closure Criteria Assessment

| Criterion | Status | Notes |
| --- | --- | --- |
| Preserve Pass 1 public facade | Passed | Public facade remains stable. |
| Add private BEAM scheduler components | Passed | Task and signal schedulers are application-owned private services. |
| Add signal metadata/debounce/squash | Passed | Covered by local and conformance tests. |
| Add task throttle/debounce | Passed | Covered by local and conformance tests. |
| Move registry/runtime under OTP lifecycle | Passed | `Cadenza.Runtime` supervises `Cadenza.Runtime.Registry`; application owns runtime services. |
| Keep process topology private | Passed | No public runtime object, PID, GenServer, or supervisor API. |
| Keep chamber/cell/distribution out of core | Passed | Explicitly excluded. |
| Keep persistence out of core | Passed | Actor state remains local in-memory primitive state. |
| Validate implemented fixture set | Passed | `mix test` passed with 46 tests. |

## Readiness-List Classification

These items appeared in earlier readiness notes but should not block Pass 2 closure.

### Close In Pass 2

- BEAM-owned lifecycle for local runtime services.
- Task throttle/debounce.
- Signal metadata/debounce/squash.
- Private runtime-module separation.
- Registry ownership split.

### Defer To Later Core Contract Review

- Task timeout policy.
- Generic concurrency limits beyond throttle/debounce.
- Emit-after-success and emit-on-failure convenience APIs.
- Actor idempotency semantics.
- Explicit actor runtime-state initialization policy.

These may still belong in core, but they need shared TypeScript/Python/Elixir contract review before becoming official cross-language requirements.

### Defer To Later Layers

- Rich scheduling beyond local debounce/throttle/squash.
- Placement, distribution, and orchestration.
- Persistence and hydration.
- Actor sessions.
- Broadcast/delivery transport metadata.
- Chamber runtime behavior.
- Cells.
- Memory.
- CLI.

### Defer Until Tags/Layers Exist

- Business/meta layer helper/global boundary rejection.

The current core does not yet model layers/tags with enough authority to enforce this cleanly. It should be revisited in the broader preparation sprint that introduces tags and layer concepts.

### Optional Elixir Enrichments, Not Closure Blockers

- Macro DSL.
- Handler behaviours.
- Isolated runtime instances for embedded/test usage.
- Property/invariant tests.
- ETS-backed registry.

These are valuable only if they clarify expression or robustness without expanding public contract accidentally.

## Residual Risks

- Timer-based tests can be environment-sensitive, though current timings are stable enough for this phase.
- `Cadenza` remains large because it is the public facade. That is acceptable for now, but new features should not add private mechanics back into it.
- `Runtime.Registry` is intentionally explicit but still broad. Split it only when there is real pressure from new behavior.
- The active workspace docs still include legacy and future notes; agents must use this closure review to distinguish current Elixir scope from broader long-term candidates.

## Closure Recommendation

Close `cadenza-elixir` Pass 2 after user approval.

Do not add more Elixir-native features before selecting the next language unless a concrete defect appears. Further Elixir work should be driven by shared contract changes, not by implementation curiosity.

## Next Language Thinking

The next language should be selected by what it teaches the official core family.

Selection criteria:

- It can materialize a string into a callable in a controlled runtime layer.
- It is popular enough to matter beyond novelty.
- It expresses the Cadenza whole differently from TypeScript, Python, and Elixir.
- It can participate in shared JSON conformance without making JSON executable authority.
- It has a plausible future role in cells, chambers, or user/business application development.

Follow-up doctrine:

- `docs/cadenza-language-role-doctrine.md` now separates core languages, authoring languages, meta-layer feature languages, execution adapters, and ordinary runtime implementation choices.
- Business-logic and database-authored meta-feature languages must support controlled string-to-callable materialization.
- Low-level cell/chamber implementation languages are exempt from that materialization rule because they serve containment, security, stability, speed, and runtime stewardship.
- `docs/cadenza-language-runtime-contract.md` now records the adapter contract for materialization, containment, evidence, resource limits, dependency handling, and capability injection.
- The doctrine now treats cell/chamber implementation languages as ordinary runtime engineering choices rather than primitive/core/adapters.
- `docs/cadenza-meta-slice-language-fit-review.md` now records where C# is a strong fit for planned meta slices and when that should affect timing.

### Candidate: C# / .NET

Why it matters:

- large enterprise and application ecosystem
- strong static type system
- mature async/concurrency model
- Roslyn can compile source strings into executable code in controlled environments
- useful contrast against TypeScript/Python dynamic authoring and Elixir BEAM supervision

Risk:

- runtime source materialization requires more setup and stronger sandboxing discipline than Ruby/Lua
- translation is likely heavier than Python or Ruby

Best if the next translation should prove Cadenza in enterprise/static application environments. The current decision is that C# is a strong next core-language candidate, but not urgent before the language runtime contract and Sprint 2 preparation.

### Candidate: Ruby

Why it matters:

- dynamic language with direct `eval`/`Proc` materialization options
- excellent internal DSL ergonomics
- very fast translation learning loop
- could express task-flow authoring elegantly

Risk:

- lower strategic coverage than C# for broad enterprise adoption
- easy metaprogramming can blur boundaries if not disciplined

Best if the next translation should explore human-friendly DSL expression.

### Candidate: Lua

Why it matters:

- `load` can materialize strings into functions
- lightweight, embeddable, and often used as a scripting layer
- interesting future fit for controlled cells or embedded chambers

Risk:

- less mainstream for general application cores
- would test embeddability more than broad product adoption

Best if the next translation should explore small controlled execution environments.

### Candidate: Clojure

Why it matters:

- runtime evaluation and homoiconic definitions
- strong functional/data orientation
- JVM ecosystem access

Risk:

- niche adoption compared with C# or Ruby
- may teach less about mainstream user adoption than about data-first expression

Best if the next translation should explore definition-as-data and functional composition.

## Preliminary Recommendation

Use a short selection sprint before implementation.

Current preference:

1. **C# / .NET** if the priority is strategic reach, static contracts, enterprise adoption, and proving Cadenza beyond dynamic languages.
2. **Ruby** if the priority is fast learning and expressive DSL design.
3. **Lua** if the priority is future controlled cell/chamber scripting.

The strongest default next core language remains **C# / .NET**, because TypeScript, Python, and Elixir already cover web/dynamic/general-purpose/BEAM expression. C# would test whether the core remains coherent in a mature static enterprise ecosystem while still meeting the runtime materialization constraint through Roslyn.

Do not start C# immediately. The next practical step is the language runtime contract and then Sprint 2 preparation.

Update after language fit review: C# should be started early if Sprint 2 implements policy evaluation, expansion-control reconciliation, capability planners, PostgresActor backing reconcilers, or runtime adapter implementation. If Sprint 2 remains foundation-only, defer C# until the first C#-natural meta slice is ready.
