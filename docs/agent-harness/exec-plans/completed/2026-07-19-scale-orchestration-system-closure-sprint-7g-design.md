# Sprint 7G Scale And Orchestration System Closure Design Proposal

Date: 2026-07-19

## Current Status

- State: `done`; the approved implementation, automatic execution-evidence
  processor amendment, recursive review, and definitive Linux proof completed
  and closure was approved on 2026-07-20.
- Complexity gate: required. This pass composes every Sprint 7 authority and
  runtime loop in one multi-Cell failure lifecycle and may repair cross-layer
  contract defects exposed by the proof.
- Impacted repos: `cadenza`, `cadenza-cell`, `cadenza-chamber` for conformance,
  and the workspace meta repo.
- Parent design:
  [Sprint 7 Scale, Placement Reconciliation, And Orchestration](2026-07-17-scale-placement-reconciliation-design.md).
- Completed prerequisite:
  [Sprint 7F Stem Recovery And Fencing](2026-07-19-stem-recovery-fencing-sprint-7f-design.md).
- Approval received: `Design approved. Proceed.` on 2026-07-19.
- Closure approval received: `Approved.` on 2026-07-20.
- Completed amendment:
  [automatic per-Cell execution-evidence processor placement](2026-07-19-automatic-evidence-processor-placement-sprint-7g-amendment.md).
- Closure review:
  [Sprint 7G Scale And Orchestration System Closure](../../../contracts/distribution/sprint-7g-closure-review-v0.md).

## Integration Finding

The independent three-Cell proof compiles on Linux and successfully reached
all of these states before its first evidence barrier:

- two retained trusted-control Cell generations became ready.
- the initial stem lease and three assigned members converged on Control A.
- desired target demand changed from `0` to `1`.
- the supply supervisor started Demand C under a fresh generation.
- the stem assigned the target unit to Demand C.
- all five expected members became ready.

The proof then waited for complete durable ledger custody and failed after
`432.98s`. The ledger contained zero records. Authority inspection confirmed
that the environment had no execution-evidence processor slice, placement
unit, replica, assignment, or Chamber. Journals had sealed correctly; no
authorized processor existed to claim and transfer them.

This is a real missing Sprint 7 responsibility, not a test timing issue.
Sprint 6D.5 explicitly deferred automatic one-processor-per-active-Cell
reconciliation to Sprint 7, and Sprints 7A through 7F did not implement it.
A static test-only placement would either keep dormant supply alive or require
the application author to coordinate evidence infrastructure. Both violate the
intended whole.

## Context

Sprints 7A through 7F have individually proved deterministic planning,
PostgreSQL reconciliation authority, autonomous Cell convergence, the contained
stem graph, pre-enrolled Cell supply, and fenced stem recovery. Their definitive
system proofs intentionally focused on one boundary at a time.

Sprint 7 is not closed merely because those parts pass separately. Supply,
placement, Cell generation, Chamber custody, route authority, stem succession,
authority-mount promotion, execution evidence, and cleanup must remain coherent
when one failure crosses all of them. The final pass must also demonstrate that
the operational loops do not form a hidden management system whose complexity
is simply displaced from the application author to operators.

## Intended Whole

An author changes only application intent. Cadenza obtains bounded
pre-authorized capacity, places and materializes work, routes execution,
survives loss of its active policy runtime, continues interpreting intent,
releases unnecessary capacity, and returns trustworthy evidence. The author
does not manage deployment, process lifecycle, topology, leases, recovery,
distribution, or scale machinery.

What must be preserved through pressure and failure:

- one semantic source of desired application state.
- one current reconciliation policy loop.
- one authority for every consequential transition.
- exact separation between desired, committed, observed, ready, and executed.
- bounded and interpretable evidence across generations and custody changes.
- explicit failure when prerequisites disappear.

False success includes:

- proving supply and recovery only in separate environments.
- accepting desired state while its runtime consequences cannot converge.
- treating process, Cell, Chamber, route, or takeover state as another layer's
  success.
- recovering the stem while losing execution-evidence continuity.
- requiring manual lifecycle commands after the initial desired-state change.
- retaining stale processes, routes, credentials, assignments, plans, or
  generated compatibility surfaces after cleanup.
- passing a happy-path proof while pressure, outages, or retries create churn,
  unbounded state, hidden queues, or ambiguous ownership.

## Governing Restrictions

Sprint 7G is closure and repair, not feature expansion.

- No dynamic enrollment, machine creation, cloud API, Kubernetes, Docker
  control, public ingress, multi-hop transport, or cross-environment placement.
- No adaptive metrics autoscaling, global optimizer, concurrent Chamber
  execution, actor persistence, memory, agent, UI, or CLI work.
- No new policy loop unless an approved amendment proves an existing owner
  cannot coherently hold the responsibility.
