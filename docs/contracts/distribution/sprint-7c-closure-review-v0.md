# Sprint 7C Autonomous Cell Runtime Convergence Closure Review V0

Date: 2026-07-18

## Status

- Implementation state: `accepted` with explicit approval on 2026-07-18.
- Scope: materialization authority, delegated activation issuance, pure local
  convergence, ordinary Cell integration, outage recovery, restart, and Linux
  gVisor proof.
- Next gate: Sprint 7D stem-cell meta-slice design.

## Intended Whole

An application or meta-slice author declares intended workload and business
logic. Cadenza absorbs the accidental complexity of materialization,
containment, lifecycle, placement interpretation, route publication, renewal,
and recovery. An ordinary Cell should therefore turn current database
authority into current local runtime truth without a controller scripting the
mechanism.

Sprint 7C succeeds only if that automation preserves singular authority and
explicit evidence. The Cell may interpret and enforce its local projection; it
may not choose placement, invent desired state, hold the environment root,
materialize authored callables, or become a durable scheduler.

## Delivered System

- Migration 008 stores bounded canonical source and runtime-support authority,
  delegated operational issuer authority, exact current Cell convergence
  projections, signed generation and residency observations, route
  invalidation hints, and isolated roles.
- One authority-owned route-member identity is shared by distribution and
  convergence projections.
- A separate unprivileged activation issuer reserves database-derived unsigned
  grants, signs only the exact digest, and records the signature through its
  narrow role. Cells receive neither issuer key nor issuer credential.
- The pure convergence engine validates one projection and one local inventory,
  then returns at most one explicit effect. Equal truth produces no effect.
- The production Cell worker executes that effect through purpose-separated
  providers, rereads authority, and decides again. It owns chamber lifecycle,
  signed observation publication, complete route replacement, renewal, and
  bounded retry.
- PostgreSQL notifications are wake hints. The bounded safety cadence and exact
  reread remain authoritative.
- Long-lived providers reconnect once after transport or session failure.
  Semantic PostgreSQL rejection remains a fail-closed outcome, not an outage.
- Controller control is reduced to business delegation and orderly host stop;
  there are no lifecycle, residency, or route-refresh commands.

## Scenario Coverage

The production-shaped Linux proof uses two unprivileged ordinary Cell hosts,
separate launchers and journals, a separate unprivileged issuer, separate
database credentials and roles, and three gVisor Chambers. It proves:

- empty Cells publish exact generation and capacity authority.
- current assignments materialize from serialized authority without startup
  bundles or host lifecycle commands.
- multi-member requirements delay route readiness until all required Chambers
  are ready.
- a remote inquiry crosses authenticated Cell transport and returns `42`.
- database-role login revocation plus backend termination creates no invented
  transition; existing authority remains only until expiry and new distributed
  affect fails closed.
- role restoration reconnects the providers and renews residency without
  replacing an equal Chamber.
- image-epoch replacement makes the successor ready before stopping the
  predecessor, then moves the route without an availability gap.
- abrupt loss of both hosts causes launcher-owned cleanup. Fresh Cell
  generations receive the exact next projection revision, start fresh
  residency lineages, recreate Chambers, restore routes, and execute remotely.
- assignment withdrawal publishes draining and stopped, removes the route, and
  relinquishes process custody.
- the run leaves no Cadenza process, gVisor container, bundle, test cgroup, or
  listener behind.

## Coherence Review

### Authority, Identity, And Affect

Definition authority, Cell generation, projection revision, replica,
assignment epoch, image epoch, member, residency observation, route member,
grant reservation, activation nonce, Chamber, and retry deadline remain
distinct identities. The Cell can affect only the exact current local identity
named by its projection.

The consequence path is singular:

```text
declared state + placement authority + signed runtime evidence
  -> exact database convergence projection
  -> pure one-effect decision
  -> narrow provider or contained Chamber affect
  -> signed observation and execution evidence
  -> exact projection reread
```

No controller queue, alternative route registry, local desired-state store, or
second placement policy was introduced.

### Security And Stewardship

- root signing authority stays offline and outside Cells and Chambers.
- issuer, convergence-reader, observation-appender, distribution-reader,
  activation-reader, gateway, evidence, and ledger privileges remain separate.
