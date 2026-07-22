# Sprint 7B PostgreSQL Reconciliation Authority Closure Review V0

Date: 2026-07-17

## Status

- Implementation state: `accepted` on 2026-07-17.
- Scope: PostgreSQL reconciliation custody, fencing, exact placement effects,
  immutable outcomes, role boundaries, and audit evidence.
- Next gate: detailed Sprint 7C autonomous cell runtime convergence design.

## Intended Whole

Application and meta authors declare workload intent. Cadenza turns that intent
into a deterministic plan and applies only the exact effects that remain
legitimate under current authority. Callers do not manage database state,
leases, placement epochs, host commands, credentials, or scheduler machinery.

Sprint 7B succeeds only if PostgreSQL serializes legitimate affect without
becoming a second planner or a generic scheduler API.

## Delivered Authority

Migration `007_reconciliation_authority.sql` adds:

- append-only desired-state and override revisions with replacement semantics.
- verified cell-generation observation custody and current-generation views.
- immutable stem lease events plus one rebuildable current lease projection.
- exact canonical snapshot custody with input, control, global-authority,
  lease, and earliest-expiry fences.
- immutable plans and ordered actions validated against the Sprint 7A
  contract without rerunning placement policy.
- plan-bound replica definition, atomic assignment or reassignment, and
  withdrawal effects.
- immutable applications and committed, failed, or rejected action outcomes.
- exact failed-attempt recording and explicit closure before replanning.
- bounded audit reads and isolated `NOLOGIN` operator, appender, stem, auditor,
  and function-owner roles.

After the first stem lease activates reconciliation, existing generic replica
definition and assignment operations are denied for that environment. Unit
definition and signed residency publication remain independent authority
because they declare topology and runtime evidence rather than planner effects.

## Scenario Coverage

The PostgreSQL integration suite proves:

- contiguous desired-state and override replacement, canonical replay, and
  stale-snapshot rejection after authority changes.
- snapshot equivalence with the TypeScript normalizer and digest authority.
- same-owner lease renewal without semantic plan invalidation.
- exactly one winner under concurrent initial lease acquisition.
- current lease reconstruction from immutable lease events.
- exact plan commit and replay, ordered define then assign execution, atomic
  action evidence, and exact action replay.
- deterministic scale-down withdrawal at the next assignment epoch.
- failed attempt preservation, unresolved-action blocking, explicit rejection,
  and later replanning.
- direct placement mutation denial after reconciliation activation.
- denial of cross-role calls, table writes, audit reads, and plan execution by
  the operator, appender, stem, generic authority gateway, distribution reader,
  and PUBLIC boundaries.
- fail-closed rejection before constructing a snapshot with more than the
  1,024-cell contract bound.

The complete environment-bootstrap suite also re-proves bootstrap, authority
gateway, distribution, execution-evidence, migration, and planner behavior.

## Coherence Review

### Intent, Identity, And Affect

Desired state, override, generation observation, lease event, issued snapshot,
plan, action, application, outcome, and operation evidence are separate
identities. Each state transition has one exact authority path and immutable
evidence. A plan remains derived coordination until the database independently
fences and applies its committed action.

The consequence path is singular:

```text
declared state + signed observed state
  -> PostgreSQL-issued canonical snapshot
  -> pure deterministic plan
  -> PostgreSQL-fenced exact action
  -> immutable application and outcome
  -> next reconciliation snapshot
```

PostgreSQL never chooses a candidate, packing strategy, anti-affinity rule, or
scale policy. It also accepts no command, executable, path, environment,
credential, endpoint, or launch descriptor in an action.

### Security And Stewardship

- restricted roles have no login and no direct authority-table privileges.
- SECURITY DEFINER functions use fixed `pg_catalog` search paths.
- callers cannot supply snapshot cells, assignments, convergence, capacity,
  current time, or action effect bodies.
- every action reloads its committed target and rechecks lease, sequence,
  authority revision, input revision, unit definition, generation, trust,
  capability, directive, assignment epoch, and capacity.
- capacity uses the greater of current assignment reservations and signed
  observed occupancy, preventing premature reuse while draining.
- committed outcomes can be produced only by the transaction applying the
  database effect.
- exact retries return the exact stored response; conflicting reuse fails.

Ed25519 verification remains deliberately outside PostgreSQL. The authenticated
cell-transport provider verifies it before selecting the narrowly privileged
observation-appender role. PostgreSQL then verifies canonical bytes, digest,
current enrolled key identity, monotonic revision, count arithmetic, time, and
TTL. This is an explicit custody boundary, not a claim of native verification.

### Time, Pressure, And Rebuildability

Internal input and control revisions are monotonic serialization devices, not
business versions. Source triggers advance input revision per affected row so
the environment identity is unambiguous for multi-environment statements.
Additional increments are harmless because only equality and monotonicity have
meaning.

Snapshots expire at the earliest lease, generation, residency, or initial
convergence boundary that could change interpretation without a write. Lease
renewal by the same owner and epoch does not create plan churn.

Collections and encoded artifacts are bounded before custody. Plans are
sequence-bound, one unresolved action surface exists per environment, and no
queue or scheduler process was introduced. Current generation, desired state,
override, action outcome, and lease interpretations are reproducible from
immutable history.

## Findings Repaired During Review

1. TypeScript reconciliation sorting used `localeCompare`, which allowed host
   locale to change capability ordering and PostgreSQL digests. It now uses
   explicit ASCII comparison throughout the planner boundary.
2. The first successful action response appended its outcome after storing the
   gateway receipt, so replay omitted that field. Outcome creation now occurs
   before receipt custody and both responses are exactly equal.
3. The global artifact-revocation source has no environment key. Its trigger
   now advances every environment fence rather than assuming row-local scope.
4. The legacy placement guard initially lacked the minimum schema privilege
   needed to inspect activation state. Its owner now has only the narrow usage
   and read privilege required for that denial path.
5. The approved proposal described statement-level source fences. Row-level
   triggers were retained because they preserve explicit environment identity
   for mixed-environment statements without a transition-table trigger matrix.
   Pressure evidence confirms the bounded write amplification is acceptable.

## Validation Evidence

- `cadenza/environment-bootstrap`: 12 files and 63 tests passed.
- environment-bootstrap typecheck and build passed.
- focused PostgreSQL reconciliation suite: 5 tests passed.
- official `cadenza` core correctness suite: 18 files and 161 tests passed.
- official `cadenza` build passed.
- the previously deferred machine-sensitive performance test remained excluded
  and was not used to claim closure.

## Remaining Sprint 7C Obligations

- publish and renew signed generation observations from `cadenza-cell` through
  the authenticated provider boundary.
- replace manual projection refresh with a bounded cell-owned convergence
  worker.
- converge chamber prepare, activate, ready, replace, drain, and stop states.
- renew replica residencies and apply route revisions atomically.
- preserve source execution, custody, and started-state semantics under
  replacement and failure.

Cell start, drain, and stop action effects remain intentionally closed until
the pre-enrolled supply provider is designed in Sprint 7E. Expired-owner lease
takeover remains Sprint 7F.

## Conclusion

Sprint 7B fits the intended whole. PostgreSQL now serializes one stem owner,
one canonical planning basis, exact plan-bound placement affect, and immutable
history without absorbing scheduler policy or host control. No finding from
the security, pressure, dead-code, or recursive coherence review should precede
Sprint 7C.
