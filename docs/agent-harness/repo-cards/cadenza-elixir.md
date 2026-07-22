# cadenza-elixir

Role: Elixir translation of the official Cadenza core contract.

Enter this repo when:

- a task implements or validates Elixir parity with the official `cadenza` core
- an Elixir-native expression of tasks, signals, intents, helpers, globals, snapshots, or actors is being designed
- shared conformance behavior is being added for Elixir

Read before editing:

- `docs/cadenza-elixir-translation-readiness.md`
- `docs/cadenza-intended-whole.md`
- `docs/cadenza-learning-path.md`
- `cadenza-elixir/AGENTS.md`

First files:

- `cadenza-elixir/README.md`
- `cadenza-elixir/mix.exs`
- `cadenza-elixir/lib/cadenza.ex`
- `cadenza-elixir/lib/cadenza/`
- `cadenza-elixir/test/`
- `cadenza-elixir/conformance/core/v0/fixtures/`

Primary commands:

- `cd cadenza-elixir && mix format --check-formatted`
- `cd cadenza-elixir && mix test`

Contract role:

- Translation target for `core_runtime_primitives`; neutral versioned fixtures in `cadenza` own shared meaning and Elixir keeps repository-local snapshots.

Routing note:

- Pass 1 is boring core parity. Do not import BEAM supervision strategy, process-backed architecture, macro DSL, legacy service, DB, CLI, demo, memory, chamber, cells, distribution, persistence, actor sessions, or orchestration concepts into the public contract unless a later approved design expands the Elixir scope.
