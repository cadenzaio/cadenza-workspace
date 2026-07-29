# Sprint 10E Operational Interpretation Matrix V1

Date: 2026-07-28

## Status

- Source and diagnostic audit: complete.
- Documentation gaps: four.
- Diagnostic projection gaps: none.
- Contract gaps: none.
- Product source change required: no.

This matrix records the evidence used to repair current operational guidance.
It does not create runtime states, retry semantics, health contracts, or
operator privileges.

## Frozen Source

| Repository | Reviewed commit |
| --- | --- |
| Workspace | `c1d3e8684caabb03b1be0f246d8922cd334a7232` |
| TypeScript Core | `a2d38f0bc72b43634ca9a2af74b1194584ba6746` |
| Python Core | `9fd99a0a7e9533163a2952fed526d35fb100f307` |
| Elixir Core | `d1dd15f1802d108023384cab39d234aaf259f114` |
| C# Core | `d294e535aa0dfad91123c9d14ad6e3aa8c5b4cb2` |
| Environment | `eb9cc0046b1e74b24e44b9598c118c9a6ee67d03` |
| Chamber | `10db3f61e93bbec336bcc489d194877e23a5ee3b` |
| Cell | `89e6e5492956a8513c215aa55996412ec4630ffb` |
| Reference system | `4d610e3d53a97d22effc6f8b677966c78fbeffc7` |

Untracked workspace files are outside this reviewed source set.

## Gap Register

| ID | Class | Finding | Disposition |
| --- | --- | --- | --- |
| `OI-DOC-001` | Documentation | No current guide applies desired, authorized, running, observed, custody, and safe-next-action questions consistently across subsystems. | Create one cross-boundary operational interpretation guide. |
| `OI-DOC-002` | Documentation | Current troubleshooting names common failures but does not always lead with owning stage and affect state. | Add stage-first triage and bounded recovery tables. |
| `OI-DOC-003` | Documentation | Current evidence guidance compresses runtime reporting, Cell durability, ledger commit, and local acknowledgement into too few operator steps. | Explain custody transfer and unknown-commit resolution explicitly. |
| `OI-DOC-004` | Documentation | Actual proof-substrate failures are preserved in closure records but are not separated from runtime failures in current troubleshooting. | Add a proof-substrate branch grounded in the PostgreSQL, rootfs, cgroup, fixture, timeout, and artifact findings. |

No missing identity or affect state requires a schema, shared contract,
protocol, public API, or product repair. Existing messages remain supporting
diagnostics rather than machine authority; stable fields and evidence own
correlation.

## Interpretation Rules

The six questions are independent:

| Question | Authoritative meaning |
| --- | --- |
| Desired | The outcome declared for convergence. |
| Authorized | The current revision, generation, epoch, lease, grant, route, policy, or receipt that permits affect. |
| Running | A process, residency, materialized primitive, or operation currently held by a runtime owner. |
| Observed | A report made by a named observer under a bounded time and identity. |
| Custody | The identity accountable for a retained process, descriptor, route, mutation, evidence batch, or cleanup consequence. |
| Safe next action | The action allowed by both current authority and the known affect state. |

An empty or inapplicable axis must remain explicit. It must not be fabricated
to make every subsystem look alike.

The reviewed safe non-secret identity vocabulary includes:

- environment, logical object, definition, unit, replica, assignment, route
  member, request, plan, and action keys;
- authority revision, projection revision, generation, image, route, lease,
  assignment, directive, and provider epochs;
- trace, graph execution, task execution, distribution execution, transport
  attempt, mutation, evidence, batch, attempt, and receipt keys;
- canonical SHA-256 commitments and bounded reason or failure codes.

Credentials, private keys, callable source, raw business context, host objects,
generic commands, and unrestricted endpoints remain excluded.

## Scenario 1: State Sources Disagree

