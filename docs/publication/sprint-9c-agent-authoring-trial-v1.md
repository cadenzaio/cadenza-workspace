# Sprint 9C Clean-Context Agent Authoring Trial V1

Date: 2026-07-22

## Question

Can an agent with no workspace history author realistic business logic using
only the public TypeScript package and README, without learning or leaking Cell,
Chamber, authority, placement, transport, database, or evidence concerns?

## Method

The agent received an isolated directory containing only:

- packed `@cadenza.io/core`, SHA-256
  `244275703171142597f44f0e106bd82da4114492f11abea9c468051f829a81e5`;
- the package's public README, SHA-256
  `b64ff42e4d90442aef0b8c56b0b9be7195b213153f196f4697eff6fcacfb7512`;
- a task brief, SHA-256
  `5a0f8d06a124fc119d3b07928a679e29cb885ca515743e844f8e33b3a5f7d165`.

The task required a `quote-order` intent, one validating task, a separate
integer-cent calculation task, an explicit relationship, valid and invalid
tests, and a report. The agent was prohibited from inspecting the workspace.

## Result

The agent completed the application in approximately 15 minutes. It produced:

- an intent-based two-task graph;
- a valid EUR `14,000`-cent quote;
- rejection of an order with no lines;
- no disallowed infrastructure term or API in business source or tests.

Independent reproduction in `node:24.18.0-bookworm-slim` passed `npm ci`,
TypeScript typecheck, two Vitest tests, and the ESM/declaration build.

## Findings And Disposition

| Finding | Disposition |
| --- | --- |
| The README did not show `defineIntent`, `respondsTo`, or `inquire`; declarations had to be inspected. | Repaired: the public README now includes a complete request-response flow. |
| Task-to-task context propagation was implicit; the first implementation dropped fields needed by its successor. | Repaired: the README now states that a task's return value is its successors' context and demonstrates preserving required fields. |
| Portable schemas do not express a minimum array length. | Accepted boundary: domain-specific cardinality is enforced by a validating task; no new schema contract was introduced. |
| The trial host had Node `24.14.1`, below the declared `24.18.0` minimum. | Closed by independent exact-runtime reproduction. |

The trial consumer selected current development dependencies and npm reported
one low-severity development advisory. This does not originate in the packed
Cadenza dependency graph and is not evidence about a production consumer
lock; the trial's purpose was framework authorability.

## Conclusion

The trial supports the intended whole: an agent could focus on validation,
calculation, and logical flow while distributed infrastructure remained absent
from business code. The first attempt still required declaration inspection
and one diagnostic run, so the public surface was usable but not sufficiently
self-explanatory. The documentation repairs directly address both observed
failures. Sprint 9F should repeat this trial from the public package and public
README rather than from workspace-created inputs.
