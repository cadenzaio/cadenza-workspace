# Sprint 7E Pre-Enrolled Cell Supply Closure Review V0

Date: 2026-07-19

## Status

- Implementation state: `accepted`; explicit Sprint 7E closure approval was
  received on 2026-07-19.
- The original design and enrollment-scoped peer-identity amendment were
  explicitly approved and are implemented.
- The definitive Linux proof and complete correctness suites pass.
- Sprint 7E is closed. Sprint 7F is now the next design gate.

## Intended Whole

An author changes intended application shape while remaining focused on logical
flow and business behavior. Cadenza obtains or releases enough pre-authorized
runtime capacity, converges placement and execution, and returns interpretable
evidence without exposing process commands, credentials, Cells, Chambers,
deployment, distribution, or scale mechanics in the authored graph.

Sprint 7E succeeds only if process supply remains a bounded realization of
semantic authority. A committed directive is not process success, a running
process is not Cell readiness, and Cell readiness is not application-member
readiness.

## Delivered System

- Neutral contracts describe provider registration, pinned pre-enrolled
  profiles, provider generations, desired supply directives, signed
  realization observations, and bounded stem projections.
- The deterministic planner starts only eligible dormant profiles when current
  ready capacity is insufficient. It reserves pending capacity, respects pins,
  trust and capability requirements, and releases only empty demand-managed
  Cells without proactive repacking.
- PostgreSQL owns provider/profile authority, non-overlapping provider
  generations, immutable directive epochs, signed observations, semantic wake
  revisions, literal role operations, and hostile role denial.
- One unprivileged Rust supply supervisor verifies a closed digest-pinned local
  profile catalog and starts only the fixed Cell executable through inherited
  descriptors. It has no shell, arbitrary command, environment, mount, generic
  SQL, enrollment, placement, or desired-state surface.
- Each managed Cell publishes signed `starting -> ready -> draining -> stopped`
  generation state and independently converges Chamber custody. The provider
  publishes process realization and never fabricates member readiness.
- Provider loss terminates unowned children. A successor generation waits for
  prior Cell generation authority to stop or expire, then creates fresh Cell
  generations rather than adopting uncertain custody.
- Peer TLS identity is enrollment-scoped. Signed controls, execution envelopes,
  routes, replay, results, and evidence remain generation-scoped and verify the
  exact current unexpired ready generation before affect.

## Scenario Coverage

The definitive Linux/gVisor proof uses one retained trusted-control Cell, two
dormant demand-managed profiles, three launchers, two activation issuers,
purpose-separated PostgreSQL roles, separate generation journals, and real
contained TypeScript Chambers. It proves:

- target desired state `0 -> 2` starts exactly two eligible pre-enrolled Cells.
- no replica assignment occurs before current signed Cell readiness.
- all required members materialize, routes converge, and remote business
  execution returns the expected result.
- provider and supply-lifecycle database-role outage preserves bounded current
  child custody without duplicate generation or invented observation.
- provider process loss cleans its children and retained source bundles remain
  untouched.
- provider restart acquires the next non-overlapping generation and creates
  fresh Cell generations under the still-current running directives.
- retained peer configuration authenticates those fresh generations, while
  live distribution authority fences generation identity.
- remote execution succeeds again after restart and ordinary reconciliation
  may withdraw and reassign replicas under new assignment epochs.
- target desired state `2 -> 0` withdraws both current assignments, removes
  routes, publishes exact draining and stopped member residencies, drains and
  stops both Cells, verifies child exit, and publishes both profiles dormant.
- final cleanup leaves no Cell, Chamber, gVisor container, bundle, listener,
  journal lock, descriptor, launcher custody, or live supply process.

## Findings Repaired During Implementation

1. Static peer configuration combined stable TLS identity with an unknowable
   future process generation. Peer credentials are now enrollment-scoped and
   the claimed generation is checked dynamically at session open and proceed.
2. The supply profile reader reused directory-stream offsets and could omit
   entries on repeat verification. Every bounded scan now starts from a fresh
   directory handle.
3. Host readiness was initially treated too close to member readiness. The
   provider now waits for current Cell generation authority and placement still
   waits for signed member and route convergence.
4. PostgreSQL connection loss was not normalized consistently. Provider
   database outages are classified as unavailable while semantic rejection
   remains an authority conflict.
5. Operational runtime reads still depended on the activation grant after
   successful admission. Grant expiry no longer revokes an admitted Chamber;
   current assignment, generation, slice, materialization, revocation, and
   independent containment authority govern runtime affect.
6. A rejected action left later actions in its immutable plan perpetually
   unresolved and the stem attempted to close the same terminal rejection.
   Rejection now aborts the remainder of that plan and only failed actions are
   eligible for explicit close.
7. Stopped Chamber controls and activation keys remained in local custody after
   stopped residency publication. Successful stop now retires process control
   and convergence clears runtime custody while preserving immutable evidence.
8. The end-to-end proof assumed assignment epoch 1 survived provider restart.
   It now follows the exact current post-restart assignment identities before
   asserting scale-down evidence.
9. Snapshot issuance locked reconciliation state before reading environment
   authority, opposite to gateway mutation. Snapshot issuance now locks the
   environment row first with `FOR SHARE`, then reconciliation state; a
   deterministic concurrency regression proves the order and the observed
   deadlock no longer occurs.