| Question | Interpretation |
| --- | --- |
| Desired | `PlacementDesiredState` records the unit, desired-state revision, replica bounds, automation mode, and allowed Cells. |
| Authorized | Current assignment, Cell generation, replica residency, projection revision, route epoch, and validity windows must agree. |
| Running | A supply provider may hold a Cell process, and a Cell may hold a Chamber, before application ingress is eligible. |
| Observed | Provider `running`, Cell `ready`, member `ready`, and route acknowledgement are separate observations by separate owners. |
| Custody | Provider owns supplied Cell process custody; Cell owns Chamber, route, and local evidence custody; Environment owns durable authority. |
| Safe next action | Identify the first disagreeing stage and reconcile from current authority. Never promote liveness or one observation into readiness. |

Key sources:

- [Environment reconciliation model](../../cadenza-environment/packages/environment-bootstrap/src/reconciliation-contracts.ts)
- [Cell supply supervisor](../../cadenza-cell/docs/cell-supply-supervisor.md)
- [Cell autonomous convergence contract](../../cadenza-cell/contracts/v0.md)
- [Cell and Chamber lifecycle views](../architecture/atlas/README.md)

Gap classification: `OI-DOC-001`.

## Scenario 2: Before Affect, Started, Or Uncertain

| Question | Interpretation |
| --- | --- |
| Desired | The caller still wants the exact inquiry, delegation, signal, reconciliation action, or actor mutation completed. Desire does not authorize duplicate execution. |
| Authorized | The exact request, idempotency identity, deadline, route, assignment, and generation remain the basis for any continuation. |
| Running | A Chamber outcome records whether execution started. Cell distribution evidence records `requested` and terminal phases with the same distribution identity. |
| Observed | Core emits `task.started`; Chamber and Cell add trusted observation and custody meaning without rewriting the runtime report. |
| Custody | Before start, no business affect is retained. After start, Chamber, Cell, target replay state, or durable provider owns an outcome that may still be unresolved. |
| Safe next action | Retry only a declared pre-affect retryable rejection under still-current authority. Resolve the exact identity after start or uncertainty; never move it to another replica as new work. |

The normalized Chamber outcomes are `fulfilled`, `execution_failed`,
`retryable_reject`, `denied`, and `transport_failed`, each with
`execution_started`. Evidence custody loss before `task.started` is a
retryable rejection with `execution_started: false`; loss after start is an
integrity failure with `execution_started: true`.

Key sources:

- [Chamber runtime contract](../../cadenza-chamber/contracts/v0.md)
- [Chamber protocol failure shape](../../cadenza-chamber/src/cell_protocol.rs)
- [Core runtime evidence types](../../cadenza/src/execution-evidence/types.ts)
- [Cell distribution evidence](../../cadenza-cell/src/orchestrator.rs)
- [Reconciliation action lifecycle](../architecture/atlas/rendered/17-reconciliation-action-lifecycle.svg)

Gap classification: `OI-DOC-002`.

## Scenario 3: Stale, Unavailable, Or Forbidden Authority

| Question | Interpretation |
| --- | --- |
| Desired | The requested outcome may remain desirable even when the attempted authority is unusable. |
| Authorized | Current revision, role, lease, generation, grant, assignment, and validity window decide whether the caller may affect. |
| Running | An existing provider session or process can remain alive while its authority is stale, revoked, expired, or inaccessible. |
| Observed | Failure code, PostgreSQL semantic error, gateway evidence, reconciliation reason, and process diagnostic describe the attempted boundary. |
| Custody | Bounded provider unavailability may retain exact work. Stale or forbidden authority retains no right to mutate and must not be retried as availability. |
| Safe next action | Reconnect and defer only declared provider or transport unavailability. Refresh from current authority after staleness. Correct caller role or policy after denial; never widen the role. |

Operational distinctions:

- **stale:** a newer revision, generation, epoch, assignment, route, grant, or
  lease superseded the attempted authority;
- **unavailable:** the purpose-specific provider or transport could not be
  reached before a semantic decision;
- **forbidden:** the caller role or current policy is not permitted to perform
  the operation.

Key sources:

- [Distribution authority failure codes](../../cadenza-environment/packages/environment-bootstrap/src/distribution-contracts.ts)
- [Cell provider boundary](../../cadenza-cell/contracts/v0.md)
- [Cell failure codes](../../cadenza-cell/src/error.rs)
- [Chamber failure codes](../../cadenza-chamber/src/error.rs)
- [Sprint 10D failure coverage](../security/sprint-10d-failure-coverage-v1.md)

