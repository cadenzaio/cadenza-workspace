# Sprint 7F Stem Recovery And Fencing Closure Review V0

Date: 2026-07-19

## Status

- Implementation state: `accepted`; explicit Sprint 7F closure approval was
  received on 2026-07-19.
- The approved design is implemented across `cadenza` and `cadenza-cell`.
- Database, hostile-boundary, ordinary Linux, strict Clippy, and definitive
  Linux/gVisor recovery proofs pass.
- Sprint 7F is closed. Sprint 7G system closure is the next design gate.

## Intended Whole

Loss of the active reconciliation stem must not force an application author to
manage leaders, leases, processes, Cells, or recovery commands. One already
ready eligible trusted-control Cell must restore the same singleton policy loop
without split brain, false readiness, hidden supply policy, or stale
predecessor affect.

## Delivered System

- The bootstrap Cell is an initial stem binding, not a permanent placement pin.
- PostgreSQL is the sole election clock and serialization authority.
- One atomic resolver validates current generation loss or lease expiry,
  selects the canonical eligible successor, advances lease and assignment
  epochs, retires unresolved predecessor work, advances revisions, and appends
  immutable evidence.
- Recovery receives a separate host-only database role and Cell descriptor.
  It cannot execute reconciliation actions, access generic tables, call the
  authority gateway, or enter a Chamber.
- A takeover result does not claim runtime readiness. Ordinary Cell convergence
  materializes the exact stem and authority-support Chambers, publishes ready
  residencies, and promotes the operational authority mount.
- Authority-mount movement now atomically moves the corresponding activation
  policy, preserving gateway continuity on the successor.
- Only a later exact `owner` resolution may deliver the private stem signal.
  Standard Cells remain on the exact disabled credential sentinel.

## Scenario Coverage

Database tests prove:

- current owner and standby outcomes.
- owner-generation loss before lease expiry.
- lease-expiry rotation to another eligible Cell.
- same-owner fallback only when no alternative exists.
- concurrent claimants produce exactly one takeover and one owner.
- stale lease renewal and predecessor mutation fail after takeover.
- unresolved predecessor actions become terminal `lease_replaced`; committed
  effects remain current authority.
- capacity, allowed-Cell policy, blocked overrides, stale generations, and
  hostile roles cannot bypass eligibility.
- lost-response replay does not duplicate lease, assignment, or evidence.
- authority activation policy follows mount custody atomically.
- absence of an initial lease is explicit standby, not invented ownership.

The definitive Linux/gVisor proof uses two real eligible trusted-control Cell
hosts with separate generations, journals, launchers, purpose-separated roles,
and contained TypeScript Chambers. It proves:

- ordinary placement, routing, remote execution, database-role outage, and
  recovery remain functional before stem loss.
- both original Cell generations terminate, making the exact owner generation
  unavailable before its five-minute lease expires.
- the previous non-owner deterministically receives lease epoch 2 and
  assignment epoch 2.
- one immutable `owner_generation_unavailable` record binds predecessor,
  successor, revisions, artifacts, eligibility, and retired work.
- the successor materializes both stem members and moves the authority mount
  and activation policy before gateway affect resumes.
- desired business state revision 5 is accepted after takeover, a fresh target
  member becomes ready, both route-selection and route-acceptance projections
  acknowledge current authority, and a real cross-Cell inquiry returns the
  expected result.
- final stop leaves no Cell host, Chamber, gVisor container, bundle, listener,
  or launcher custody behind.

## Findings Repaired

1. Candidate SQL initially missed exact capacity and override fencing and had
   ambiguous boolean precedence. Eligibility is now one exact bounded view.
2. The first lock attempt targeted a derived current view. Recovery now locks
   the actual latest assignment row in the established authority order.
3. Lease and singleton assignment could theoretically begin recovery in
   disagreement. The resolver now rejects that state before mutation.
4. The old trigger-lease reader remained as a parallel authority surface. It
   is removed from the final schema and Rust host.