- No weakening of current signatures, epochs, role boundaries, containment,
  evidence barriers, or PostgreSQL serialization to make the proof pass.
- Fault injection belongs to the test harness; product behavior remains driven
  by declared desired state and current authority.

## Proposed Approach

Build one definitive three-Cell Linux/gVisor lifecycle that composes dual
trusted-control readiness, pre-enrolled standard Cell supply, ordinary business
distribution, active stem loss, successor convergence, post-takeover
scale-down, fresh resupply, renewed execution, evidence transfer, and complete
cleanup. Keep destructive, concurrency, maximum-pressure, and unknown-commit
cases in focused tests, then publish one scenario-to-evidence matrix.

After the proofs pass, audit every Sprint 7 loop and live contract surface
against security, disclosure, bounded pressure, dead-code, operational
complexity, and recursive coherence criteria. Repair only defects within the
approved Sprint 7 whole; stop for an amendment if a finding would add a new
authority, policy loop, dependency, or product feature.

## Closure Topology

The definitive proof uses at least three real Cell hosts:

1. **Control A**: retained trusted-control Cell, initial stem owner, and one
   ordinary source workload.
2. **Control B**: separate retained trusted-control Cell, ready recovery
   candidate, with independent generation, journal, launcher, keys, and
   purpose-separated credentials.
3. **Demand C**: standard pre-enrolled Cell whose process is initially dormant
   and is owned by the bounded supply supervisor when demanded.

Control A and B must both be genuinely stem-eligible: exact trust,
capabilities, capacity, artifacts, mounts, credentials, and current ready
generation. Demand C must have no recovery, authority-gateway, or
reconciliation-control authority.

PostgreSQL remains the only durable shared state and clock. Each process keeps
only the local custody already approved in earlier passes.

## Definitive Lifecycle

The proof will execute this ordered scenario without product lifecycle
commands:

1. Bootstrap Control A and Control B; acquire the initial stem lease on A.
2. Declare ordinary target demand `0 -> 1`.
3. Let the contained stem commit supply and placement actions; the supervisor
   starts Demand C under a fresh generation.
4. Converge exact Chambers and route catalogs, execute real remote business
   work, and transfer its evidence through the durable ledger path.
5. Interrupt the relevant database roles and prove that no loop invents
   authority, duplicates a process, or bypasses evidence custody.
6. Restore PostgreSQL authority, then terminate active stem owner A before its
   lease expires.
7. Require Control B to atomically take lease and singleton assignment custody,
   materialize both stem members, and promote the authority mount and policy.
8. Attempt delayed predecessor operations with A's stale lease, generation,
   assignment, plan, and mount identities; every affect must fail.
9. Change target demand `1 -> 0` through current authority. The recovered stem
   must withdraw work, remove routes, drain and stop Demand C, and return its
   profile to dormant.
10. Change target demand `0 -> 1` again. Demand C must start under a fresh Cell
    generation, reconverge, and complete remote business execution.
11. Drain the environment and verify complete runtime, evidence, journal,
    listener, descriptor, launcher, supply, and gVisor cleanup.

The second scale-up after takeover is important. It proves that recovery did
not merely preserve an existing result; the successor can continue generating
new consequences from later intent.

## Evidence Continuity

The proof must reconcile these identities before and after failure:

- trace, graph execution, task execution, relationship, and inquiry.
- distribution execution and transport attempt.
- Cell and Chamber generation and residency.
- reconciliation lease, snapshot, plan, action, attempt, application, and
  outcome.
- supply provider generation, directive, process observation, and managed Cell
  lifecycle.
- stem takeover and authority-mount promotion.
- custody batch, processing-attempt chain, ledger receipt, and checkpoint.

Evidence does not need one physical record shape. It must remain causally and
temporally interpretable: the predecessor's work ends under predecessor
identity, takeover explains the authority discontinuity, and successor work
starts under successor identity without rewriting history.

No raw business context, credential, private key, endpoint secret, command,
profile body, process handle, or stderr may enter the evidence ledger.

## Failure And Pressure Matrix

The combined proof and focused tests must account for:

- PostgreSQL outage before and during pending reconciliation work.
- supply-provider outage and restart without child adoption or duplicate spawn.
- stem-owner generation loss before lease expiry.
- delayed predecessor mutation after takeover.
- lost takeover and supply-observation responses.
- successor materialization delay without premature lease renewal or mount
  promotion.
- route-selection and route-acceptance projection skew.
- evidence-provider unknown commit and exact replay.
- no eligible placement or recovery capacity.
- maximum planner replica/action pressure.
- maximum bounded recovery candidate and evidence sizes.
- journal high-water, unacknowledged batches, and terminal reserve.
- repeated safety ticks and notification storms without semantic churn.

