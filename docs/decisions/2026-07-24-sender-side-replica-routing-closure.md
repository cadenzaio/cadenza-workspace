# Sender-Side Replica Routing Closure

Date: 2026-07-24

## Context

Cadenza already projects every current ready replica as an opaque route member,
marks multi-candidate route groups as `round_robin`, lets the sending Chamber
select a member, and requires the source Cell to validate and resolve that exact
selection. Focused tests prove candidate projection, and the Linux system proof
reaches two ready target replicas, but no existing proof repeatedly executes
ordinary work and demonstrates that both replicas receive it.

This is a vital part of distribution because a system that can create replicas
but cannot prove coherent execution selection among them has not closed the
intended reduction of deployment and scaling complexity.

## Decision

- Preserve sender-side selection in generated Chamber runtime support. Do not
  introduce a load-balancer service or a second Cell-side selection decision.
- Define V0 balancing as deterministic round-robin per sending Chamber, route
  group, and route epoch.
- Bound selection state to one current epoch and offset per route group. Route
  epoch replacement resets the offset, and the offset wraps at candidate count.
- Prove exact delegation and signal selection sequences in focused Chamber
  adapter tests.
- Prove that Cell routing resolves both explicit selections and rejects stale
  or removed selections without substitution.
- Extend the existing three-Cell Linux scenario with four repeated delegations
  after two target replicas are ready. Use durable execution evidence to prove
  both target replicas receive work without exposing topology in business
  context or results.
- Keep system evidence assertions set-based. Exact ordering belongs in the
  deterministic adapter test because asynchronous evidence custody may reorder
  otherwise valid records.

Signals retain their existing relationship semantics: each subscribing slice
receives one forwarded signal, with one replica selected inside that slice's
route group. Actor-owner routes remain authority-directed and are not balanced.
An uncertain or started execution is never automatically retried on another
replica.

## Consequences

- Replica balancing remains a private consequence of normal delegation,
  inquiry, and signal APIs.
- There is no global fairness claim across multiple sending Chambers and no
  load-aware, weighted, or least-connections policy.
- Long-lived Chambers no longer retain obsolete per-epoch counters.
- Test growth is bounded to focused adapter and Cell assertions plus a small
  extension of an existing system proof.
- No schema, migration, authority operation, primitive contract, business API,
  or compatibility layer changes.

## Alternatives

- Add a separate load-balancer service: rejected because it duplicates route
  authority and moves an ordinary execution decision outside the sender.
- Add a new standalone Linux proof: rejected because the existing three-Cell
  supply scenario already creates the required source and two target replicas.
- Assert exact round-robin order from durable system evidence: rejected because
  asynchronous custody order is not routing order.
- Add weighted or load-aware selection now: rejected because no measured need
  justifies the additional state, interpretation, and failure modes.

## Links

- [Completed execution plan](../agent-harness/exec-plans/completed/2026-07-24-replica-routing-closure.md)
- [Local orchestration contract](../contracts/local-orchestration/v0.md)
- [Distribution contract](../contracts/distribution/v0.md)
- User approval on 2026-07-24: `Design approved. Proceed.`
