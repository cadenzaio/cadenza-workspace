# C# Core Design Proposal

## Status

done

Approved by the user on 2026-07-12 with: "Design approved. Proceed."

Completed on 2026-07-12 after creating the first C# core repo and validating the boring parity slice.

## Context

- Problem: Cadenza already has TypeScript, Python, and Elixir official core implementations, but the meta-slice language fit review shows that C# is likely to matter for more than ordinary business logic.
- Why now: The translation context is fresh after Python and Elixir. C# is a strong candidate for policy evaluation, expansion-control reconciliation, capability planners, PostgresActor backing reconcilers, enterprise plugins, typed SDKs, generated surfaces, and runtime adapter validation.
- Evidence:
  - `docs/cadenza-meta-slice-language-fit-review.md` identifies C# as very strong for policy evaluation, expansion control, and backing reconcilers.
  - `docs/cadenza-language-role-doctrine.md` limits official core languages to a small steward set while allowing broader execution adapters later.
  - `docs/cadenza-language-runtime-contract.md` separates core primitive implementation from source-to-callable materialization.
  - Official Microsoft documentation currently lists .NET 10 as Long Term Support until November 2028 and explains that even-numbered .NET releases are LTS releases.

## Proposed Approach

- Change summary:
  - Create a new independent official core repo: `cadenza-csharp`.
  - Implement Cadenza primitive semantics in idiomatic modern C#/.NET.
  - Use the existing TypeScript core as current contract authority.
  - Use Python and Elixir as translation references, not as authorities over C# idiom.
  - Preserve callable materialization boundary: C# core receives delegates/callables, not source strings.
  - Defer Roslyn/source-to-callable work to the language runtime adapter layer.

- Why this shape:
  - C# gives Cadenza a strong statically typed, enterprise-grade core expression.
  - Several planned meta slices are C#-natural enough that proving the core now reduces future design uncertainty.
  - The .NET ecosystem is strong for typed service contracts, policy envelopes, PostgreSQL integration, generated SDKs, and long-lived enterprise systems.
  - A C# core can later support a C# runtime adapter, but that adapter must satisfy the language runtime contract and must not be confused with core.

- Non-goals:
  - Do not implement Roslyn source materialization in the core.
  - Do not implement chamber/cell runtime substrate.
  - Do not implement policy engine, PostgresActor backing reconciler, expansion-control, or runtime adapters in this repo slice.
  - Do not add memory, CLI, persistence, distribution, actor sessions, orchestration, or public runtime process topology.
  - Do not make C# the default or only meta-slice language by policy.

## Proposed Repo Shape

- Repo: `cadenza-csharp`
- Solution: `Cadenza.sln`
- Projects:
  - `src/Cadenza/Cadenza.csproj`
  - `tests/Cadenza.Tests/Cadenza.Tests.csproj`
- Target framework:
  - `net10.0` preferred because .NET 10 is the current LTS release.
  - If local tooling blocks immediate work, temporarily target the newest installed supported LTS and record the exception.
- Namespace:
  - `Cadenza`
- Package identity:
  - NuGet package name can be decided later; likely `Cadenza.Core` or `Cadenza`.

## Public API Direction

C# should be idiomatic without changing shared meaning.

Recommended first surface:

- `Cadenza.CreateTask(...)`
- `Cadenza.Run(...)`
- `Cadenza.Then(...)`
- `Cadenza.CreateHelper(...)`
- `Cadenza.CreateGlobal(...)`
- `Cadenza.DefineIntent(...)`
- `Cadenza.DefineSignal(...)`
- `Cadenza.CreateActor(...)`
- `Cadenza.CreateActorTask(...)`
- `Cadenza.Inquire(...)`
- `Cadenza.Emit(...)`
- `Cadenza.SnapshotRuntime()`

Recommended type style:

- records or sealed classes for primitive definitions
- `Dictionary<string, object?>` or a thin `CadenzaContext` wrapper for context
- delegates for handlers:
  - task handler
  - task handler with tools
  - helper handler
  - actor handler
- `System.Text.Json` for JSON-shaped conformance and snapshots
- exceptions for invalid definition/validation errors in the first core slice, matching current translation behavior

## Translation Principles

- Preserve shared primitive meaning first.
- Express C# idiomatically where it improves clarity.
- Use stable keys for tasks, actors, helpers, and globals.
- Use lowercase kebab-case intent names.
- Use lowercase dot-separated signal names with optional exact tags.
- Keep source/language metadata interpretive only.
- Materialize primitives from already-callable delegates.
- Keep core persistence-agnostic.
- Keep runtime/process/substrate choices private or out of scope.
- Avoid overfitting the core API to future C# meta-slice implementation details.

## Implementation Passes

### Pass 1: Boring Core Parity

Purpose: prove C# can express the shared primitive contract without smuggling runtime adapter, policy engine, chamber, persistence, or enterprise service concerns into core.

Initial scope:

- repo skeleton and repo-local `AGENTS.md`
- task identity, creation, execution, chaining, branch filtering, list splitting, unique fan-in
- helper/global definitions and alias-scoped tools
- intent/signal names and local inquiry/signal behavior
- schema validation and JSON-shaped snapshots
- callable-backed definition materialization from delegates
- actor identity, actor-bound tasks, keyed durable/runtime state, and read/write mode enforcement
- shared JSON conformance runner for the implemented fixture set

### Pass 2: C# Completeness And Idiom

Purpose: complete the shared core and improve C# expression while preserving the contract.

Candidate scope:

