# Sprint 7A Reconciliation Contract And Pure Planner Closure Review V0

Date: 2026-07-17

## Status

- Implementation state: `review_needed`.
- Scope: language-neutral reconciliation contracts, canonical fixtures,
  fail-closed normalization, and the pure TypeScript V0 planner.
- Next gate: explicit Sprint 7A acceptance before PostgreSQL reconciliation
  authority begins.

## Intended Whole

Application authors declare workload shape and constraints. Cadenza translates
that authority into one deterministic, reviewable placement plan without
giving business or meta logic deployment machinery, credentials, topology,
process control, or database access.

Sprint 7A succeeds only if later authority and runtime layers can interpret the
same plan without hidden scheduler state or language-specific meaning.

## Delivered Contract

The `cadenza` authority repo now defines:

- placement desired state and sparse replacement-style overrides.
- signed cell-generation observation shape and provenance binding.
- lease-fenced, authority-supplied reconciliation snapshots.
- assignment-scoped `ready`, `converging`, and `unhealthy` projections derived
  from current signed residency digests.
- stable replica, assignment, plan, action, and outcome identities.
- canonical plan and action ordering, digests, and immutable outcome digests.
- explicit unsatisfied-demand reasons and unresolved-action fencing.
- JSON schemas plus five exact valid plans, one permutation vector, and four
  hostile vectors.

The TypeScript planner implements no database, clock, randomness, environment,
filesystem, network, process, credential, or provider access.

## Scenario Coverage

The implementation and shared fixtures cover:

- semantic input permutation with equal snapshot and plan digests.
- preservation of valid and still-converging assignments without churn.
- stable replica definition and reuse.
- deterministic scale up and scale down.
- anti-affinity preference followed by fullest-fit packing and canonical ties.
- trusted-cell and capability filtering, including admin satisfying use.
- allowed, pinned, and blocked cell policy.
- pin/block contradiction and pins that never spill.
- capacity, eligible-cell, pinned-capacity, and pending-action shortage reports.
- unhealthy replica reassignment with monotonic assignment epoch.
- hard-invalid withdrawal when no replacement target exists.
- signed observed occupancy that prevents premature reuse during drain.
- unresolved prior actions that suppress overlapping effects.
- stale unit authority, expired lease, snapshot drift, forged action key,
  forged plan identity, noncontiguous action sequence, and plan/outcome digest
  drift.
- maximum pressure of 4,096 effective replicas and 8,192 plan actions.

## Coherence Review

### Intent And Identity

The planner serves the intended whole by translating declared workload intent
into coordination authority. Desired state, override, cell generation, lease,
replica, assignment, convergence projection, snapshot, plan, action, demand,
and outcome are explicit identities. No host effect is disguised as planning.

### State And Affect

State has consequential meaning:

- `ready` and `converging` assignments may be preserved.
- `unhealthy` assignments require repair.
- expired or non-ready cell generations cannot receive placement.
- unresolved actions fence new effects.
- a plan remains a proposal until an exact later operation commits it.

The planner's only affect is informational: it returns a canonical value. It
cannot mutate authority or runtime state.

### Relationships And Interpretation

The relationship direction is singular:

```text
semantic desired state + signed observed projections + lease
  -> normalized snapshot
  -> deterministic plan
  -> later exact authority/provider operations
  -> immutable outcomes
```

Downward interpretation is expressed through exact actions. Upward
interpretation is expressed through unsatisfied demand and immutable outcomes.
Residency source digests preserve the path from runtime evidence to planner
health interpretation without exposing raw topology to the planner.

### Security And Stewardship

- all external values are normalized before use.
- identities, revisions, epochs, capacities, counts, and digests fail closed.
- snapshot time is authority supplied; there is no ambient clock.
- the lease owner must be one current ready trusted-control generation.
- observation identity and digest are bound to enrolled transport identity.
- action keys bind exact bodies; plan keys bind lease, revision, and snapshot.
- action order and sequence are independently verified.
- unresolved actions cannot coexist with newly issued actions.
- cell-supply actions are closed identities only; no command, executable,
  environment, mount, endpoint, image, or credential field exists.

Cryptographic signature verification is intentionally not performed by the
pure planner. Sprint 7B must verify signatures while constructing the bounded
snapshot under authority, before this contract is invoked.

### Pressure And Temporal Coherence

- maximum 1,024 cells, 256 units, 4,096 replicas, and 8,192 actions.
- maximum 1,024 replicas per unit and one million slots per cell/unit cost.
- effective desired count is bounded globally after overrides.
- set-like collections reject duplicates and normalize canonical order.
- the planner is restartable from one snapshot and owns no process memory.
- revisions, lease epochs, assignment epochs, source digests, action attempts,
  and outcome digests preserve temporal interpretation.

The maximum valid pressure case completes within the focused test suite and
does not create an unbounded queue.

### Language Fit

The semantics use only canonical JSON values, integer arithmetic, sorting,
maps, sets, and SHA-256. TypeScript contributes no semantic shortcut that
another official language could not reproduce. Exact fixtures, rather than the
TypeScript implementation, are the horizontal interpretation authority.

TypeScript remains justified for the future V1 stem slice because the current
production chamber adapter already supports it. This pass does not move the
planner into the public primitive API or make TypeScript the general meta-layer
default.

## Findings Repaired During Review

1. Initial planning released withdrawn capacity too early. Selection now uses
   the greater of current authority reservations and signed observed occupancy.
2. Initial snapshots inferred workload health from cell health. Assignment-
   scoped convergence projections now preserve residency provenance and make
   unhealthy repair explicit.
3. Initial plan output had digest vectors but no independent normalizer. Plan
   identity, action identity, ordering, sequence, bounds, and digest now verify
   independently.
4. Per-unit bounds did not bound the total plan. Effective replica count and
   the two-actions-per-missing-replica ceiling are now explicit global bounds.

## Remaining 7B Obligations

- verify Ed25519 generation observations against current enrollment authority.
- derive convergence projections transactionally from current signed
  residencies and route readiness, never caller-supplied health labels.
- serialize the lease, snapshot revision, snapshot digest, plans, and immutable
  outcomes in PostgreSQL.
- reject action commit when lease, revision, snapshot, target, assignment epoch,
  or unit definition changed.
- prove restricted roles cannot forge observations, projections, plans, or
  outcomes through direct SQL.
- version the reconciliation contract if planner semantics change; a changed
  algorithm under `0.1.0` must not silently produce a different plan.

## Conclusion

Sprint 7A passes the security, pressure, language-fit, and recursive coherence
reviews. It is ready for acceptance. No PostgreSQL reconciliation mutation,
stem graph, runtime worker, provider effect, or cell process behavior has been
introduced.