Gap classification: `OI-DOC-002`.

## Scenario 4: Supply Directive, Retained Process, And Fresh Generation

| Question | Interpretation |
| --- | --- |
| Desired | Reconciliation requests `running`, `draining`, or `stopped` through an exact Cell supply directive. |
| Authorized | Directive key and epoch bind the source plan, action, stem lease epoch, authority revision, provider registration, profile revision, and launch-profile digest. |
| Running | The provider records local child custody before publishing `running`; an observation outage cannot justify another spawn. |
| Observed | Provider generation and supply observations name provider generation, directive epoch, Cell generation, attempt sequence, state, validity, and optional bounded failure reason. |
| Custody | The provider owns child process custody; Cell owns its generation, launcher, Chambers, routes, actors, and evidence. A replacement provider never adopts a predecessor child. |
| Safe next action | Retain the child during bounded observation outage. Replace provider and Cell with fresh generations after custody ends. Defer `CustodyPending` only for the exact matching provider generation, directive, and epoch. |

`running` provider observation is not Cell readiness. `dormant` means the
profile has no Cell generation; `stopped` is Cell lifecycle evidence; absence
is represented by no local member record.

Key sources:

- [Supply contract schemas](../../cadenza-environment/contracts/reconciliation/v0/README.md)
- [Supply provider projection](../../cadenza-environment/packages/environment-bootstrap/migrations/010_pre_enrolled_cell_supply_authority.sql)
- [Cell supply supervisor](../../cadenza-cell/docs/cell-supply-supervisor.md)
- [Supply restart evidence](../../cadenza-cell/docs/supply-restart-lifecycle-evidence-2026-07-24.md)

Gap classification: `OI-DOC-001`.

## Scenario 5: Selected Route Member And No Substitution

| Question | Interpretation |
| --- | --- |
| Desired | Placement declares replica count and eligible Cells; it does not pick the target for one execution. |
| Authorized | A route group contains exact member keys under a route epoch. Every member binds unit revision, replica, assignment epoch, Cell generation, Chamber, image, responsibility, and route epoch. |
| Running | The selected Chamber residency must be ready and the source Chamber must hold the applied projection used for selection. |
| Observed | Signed member residency and projection acknowledgement establish current readiness; distribution evidence records the exact selected member and target identities. |
| Custody | Chamber owns bounded sender-selection state. Source Cell owns validation and the distribution execution identity. Target Cell owns replay state after authenticated acceptance. |
| Safe next action | Cell validates the Chamber-selected member exactly. A stale route epoch or changed member rejects before affect. Cell never substitutes another member. A new selection is allowed only as new pre-affect work under current projection. |

Key sources:

- [Distribution route-member authority](../../cadenza-environment/packages/environment-bootstrap/src/distribution-contracts.ts)
- [Chamber selection and ingress contract](../../cadenza-chamber/contracts/v0.md)
- [Cell route validation and transport contract](../../cadenza-cell/contracts/v0.md)
- [Sender-side routing closure](../contracts/distribution/sender-side-replica-routing-closure-review-v0.md)
- [Distribution path](../architecture/atlas/rendered/08-distribution-path.svg)

Gap classification: `OI-DOC-001`.

## Scenario 6: Actor Mutation, Owner Loss, And Relinquishment

| Question | Interpretation |
| --- | --- |
| Desired | Actor placement authority declares the eligible owner unit; one invocation requests a read or write against one actor-state key digest. |
| Authorized | Current actor assignment epoch binds owner replica assignment, Cell generation, Chamber, image, route member, and validity. Mutation authority also binds expected state version and stable mutation key. |
| Running | The current owner may hold serialized actor work while a persistence call is in flight. Local candidate state is not durable authority. |
| Observed | Actor lifecycle evidence records assignment, routing, hydration, commit, outcome resolution, and failure class with trace and mutation identities. |
| Custody | Environment owns committed state and mutation outcomes. Cell owns owner residency coordination. Chamber owns the in-flight task. Drain retains the owner until accepted mutations settle or resolve. |
| Safe next action | Resolve an uncertain mutation by its exact mutation key before reassignment or response. A successor advances epoch, hydrates committed state, and rejects stale-owner commits. Relinquish only after accepted work settles. |