10. The host JSON Schema and transport documentation still advertised a peer
    generation in pinned configuration. They now match the implemented
    enrollment-scoped contract.
11. Active workspace entry documents still routed agents toward legacy service,
    database, routine, layer-tools, and PostgresActor authority. Governance,
    architecture, navigation, and repo notes now identify those paths as
    reference-only and route current work through official repositories.

## Recursive Coherence Review

### Intent, Identity, And State

Demand, provider registration, profile, provider generation, directive,
process observation, Cell generation, assignment, Chamber residency, route,
activation grant, containment, and evidence remain distinct identities. Their
states carry separate whole-relevant meaning and no lower-level success is
allowed to impersonate higher-level convergence.

### Affect And Security

The consequence path is singular:

```text
declared replica demand
  -> contained stem interpretation
  -> immutable canonical plan and exact action
  -> PostgreSQL supply directive
  -> fixed-profile process realization
  -> Cell-signed generation and residency
  -> route and business execution
```

The stem receives only bounded supply projections. It cannot enroll Cells,
select profiles, access provider identity, start processes, or receive launch
material. The provider cannot plan, assign, change desired state, publish Cell
state, or execute arbitrary SQL. The Cell cannot publish provider state or
choose its profile. Credentials, profile bytes, commands, paths, stderr, and
host objects remain outside graph context and evidence.

### Relationships And Interpretation

PostgreSQL serializes desired process meaning; the supervisor interprets it
into local custody; Cells interpret current runtime projections; Chambers
execute controlled definitions. Signed provider and Cell observations let the
stem and future operators interpret consequence upward without coupling those
roles or duplicating their policy loops.

### Shared Fields And Temporal Stewardship

Canonical contracts, immutable directives, monotonic epochs, semantic
revisions, signed observations, generation journals, assignment history,
decision records, and this closure review steward meaning across outage,
restart, rejection, expiry, and replacement. The deadlock repair establishes a
single lock order for the two shared authority rows touched by snapshot and
gateway mutation.

### Fragmentation And Repair

The review found no generic infrastructure API, dynamic enrollment shortcut,
provider-selected placement, hidden command queue, child adoption, false
readiness, legacy compatibility path, or dead production path that should
precede Sprint 7F. The repaired findings were local-success/global-failure
risks: stable TLS mistaken for process identity, admission mistaken for runtime
custody, terminal rejection mistaken for pending work, stopped evidence without
custody retirement, and individually valid database locks in contradictory
order.

## Operational Complexity

Sprint 7E adds one necessary bounded loop: the local supply supervisor. The
stem decides, PostgreSQL serializes, the supervisor realizes process state, and
each Cell converges its own Chambers. The supervisor keeps one pending wake bit,
one fixed safety cadence, one globally serialized transition, one current
directive and observation per profile, and no local desired-state database or
retry queue.

This remains disciplined but is now a material operational surface. Provider
generation expiry, profile custody, purpose-separated database roles, launcher
ownership, Cell convergence, and evidence must continue to be measured as one
system. Later optimization must not duplicate policy or blur which loop owns a
decision.

## Validation Evidence

- `cadenza/environment-bootstrap`: typecheck and build passed; 17 files and 94
  tests passed, including the deterministic snapshot lock-order regression.
- `cadenza`: typecheck and build passed; 18 non-performance files and 161
  correctness tests passed.
- `cadenza-chamber`: formatting and strict all-target Clippy passed; the full
  all-target suite passed.
- `cadenza-cell`: Linux formatting and strict all-target Clippy passed; 128
  ordinary all-target tests passed, including the 153.82-second real Chamber
  protocol integration case. Nine provisioned environment proofs remain
  ignored by default.
- the definitive ignored autonomous supply proof passed in 468.90 seconds
  after the final assignment-identity and PostgreSQL lock-order repairs.
- workspace agent-harness validation and JSON contract parsing passed.
- the host-relative TypeScript performance file remains deferred by explicit
  prior agreement until a clean machine restart and is not correctness
  evidence.

## Remaining Boundaries

- V1 supplies only already enrolled, local, digest-pinned profiles. Dynamic
  enrollment, remote machines, cloud APIs, and networking are separate future
  trust and infrastructure problems.
- Provider restart intentionally waits for prior generation stop or expiry and
  does not adopt surviving children.
- Process transitions and Chamber execution remain deliberately serialized;
  the deferred concurrency optimization must follow measurement after the
  first complete environment.
- Purpose-separated provider database descriptors remain Unix/loopback-only
  while their clients use `NoTls`; remote database transport requires a
  separately approved authenticated contract.
- Fifteen-minute Chamber containment still requires a later explicit renewal
  or replacement policy for long-lived production workloads.
- Sprint 7F owns stem loss, expired-lease takeover, predecessor fencing, and
  recovery of the reconciliation meta slice itself.

## Conclusion

Sprint 7E lets declared application demand obtain and release bounded local
runtime capacity without importing infrastructure mechanics into business
graphs or creating a second management architecture. The closure review finds
no correctness, security, disclosure, dead-code, operational-complexity, or
coherence issue that should precede Sprint 7F. Implementation and closure
review are complete and accepted.
