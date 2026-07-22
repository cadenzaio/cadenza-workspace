# Multi-Cell Static Placement Foundation

Date: 2026-07-14

## Context

Sprint 5 proved local multi-chamber execution, but distribution requires more
than a network adapter. Cadenza has no unprivileged cell-host daemon, chamber
route candidates are location-specific chamber keys, additional cell enrollment
and placement authority are absent, and general source activation authority is
not yet persisted beyond the bootstrap authority slice.

Introducing dynamic scheduling or stem-cell reconciliation before these
identities and boundaries are proven would multiply ambiguity. Simulating two
cells in one process or representing remote replicas as virtual chambers would
also create false success.

## Decision

- Sprint 6 is divided into distribution authority, authenticated transport, and
  two-cell environment closure passes.
- `cadenza-cell` gains a real unprivileged host process with one generation per
  process lifetime.
- cell transport uses a separately enrolled key rather than the existing
  control/containment key.
- direct peers use authority-pinned mutual TLS plus signed canonical execution
  envelopes.
- chamber projections select opaque route-member identities instead of local or
  remote chamber topology.
- static placement units may contain multiple required runtime-slice members;
  each replica materializes one chamber per member.
- Sprint 6 validates explicit static assignments only. Stem-cell
  reconciliation, scheduling, optimization, and healing remain later work.
- enrollment and placement management are expressed as a contained Cadenza
  distribution-control meta slice over fixed authority operations.

## Consequences

- authored business definitions remain unchanged between local and remote
  placement.
- cell enrollment, generation, replica, assignment, residency, route member,
  chamber, and image remain distinct identities.
- transport confidentiality, live peer authentication, durable envelope
  interpretation, and execution authorization are separate checks.
- the first distributed proof can be honest without claiming multi-host fault
  isolation, exactly-once execution, or automated orchestration.
- shared contracts and protocol versions change intentionally with no legacy
  compatibility layer.

## Alternatives

- virtual remote chambers: rejected because they collapse placement and chamber
  identity.
- signed plaintext transport: rejected because business context also requires
  confidentiality.
- TLS without signed envelopes: rejected because durable evidence and replay
  meaning should not depend on an ephemeral channel.
- reuse the containment key: rejected because network and process-custody keys
  have different compromise and rotation domains.
- generic RPC or message broker: rejected because it introduces ambient
  transport authority outside Cadenza primitives.
- implement stem-cell reconciliation now: rejected until static placement and
  direct transport are proven.

## Links

- [Approved Sprint 6 design](../agent-harness/exec-plans/active/2026-07-14-multi-cell-static-placement-design.md)
- [Sprint 5 closure](../contracts/local-orchestration/closure-review-v0.md)
- User approval on 2026-07-14.
