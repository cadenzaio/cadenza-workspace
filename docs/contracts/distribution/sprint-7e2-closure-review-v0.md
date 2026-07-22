# Sprint 7E.2 PostgreSQL Cell Supply Authority Closure Review V0

Date: 2026-07-19

## Status

- Implementation state: closed.
- Scope: neutral pre-enrolled supply contracts, deterministic supply planning,
  PostgreSQL authority, provider fencing, directives, observations, and roles.
- Next pass: Sprint 7E.3 Linux supervisor and Cell lifecycle.

## Delivered Authority

Migration `010_pre_enrolled_cell_supply_authority.sql` adds immutable provider
registrations, pre-enrolled profiles, provider-generation events, supply
directives, and signed supply observations. Registration and revocation use
the existing authority gateway. Provider operations use narrow literal
functions and cannot mutate placement or environment policy.

`Reconciliation.ExecuteAction` remains the only supply-action path. Start,
drain, and stop commit desired dispositions with outcome reason
`directive_committed`; they do not claim process success. The snapshot exposes
only the bounded planner projection and omits provider/profile identities and
launch custody.

## Scenario Evidence

The PostgreSQL proof covers:

- exact active provider and profile registration.
- non-overlapping, contiguous provider generation epochs.
- deterministic dormant-profile selection and pending capacity reservation.
- directive commit without false Cell readiness.
- separate provider-running and Cell-ready observations.
- empty demand-managed Cell drain, signed draining, stop, and dormant state.
- provider stop and expiry becoming explicitly unavailable.
- profile revocation becoming explicitly revoked.
- replay, stale generation, immutable event, and hostile role boundaries.
- drain and stop denial while assignment, residency, stem lease, or authority
  mount custody remains.

## Coherence Review

Desired process state, provider realization, and Cell runtime readiness remain
separate identities. PostgreSQL serializes authority, the provider reports
process custody, and the Cell remains sole authority for its generation and
local Chamber custody. No database payload accepts launch commands, paths,
credentials, descriptors, mounts, environment, or provider implementation
objects.

The review repaired two temporal ambiguities. A newly committed start may
legitimately coexist with an older dormant observation until the provider binds
the new directive epoch. Compatible dormant supply with an unavailable provider
is now reported as `supply_unavailable`, not misclassified as absence of an
eligible Cell.

## Validation

- `cadenza/environment-bootstrap`: typecheck passed; 17 files and 92 tests
  passed.
- `cadenza-cell`: formatting, strict all-target Clippy, and the full ordinary
  test suite passed.
- `cadenza-chamber`: formatting, strict all-target Clippy, and the full
  ordinary test suite passed.
- canonical planner and shared stem fixtures were regenerated from the
  authoritative TypeScript source.
- host-relative performance thresholds remain deferred by prior agreement and
  are not used as correctness evidence.

## Remaining Boundary

PostgreSQL now expresses exactly what should run, but it does not start a
process. Sprint 7E.3 must prove that a dedicated unprivileged Rust supervisor
can realize only current directives through pinned local profiles, publish
separate provider evidence, drive exact Cell drain/stop lifecycle, and recover
without adopting or leaking child custody.
