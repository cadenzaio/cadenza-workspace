# Contract Foundation Sprint Split

## Context

The user approved the Contract Foundation design in Codex on 2026-07-10 with:

```text
Design approved. Proceed.
```

The approved design follows the current official direction that `cadenza` is the only near-term official foundation repo. `cadenza-service`, `cadenza-db`, `cadenza-ui`, demo repos, and earlier runtime/CLI work are legacy or reference-only unless explicitly revived later.

Sprint 0 established the intended whole: Cadenza should reduce accidental complexity around software creation, operation, deployment, scale, and distribution so humans and agents can focus on business logic, intended function, and logical workflow.

## Decision

Sprint 1 is split into two linked sprints:

- Sprint 1A: TypeScript Contract Foundation in `cadenza`.
- Sprint 1B: Polyglot Foundation after the TypeScript contract is spotless.

Sprint 1A will make the TypeScript core the canonical reference implementation before any new official language repos are created. Backwards compatibility is not required; this is a new major-version direction, and legacy consumers can remain on previous core versions.

The Sprint 1A standard for "spotless" is:

- every source module, public API, test, and doc serves the intended whole
- no dead, exploratory, or legacy code remains without an explicit current purpose
- public docs match exported behavior
- tests cover every changed primitive contract
- names are labels, not correctness-bearing identity
- routines are not treated as future executable primitive structure
- future chamber, cell, and database concerns do not leak into core
- the core is suitable as the canonical contract reference for later language implementations.

Sprint 1B will use one repo per language implementation. Python and Elixir are mandatory first targets. The third language is still undecided, but it must be able to materialize source strings into runtime functions. Shared language-neutral behavior specs and JSON fixtures will provide conformance coverage.

## Consequences

- Implementation starts with an inventory of the current `cadenza` public API, source modules, tests, and docs.
- Breaking changes are allowed when they serve the intended whole.
- Compatibility-shaped APIs may only remain if they have a current coherent purpose, not because legacy consumers expect them.
- CLI, memory, UI/UX, chamber runtime, cells, distribution, authority/tag/policy runtime, and legacy service/db/demo work are out of Sprint 1A scope.
- Polyglot work waits until TypeScript is coherent enough to inherit.

## Alternatives

- Compatibility-first incremental evolution.
  - Rejected because it would preserve legacy ambiguity and conflict with the new major-version direction.
- Start with bootstrap, authority, chamber, cells, or distribution before core cleanup.
  - Rejected because higher layers would inherit unstable primitive semantics.
- Keep Cadenza TypeScript-only until much later.
  - Rejected as the long-term model should be language-independent, and Elixir/Beam alignment is strategically important.
- Include CLI or memory in the current foundation sprint batch.
  - Rejected because both are deferred until after the core stabilizes.

## Links

- [Contract Foundation design](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-09-contract-foundation-design.md)
- [Cadenza intended whole](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- [Official roadmap](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md)
- [Contract Foundation backlog](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/contract-foundation-backlog-2026-07-09.md)
