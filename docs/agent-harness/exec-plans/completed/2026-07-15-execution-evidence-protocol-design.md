# Realtime Execution Evidence Protocol Design

Date: 2026-07-15

## Goal

- Outcome: formalize a coherent V0 protocol for realtime business-logic
  execution evidence across core primitives, graph runs, chambers, cells,
  detached signals, inquiries, and distribution.
- Why it matters: automated scale and orchestration must not begin while
  Cadenza has several disconnected evidence forms and no single causal account
  of business execution.

## Current Status

- State: `done`
- Current repo: workspace meta repo.
- Impacted repos: proposed future changes in `cadenza`, `cadenza-python`,
  `cadenza-elixir`, `cadenza-csharp`, `cadenza-chamber`, and `cadenza-cell`.
- Complexity gate: required because this is a breaking cross-repo contract,
  security boundary, and core execution-semantics design.
- Approved by the user with `Design approved. Proceed.` on 2026-07-15.

## Scope

- In scope:
  - trace, graph-execution, primitive-effect, distribution-execution, transport
    attempt, and evidence-record identities.
  - causal behavior for detached signals, inquiries, and distributed calls.
  - trusted capture, durable local custody, meta processing, durable ledger,
    and projection boundaries.
  - structural, boundary, and debug evidence profiles.
  - recursion termination for evidence-processing meta slices.
  - context commitments, sensitive-data boundaries, ordering, replay,
    idempotency, and gap visibility.
  - relationship to current authority, chamber, cell, transport, and graph
    conclusion evidence.
- Out of scope:
  - product-code implementation.
  - final persistence schema or journal technology.
  - global trace-quiescence detection.
  - concurrency optimization.
  - memory, CLI, UI, and agent-history features.
  - legacy compatibility.

## Proposed Approach

- Specify the language-neutral semantic contract in
  `docs/contracts/execution-evidence/v0.md`.
- Propose `cadenza` as semantic authority while preserving chamber and cell
  ownership of trustworthy substrate capture.
- Treat traces as causal wholes rather than conventional spans.
- Require new graph executions, but not new traces, across detached signals.
- Distinguish one logical inquiry call from its potentially multiple responder
  obligations and graph executions.
- Make distribution calls and their transport attempts first-class and
  distinct.
- Require mandatory local custody before affect-bearing success, then process
  asynchronously with Cadenza meta primitives.
- Preserve production visibility of evidence processing through bounded
  boundary evidence rather than recursive task-level capture.

## Risks

- Breaking change risk: existing runtime envelopes and evidence schemas lack
  several proposed identities.
- Migration risk: generic correlation fields may currently carry different
  meanings at different boundaries.
- Security risk: diagnostic expansion could leak business context unless it is
  a separate governed disclosure artifact.
- Availability risk: fail-closed custody can stop work if the local journal is
  not bounded and reliable.
- Scale risk: task-level evidence can create unacceptable pressure without
  batching, commitments, profiles, and projection separation.
- Interpretation risk: treating timestamps as global order would create false
  causality.

## Migration Strategy

- Order of operations:
  1. approve semantic protocol and authority assignment.
  2. add shared schemas, event vocabulary, and conformance fixtures to
     `cadenza`.
  3. update official core implementations with trace and graph identity
     propagation plus runtime evidence hooks.
  4. update chamber capture and normalized outcomes.
  5. implement cell local custody and map peer evidence to distribution and
     transport-attempt identities.
  6. implement the evidence meta slice and one rebuildable durable projection.
  7. run cross-language, hostile-boundary, out-of-order, pressure, and recursive
     coherence reviews.
- Backward compatibility plan: none; this is a new major-version contract.
- Validation plan: shared canonical fixtures plus the conformance scenarios in
  the protocol.

## Alternatives

- Use vendor-style spans: rejected because detachment, graph result ownership,
  and distribution attempts do not map coherently to one nested span tree.
- Start a new trace for detached signals: rejected because it destroys the
  causal whole across fire-and-forget work.
- Capture evidence only through meta signals: rejected because the observed
  runtime could suppress, delay, forge, or recursively amplify its own
  evidence.
- Keep evidence processing entirely outside Cadenza: rejected because
  classification, persistence policy, aggregation, and projection are Cadenza
  feature extensions and can coherently use its primitives after custody.
- Persist mutable execution rows directly: rejected because mutable projections
  cannot serve as immutable temporal authority.
- Hide all meta execution in production: rejected because consequential support
  work must leave at least bounded boundary evidence.

## Questions Or Blockers

- None for semantic protocol closure.
- The implementation design must choose the durable local
  custody mechanism and exact canonical envelope fields.

## Assumptions

- Existing chamber and cell evidence will be adapted rather than discarded.
- Runtime capture may use substrate channels while evidence feature processing
  uses Cadenza primitives.
- Raw business context is excluded from base production evidence.
- Current single-threaded chamber command handling is not relied upon as a
  permanent ordering guarantee.

## Validation

- Checks to run:
  - `./scripts/check-agent-harness.sh`.
  - terminology review against graph conclusion, local orchestration, peer
    transport, authority gateway, and language runtime contracts.
  - legacy evidence-flow comparison against `cadenza-service` and
    `cadenza-db` as non-authoritative design evidence.
- Docs to update:
  - `docs/contracts/execution-evidence/v0.md`.
  - `docs/contracts/execution-evidence/coherence-review-v0.md`.
  - official roadmap gate status.
  - `docs/index.md`.
  - decision record and `contracts.config.json` only after approval.

## Exit Criteria

- The user explicitly approves the formal V0 protocol.
- A decision record captures the approved semantic model and authority split.
- The authority map names execution-evidence ownership.
- A separate implementation design identifies exact repo changes, fixtures,
  custody technology, rollout sequence, and validation.