Existing focused proofs may supply evidence for destructive or expensive cases
that would make the single lifecycle less interpretable. The closure report
must map every scenario to an exact test rather than claiming one monolithic
test covers everything.

## Operational Complexity Review

The review will inventory each continuous or retrying loop:

- Cell convergence.
- reconciliation stem execution and lease renewal.
- stem recovery resolution.
- supply supervision.
- evidence processing and ledger transfer.
- peer transport replay and route refresh.
- launcher containment custody.

For each loop it will record owner, trigger, cadence, durable state, local
state, retry semantics, authority boundary, pressure bound, shutdown behavior,
and evidence. Any overlapping decision ownership, unbounded queue, redundant
clock, or hidden recovery state is a closure blocker.

## Security And Disclosure Review

Closure requires proof that:

- standard Cells cannot acquire trusted-control, recovery, gateway, or stem
  operation authority.
- every purpose-separated credential has one literal operation surface and is
  absent from child layers that do not need it.
- stale lease, assignment, generation, residency, image, mount, route, and plan
  identities fail after succession.
- supply cannot enroll, place, publish Cell state, or choose application
  intent.
- the stem cannot launch processes, choose profiles, read credentials, or call
  generic SQL.
- Chambers receive serialized callable definitions but no materialization or
  host provider authority outside their approved capability facades.
- logs, evidence, errors, fixtures, and generated artifacts contain no secrets
  or unnecessary business context.

## Dead-Code And Contract Review

The official `cadenza`, `cadenza-cell`, and `cadenza-chamber` repos will be
screened for Sprint 7 surfaces that are unreachable, duplicated, legacy,
test-only in production, or no longer serve the intended whole. In particular:

- obsolete direct placement and lifecycle mutation paths.
- parallel lease or trigger readers.
- controller-authored route or Chamber lifecycle commands.
- generic SQL/provider escape hatches.
- stale generation-bound peer configuration.
- unused contracts, fixtures, descriptors, roles, migrations, and exports.

Migration history may retain superseded definitions only when a later migration
explicitly removes them from the final schema. Historical text is not treated
as a live alternative authority surface.

Contract authority in `contracts.config.json`, neutral schemas, implemented
providers, host descriptors, docs, and tests must agree exactly.

## Recursive Coherence Review

The final review applies the Coherent Creation methodology across:

- intent and false success.
- participating identities and whole-relevant states.
- legitimate and forbidden affect.
- vertical interpretation from desired state to local custody and back through
  evidence.
- horizontal interpretation among stem, PostgreSQL, supply, Cells, Chambers,
  peers, launcher, and ledger.
- shared-field stewardship for authority, contracts, evidence, and time.
- temporal inheritance across generations, retries, takeover, and cleanup.
- fragmentation where a locally successful loop could produce global failure.

The review must name concerns rather than averaging them into a general pass.
Any issue that weakens authority, creates false success, leaks privileged
meaning, or introduces unbounded operational state is repaired before closure
or returned to an explicit design gate.

## Implementation Passes

### Sprint 7G.1: Combined Three-Cell Proof Harness

- compose retained dual-control topology with one dormant standard supply
  profile.
- preserve exact independent credentials, launchers, journals, endpoints, and
  generation identities.
- implement the ordered scale, execution, outage, takeover, scale-down,
  resupply, execution, and cleanup lifecycle.

Gate: one environment can traverse the complete lifecycle without manual
product commands or cross-role authority leakage.

### Sprint 7G.2: Evidence, Failure, And Pressure Closure

- verify causal evidence across pre-failure work, takeover, post-recovery
  reconciliation, resupply, and execution.
- map every approved failure scenario to combined or focused proof evidence.
- measure bounded planner, recovery, journal, notification, and retry pressure.
- repair only defects inside approved Sprint 7 meaning; architectural changes
  require an amendment gate.

Gate: failure and pressure produce bounded explicit states, not hidden queues,
duplicate mutation, false readiness, or uninterpretable evidence.

### Sprint 7G.3: Recursive Review And Sprint Closure

- complete security, disclosure, dead-code, contract-authority, operational
  complexity, and recursive coherence reviews.
- remove non-serving live surfaces and align official documentation.
- run all ordinary correctness suites, strict linting, neutral contract tests,
  and definitive Linux/gVisor proofs.
- publish the Sprint 7 closure report and roadmap transition.

Gate: scale and orchestration demonstrably reduce accidental complexity without
creating a hidden management system or weakening authority.

## Impacted Repositories

### `cadenza`

- authority and neutral-contract conformance.
- PostgreSQL failure, pressure, role, evidence, and final-schema tests.
- repairs only if combined proof exposes an existing Sprint 7 defect.

### `cadenza-cell`

- combined Linux/gVisor proof harness and local custody validation.
- descriptor, profile, role, loop, cleanup, and dead-code review.
- repairs only within already approved Cell, supply, recovery, transport, or
  evidence responsibilities.

