# TypeScript Actor API Purpose Repair

Date: 2026-07-27

## Context

The Sprint 10B recursive purpose review found that TypeScript serialized actor
definition types carried a runtime-state generic even though runtime state is
not serialized. It also found that `createActorFromDefinition` exposed an
options argument that was ignored and that `ActorFactoryOptions` published an
internal definition-source custody mechanism.

The user approved the focused design on 2026-07-27 with:

`Sprint 10B TypeScript actor API purpose repair design approved. Proceed.`

## Decision

- Serialized actor authority is expressed as `ActorStateDefinition<D>`,
  `ActorDefinition<D>`, and `ActorSpec<D>`.
- `Actor<D, R>` and its task/runtime-state APIs retain separate durable and
  runtime state typing.
- Public Cadenza actor creation accepts no caller-owned factory options.
- Exact definition round trips remain a module-owned construction concern.
- The base `Task.getTag(context)` argument remains a purposeful specialization
  hook even though the base implementation uses only the task name.
- The TypeScript core enables unused-local and unused-parameter compiler
  checks.

## Consequences

- The TypeScript source API is intentionally breaking for callers that imported
  `ActorFactoryOptions` or passed the ignored options argument.
- Neutral JSON actor definitions and the Python, Elixir, and C# core contracts
  do not change.
- The packed TypeScript core digest and reference-system artifact binding must
  be regenerated and checked.
- RC1 remains immutable; the repair belongs to the post-RC consolidation
  lineage.

## Alternatives

- Retain and suppress the unused public symbols: rejected because they claim
  affect they do not possess.
- Serialize runtime state to use the generic: rejected because runtime state is
  runtime-owned and non-durable.
- Honor caller-supplied definition source: rejected because source authority
  could differ from the definition actually validated and materialized.
- Collapse durable and runtime state into one type: rejected because they have
  distinct lifecycle and persistence meaning.

## Links

- [Approved design](../agent-harness/exec-plans/completed/2026-07-27-typescript-actor-api-purpose-repair-design.md)
- [Sprint 10B review](../publication/sprint-10b-recursive-purpose-contract-review-v1.md)
- [Sprint 10 design](../agent-harness/exec-plans/active/2026-07-25-distributed-foundation-consolidation-hardening-design.md)
