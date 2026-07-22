# Realtime Execution Evidence Protocol

Date: 2026-07-15

## Context

Cadenza had several valid but disconnected evidence forms for authority,
chamber lifecycle, cell containment, peer transport, and graph conclusions. It
did not yet have one semantic account of realtime business execution across
tasks, signals, local graph runs, inquiries, detached work, and inter-cell
distribution.

The legacy `cadenza-service` and `cadenza-db` implementations demonstrated that
an overarching trace can survive detached signals while each observer starts a
new local graph run, that distributed evidence arrives out of order, and that
evidence processing can use Cadenza meta graphs. They also exposed weak
boundaries around raw context, mutable persistence, meta recursion, and
distribution identity.

Scale and orchestration would multiply those ambiguities if implemented before
execution evidence became a governed cross-repo contract.

## Decision

- `cadenza` owns the language-neutral execution-evidence semantics.
- a trace is the complete causal whole and survives graph, signal, inquiry,
  chamber, cell, and language boundaries.
- a detached signal starts zero or more new graph executions in the same trace;
  detachment removes response obligation, not causal membership.
- V0 does not define authoritative trace closure because no trace steward yet
  owns all detached descendants.
- graph executions, task executions, signal emissions, inquiry calls, inquiry
  responders, relationship resolutions, compositions, distribution calls,
  transport attempts, and evidence records have distinct identities.
- trusted substrate captures and places mandatory evidence into bounded local
  custody before affect-bearing success.
- evidence processing after custody is a Cadenza meta feature and uses Cadenza
  primitives.
- evidence-processing execution remains visible through production boundary
  evidence and terminates recursion through trusted processing eligibility.
- immutable append records are evidence authority; mutable status and realtime
  views are rebuildable projections.
- base evidence contains commitments and normalized outcomes, not raw business
  context or secrets.
- cross-source causality follows explicit keys; timestamps never establish
  distributed order.

## Consequences

- authored business graphs do not carry tracing or deployment infrastructure.
- official core languages must converge on shared identity propagation,
  canonical commitments, and runtime evidence hooks.
- chamber and cell contracts retain their legitimate substrate ownership but
  must link their evidence into the shared execution identities.
- the cell requires a bounded durable local custody mechanism before the
  protocol can be implemented honestly.
- the environment requires an evidence meta slice and rebuildable durable
  projection before realtime evidence is operationally complete.
- current generic correlation fields and overloaded legacy run/inquiry IDs must
  be replaced or mapped explicitly.
- no legacy compatibility layer is required for the new major version.
- Sprint 7 scale and orchestration remain blocked until the approved protocol is
  implemented and reviewed.

## Alternatives

- vendor-style nested spans: rejected because detached work, inquiry response,
  and transport attempts are not one strict parent-child timing tree.
- start a new trace on signal detachment: rejected because it fragments the
  causal whole.
- capture only through meta signals: rejected because the observed runtime
  would control its own first evidence boundary and could recurse.
- keep all evidence processing outside Cadenza: rejected because processing,
  policy, aggregation, and projection are feature extensions that should use
  Cadenza primitives after trustworthy custody.
- hide evidence-processing execution in production: rejected because support
  work with consequence must leave bounded evidence.
- use mutable database rows as evidence: rejected because later state would
  overwrite temporal truth.
- define trace completion now: rejected because it would claim knowledge that
  no V0 identity owns.

## Links

- [Approved protocol](../contracts/execution-evidence/v0.md)
- [Coherence review](../contracts/execution-evidence/coherence-review-v0.md)
- [Completed design plan](../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-protocol-design.md)
- [Cadenza intended whole](../cadenza-intended-whole.md)
- User approval with `Design approved. Proceed.` on 2026-07-15.
