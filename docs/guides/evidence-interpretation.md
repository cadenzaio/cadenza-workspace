# Execution Evidence Interpretation Guide

## What Evidence Means

Evidence reports what identity participated, under which authority, at which
phase, with what normalized outcome and bounded commitments. It supports
realtime interpretation and durable audit. It does not prove that business
logic was wise or an external provider was honest.

Use the [evidence relationship view](../architecture/atlas/rendered/09-execution-evidence.svg)
and [custody lifecycle](../architecture/atlas/rendered/18-evidence-custody-lifecycle.svg).

## Identity Layers

- Trace: the overarching causal identity across inquiries, detached signals,
  graph runs, and distribution.
- Graph execution: one local graph run.
- Primitive/effect execution: task, signal, inquiry, responder, relationship,
  or composition work.
- Distribution execution: one cross-Cell delegation identity.
- Transport attempt: a bounded network attempt under that distribution.
- Custody batch and ledger record: transfer and durable interpretation, not
  business execution identities.

Detached signals start a new graph execution while preserving the trace.
Distribution and transport identities supplement rather than replace local
graph and task identity.

## Evidence Layers

| Layer | Meaning | Not yet proof of |
| --- | --- | --- |
| Core runtime report | Primitive event, execution identity, cause, authority reference, outcome, and commitments | Trusted observation or durable custody |
| Chamber capture | Validated runtime report bound to image, adapter, request, and Chamber observation basis | Cell durability |
| Cell normalized record and receipt | Canonical record synchronized to the Cell-generation journal | Environment ledger commit |
| Sealed Cell batch and processing attempt | Bounded transfer unit and exact processor custody | Successful ledger append |
| Environment ledger receipt | Exact batch committed durably | Cell acknowledgement and releasable local custody |
| Cell acknowledgement and checkpoint | Exact receipt accepted and predecessor authority preserved | Business correctness |

Evidence custody transfers only when the next owner returns the exact required
acknowledgement. A runtime report, capture, or successful provider call cannot
stand in for a missing receipt.

## Read Failure Truthfully

`started` means affect may have begun. Connection loss after that point cannot
be rewritten as “not executed.” `commit_unknown` requires exact outcome
resolution. A custody barrier failure prevents a successful result even when
business code completed. Pressure may stop new work to preserve terminal
evidence reserve.

Read failure through the
[operational interpretation guide](./operational-interpretation.md):

1. identify the exact trace and narrowest failed execution;
2. locate the last accepted or started event;
3. locate the last durable custody receipt;
4. identify any distribution, transport, mutation, batch, or attempt identity
   whose outcome is unresolved;
5. distinguish execution failure from evidence transfer failure;
6. resolve or retain the exact custody before permitting retry or cleanup.

Detached signals preserve trace identity but start a new graph execution.
Signals acknowledge acceptance, not completion. A missing child completion
must not be inferred from the parent graph outcome.

## Disclosure

Evidence may include definition references, authority identities, phases,
normalized outcomes, and cryptographic context commitments. Raw contexts,
callable source, credentials, private keys, host objects, and generic commands
are excluded. Debug evidence remains bounded and does not bypass this rule.

Actor state keys are represented by digest outside the invocation path.
Aggregate drain evidence omits per-key actor identities by design. Commitments
show equality or change of hidden values; they do not reveal or validate the
business meaning of those values.

## Custody Under Pressure

- Normal journal high-water rejects new execution before affect.
- Terminal reserve exists only to close work already admitted.
- Unknown ledger commit retains the batch claim and processing attempt.
- Exact equal replay returns the original receipt.
- Conflict, malformed authority, or historical absence fails closed.
- Compaction starts only after local acknowledgement of the exact ledger
  receipt and publication of predecessor authority.

Never delete local evidence to restore availability. Restore the processor or
ledger path, resolve the exact attempt, and verify acknowledgement before
claiming custody released.