The durable outcome resolver returns `committed` or `not_found` for the exact
mutation identity. Actor evidence distinguishes `uncertain_commit` from
unavailable, stale, conflict, pressure, invalid state, and evidence-custody
failure.

Key sources:

- [Actor assignment authority](../../cadenza-environment/packages/environment-bootstrap/migrations/013_actor_assignment_authority.sql)
- [Actor persistence authority](../../cadenza-environment/packages/environment-bootstrap/migrations/014_actor_state_persistence.sql)
- [Actor failure and relinquishment](../../cadenza-environment/packages/environment-bootstrap/migrations/015_actor_failure_and_lifecycle.sql)
- [Cell actor lifecycle evidence](../../cadenza-cell/src/actor_evidence.rs)
- [Actor write recovery](../architecture/atlas/rendered/20-actor-write-failure-recovery.svg)

Gap classification: `OI-DOC-001` and `OI-DOC-002`.

## Scenario 7: Evidence Pressure And Durable Custody

| Question | Interpretation |
| --- | --- |
| Desired | Evidence policy declares profile and processing eligibility for the runtime image; it does not make a runtime report durable. |
| Authorized | Image policy, active execution identity, report sequence, Cell generation, journal chain, claim lease, and exact ledger receipt govern each custody transfer. |
| Running | Core reports execution; Chamber validates and captures; Cell appends and synchronizes; processor claims a sealed batch; Environment commits the exact batch. |
| Observed | Runtime report, Chamber capture, Cell normalized record, processing attempt, ledger receipt, and local acknowledgement are different evidence layers. |
| Custody | Chamber waits for Cell receipt; Cell retains journal and batch until exact ledger receipt is locally acknowledged; unknown commit retains claim and attempt authority. |
| Safe next action | Reject new affect at normal high-water. Preserve terminal reserve for admitted work. Resolve unknown ledger commit with the exact attempt and receipt. Compact only an acknowledged contiguous prefix. |

A successful business result is not returned when mandatory evidence custody
fails. Post-start custody failure remains indeterminate rather than becoming a
safe retry.

Key sources:

- [Core evidence machine contract](../../cadenza/contracts/execution-evidence/v0/README.md)
- [Chamber evidence capture](../../cadenza-chamber/contracts/v0.md)
- [Cell evidence custody](../../cadenza-cell/contracts/v0.md)
- [Environment ledger contract](../../cadenza-environment/contracts/execution-evidence/v0/README.md)
- [Evidence custody lifecycle](../architecture/atlas/rendered/18-evidence-custody-lifecycle.svg)

Gap classification: `OI-DOC-003`.

## Scenario 8: Draining, Stopped, Dormant, Absent, And Clean

| Question | Interpretation |
| --- | --- |
| Desired | Authority withdraws replicas and requests Cell drain or stop. |
| Authorized | Exact assignment, directive, generation, and lifecycle transitions determine which owner may release each resource. |
| Running | Chambers, actor owners, Cell processes, launcher children, containers, or processors may remain while drain is validly in progress. |
| Observed | Draining, stopped, dormant, and cleanup reports describe different scopes. No one report proves all resources absent. |
| Custody | Route, accepted work, actor mutation, evidence, process, descriptor, container, cgroup, filesystem, authority, and credential custody close in dependency order. |
| Safe next action | Withdraw routes, settle accepted work and actors, durably acknowledge evidence, stop Chambers, stop the Cell generation, verify provider dormancy, then measure every resource named by the cleanup claim. |

Meanings:

- `draining`: no new eligible work, but declared custody may remain;
- `stopped`: one lifecycle owner completed its stop boundary;
- `dormant`: a supply profile names no active Cell generation;
- absent member: no local member record remains after stopped residency;
- clean: every resource explicitly named by the proof or operator claim is
  measured absent.

Key sources:

- [Operational lifecycle evidence](sprint-9c-operational-lifecycle-v1.md)
- [Cell lifecycle](../architecture/atlas/rendered/15-cell-lifecycle.svg)
- [Chamber lifecycle](../architecture/atlas/rendered/16-chamber-lifecycle.svg)
- [Supply restart evidence](../../cadenza-cell/docs/supply-restart-lifecycle-evidence-2026-07-24.md)
- [Sprint 10D failure coverage](../security/sprint-10d-failure-coverage-v1.md)

