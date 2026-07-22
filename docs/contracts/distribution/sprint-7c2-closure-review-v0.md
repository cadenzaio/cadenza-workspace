# Sprint 7C.2 Pure Local Convergence Engine Closure Review

Date: 2026-07-17

## Status

Sprint 7C.2 closed with explicit user approval on 2026-07-18. Sprint 7C.3 may
proceed under the approved parent design and the integration requirements below.

## Intended Whole

This pass gives each Cell one deterministic interpretation of the difference
between current database authority and current local process truth. The Cell
can identify the next legitimate local action without becoming a placement
planner, desired-state owner, database authority, durable scheduler, or hidden
source of policy.

The decision layer performs no I/O. It returns at most one bounded effect, and
the future worker must reread authority after that effect completes. Equal
authority and local truth return no effect.

## Implemented Contract

- the neutral `cell-convergence-projection` schema now carries bounded cell
  generation, assignment, exact materialization, residency, occupancy, and
  complete expiring route authority.
- `cadenza-cell` has strict normalized authority, local inventory, retry,
  residency, route-catalog, member-state, and effect types.
- the pure engine validates contract version, digest, cell-generation identity,
  monotonic authority revision, current generation lifetime, capacity,
  identities, duplicate authority, collection bounds, and a 16 MiB total byte
  bound before deciding affect.
- the engine sequences generation publication, withdrawal fencing,
  materialization, projection acknowledgement, residency, full route
  installation, successor-first retirement, and fixed retry waits.
- serialized source and runtime-support authority travel with the exact prepare
  effect, while debug formatting redacts their contents.
- retry deadlines are fixed at 250 ms, 1 second, and 5 seconds. A waiting failed
  member does not block independent member progress.
- route membership and exact validity have separate digests. Membership changes
  advance the local route epoch; validity-only renewal preserves it.
- `HostMetaAuthority` stores route expiry privately and rejects delegation,
  signals, selection, and peer ingress at expiry. Validity-only refresh records
  evidence without dirtying equal chamber-visible candidate projections.
- the existing distribution reader is upgraded by migration 008 to return the
  earliest residency/generation expiry. Route validity therefore fails closed
  even before the automatic 7C.3 reader replaces manual refresh.

## Proved Scenarios

- an empty enrolled Cell first decides one ready generation observation.
- equal authority, generation, members, residencies, and routes produce no
  process, observation, projection, route, or retry effect.
- a missing member advances through grant request, prepare, activate, exact
  projection acknowledgement, and ready residency one effect at a time.
- withdrawal publishes draining, removes stale ingress, then drains and stops;
  an uninstalled or stale route cannot be treated as current authority.
- replacement requests and readies the successor before route replacement and
  predecessor drain. Same-replica predecessor and successor occupancy counts
  once.
- ready residency and generation observations renew before their bounded
  expiry; an expired generation projection is rejected rather than interpreted
  as withdrawal.
- a validity-only route extension preserves the local route epoch and causes no
  chamber projection churn.
- opaque route selection succeeds before validity expiry and returns explicit
  `StaleRoute` at expiry.
- authority rollback, body/digest drift, duplicate members, conflicting route
  identity, invalid capacity, and contract-bound violations fail before affect.
- restart inventory has no competing durable queue: the same authority/local
  difference recomputes the same next effect.
- the engine remains bounded and churn-free at 256 local members and emits one
  full replacement at 4,096 route groups.

## Coherence Review

### Identity And Affect

Environment, Cell, generation, replica, assignment epoch, slice, chamber,
image, responsibility, route member, projection, and retry deadline remain
explicit identities. Every returned effect names the exact identity it may
affect; none can define placement, move a replica, or select another Cell.

### Interpretation

Database authority is interpreted downward into one local effect. Local
process, projection, residency, and route state are interpreted upward into
generation occupancy and convergence evidence. Chamber-visible routes remain
opaque while the Cell retains enough private identity and expiry to enforce
them.

### Temporal Stewardship

Monotonic authority revisions, assignment epochs, image epochs, route epochs,
expiry, projection acknowledgements, and fixed retry deadlines preserve meaning
across replacement, outage, and restart. Absence has consequence only inside a
valid current projection.

### Corrections Discovered

1. The projected opaque route-member digest initially omitted responsibility
   kind and key. It now binds both, preventing one identity from expressing two
   conflicting routing relationships.
2. Route expiry was first added to migration 003, before generation authority
   exists. PostgreSQL proof caught the ordering error; the reader replacement
   now lives in migration 008 with exact generation validity and narrow grants.
3. Private validity was initially allowed to filter chamber candidate sets.
   That would have republished equal opaque membership on renewal. Expiry is
   now enforced only at Cell admission, while membership remains the chamber
   projection concern.
4. A local route inventory initially retained opaque keys without the replica,
   assignment, and slice they represented. Explicit routed-member identity now
   proves that a predecessor has actually been fenced before drain.
5. Serialized materialization authority was initially represented only by its
   digest in an effect. The exact bounded authority now reaches prepare, but is
   redacted from ordinary debug output.

No unresolved issue should precede Sprint 7C.2 closure.

## Required 7C.3 Integration Work

The current runtime-observation appender accepts residency transitions only
while the replica remains currently assigned. That is correct for ready
authority but cannot yet express the approved draining/stopped sequence after
withdrawal. Sprint 7C.3 must add a narrow, bounded proof of immediately prior
local custody or equivalent transition authority. It must not reopen generic
residency publication or let a Cell invent assignment history.

Sprint 7C.3 must also map effects to providers without logging raw source,
credentials, endpoints, keys, or business context, and must reread exact
authority after every external effect.

## Validation

- `cadenza-cell`: format and strict all-target/all-feature Clippy passed.
- `cadenza-cell`: 10 convergence, 12 host-authority, 5 orchestrator, and 8 peer
  transport tests passed after the final coherence corrections.
- environment bootstrap: typecheck and all 68 tests across 14 files passed,
  including real PostgreSQL migration, distribution, runtime-convergence,
  hostile-role, and upgrade coverage.
- TypeScript core: build and 161 non-performance tests across 18 files passed.
- neutral runtime-convergence JSON schema parsed and the six schema tests passed.
- the machine-sensitive TypeScript performance test remains deferred by prior
  agreement and is unrelated to this pure decision gate.

## Deferred Scope

- activation issuer service/client and private-key descriptor custody: 7C.3.
- PostgreSQL convergence reader and narrow observation provider: 7C.3.
- effect execution, notification coalescing, safety cadence, automatic host
  integration, and removal of manual production control paths: 7C.3.
- two-Cell outage, recovery, restart, gVisor, and cleanup proof: 7C.4.
- concurrent materialization and route application: later measured optimization.
