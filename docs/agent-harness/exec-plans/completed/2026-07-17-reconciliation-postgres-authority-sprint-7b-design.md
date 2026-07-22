# Sprint 7B PostgreSQL Reconciliation Authority Design Proposal

Date: 2026-07-17

## Current Status

- State: `done`; closure approved on 2026-07-17.
- Complexity gate: required because this pass changes PostgreSQL authority,
  schemas, roles, fencing, placement mutation, and immutable evidence.
- Current repo: workspace meta repo during design; `cadenza` during
  implementation.
- Impacted repos: workspace meta repo and `cadenza` only.
- Approval received: `Design approved. Proceed.` on 2026-07-17.
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).
- Completed prerequisite:
  [Sprint 7A Reconciliation Contract And Pure Planner](../completed/2026-07-17-scale-placement-reconciliation-sprint-7a.md).

## Context

### Problem

Sprint 7A proves that one bounded authority snapshot produces one deterministic
plan. It deliberately does not answer who may issue a snapshot, how state is
serialized while it is planned, or how a committed action is fenced from
concurrent authority changes.

The current distribution authority already has sound relational foundations:

- immutable placement-unit definitions and stable replica identities.
- append-only assignment epochs with explicit `assigned` and `withdrawn`
  states.
- signed, expiring member residencies and derived route projections.
- exact authority-gateway operations with revision fencing and replay.
- SECURITY DEFINER functions, fixed search paths, and hostile role tests.

It is not yet a reconciliation authority. A caller with the existing authority
gateway can define or assign placement directly, no cell-generation authority
exists, no stem lease is serialized, and no plan is bound to the exact state
from which it was derived.

### Why A Stored Snapshot Is Necessary

`source_authority_revision` is not a sufficient fence. Cell-generation
observations and residencies can be appended or expire without changing the
global semantic authority revision. Recomputing a snapshot digest at plan
commit is also incorrect because the snapshot contains authority-supplied time
and time-relative projections.

PostgreSQL must therefore custody every issued snapshot. The stored record
binds the public `snapshot_digest` to internal input and control revisions and
to the earliest time at which any interpretation in that snapshot can change.
Those database fences remain internal; the language-neutral Sprint 7A contract
does not gain persistence concerns.

### Intended Whole

PostgreSQL serializes legitimate affect between declared placement intent,
signed observed reality, one leased stem owner, deterministic plans, exact
placement effects, and immutable outcomes. It does not choose placement,
launch hosts, infer demand, execute business logic, or expose a scheduler API.

False success includes:

- storing plans without fencing their source state.
- treating caller-supplied health labels as authority.
- accepting `signature_verified: true` from an untrusted caller.
- allowing lease renewal to invalidate otherwise current semantic plans.
- recording a failed effect without preserving its attempt and reason.
- duplicating the planner algorithm in PL/pgSQL.
- hiding direct host commands, credentials, SQL, or arbitrary payloads inside
  action rows.

## Proposed Approach

### Migration Boundary

Add one additive migration:

`cadenza/environment-bootstrap/migrations/007_reconciliation_authority.sql`

The migration creates an isolated `cadenza_reconciliation` schema. Existing
distribution tables remain the source of cell, unit, replica, assignment, and
residency truth. New reconciliation tables own only state not already owned by
distribution authority.

No environment begins reconciling merely because the migration is applied.
An environment is inert until desired state and an initial stem lease are
explicitly established.

### Relational And JSON Ownership

Use relational columns and child tables for authority that must be constrained,
joined, or projected. Retain canonical JSON and bytes for immutable contract
artifacts that must be replayed or compared across languages.

| Identity           | Storage shape                                               | Mutability                           |
| ------------------ | ----------------------------------------------------------- | ------------------------------------ |
| Desired state      | revision row plus allowed-cell child rows                   | append-only                          |
| Override           | revision row plus pinned/blocked child rows                 | append-only                          |
| Cell generation    | typed observation row plus canonical contract bytes         | append-only                          |
| Stem lease         | immutable lease events plus one current projection row      | projection is replaceable under lock |
| Issued snapshot    | typed fence metadata plus canonical snapshot JSON/bytes     | append-only                          |
| Plan               | typed identity/fence columns plus canonical plan JSON/bytes | append-only                          |
| Action             | typed target columns plus canonical action JSON/bytes       | append-only                          |
| Outcome            | typed attempt row plus canonical outcome JSON/bytes         | append-only                          |
| Action application | before/after authority and input revisions                  | append-only                          |

