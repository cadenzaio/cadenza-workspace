# Graph Conclusion Conformance V0

## Authority

- semantic authority: this contract, its canonical fixture, and the decision record.
- working implementation authority: `cadenza`.
- official core consumers: `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp`.
- substrate consumer: the TypeScript adapter in `cadenza-chamber`.

## Required Proofs

Implementations must consume [fixtures/v0-graph-conclusion.json](fixtures/v0-graph-conclusion.json) and prove every named positive and negative case.

The fixture defines semantic cases rather than language-specific API spelling. Each core may expose an idiomatic relationship API, but exported definitions must preserve the language-neutral `contributes_to_result` meaning.

## Validation Invariants

- one immutable run-entry baseline is used for every terminal delta.
- terminal completion order cannot alter the outcome.
- metadata keys beginning with `__` do not create business-context conflicts.
- excluded branches still gate completion.
- conflicts identify canonical JSON Pointer paths and terminal provenance.
- chamber delegation maps both composition and terminal execution failures to a started `execution_failed` outcome.
