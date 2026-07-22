# cadenza-csharp

Role: C# translation of the official Cadenza core contract.

Enter this repo when:

- a task implements or validates C# parity with the official `cadenza` core
- a C#-native expression of tasks, signals, intents, helpers, globals, snapshots, or actors is being designed
- shared conformance behavior is being added for C#

Read before editing:

- `docs/agent-harness/exec-plans/active/2026-07-12-csharp-core-design-proposal.md`
- `docs/cadenza-meta-slice-language-fit-review.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/cadenza-intended-whole.md`
- `cadenza-csharp/AGENTS.md`

First files:

- `cadenza-csharp/README.md`
- `cadenza-csharp/Cadenza.sln`
- `cadenza-csharp/src/Cadenza/`
- `cadenza-csharp/tests/Cadenza.Tests/`
- `cadenza-csharp/conformance/core/v0/fixtures/`

Primary commands:

- `cd cadenza-csharp && dotnet format --verify-no-changes`
- `cd cadenza-csharp && dotnet build`
- `cd cadenza-csharp && dotnet test`

Contract role:

- Translation target for `core_runtime_primitives`; neutral versioned fixtures in `cadenza` own shared meaning and C# keeps repository-local snapshots.

Routing note:

- Core receives already-materialized delegates. Do not add Roslyn/source materialization, runtime adapters, policy engine, PostgresActor reconcilers, memory, CLI, chamber runtime, cells, distribution, persistence, actor sessions, or orchestration concepts into this repo unless a later approved design expands C# scope.