- async-friendly APIs where they preserve shared semantics
- cancellation-token-aware local execution where appropriate
- immutable or read-only views for globals and snapshots
- stronger typed envelopes for schemas, inquiry metadata, and signal metadata
- test coverage for C# edge cases around delegate shapes and JSON normalization

### Deferred Adapter Pass

Purpose: explore C# source-to-callable materialization through Roslyn under the language runtime contract.

This is not part of core implementation.

Any Roslyn work must satisfy:

- materialization envelope
- containment boundary
- dependency lock policy
- capability injection
- resource limits
- evidence emission
- adapter conformance tests

## Impacted Repos

- Authority repo:
  - `cadenza` remains current shared contract authority.
- New repo:
  - `cadenza-csharp`
- Translation references:
  - `cadenza-python`
  - `cadenza-elixir`
- Workspace docs:
  - `docs/cadenza-language-role-doctrine.md`
  - `docs/cadenza-language-runtime-contract.md`
  - `docs/cadenza-meta-slice-language-fit-review.md`
  - repo card and workspace map after repo creation
- Deferred consumers:
  - future C# runtime adapter
  - policy/meta-slice implementations
  - generated SDKs

## Risks

- Breaking change risk:
  - Low for existing repos if C# starts as an independent repo.
  - Medium for shared fixtures if it exposes ambiguity in current cross-language contracts.
- Migration or rollout risk:
  - Low initially; no existing C# users.
  - Medium later if C# meta slices depend on early API choices.
- Testing risk:
  - JSON normalization differences between C#, TypeScript, Python, and Elixir may expose fixture drift.
  - Numeric and date/time value representation need care.
  - Async/cancellation behavior must not silently change shared execution semantics.
- Security risk:
  - High if Roslyn/materialization leaks into core. This proposal explicitly defers it.

## Migration Strategy

- Order of operations:
  1. Create `cadenza-csharp` repo skeleton and repo-local agent contract.
  2. Implement Pass 1 boring core parity.
  3. Add local unit tests.
  4. Add shared conformance runner.
  5. Run coherence review against the language role doctrine and runtime contract.
  6. Only after core parity, decide whether C# Pass 2 or Sprint 2 meta-slice implementation comes next.

- Backward compatibility plan:
  - No legacy compatibility requirement.
  - C# should match the new major-version core direction, not old legacy repos.

- Validation plan:
  - `dotnet format --verify-no-changes`
  - `dotnet build`
  - `dotnet test`
  - JSON conformance fixture coverage
  - workspace `./scripts/check-agent-harness.sh`
  - `git diff --check`

## Alternatives

- Option A: Defer C# until after Sprint 2.
  - Benefit: keeps focus on TypeScript foundation.
  - Cost: may delay or distort C#-natural meta slices such as policy and backing reconcilers.

- Option B: Implement C# only as an execution adapter.
  - Benefit: faster if the goal is only to run C# task logic.
  - Cost: misses the value of C# as an official typed primitive steward and meta-slice language.

- Option C: Start with C# policy/backing reconciler without a C# core repo.
  - Benefit: directly targets meta slices.
  - Cost: risks creating C# meta behavior before proving primitive coherence in C#.

- Recommendation:
  - Create `cadenza-csharp` as the next official core repo before implementing C#-natural meta slices.

## Assumptions

- The C# implementation will use modern .NET rather than legacy .NET Framework.
- `net10.0` is the preferred target if local tooling supports it.
- Roslyn source materialization is adapter-layer work, not core work.
- C# will be one of a small number of official core languages, not the start of unlimited full core translations.
- C# meta-slice work should wait until the core repo proves parity or until a specific approved slice justifies parallel implementation.

## Approval Gate

Implementation should start only after explicit approval:

> Design approved. Proceed.

## Sources

- Microsoft .NET releases and support: `https://learn.microsoft.com/en-us/dotnet/core/releases-and-support`
- Microsoft .NET lifecycle FAQ: `https://learn.microsoft.com/en-us/lifecycle/faq/dotnet-core`
- Cadenza meta-slice fit review: `docs/cadenza-meta-slice-language-fit-review.md`
- Cadenza language runtime contract: `docs/cadenza-language-runtime-contract.md`

## Progress - 2026-07-12

- Created independent `cadenza-csharp` repo.
- Installed .NET SDK 10.0.301 locally under `<local-user-path>/.dotnet-codex` because no system `dotnet` was available and Homebrew cask installation required sudo.
- Created `Cadenza.sln`, `src/Cadenza`, and `tests/Cadenza.Tests`.
- Added repo-local `AGENTS.md`, README, `.gitignore`, and warning-as-error build settings.
- Implemented first boring core slice:
  - tasks
  - context execution
  - branch filtering and splitting
  - unique fan-in with joined contexts
  - helpers and globals
  - intents and local inquiry
  - signals and local observers
  - callable-backed definitions from delegates
  - actors with keyed durable/runtime state and read/write mode enforcement
  - key-first snapshots
- Added local unit tests and initial JSON conformance fixture tests for core identity and runtime branching.

## Validation - 2026-07-12

- `cd cadenza-csharp && dotnet format --verify-no-changes`
- `cd cadenza-csharp && dotnet build`
- `cd cadenza-csharp && dotnet test`
  - Passed: 12
  - Failed: 0
  - Skipped: 0
- `./scripts/check-agent-harness.sh`
- `git diff --check`

Deferred work remains intentionally outside this completed pass: Roslyn/source materialization, runtime adapters, persistence, distribution, scheduler semantics beyond current local execution, and C#-natural meta slices.