5. Adding the recovery credential collided with the supply executable
   descriptor. The Cell surface now ends at fd 20 and the pinned executable is
   isolated on fd 21.
6. A trusted label alone did not make the second proof Cell eligible. The proof
   now grants exact capabilities, capacity, mounts, and purpose-separated
   credentials and uses an unpinned stem policy.
7. Pre-lease wakeups appeared as provider outages. A missing initial lease now
   returns non-authoritative standby.
8. Authority-mount promotion moved runtime custody but left the bootstrap-era
   activation policy on the predecessor. A database trigger now keeps those
   identities atomic, and hostile/database plus Linux proofs cover it.
9. The final post-recovery inquiry could race target route acceptance after
   source selection had converged. The proof now requires both projections to
   acknowledge current authority before affect.

## Recursive Coherence Review

### Intent, Identity, And State

Desired state, eligibility, lease, assignment, generation, residency, mount,
activation policy, plan, action, and evidence remain distinct. Takeover means
only that PostgreSQL transferred authority; it does not impersonate Chamber
readiness, route readiness, or successful business execution.

### Affect And Security

The consequence path remains singular:

```text
host wake hint
  -> host-only recovery resolver
  -> atomic PostgreSQL authority transfer
  -> ordinary Cell convergence
  -> ready stem and authority-support residencies
  -> authority mount and policy promotion
  -> contained stem execution
  -> ordinary reconciliation affect
```

No host clock, local election file, Chamber callback, dormant-supply request,
generic SQL surface, or second scheduler can authorize takeover. Credentials,
endpoints, process handles, business definitions, and business contexts are
absent from recovery evidence and graph context.

### Relationships And Temporal Stewardship

Lease and assignment epochs, current generation authority, exact artifact
digests, canonical candidate ordering, immutable action outcomes, promotion
evidence, and takeover evidence preserve meaning across concurrency, outage,
lost response, restart, and delayed predecessor execution. PostgreSQL row locks
and database time remain the only shared temporal authority.

### Fragmentation And Operational Complexity

Sprint 7F adds no process, heartbeat table, election timeout, local term,
consensus service, retry queue, or policy loop. It adds one fixed credential and
one bounded resolver call to the existing trusted-host cadence. The main cost
is another high-authority transaction and the duty to provision more than one
ready trusted-control Cell when automatic cross-Cell recovery is required.

The review found no dead recovery reader, legacy compatibility branch, hidden
infrastructure action, duplicated scheduler, false readiness path, disclosure,
or coherence issue that should precede closure approval.

## Validation Evidence

- `cadenza`: build passed; 18 non-performance files and 161 correctness tests
  passed. The host-relative performance file remains deferred by prior explicit
  agreement.
- `cadenza/environment-bootstrap`: typecheck and build passed; 19 files and 101
  tests passed, including migration upgrade, hostile roles, concurrency,
  rotation, replay, stale fencing, and activation-policy continuity.
- `cadenza-cell`: formatting, Linux all-target compilation, strict all-target
  Clippy, and the complete ordinary all-target suite passed.
- definitive Linux/gVisor recovery proof: `1 passed`, `0 failed`, completed in
  `523.68s`.
- workspace agent-harness validation passed.

## Remaining Boundaries

- Complete loss of all ready eligible trusted-control Cells remains explicit
  operator/bootstrap restoration. Recovery does not start dormant supply.
- PostgreSQL disaster recovery remains a substrate concern; hosts never elect
  during database unavailability.
- Five-minute leases and current generation validity remain governed policy
  until production evidence justifies different durations.
- Sprint 7G still owns the complete Sprint 7 recursive closure across scale,
  supply, stem recovery, execution evidence, pressure, and three-Cell system
  behavior.

## Closure Decision

Sprint 7F meets its approved exit criteria. No identified finding precedes
closure. The user approved closure on 2026-07-19; its execution plan is retained
under `completed`, and Sprint 7G may enter its design gate.