Current desired state, override, generation, action outcome, and plan status
are rebuildable views over immutable rows. The lease is the only deliberately
mutable current row, and every mutation has a corresponding immutable event.

### Shared Canonical JSON

Promote the already proven canonical JSON algorithm to shared database helpers
under `cadenza` and make the execution-evidence implementation delegate to the
same helper. The helper must match the TypeScript vectors for:

- printable ASCII object keys ordered by UTF-8 byte order.
- Unicode scalar string values.
- safe integer numbers only.
- ordered arrays and exact JSON primitives.
- SHA-256 digests with the `sha256:` prefix.

This removes a second database interpretation while preserving the execution
ledger's existing public functions.

### Roles And Legitimate Affect

Create NOLOGIN, NOINHERIT roles with no table privileges:

| Role                                          | Exact authority                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `cadenza_reconciliation_owner`                | owns schema objects and SECURITY DEFINER functions                                            |
| `cadenza_reconciliation_operator`             | replace desired state/override revisions and establish the first lease                        |
| `cadenza_reconciliation_observation_appender` | append one verified cell-generation observation                                               |
| `cadenza_reconciliation_stem`                 | renew its lease, issue its snapshot, commit its plan, and execute a committed database action |
| `cadenza_reconciliation_auditor`              | read bounded plans, actions, outcomes, and fence metadata, never raw authority tables         |

These roles are provider boundaries, not chamber credentials. Sprint 7D will
expose only private generated facades to the stem graph. A substrate provider
may hold role membership and select one exact role per transaction; no chamber
receives database credentials.

PUBLIC receives no schema, table, sequence, or function privilege. The
existing distribution reader and generic authority gateway receive no new
reconciliation privilege by default.

### Exact Operations

The migration adds exact functions rather than generic CRUD:

1. `replace_desired_state(invocation)`
   - requires the operator role and current semantic authority revision.
   - appends exactly the next revision and complete allowed-cell replacement.
   - increments global authority once and records authority evidence.
2. `replace_override(invocation)`
   - applies the same revision, replacement, replay, and evidence rules.
   - rejects pin/block overlap and references outside current enrollment.
3. `publish_cell_generation_observation(request)`
   - requires the observation-appender role.
   - accepts canonical observation bytes plus verification evidence from the
     authenticated cell-transport boundary.
   - rechecks current enrollment, transport key reference/digest, monotonic
     projection revision, count arithmetic, bounded TTL, digest, and replay.
4. `acquire_initial_stem_lease(request)`
   - requires the operator role.
   - succeeds only when no lease history exists and the target is an active,
     ready, current trusted-control generation.
   - concurrent acquisition produces one epoch-1 owner.
   - expired-owner takeover remains Sprint 7F.
5. `renew_stem_lease(request)`
   - requires the stem role and the same current owner, generation, and epoch.
   - uses database time and a bounded duration; it cannot shorten, transfer,
     or resurrect an expired lease.
6. `issue_reconciliation_snapshot(request)`
   - requires the current unexpired stem lease.
   - creates and stores one normalized, bounded Sprint 7A snapshot in one
     PostgreSQL statement snapshot.
   - records internal fences and returns only the public snapshot contract.
7. `commit_reconciliation_plan(request)`
   - requires the same current lease and a previously issued snapshot.
   - validates exact shape, normalization, identities, ordering, bounds,
     canonical bytes, keys, and digests without rerunning placement policy.
   - stores one immutable plan and its actions or returns the exact replay.
8. `execute_reconciliation_authority_action(request)`
   - loads the target from the committed action row; callers cannot submit a
     replacement target or effect body.
   - supports only `define_replica`, `assign_replica`, and
     `withdraw_replica` in 7B.
   - atomically applies the exact placement effect and appends the outcome.
   - rejects cell-supply action kinds until their provider is approved in 7E.
9. `close_reconciliation_action(request)`
   - may append a terminal `rejected` outcome only after the same action has a
     recorded failed attempt and no placement effect committed.
   - remains lease-, sequence-, replay-, and role-fenced.
10. `read_reconciliation_audit(environment_key, plan_key)`

- returns bounded immutable plan, action, application, and outcome evidence.

Operation requests have exact fields, deadlines, idempotency keys, canonical
digests, and bounded result sizes. No operation accepts SQL, host commands,
executables, environment variables, paths, endpoints, credentials, launch
descriptors, arbitrary capability names, or caller-selected timestamps.

### Observation Verification Boundary

PostgreSQL cannot natively verify Ed25519 with the currently approved
extensions. Pretending otherwise would be a false security claim.

The authenticated cell-transport provider therefore verifies the signature
over canonical unsigned observation bytes using the current enrolled transport
key before selecting the observation-appender role. PostgreSQL then verifies:

- the canonical bytes and `observation_digest` agree.
- the signed attestation is present and uses `ed25519`.
- the verified key reference and digest equal current active enrollment.
- the observation names that same cell and a monotonic generation projection.
- occupied plus available slots does not exceed enrolled slot capacity.
- timestamps are bounded around database time and TTL is limited.
- replay is byte-identical; conflicting reuse fails.

The appender role can do nothing else. Hostile tests prove that the stem,
operator, reader, generic distribution reader, and PUBLIC cannot append or
alter observations. This follows the already approved enrollment and evidence
custody model while narrowing the role substantially.

### Input And Control Fences

Maintain one locked environment fence row containing two independent counters:

- `input_revision` changes when any fact used to build a snapshot changes:
  desired state, overrides, cell enrollment/capabilities, runtime-slice
  availability, artifact revocation, placement definitions, replicas,
  assignments, residencies, or cell-generation observations.
- `control_revision` changes when a snapshot, plan, action attempt, or terminal
  outcome changes the reconciliation control history.

Row-level triggers advance `input_revision` for existing authority tables so
legacy/manual exact placement operations cannot bypass the fence. Row scope
keeps environment identity explicit for mixed-environment statements; the
counter is monotonic rather than a semantic version, so additional increments
have no independent meaning. Reconciliation functions advance counters under
the same environment row lock.
The counters are internal monotonic serialization devices, not business
contracts or planner inputs.

Each issued snapshot stores both counters and `valid_until`. `valid_until` is
the earliest lease expiry, observation expiry, residency expiry, or initial
assignment convergence deadline that can change any interpretation in the
snapshot without another write.

Plan commit locks the lease and fence row, then requires:

- the lease owner, generation, and epoch still match and are unexpired.
- current input and control revisions equal the issued snapshot's revisions.
- database time is earlier than the snapshot's `valid_until`.
- global semantic authority revision equals the public source revision.
- no other unresolved plan appeared.
- the exact source digest belongs to that issued snapshot.

Lease renewal does not advance `input_revision` and does not invalidate a plan
for the same owner and epoch. Lease transfer or expiry always invalidates it.

### Snapshot Derivation

PostgreSQL derives every public snapshot field. Callers cannot provide cells,
capacity, assignments, convergence, unresolved actions, or evaluation time.

The snapshot includes only units with explicit current desired state and the
bounded authority needed to plan them. Collection and encoded-size limits are
checked before custody.

`current_generation` is the latest nonexpired observation for the current
active enrollment transport identity. Expired, stale-key, stopped, or superseded
observations never provide capacity.

Replica convergence is derived from current assignment and signed residency
authority:

- `ready`: every current unit member has a matching, nonexpired `ready`
  residency for the current assignment, cell generation, unit revision, and
  active source; route readiness is therefore true.
- `converging`: the target generation is current and ready, and either the
  assignment is inside a fixed 60-second initial grace period or at least one
  matching nonexpired `materializing` residency demonstrates current progress.
- `unhealthy`: every other active-assignment condition, including inactive
  enrollment, absent/expired/non-ready generation, stopped/draining evidence,
  stale unit/source authority, or expired progress.

The fixed initial grace is a V0 authority constant, not caller policy. A cell
can preserve legitimate longer work by renewing `materializing` evidence.
The projection includes sorted source residency digests as provenance. Health
labels supplied by a cell or stem are ignored.

### Plan And Action Semantics

Plan identity remains exactly the Sprint 7A identity. PostgreSQL verifies but
does not reproduce candidate filtering, packing, anti-affinity, pinning, or
scale policy.

Only one plan with unresolved actions may exist for an environment. Equal
`plan_key` and canonical bytes are replay. Equal key with different bytes is a
conflict. A blocked zero-action plan may be recorded for evidence, but a plan
cannot introduce actions when its source snapshot lists blockers.

Database actions execute in plan sequence. Before each action PostgreSQL
requires all earlier actions to be committed and verifies that current global
authority and input revisions equal the after-revisions recorded by the last
successful action application. Any unrelated authority change rejects the
next action and requires a new snapshot and plan.

`define_replica`, `assign_replica`, and `withdraw_replica` reuse the existing
placement constraints and append-only assignment epoch model. In accordance
with the authoritative Sprint 7A planner, reassignment is one atomic
`assign_replica` effect at the next assignment epoch; explicit withdrawal is
reserved for scale-down or unassignment. Each committed effect increments
global semantic authority exactly once and stores immutable before/after
revisions.