Gap classification: `OI-DOC-001` and `OI-DOC-002`.

## Diagnostic Surface Audit

| Owner | Existing safe correlation surface | Audit result |
| --- | --- | --- |
| Reconciliation stem | status, trigger, lease epoch, input revision, plan key, blocked action key, reason code, applied action count, and unsatisfied demand | Sufficient; guidance must explain unknown outcome versus blocked action. |
| Supply authority | provider generation, directive, profile and Cell generation identities; epochs; state; attempt sequence; validity; bounded failure reason | Sufficient; guidance must separate process custody from readiness. |
| Chamber | request identity, operation, failure code, bounded message, and `execution_started`; lifecycle, image, projection, and runtime evidence | Sufficient; free-form message is supporting detail, not authority. |
| Cell distribution | phase, trace, source effect, distribution execution, selected route member, target generation and Chamber, outcome, started state, and failure code | Sufficient; guidance must preserve Chamber selection and Cell no-substitution roles. |
| Actor lifecycle | assignment epoch, mutation key, expected and committed state versions, owner image, execution path, outcome, and bounded failure class | Sufficient; per-key identities are deliberately excluded from aggregate drain evidence. |
| Evidence custody | report sequence, custody sequence, evidence key, batch key/root, processing attempt, ledger commit key, receipt digest, and acknowledgement state | Sufficient; guidance must explain which transfer is durable. |
| Proof harness | source commits, manifest digest, scenario, stage, failure, cleanup counts, and measured substrate | Sufficient; proof-environment failures must not be misclassified as runtime behavior. |

## Proof-Substrate Lessons

Current troubleshooting must preserve these actual findings:

1. Shared PostgreSQL cluster roles polluted proof authority. Fresh clusters
   restored isolated authority.
2. An obsolete installed rootfs correctly failed closed with
   `protocol_version_mismatch`. Reassembly from measured inputs restored the
   declared runtime.
3. A proof service named like a Cadenza runtime was counted by its own cgroup
   cleanup scanner. A neutral enclosing service name restored scope accuracy.
4. Temporary PostgreSQL tests used a shared host-port race and discarded the
   diagnostic needed to explain exit. Per-cluster Unix sockets and captured
   stderr repaired the harness.
5. Chamber and Cell tests relied on undeclared parent-workspace fixtures.
   Governed repository-local snapshots restored standalone authority.
6. A longer timeout exposed a planner defect rather than proving timing was
   the cause. Time bounds remain evidence limits, not explanations.
7. A changed declared artifact was initially classified by shape before
   content. The repair preserved a distinct tamper classification.

These are proof or diagnostic-environment lessons. They do not authorize
production retries, relaxed cleanup, mutable runtime artifacts, ambient
fixtures, or broader roles.

Sources:

- [Supply restart proof findings](../../cadenza-cell/docs/supply-restart-lifecycle-evidence-2026-07-24.md)
- [Environment PostgreSQL restart gate](sprint-9f-environment-postgres-restart-ci-gate-v1.md)
- [Chamber standalone fixture gate](sprint-9f-chamber-standalone-contract-fixture-gate-v1.md)
- [Cell standalone fixture gate](sprint-9f-cell-standalone-contract-fixture-gate-v1.md)
- [Linux proof timing gate](sprint-9f-linux-proof-timing-bound-gate-v1.md)
- [Chamber artifact classification gate](sprint-9f-chamber-artifact-tamper-classification-gate-v1.md)

Gap classification: `OI-DOC-004`.

## Audit Conclusion

The operational system is interpretable from its current authority and
evidence. Its complexity comes from preserving legitimate identities and
custody across boundaries, not from a missing global state object.

Sprint 10E can remain documentation-only:

- no runtime state is missing;
- no universal diagnostic field is justified;
- no error message must become authority;
- no retry policy changes;
- no repository contract changes;
- no child repository changes.

The repair should make the existing whole legible while keeping every
security-relevant distinction intact.
