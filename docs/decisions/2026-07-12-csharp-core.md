# C# Core

## Context

Cadenza now has TypeScript, Python, and Elixir official core implementations. The meta-slice language fit review showed that C# is likely to matter for more than ordinary business logic: policy evaluation, expansion-control reconciliation, capability planners, PostgresActor backing reconcilers, enterprise plugins, typed SDKs, generated surfaces, and runtime adapter validation are all plausible C#-natural slices.

## Decision

Create `cadenza-csharp` as the next official Cadenza core translation repo.

The first implementation pass is boring core parity. It proves primitive semantics in C# before any C# runtime adapter, Roslyn source materialization, policy engine, chamber runtime, or meta-slice implementation.

The C# core receives already-materialized delegates. Source-to-callable materialization remains a cell/chamber runtime adapter concern governed by `docs/cadenza-language-runtime-contract.md`.

## Consequences

- C# joins TypeScript, Python, and Elixir as an official core language.
- `cadenza` remains the current shared contract authority.
- C# can later become a strong base for C#-natural meta slices, but those slices should not be implemented inside the core repo.
- Roslyn work is deferred until a runtime adapter design satisfies materialization, containment, and evidence requirements.
- The workspace authority map now lists `cadenza-csharp` as a consumer of `core_runtime_primitives`.

## Alternatives

- Defer C# until after Sprint 2. Rejected because the translation context is fresh and the language fit review gives enough evidence that C# will matter for planned meta slices.
- Implement C# only as an execution adapter. Rejected because this would miss the value of C# as a typed primitive steward.
- Start C# policy or backing reconciler work without a C# core. Rejected because meta-slice work should not precede primitive coherence in that language.

## Links

- Design proposal: `docs/agent-harness/exec-plans/active/2026-07-12-csharp-core-design-proposal.md`
- Language fit review: `docs/cadenza-meta-slice-language-fit-review.md`
- Language runtime contract: `docs/cadenza-language-runtime-contract.md`
- Repo card: `docs/agent-harness/repo-cards/cadenza-csharp.md`
