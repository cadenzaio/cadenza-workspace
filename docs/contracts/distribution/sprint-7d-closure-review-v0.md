# Sprint 7D Stem-Cell Meta Slice Closure Review V0

Date: 2026-07-19

## Status

- Implementation state: `accepted`; closure explicitly approved on 2026-07-19.
- Design and the operational authority-mount and lifetime amendments were
  explicitly approved.
- Next planned pass: Sprint 7E pre-enrolled Cell supply design.

## Intended Whole

An author declares application shape and intended function. Cadenza interprets
that intent into exact placement affect without requiring the author to manage
replicas, assignments, Cells, Chambers, routes, leases, credentials, or host
lifecycle.

Sprint 7D succeeds when Cadenza performs that interpretation through its own
primitive graph while PostgreSQL remains semantic authority, Cells remain local
runtime custodians, Chambers remain controlled materialization boundaries, and
every consequential transition remains bounded and interpretable.

## Delivered System

- One deterministic eight-task TypeScript stem graph and pure bundled planner
  helper materialize from serialized authority in a contained Chamber.
- One singleton placement unit keeps the stem source and authority-access
  support in separate trusted-control Chambers.
- Six private reconciliation-control facades expose literal bounded operations.
  Their credential cannot execute placement actions.
- One nineteenth digest-pinned authority operation executes only exact actions
  from committed plans. The source reaches it through the support Chamber and
  cannot mount authority access directly.
- PostgreSQL owns semantic input and control revisions, resumable work,
  snapshots, plans, actions, outcomes, applications, lease fencing, and bounded
  notifications.
- The trusted Cell coalesces notification hints and a five-second safety tick
  into one in-flight signal plus one pending bit. No durable host queue or
  parallel scheduler exists.
- The stem lease lasts five minutes and renews only inside its final two
  minutes. Equal semantic authority produces no new plan or runtime churn.
- The UID-bound activation issuer can promote only the exact ready authority
  support member into the singleton operational authority mount and records
  immutable evidence.
- Activation grants remain capped at five minutes. Successfully admitted
  Chambers receive independent, signed containment custody capped at fifteen
  minutes.

## Scenario Coverage

The definitive Linux/gVisor proof uses two real unprivileged Cells, separate
launchers and generation journals, the contained two-member stem, ordinary
workload Chambers, purpose-separated PostgreSQL roles, and no controller
lifecycle commands. It proves:

- initial singleton stem activation and operational authority-mount promotion.
- desired-state-only scale-up and cross-Cell assignment.
- source materialization, exact route publication, and remote execution.
- PostgreSQL outage fencing without invented transition or lost local custody.
- restoration, provider reconnect, lease renewal, and continued convergence.
- route and residency renewal without semantic plan churn.
- reassignment and successor routing under current authority.
- zero-action quiescence across an observed safety window.
- desired-state scale-down, route removal, draining, stopped residency, and
  process cleanup.
- empty route-group canonicalization between PostgreSQL and Cell projections.
- Cell generation restart without resurrecting withdrawn target work.
- execution and transport evidence remaining attributable to the generation
  that actually produced it.
- cleanup of Cadenza processes, gVisor containers, bundles, listeners, and
  launcher custody.

## Findings Repaired During Implementation

1. The stem identities lacked exact authority subjects. Migration 009 now
   provisions fixed system actors and the host uses only those identities.
2. A ready managed authority-support Chamber could not satisfy the bootstrap
   mount identity. The approved UID-bound promotion path now verifies the
   complete current chain and preserves immutable evidence.
3. Coarse database revisions created false plan churn. Semantic input and
   control revisions now advance only for whole-relevant changes.
4. A short 60-second lease increased renewal pressure. The fixed policy is now
   five minutes with a two-minute renewal threshold.
5. Route and member ordering differed across SQL and Rust projections.
   Canonical sort order and empty-group removal now produce equal digests.
6. Residency withdrawal initially attributed stopped state to the wrong local
   identity. Publication now preserves the process and generation provenance
   that performed the transition.
7. Healthy Chambers died when their activation grants expired. Activation and
   containment lifetimes are now distinct, with five- and fifteen-minute hard
   ceilings respectively.