- restricted PostgreSQL roles have no table authority or generic SQL surface.
- source and runtime-support bytes are bounded, digest-bound, and redacted from
  ordinary debugging.
- serialized callables reach the contained Chamber unchanged; the Cell does
  not materialize them.
- transport failure permits one exact reconnect retry; semantic rejection,
  malformed authority, signature drift, stale generation, rollback, or
  conflicting replay fails closed.
- route admission is validity-bound even if notifications or PostgreSQL are
  unavailable.
- new-generation restart cannot inherit route or residency authority from the
  prior generation.

### Pressure And Operational Complexity

The engine remains one-effect-at-a-time, bounded in collection size and total
projection bytes, notification-coalesced, and backed by a five-second safety
cadence. It creates no durable Cell work queue. Lifecycle concurrency remains
deferred until measured demand justifies it.

Environment-wide wildcard wake hints are semantically correct because one
target change can alter every source Cell's derived route projection. They can
produce O(N) wake fanout per event and compound with renewal pressure. This is
a visible optimization obligation: later work may add selective subscription
or bounded invalidation indexing only if the exact authoritative projection and
expiry behavior remain unchanged.

### Purpose And Dead Code

The production host has one path for lifecycle, residency, and route
convergence. Manual controller refresh and residency paths are absent from the
runtime contract. Every new provider serves an isolated authority role, the
pure engine owns no I/O, and the issuer owns no launcher or runtime custody.
The review found no parallel scheduler, compatibility layer, generic provider,
or exploratory production path that should be removed before Sprint 7D.

## Findings Repaired During Proof

1. Route notifications initially woke only the changed target Cell even though
   derived route effects are environment-wide. They now use a wildcard hint.
2. Source projections omitted required runtime-support target proxies and
   signal forwarders. Those requirements now participate in convergence.
3. Distribution and convergence readers produced different opaque member keys.
   One authority-owned deterministic key function now serves both.
4. Long-lived providers could not recover a severed PostgreSQL session. Narrow
   reconnecting clients now distinguish transport failure from SQL rejection.
5. Failure paths in the Linux proof could leak child processes and role state.
   Bounded ownership guards now restore and clean all external effects.
6. Fresh generations guessed projection revision `1`. PostgreSQL now supplies
   the exact next cell-wide revision and the Cell publishes that value.
7. Residency validation compared transitions across Cell generations. Each
   generation now starts at `materializing`; prior rows remain history.

These were material contract defects. Repairing them before closure is stronger
evidence than a test that avoided outage and restart boundaries.

## Validation Evidence

- `cadenza/environment-bootstrap`: typecheck passed; 14 files and 68 tests
  passed against real PostgreSQL after the final migration changes.
- `cadenza-cell` on macOS: 41 library tests and all applicable integration
  suites passed; strict all-target Clippy passed.
- `cadenza-cell` on Linux: all-target strict Clippy passed after final source
  synchronization. The broader Linux host suite passed during the same closure
  pass.
- `cadenza-chamber`: macOS and Linux all-target tests and strict Clippy passed.
- final autonomous two-Cell gVisor proof passed in 146.55 seconds on Linux
  6.8.0-134-generic aarch64, gVisor release-20260706.0, Node 22.23.1,
  PostgreSQL 16.14, and Rust 1.97.0.
- the machine-relative TypeScript performance threshold remains deferred by
  prior agreement and is not used to claim closure.

## Remaining Boundaries

- Sprint 7D must author and activate the stem meta slice that changes desired
  state and applies exact reconciliation actions through Cadenza primitives.
- pre-enrolled Cell supply remains Sprint 7E.
- expired stem-owner recovery and fencing remain Sprint 7F.
- same-generation runtime continuation is unsupported. A host restart creates
  a new generation, which this pass proves end to end.
- notification fanout and serialized lifecycle work remain measured
  optimization concerns, not closure blockers.

## Conclusion

Sprint 7C serves the intended whole. Ordinary Cells now absorb local runtime
coordination while PostgreSQL remains semantic authority, Chambers remain the
materialization and primitive runtime boundary, and controllers no longer
script runtime lifecycle. No security, pressure, dead-code, or coherence
finding should precede Sprint 7D.