Initial static placement remains possible before the first stem lease is
established. Acquiring that first lease atomically activates reconciliation for
the environment. From that point, the existing direct replica-definition and
assignment gateway operations reject mutation; replica effects must come from
committed reconciliation actions. Placement-unit definition and signed
residency publication remain exact independent authority operations because
they declare source topology and runtime evidence rather than planner effects.

Outcomes are append-only attempts. `committed` and `rejected` are terminal;
`failed` is retryable and may be followed only by the next attempt sequence.
An exact close operation may mark an unrecoverable failed action `rejected` so
later planning is not blocked forever. No caller may report `committed` for a
database action; only the transaction that applies the effect can produce that
outcome.

### Immutability And Evidence

Triggers reject UPDATE or DELETE on revisions, observations, snapshots, plans,
actions, applications, outcomes, and lease events. The current lease projection
may be updated only by owner functions.

Every operation records request digest, role boundary, replay identity,
database observation time, outcome, and response digest. Placement applications
also bind the existing authority-operation evidence to plan and action keys.

## Impacted Repos

- Authority repo: `cadenza`.
- Workspace meta repo: design, decision, contract notes, and roadmap state.
- Direct consumers in this pass: `cadenza/environment-bootstrap` PostgreSQL
  authority package and tests.
- Deferred consumers: `cadenza-cell` in 7C, the stem meta slice in 7D, cell
  supply in 7E, and takeover in 7F.

No primitive-core translation is required. The SQL authority materializes the
existing neutral contracts; it does not create a new core API.

## Migration Strategy

1. Record the approved 7B decision before implementation.
2. Add shared canonical helpers and conformance tests.
3. Add migration 007 with isolated roles, schema, tables, views, triggers, and
   functions.
4. Add typed TypeScript request/response adapters only where needed to invoke
   and validate the SQL boundary; do not add a second in-memory authority.
5. Add PostgreSQL integration tests for operations and hostile boundaries.
6. Update neutral reconciliation documentation with SQL ownership and the
   signature-verification boundary, without changing planner semantics.
7. Run focused PostgreSQL, complete authority-package, core correctness,
   schema, formatting, build, and harness validation.

Existing rows require no destructive rewrite. Existing placement state remains
valid input. Reconciliation desired state starts absent, so rollout cannot
create effects. No backward-compatibility promise is made for pre-major-version
internal SQL functions, but unrelated official authority behavior must remain
correct.

## Validation Plan

### Contract And Canonical Tests

- PostgreSQL canonical JSON matches every TypeScript reconciliation fixture.
- snapshot, plan, action, observation, and outcome digests match byte for byte.
- noncanonical order, unsafe numbers, excessive collections/bytes, duplicate
  identities, and conflicting replay fail closed.

### Authority Tests

- desired and override revisions are contiguous and replacement-based.
- one of two concurrent initial lease claims wins; renewal cannot transfer or
  resurrect authority.
- snapshot issuance is transactionally coherent and records correct internal
  fences and earliest expiry.
- plan replay is exact and stale authority, input, control, time, digest,
  lease, and unresolved-action cases are rejected.
- definition, assignment, withdrawal, and reassignment preserve epochs,
  capabilities, trust, pins, capacity, and before/after evidence.
- first-lease activation closes direct replica-definition and assignment
  mutation while preserving unit definition and residency publication.
- action failure preserves an immutable attempt and cannot forge committed
  state.
- current views can be rebuilt from immutable rows.

### Hostile Role Tests

- no restricted role can SELECT, INSERT, UPDATE, or DELETE authority tables.
- no role can call another role's exact functions.
- cells cannot forge plans, projections, leases, or outcomes.
- stem cannot forge observations, desired state, overrides, or committed
  database outcomes.
- operator cannot forge cell observations or execute plan effects.
- generic distribution reader, generic authority gateway, and PUBLIC gain no
  accidental reconciliation authority.
- search-path substitution, stale key identity, replay mutation, oversized
  JSON, caller time, and direct sequence access fail closed.

### Commands

- focused Vitest PostgreSQL reconciliation suite.
- complete `cadenza/environment-bootstrap` test, typecheck, build, and format.
- complete `cadenza` correctness suite with the previously deferred
  machine-sensitive performance test still reported separately.
- JSON Schema validation for all neutral reconciliation fixtures.
- `git diff --check` in each touched repo.
- `./scripts/check-agent-harness.sh` from workspace root.

## Risks

### Operational Complexity

New roles, revisions, and immutable custody add operational weight. The design
contains that weight in one schema, one migration, one environment fence row,
and exact operations. It deliberately avoids queues, scheduler workers,
leader-election services, advisory-lock protocols exposed to callers, or a
general job model.

