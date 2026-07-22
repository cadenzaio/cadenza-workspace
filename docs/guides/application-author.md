# Cadenza Application Author Guide

## Purpose

Cadenza lets a human or agent spend attention on workflow and business logic.
An application describes tasks, explicit relationships, intents for responses,
signals for detached consequences, and actors for durable keyed behavior. It
does not embed deployment, placement, transport, containment, credentials, or
recovery mechanics in business code.

Start with the [intended whole](../cadenza-intended-whole.md), then view
[graph behavior](../architecture/atlas/rendered/07-graph-behavior.svg) and the
[reference order journey](../architecture/atlas/rendered/13-reference-business-journey.svg).

## Model A Workflow

1. Name the business intent in lowercase kebab-case when a caller needs a
   response, for example `submit-order`.
2. Give every task one explicit business responsibility and a stable key.
3. Relate awaited work with task relationships. Use a signal only when the work
   is genuinely detached from completion.
4. Return the business context needed by successor tasks. A task return value
   is its successors' context.
5. Let deterministic conclusion compose terminal changes. A conflicting write
   to the same context path is an explicit composition failure, not a race won
   by timing.
6. Mark a relationship as non-contributing only when its result is irrelevant
   to the graph result. Use a domain join task for custom composition.
7. Use an actor when behavior belongs to one durable keyed identity and must
   remain serialized and recoverable across runtime owners.

## Keep Boundaries Explicit

- Providers are named business boundaries such as payment, inventory, risk, or
  shipping. Their failure is a domain outcome, not hidden infrastructure magic.
- Integer money and domain invariants belong in business logic and schemas.
- Definition import never evaluates source. A controlled Chamber adapter
  materializes callable source; the core materializes primitives.
- Evidence carries identities, phases, normalized outcomes, and context
  commitments. It does not expose raw business context or credentials.

## Working Example

The [`cadenza-reference-system`](../../cadenza-reference-system/README.md)
contains order submission, parallel pricing/inventory/risk decisions,
deterministic fan-in, payment, stock reservation, actor state, cancellation,
fulfillment, detached audit, and explicit conflict scenarios. Its
[walkthrough](../../cadenza-reference-system/docs/walkthrough.md) follows the
business flow first and reveals runtime consequences progressively.

## Current Limits

TypeScript is the only distributed Chamber adapter. Python, Elixir, and C# are
complete core expressions but currently run locally. Chamber execution is
serialized. Memory, CLI, the observer UI, managed cloud control, and mutating
agent/UI integration are not part of this release candidate.
