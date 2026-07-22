# Deterministic Graph Conclusion

## Context

Cadenza graphs coordinate work. Request/response behavior is built around that coordination by observing completion of an inquiry or delegated graph. The previous runtime exposed the context of whichever terminal node completed the graph last. Multi-terminal graphs therefore made result meaning dependent on graph shape and completion order, forcing architects to create defensive terminal joins even when branch changes were structurally compatible.

## Decision

- preserve graph execution as coordination and add one internal run-scoped conclusion boundary for result composition.
- calculate every terminal delta against the immutable user context supplied at graph-run entry, never against a context captured at an intermediate split.
- merge disjoint provenance deltas and collapse canonically identical mutations.
- fail explicitly and deterministically when contributing terminal deltas conflict.
- let architects define ordinary unique join tasks for domain-specific merge logic; the internal conclusion forwards their authored output.
- add a relationship-level `contributes_to_result` policy, defaulting to `true`, for branches that must complete but should not affect automatic result composition.
- keep result exclusion distinct from signal detachment.
- treat terminal execution failure and composition failure as started execution failures at a chamber delegation boundary.
- keep conflict values out of ordinary diagnostics unless an authorized diagnostic surface permits them.

## Consequences

- inquiry and delegation results no longer depend on terminal completion order.
- multi-terminal graphs with compatible changes need no boilerplate join task.
- semantically incompatible writes become visible failures instead of silent precedence choices.
- task relationship definitions gain result-contribution meaning that official core languages and materializers must preserve.
- the TypeScript core remains the working implementation authority; Python, Elixir, and C# remain conformance implementations.
- chambers and cells transport normalized outcomes but do not own composition semantics.

## Alternatives

- require an authored join for every multi-terminal graph: rejected because it preserves avoidable accidental complexity for structurally compatible branches.
- shallow-merge terminal contexts in completion order: rejected because it is nondeterministic and hides conflicts.
- mutate every authored graph by adding a persisted conclusion task: rejected because conclusion identity is run-specific and runtime participation can differ from static reachability.
- exclude tasks globally from results: rejected because task reuse would make result meaning depend on ambient task configuration rather than the relationship in the current flow.

## Links

- [Graph conclusion contract](../contracts/graph-conclusion/v0.md)
- [Conformance requirements](../contracts/graph-conclusion/conformance-v0.md)
- [Sprint 5 design](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
- [Intended whole](../cadenza-intended-whole.md)