### Revision Trigger Coverage

Missing one source table would permit stale-plan acceptance. Tests will mutate
every named input table between snapshot and plan commit and require rejection.
The table list will also be documented next to the trigger definition.

### Signature Custody

Signature verification remains outside PostgreSQL. The risk is controlled by
one narrow appender role, canonical-byte verification, current enrollment-key
binding, and hostile tests. Native database verification should be considered
only if a proven Ed25519 extension is explicitly approved later.

### Snapshot Size

The neutral collection limits permit multi-megabyte snapshots. SQL checks both
entity counts and an explicit encoded-byte ceiling before custody. Pressure
tests measure construction, digesting, storage, replay, and plan commit at the
maximum practical fixture. A lower contract bound must be versioned if pressure
evidence shows the current bound is operationally incoherent.

### Partial Plan Failure

A plan can become stale after earlier actions committed. That is expected:
committed effects remain valid authority, later actions fail closed, and the
next pass plans from current state. History is never rolled back or rewritten.

## Alternatives

### Recompute The Snapshot At Plan Commit

Rejected. Authority-supplied time and expiry make a later digest different even
when no meaningful write occurred, while a careless recomputation can also
miss a time boundary.

### Fence Only With Global Authority Revision

Rejected. Runtime observations, residency publication, expiry, and action
history are meaningful without a global authority revision change.

### Put Planner Policy In SQL

Rejected. It would create a second planner, weaken cross-language conformance,
and turn PostgreSQL into a scheduler.

### Store Every Contract Only As JSONB

Rejected. JSON is the shared interchange and evidence format, but relational
constraints are better for revisions, ownership, referential integrity,
fencing, and current projections.

### Create A Separate Reconciliation Service

Rejected. It would duplicate identity, authority, deployment, and evidence
boundaries beside Cadenza and violate the intended whole.

### Let The Stem Call Existing Placement Operations Directly

Rejected. A plan would remain advice rather than authority, and target,
revision, lease, and action identity could drift independently.

## Assumptions

- PostgreSQL remains the environment-local semantic authority for Sprint 7.
- The approved Sprint 7A contract and planner semantics remain authoritative.
- Database time is authoritative for lease and expiry evaluation.
- Existing cell transport verifies Ed25519 before the narrow observation
  append boundary; PostgreSQL verifies custody and current-key binding.
- Initial stem ownership is established explicitly; automatic expired-lease
  takeover remains Sprint 7F.
- Provider cell-supply actions may be stored but cannot execute in 7B.

## Work Items After Approval

- [x] Record the approved architecture decision.
- [x] Implement and prove shared PostgreSQL canonical JSON.
- [x] Implement migration 007 roles, tables, views, triggers, and grants.
- [x] Implement exact desired-state and override operations.
- [x] Implement observation custody and current-generation projection.
- [x] Implement initial lease acquisition and renewal.
- [x] Implement snapshot issuance, derivation, custody, and expiry fencing.
- [x] Implement plan validation, custody, replay, and unresolved-action rules.
- [x] Implement plan-bound define, assign, withdraw, and outcome operations.
- [x] Add rebuild, concurrency, stale-state, replay, and hostile-role tests.
- [x] Run pressure, security, dead-code, and recursive coherence reviews.
- [x] Update contract docs, migration inventory, roadmap, and closure evidence.

## Implementation Result

Migration 007 and its exact role boundaries are implemented in the official
`cadenza` repo. The environment-bootstrap suite passes 63 tests across 12 test
files, including five focused PostgreSQL reconciliation scenarios. Typecheck
and build pass. The official core correctness suite passes 161 tests with the
previously deferred machine-sensitive performance test excluded.

The closure evidence is
[Sprint 7B PostgreSQL Reconciliation Authority Closure Review V0](../../../contracts/distribution/sprint-7b-closure-review-v0.md).

## Exit Criteria

- PostgreSQL serializes one current stem owner and rejects split authority.
- Every accepted plan is bound to one still-valid issued snapshot.
- After reconciliation activation, every replica-definition or assignment
  effect is bound to one committed plan action and produces immutable outcome
  and authority evidence.
- Generation and convergence projections are derived from current signed
  evidence, never caller health claims.
- Equal retries replay exactly; conflicting and stale attempts fail closed.
- All current projections are reproducible from immutable authority history.
- No restricted role, chamber, or public caller gains generic database,
  scheduler, or host-control authority.
- The final coherence review finds no issue that should precede Sprint 7C.