### `cadenza-chamber`

- conformance and disclosure validation only unless the proof exposes a real
  runtime contract defect.
- no new Chamber feature is planned.

### Workspace Meta Repo

- contract authority map, scenario matrix, closure evidence, roadmap status,
  and final Sprint 7 decision trail.

## Risks

- The combined proof may become opaque or excessively slow. Mitigation: keep
  one ordered integration lifecycle and map expensive edge cases to focused
  proofs rather than adding branches to the main scenario.
- Three real Cells and their Chambers may exceed the current Docker Desktop or
  gVisor resource envelope. Mitigation: measure process, memory, journal, and
  duration pressure before changing runtime limits; resource scarcity must not
  be mistaken for a correctness repair.
- Reusing focused evidence can hide drift from the final code. Mitigation: all
  cited focused proofs are rerun after the last repair and identified by exact
  command and result in the closure matrix.
- Closure findings may reveal a missing cross-layer invariant. Mitigation: use
  migration 012 or a narrow existing-owner repair with hostile regression
  tests; require a design amendment for new authority or responsibility.
- Evidence volume can make the proof pass operationally while violating
  bounded custody. Mitigation: inspect journal, batch, ledger, checkpoint, and
  redaction bounds as first-class exit criteria.
- A test harness may accidentally perform product orchestration. Mitigation:
  distinguish explicit fault injection and final teardown from product affect;
  all normal lifecycle transitions must originate in desired state and current
  authority.

## Migration Strategy

No schema migration is planned. If closure exposes a database invariant, the
authority source must add migration 012 with focused upgrade and hostile tests.
Migration 011 and all earlier checksums will not be rewritten after Sprint 7F
closure.

No runtime compatibility migration is required; this remains the new
major-version line. Repairs may remove non-serving live surfaces after exact
references and final-schema behavior are proved.

## Alternatives

### Close Sprint 7 From Separate Proofs

Rejected. Cross-layer fragmentation appears only when supply, succession,
runtime convergence, transport, and evidence share one failure lifecycle.

### Build One Monolithic Test For Every Failure

Rejected. It would be slow, opaque, and difficult to diagnose. One definitive
combined lifecycle proves integration; focused tests prove destructive and
pressure boundaries with an explicit coverage map.

### Add More Runtime Features Before Closure

Rejected. Actor lifecycle, adaptive scaling, dynamic enrollment, additional
languages, and concurrency would expand the state space before the first
environment is recursively understood.

### Use A Controller To Stabilize The Proof

Rejected. Product lifecycle commands would conceal whether Cadenza actually
interprets desired state through its own approved primitives and authority.

### Treat Cleanup Or Evidence As Secondary

Rejected. Unowned custody and uninterpretable consequence are system failures,
even when business output happened to be correct.

## Assumptions

- PostgreSQL remains available for successful authority transitions; outage
  behavior remains fail-closed.
- the provisioned Linux/gVisor environment can host at least three Cell
  processes and their contained Chambers.
- TypeScript remains the only production business/meta adapter in Sprint 7.
- current serialized Chamber execution remains unchanged; concurrency is still
  a later optimization pass.
- machine-relative performance thresholds remain separate from correctness.
- existing focused proofs remain admissible evidence only when rerun against
  the final Sprint 7 code and linked from the closure matrix.

## Exit Criteria

- the complete three-Cell lifecycle passes from desired state alone, excluding
  explicit test fault injection and final harness teardown.
- active stem loss recovers to one successor with no stale predecessor affect.
- the successor performs both scale-down and fresh scale-up after takeover.
- remote business execution succeeds before failure and after fresh resupply.
- evidence remains causally interpretable across distribution, custody,
  succession, reconciliation, supply, and execution.
- all loops have one owner, bounded state, explicit retries, and clean shutdown.
- official contract authority, schemas, code, descriptors, roles, docs, and
  tests agree.
- no business definition or context contains deployment, endpoint, credential,
  lease, recovery, or reconciliation machinery.
- no dead or parallel live Sprint 7 authority path remains.
- ordinary suites, strict linting, hostile tests, pressure tests, workspace
  governance, and definitive Linux proofs pass.
- recursive closure finds no issue that should precede Sprint 8 actor lifecycle
  design.

## Work Items After Approval

- [x] Record the approved Sprint 7G decision.
- [x] Resolve the automatic per-Cell evidence-processor placement amendment.
- [x] Implement Sprint 7G.1 combined three-Cell proof harness and pass the
  definitive Linux lifecycle.
- [x] Implement Sprint 7G.2 evidence, failure, and pressure review.
- [x] Implement Sprint 7G.3 recursive Sprint 7 closure review.
- [x] Update the roadmap and move Sprint 7 plans to completed after explicit
  closure approval.
