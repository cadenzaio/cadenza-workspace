# Cadenza Meta-Slice Language Fit Review

Date: 2026-07-12

## Purpose

This review evaluates which languages best fit the planned Cadenza meta slices and whether that changes the timing of a C# core implementation.

It follows:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-language-role-doctrine.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/cadenza-flow-design.md`
- `docs/cadenza-environment.md`
- `docs/cadenza-schema-proposal.md`

## Framing

There are three separate choices:

1. **Official core language**
   - a full primitive implementation with conformance fixtures
   - should be limited to a small steward set, likely 4-5 languages total
2. **Execution adapter language**
   - a language Cadenza can run through the language runtime contract without making it a full core repo
3. **Runtime implementation language**
   - ordinary engineering language for cells, chambers, brokers, isolation, and materialization hosts

C# should be judged mainly as an official core language and as a possible meta-slice authoring language, not as a runtime substrate.

## Review Criteria

Each planned slice is evaluated by:

- need for controlled source-to-callable materialization
- need for strong typing and contract clarity
- need for ecosystem libraries
- need for policy/audit/evidence rigor
- need for graph-native primitive expression
- need for operational/sandbox implementation
- likelihood of enterprise/customer adoption
- whether the language would benefit from being a full official core rather than only an adapter

## Planned Meta-Slice Families

### Authority Access And Privileged Commands

Examples:

- graph queries
- graph commands
- projection commands
- bootstrap administration
- repair administration
- version creation and pointer moves
- tag assignment and effective-tag recomputation

Best-fit languages:

- **TypeScript** initially, because the current authority/core work is already TypeScript-centered.
- **C#** as a strong future candidate because privileged commands benefit from typed command envelopes, validation, policy/audit models, and enterprise maintainability.

Assessment:

C# is a strong fit, but not required before Sprint 2 if Sprint 2 starts by stabilizing the TypeScript authority foundation and schema contracts.

### Policy Evaluation

Examples:

- `Policy.EvaluateResourceAction`
- `Policy.EvaluateTagAction`
- materialization policy
- capability policy
- secret access policy
- authority gateway policy

Best-fit languages:

- **C#** is very strong for policy engines that need typed decision envelopes, explainability, audit records, and enterprise integration.
- **TypeScript** is acceptable for first implementation because it stays close to current core/schema work.
- **Datalog/Rego-style policy DSLs** may later be useful as data/DSL layers, but they are not core language repos.

Assessment:

This is one of the strongest arguments for C# before long-term policy work hardens. If policy becomes a major Sprint 2 implementation slice, C# should be reconsidered as an early core repo.

### Generated Bundle Expansion Control

Examples:

- source change detector
- bundle reconciler
- generated member applier
- bundle finalizer
- bundle retirement reconciler
- generated object provenance writes

Best-fit languages:

- **C#** is strong for deterministic-ish planner/reconciler logic, typed diffs, versioned object models, and enterprise-grade service code.
- **TypeScript** is good for staying near current schema and fixture definitions.
- **Elixir** is interesting for resilient reconciliation loops, but this slice is authority/data-heavy rather than primarily supervision-heavy.

Assessment:

C# is a strong fit for durable generated-bundle infrastructure. If expansion-control implementation is early in Sprint 2, a C# core starts to look worthwhile sooner.

### Capability Planners

Examples:

- `PostgresActor` expansion planner
- future planner contracts for generated surfaces
- capability-specific desired member plans

Best-fit languages:

- **C#** is strong for typed planner contracts and generated artifacts.
- **TypeScript** remains convenient because schema proposal examples are currently TypeScript-shaped.
- **Python** may be strong for AI-assisted generation, but less ideal for the authoritative planner contract itself.

Assessment:

C# is a good fit, especially for planners intended to be maintained in enterprise environments. It is not the only viable choice.

### Backing Reconcilers

Examples:

- `PostgresActor` database creation
- migration ledger setup
- additive schema reconciliation
- backing-state readiness checks

Best-fit languages:

- **C#** is very strong because .NET has mature PostgreSQL support through Npgsql and good typed service patterns.
- **TypeScript** is viable with node-postgres and migration tooling.
- **Go** is operationally strong but is runtime implementation oriented here unless database-authored behavior needs it.

Assessment:

C# is one of the best fits for backing reconcilers, especially if these reconcilers become durable enterprise-facing extension points.

### Language Runtime Adapters

Examples:

- C# adapter using Roslyn
- Python adapter
- JavaScript/TypeScript adapter
- Ruby/Lua adapters later

Best-fit languages:

- The adapter host can be ordinary runtime implementation code.
- The adapter target language must satisfy `docs/cadenza-language-runtime-contract.md`.
- **C#** is useful as both a target language and an adapter implementation experiment because Roslyn can materialize source under controlled process/chamber boundaries.

Assessment:

If C# core exists, the C# runtime adapter can share primitive conformance assumptions and become a strong test case for the language runtime contract. Still, sandboxing remains chamber-owned; C# itself is not the containment boundary.

### Schema Interpretation And Code Generation

Examples:

- Cadenza schema-to-language projection
- generated task/helper/actor surfaces
- adapter stubs
- typed client or console projections

Best-fit languages:

- **TypeScript** for web/UI and current schema authoring momentum.
- **C#** for strongly typed generated models, enterprise SDKs, and planner contracts.
- **Python** for AI-assisted generation and analysis tools.

Assessment:

C# is useful here, but this alone does not require a C# core immediately.

### Agent API And Human Console Meta Slices

Examples:

- high-level agent API
- console-facing meta slices
- scoped context assembly before memory is reintroduced
- human review and repair workflows

Best-fit languages:

- **TypeScript** for UI/console and web-facing APIs.
- **Python** later for AI/data-heavy context and memory-adjacent work.
- **C#** when enterprise/API hosting and typed service boundaries matter.

Assessment:

C# is useful but not dominant for the first console/agent-facing layers.

### Flow Manager And Persistent/Resumable Flow Support

Examples:

- leases
- checkpoints
- safe resume decisions
- repair transitions
- persistent flow policy

Best-fit languages:

- **Elixir** is conceptually strong for supervision and process resilience.
- **C#** is strong for durable state machines, typed persistence, and enterprise service operation.
- **TypeScript** is acceptable for first cross-contract implementation.

Assessment:

This slice does not force C#, but C# is credible if the flow manager becomes enterprise/durable-state heavy.

## Summary Matrix

| Slice | TypeScript | Python | Elixir | C# | Notes |
| --- | --- | --- | --- | --- | --- |
| Authority access | Strong now | Weak | Medium | Strong later | Start near TS authority; C# strong once service contracts harden. |
| Policy evaluation | Medium | Medium | Medium | Very strong | Strongest C# argument. |
| Expansion control | Strong now | Medium | Medium | Very strong | C# strong for typed reconcilers and provenance. |
| Capability planners | Strong now | Medium | Weak | Strong | C# useful for durable planner contracts. |
| Postgres backing reconcilers | Medium | Medium | Weak | Very strong | Npgsql/.NET ecosystem is a clear advantage. |
| Runtime adapters | Strong for JS/TS | Strong for Python | Medium | Strong for C# | Adapter host is not necessarily core language. |
| Schema/code generation | Strong | Strong for AI assist | Weak | Strong | C# valuable but not urgent alone. |
| Agent/console meta | Very strong | Strong later | Weak | Medium | TS/Python likely earlier. |
| Flow manager | Medium | Weak | Strong conceptually | Strong | Depends on durability vs supervision emphasis. |

## C# Implication

C# is not merely another business-logic language. It is a plausible language for several important meta slices:

- policy evaluation
- expansion-control reconciliation
- capability planners
- backing reconcilers
- enterprise plugins
- typed SDKs and generated surfaces
- C# runtime adapter validation

That strengthens the case for a C# core repo.

However, the timing still depends on Sprint 2 content:

- If Sprint 2 is mostly contract foundation, tags, object/version foundations, and TypeScript authority cleanup, C# can wait.
- If Sprint 2 includes policy evaluator implementation, generated bundle control, PostgresActor backing reconciliation, or runtime adapter implementation, C# should probably start earlier.

## Recommendation

Do not start C# only because it is possible.

Do start C# before implementing C#-natural meta slices in production form.

Practical recommendation:

1. Finish the language runtime contract v0. Done in `docs/cadenza-language-runtime-contract.md`.
2. During Sprint 2 planning, explicitly mark which meta slices are implementation targets.
3. If policy, expansion control, capability planners, or PostgresActor backing reconcilers are in Sprint 2 implementation scope, start `cadenza-csharp` first or in parallel.
4. If Sprint 2 is foundation-only, defer `cadenza-csharp` until the first C#-natural meta slice is ready.

## Proposed Gate

Before Sprint 2 implementation begins, answer:

> Will Sprint 2 implement any meta slice whose long-term best-fit language is C#?

If yes, create a short C# core design proposal.

If no, proceed with TypeScript-centered Sprint 2 and leave C# as the next likely core language.
