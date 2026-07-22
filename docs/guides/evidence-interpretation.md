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

## Read Failure Truthfully

`started` means affect may have begun. Connection loss after that point cannot
be rewritten as “not executed.” `commit_unknown` requires exact outcome
resolution. A custody barrier failure prevents a successful result even when
business code completed. Pressure may stop new work to preserve terminal
evidence reserve.

## Disclosure

Evidence may include definition references, authority identities, phases,
normalized outcomes, and cryptographic context commitments. Raw contexts,
callable source, credentials, private keys, host objects, and generic commands
are excluded. Debug evidence remains bounded and does not bypass this rule.