8. The proof initially inspected restart-generation journals for earlier work.
   Assertions now follow evidence provenance to the original generation.
9. Chamber test facades did not model the approved lease renewal operation.
   Their exact broker contract now records and answers renewal explicitly.
10. The host schema still advertised the old containment ceiling. It now
    matches runtime and launcher enforcement.

## Coherence Review

### Intent, Identity, And State

Desired state, semantic revisions, lease epoch, plan, action, application,
Cell generation, Chamber, image epoch, residency, route member, activation
grant, containment plan, and authority mount remain separate identities. Their
states have distinct meanings and no local success is allowed to stand in for
environment convergence.

### Affect And Security

The consequence path is singular:

```text
declared desired state
  -> semantic authority revision
  -> contained stem graph
  -> committed canonical plan
  -> digest-pinned authority action
  -> Cell-local convergence
  -> signed runtime observation and evidence
```

No source slice receives SQL, credentials, launcher control, generic authority,
or process custody. Control and action roles are mutually denied. Operational
mount promotion is narrower than residency and is available only through the
UID-bound issuer. Every mutable boundary rereads current authority and fails
closed on identity, generation, lease, revision, digest, expiry, or role drift.

### Relationships And Interpretation

The graph exposes trigger, renewal, work resolution, snapshot, planning,
commit, action dispatch, and conclusion as visible primitive relationships.
PostgreSQL serializes authority; the graph interprets it; Cells interpret local
projections; Chambers execute callables. Execution, distribution, transport,
runtime, and authority evidence let current and future operators reconstruct
which identity caused each consequence without storing raw authority bodies.

### Shared Fields And Temporal Stewardship

Canonical JSON, semantic revisions, immutable plan history, action outcomes,
signed generation observations, route catalogs, journals, and decision records
are explicitly stewarded shared fields. Lost notifications, process restart,
database outage, unknown response, and generation replacement do not erase or
silently reinterpret prior authority.

### Fragmentation And Repair

The review found no parallel scheduler, generic provider, ambient privilege,
legacy compatibility path, or dead production path that should precede Sprint
7E. The repaired findings above were cases where locally plausible behavior
would have fragmented authority, provenance, or temporal meaning.

## Validation Evidence

- `cadenza/environment-bootstrap`: 17 files and 84 tests passed; typecheck and
  build passed.
- `cadenza`: build passed; 18 non-performance files and 161 tests passed.
- `cadenza-cell` on Linux: strict all-target Clippy passed; 119 tests passed and
  8 explicitly provisioned tests remained ignored in the ordinary suite.
- `cadenza-chamber`: formatting and strict all-target Clippy passed; 76 tests
  passed.
- the definitive ignored autonomous two-Cell Linux/gVisor proof passed in
  392.17 seconds after the final authority, lifetime, canonicalization, restart,
  evidence, and cleanup corrections.
- the host-relative TypeScript performance file produced four threshold or
  timeout failures and remains deferred by explicit prior agreement until a
  clean machine restart. It is not used as correctness evidence.
- one debounce timing assertion missed once while the heavy Rust and
  performance suites ran concurrently. It passed in isolation and in the clean
  161-test functional rerun.

## Remaining Boundaries

- Sprint 7E owns bounded pre-enrolled Cell supply; current convergence can only
  use already running eligible Cells.
- Sprint 7F owns expired stem-lease takeover, predecessor fencing, and recovery
  after loss of the active stem Cell.
- automatic healing after an unexpected Chamber custody expiry remains later
  lifecycle work.
- lifecycle and action dispatch remain deliberately serialized.
- environment-wide wildcard wake hints can create O(N) fanout and should be
  optimized only from measured pressure without weakening authoritative reread.
- fifteen-minute containment eventually requires an explicit renewal or
  replacement policy for long-lived production workloads.
- trustworthy custody has a real operational cost. Provider count, role count,
  safety cadence, evidence pressure, and recovery paths must stay visible in
  every later sprint.

## Conclusion

Sprint 7D implements the first active Cadenza meta slice without creating a
second management architecture. Desired state now drives placement and runtime
convergence across existing Cells through ordinary primitives and singular
authority. The closure review found no correctness, security, dead-code, or
coherence issue that should precede Sprint 7E. Sprint 7D is closure-approved.
