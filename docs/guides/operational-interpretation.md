# Cadenza Operational Interpretation Guide

## Purpose

Cadenza does not have one global health value. Operational truth is the
agreement or explicit disagreement between authority, runtime state,
observation, and custody.

Use this guide to answer six questions about one exact identity:

1. What is desired?
2. What is authorized now?
3. What is running or materialized?
4. What has been observed, by whom, and until when is it current?
5. What remains in custody?
6. What can safely happen next?

The source-backed audit is
[Sprint 10E Operational Interpretation Matrix V1](../publication/sprint-10e-operational-interpretation-matrix-v1.md).
Repository contracts remain authoritative for local states and operations.
This guide composes those meanings across boundaries.

This is not an access grant. Read authority and evidence only through the
purpose-specific interfaces allowed to the operator or deployment. Do not use
broad database, host, or credential access to bypass a failed boundary.

## Six Sources Of Truth

| Question | Meaning | Common false inference |
| --- | --- | --- |
| Desired | The declared outcome the Environment should converge | Desired means assigned or started |
| Authorized | The current revision, generation, epoch, lease, grant, route, policy, or receipt that may affect | Previously valid means still valid |
| Running | A process, residency, materialized primitive, or operation held by a runtime owner | Running means ready or authorized |
| Observed | A report made by an identified observer under a validity boundary | Observed means authoritative or timeless |
| Custody | Accountable possession of a retained consequence until valid transfer or release | A command returned, so custody is empty |
| Safe next action | The action permitted by current authority and known affect state | Every failure can be retried |

Do not force an inapplicable question to have a value. For example, a rejected
pre-affect request may have no running state or retained business custody.

## Investigation Order

1. Name the exact affected identity and owning subsystem.
2. Read current desired state and its revision, if the concern is convergent.
3. Read the current authority that could permit the next affect.
4. Read runtime state without treating liveness as readiness.
5. Check observation identity, signature or digest, time, generation, and
   expiry.
6. Inventory every custody owner named by the operation.
7. Locate the first stage where these sources disagree.
8. Classify affect before choosing recovery.
9. Act only through the stage that owns the block.
10. Verify the resulting authority, observation, evidence, and custody state.

Later-stage symptoms do not override an earlier-stage block. A route cannot
repair missing residency authority, and a live Chamber cannot repair an
expired Cell generation.

## Classify Affect First

| Class | Meaning | Safe posture |
| --- | --- | --- |
| Pre-affect rejection | Protected affect is known not to have started | Correct the request or authority. Retry only when the owning contract says the failure is retryable. |
| Bounded unavailability | Provider or transport failed before affect under still-current authority | Retain the exact identity and defer within the declared bound. |
| Started | Affect may be in progress | Do not move the work to another identity as if nothing started. |
| Outcome uncertain | Commit may have happened without an authoritative receipt | Resolve the exact idempotency, distribution, mutation, or attempt identity. |
| Superseded | Revision, generation, epoch, lease, route, grant, or assignment is no longer current | Fence the stale identity and reconcile from current authority. |
| Custody blocked | A required process, actor, route, evidence, or cleanup owner has not released or transferred custody | Preserve custody, stop unsafe new affect, and escalate to the owner. |
| Completed | Current authority and required durable acknowledgement agree | Continue from the resulting current state. |

Outcome kind alone is insufficient. In particular, `transport_failed` may
carry `execution_started: false` or `execution_started: true`. Read the started
state and durable evidence before deciding whether another attempt is safe.

## Read Each Subsystem

| Subsystem | Desired or authorized truth | Running or observed truth | Custody owner | Safe next action when they disagree |
| --- | --- | --- | --- | --- |
| Environment bootstrap | Bootstrap state, trust root, handoff, operational transition | Committed transition evidence | Exclusive administrative or operational authority | Complete or repair the exact transition; never revive retired bootstrap authority |
| Stem and reconciliation | Desired-state revision, lease epoch, snapshot, plan, action | Stem result, blocked action, reason, unsatisfied demand | Current stem owner and exact action identity | Resolve unknown action outcome or replan only after authority changes |
| Supply | Directive key and epoch, provider/profile revision, target disposition | Provider generation and supply observation | Supply provider for child process; Cell for its generation | Retain exact child on bounded observation failure; replace with fresh generations after custody ends |
| Cell | Enrollment, current generation, convergence projection | Signed lifecycle observation and local inventory | Cell for Chamber, route, actor, transport, and evidence custody | Reconcile current projection or drain in dependency order |
| Chamber | Activation grant, image, assignment, projection | Lifecycle, adapter, readiness, and execution outcome | Cell owns process; Chamber owns active execution | Replace from authority after failure; never reactivate a failed or stopped Chamber |
| Route | Route group, exact members, route epoch | Projection acknowledgement and distribution evidence | Chamber owns selection state; Cell owns validation and distribution identity | Reject stale selection; never substitute a different member |
| Actor | Placement, assignment epoch, owner residency, expected state version | Actor lifecycle evidence and durable mutation outcome | Environment owns committed state; Cell and Chamber own residency and in-flight work | Resolve exact mutation outcome, advance epoch after owner loss, hydrate durable state, fence stale owner |
| Evidence | Image evidence policy, report identity, claim and receipt authority | Runtime report, capture, journal, batch, ledger receipt, local acknowledgement | Chamber, then Cell, then ledger, with explicit transfer | Stop new affect under pressure; retain unknown commits; compact only acknowledged custody |

## Current Authority Map

Use this guide for composition and the owning source for exact fields, states,
and operations:

- Environment bootstrap and role boundaries:
  [environment bootstrap contract](../contracts/environment-bootstrap/v0.md)
  and [authority security contract](../contracts/authority-security/v0.md).
- Reconciliation, supply, and Cell lifecycle:
  [Environment reconciliation contracts](../../cadenza-environment/contracts/reconciliation/v0/README.md),
  [Cell supply supervisor](../../cadenza-cell/docs/cell-supply-supervisor.md),
  [Cell lifecycle view](../architecture/atlas/rendered/15-cell-lifecycle.svg),
  and [reconciliation action lifecycle](../architecture/atlas/rendered/17-reconciliation-action-lifecycle.svg).
- Chamber activation and execution:
  [Chamber lifecycle view](../architecture/atlas/rendered/16-chamber-lifecycle.svg)
  and [language runtime contract](../cadenza-language-runtime-contract.md).
- Selection and distribution:
  [distribution contract](../contracts/distribution/v0.md),
  [Cell peer transport contract](../contracts/cell-peer-transport/v0.md), and
  [distribution view](../architecture/atlas/rendered/08-distribution-path.svg).
- Actors:
  [actor lifecycle view](../architecture/atlas/rendered/11-actor-lifecycle.svg)
  and [actor recovery view](../architecture/atlas/rendered/20-actor-write-failure-recovery.svg).
- Evidence:
  [execution evidence contract](../contracts/execution-evidence/v0.md),
  [evidence relationship view](../architecture/atlas/rendered/09-execution-evidence.svg),
  and [evidence custody lifecycle](../architecture/atlas/rendered/18-evidence-custody-lifecycle.svg).

The complete field-by-field evidence trail for the eight walkthroughs remains
in the [Sprint 10E interpretation matrix](../publication/sprint-10e-operational-interpretation-matrix-v1.md).

## Walkthrough 1: Running Does Not Mean Ready

Example: desired replicas are two, the supply provider reports a running Cell
process, but no current Cell-signed `ready` generation exists.

- Desired: two replicas under one desired-state revision.
- Authorized: assignment and current unexpired Cell generation are required.
- Running: the provider holds the Cell process.
- Observed: provider `running` exists; Cell `ready` is missing or expired.
- Custody: provider retains the process; the Cell may still hold local startup
  resources.
- Safe next action: inspect the Cell lifecycle stage and current generation
  authority. Do not publish member readiness or route the Cell based on
  provider liveness.

The same rule applies to Chamber readiness: image preparation, adapter
startup, and process existence are not a ready residency until activation,
projection acknowledgement, and evidence custody agree.

## Walkthrough 2: Retry Depends On Started State

Example: a delegation returns `transport_failed`.

1. Identify request, trace, selected route member, distribution execution, and
   transport attempt where present.
2. Read `execution_started`.
3. If false, verify that the failure class is explicitly retryable and that
   route, assignment, generation, and deadline remain current.
4. If true, do not create a fresh execution elsewhere. Read source and target
   distribution evidence and resolve the same idempotency identity.
5. If the target recorded completed state, replay the stored substrate outcome.
6. If target state is in progress or indeterminate, retain uncertainty rather
   than executing again.

Evidence custody loss follows the same boundary. Loss before `task.started` can
be a closed retryable rejection. Loss after start is an integrity failure with
possible business affect.

## Walkthrough 3: Stale Is Not Unavailable

Use three separate interpretations:

- **Stale:** a newer authority revision, generation, epoch, assignment, route,
  lease, grant, or deadline supersedes the attempt. Fence it and reread current
  authority.
- **Unavailable:** a purpose-specific provider or transport could not produce
  a semantic decision. Defer only where the owning operation declares bounded
  retry.
- **Forbidden:** the connected role, policy subject, or capability is not
  permitted to affect. Correct the authority relationship; do not widen the
  credential or retry it as an outage.

Connection or authentication loss before a purpose-specific provider is
established may be normalized as provider unavailability. A successful
provider call that returns semantic authorization denial remains forbidden.

## Walkthrough 4: Supply Restart Never Adopts A Child

For one supply-managed Cell, correlate:

- provider key, provider generation, and generation epoch;
- profile key, profile revision, and launch-profile digest;
- directive key, directive epoch, and target disposition;
- Cell key and Cell generation;
- observation attempt, state, time, expiry, and failure reason.

The provider records local process custody before attempting its `running`
observation. If observation authority is unavailable, it retains and retries
the exact signed observation; it does not spawn a duplicate.

After provider loss, parent-death and control-channel rules end predecessor
custody. A replacement provider creates a fresh provider generation and starts
a fresh Cell generation only after the prior generation stops or expires. It
never adopts an unowned process.

During release, `CustodyPending` is a bounded deferral only for the exact
provider generation, directive, and epoch. The Cell must settle members,
pending activation, prepared Chambers, routes, actors, and evidence before
claiming stopped. The provider may then observe the profile as dormant.

## Walkthrough 5: The Cell Does Not Load Balance Again

The Chamber selects one candidate from its applied route projection. That
selection includes the route group and epoch plus the exact route member.

The source Cell:

1. validates the exact selected member against current local authority;
2. checks assignment, Cell generation, Chamber, image, responsibility, lane,
   route epoch, deadline, and caller identity;
3. creates one distribution execution identity before local or remote affect;
4. routes to that member or rejects;
5. never substitutes another member.

If the route changed, the old selection is stale. A new candidate may be
selected only as new pre-affect work under a current projection. Started or
uncertain work remains attached to its original distribution identity.

## Walkthrough 6: Actor Candidate State Is Not Durable State

For one actor write, correlate:

- actor object and state-key digest;
- actor assignment epoch and owner residency;
- trace, graph, and task execution;
- stable mutation key;
- expected and committed state versions;
- owner Chamber, image, and endpoint provenance;
- outcome and failure class.

The Chamber produces candidate state. It is not authoritative before the
Environment returns the durable mutation receipt.

If the response is lost after possible commit, the Cell uses its
purpose-specific outcome authority to resolve the same mutation key as
`committed` or `not_found`. It must not resubmit different content under that
identity.

If the owner is lost, a successor advances the assignment epoch and hydrates
the current committed state. Hydration establishes the durable state from
which the successor continues; it does not invent a successful response for an
unresolved caller operation. The stale owner cannot commit under the old
epoch. Drain relinquishes owner assignments only after accepted mutations
settle or resolve.

## Walkthrough 7: Evidence Has Several Custody Transfers

Read the evidence path in order:

1. Core runtime report identifies execution meaning.
2. Chamber validates the report and creates a commitment-only capture.
3. Cell appends, synchronizes, and returns an exact `cell_durable` receipt.
4. Cell seals signed journal segments into a bounded batch.
5. Evidence processor claims the oldest unacknowledged batch.
6. Environment ledger commits the exact manifest, entries, and attempt chain.
7. Cell verifies and durably acknowledges the exact ledger receipt.
8. Cell may compact only the oldest contiguous acknowledged prefix.

A runtime report is not durable custody. A ledger receipt that the Cell has
not acknowledged still leaves local custody unresolved. A lost ledger response
after possible commit retains claim and processing-attempt authority until the
exact outcome resolves.

At normal high-water, Cell rejects new execution before affect. Terminal
reserve closes evidence for work already admitted; it is not ordinary
capacity. Evidence failure after business execution starts can prevent a
successful response without proving that business affect did not happen.

## Walkthrough 8: Stopped Is Not Globally Clean

Shutdown closes custody in dependency order:

1. withdraw desired ordinary replicas;
2. remove routes to retiring members;
3. stop new actor work and settle accepted mutations;
4. drain and stop Chambers;
5. seal, process, and acknowledge evidence;
6. withdraw the per-Cell evidence processor;
7. move supply-managed Cells through draining, stopped, and dormant;
8. measure process, descriptor, container, cgroup, bundle, socket, filesystem,
   authority, cluster, and credential cleanup named by the claim.

Interpret the terms narrowly:

- `draining`: no new eligible work, but declared custody may remain;
- `stopped`: one lifecycle owner completed its stop boundary;
- `dormant`: a supply profile names no active Cell generation;
- absent member: no local member record remains after stopped residency;
- clean: every resource named by the cleanup claim is measured absent.

An exited process is not proof that transferred descriptors, a runsc
container, a launch bundle, local evidence, or durable authority is absent.

## Escalation Ownership

| Blocked stage | Owning boundary | Preserve before escalation |
| --- | --- | --- |
| Bootstrap or durable authority | Environment administrator or exact operation owner | request/idempotency identity, revisions, transition evidence |
| Reconciliation or stem | Current stem lease owner and Environment authority | lease epoch, snapshot/plan digest, action key, latest outcome |
| Supply | Supply provider and Cell lifecycle | provider generation, directive epoch, Cell generation, local process custody |
| Containment or launch | Cell and root-owned launcher boundary | request, plan and artifact digests, descriptor/process custody, failure code |
| Chamber materialization or execution | Chamber under Cell supervision | request, image, adapter phase, started state, bounded stderr or failure |
| Routing or peer transport | Source Cell, then target Cell after acceptance | selected member, route epoch, distribution and transport identities |
| Actor | Environment actor authority, Cell residency, Chamber execution | assignment epoch, mutation key, state versions, lifecycle evidence |
| Evidence | Chamber capture, Cell journal/processor, Environment ledger | report sequence, custody sequence, batch, attempt, receipt identities |
| Cleanup | The owner of each retained resource | exact resource inventory and last valid custody transfer |

Escalation does not authorize a higher layer to perform the lower layer's
operation. It identifies who must restore, fence, resolve, or release the
blocked identity.

## Proof And Runtime Failures

Before blaming runtime behavior, verify the proving environment:

- source commits and manifest digest match;
- PostgreSQL authority came from a fresh isolated cluster;
- rootfs and component digests match measured inputs;
- the enclosing service is outside the cleanup namespace being measured;
- standalone repositories do not depend on ambient parent fixtures;
- process stderr and exit state were retained;
- an increased timeout did not merely expose a different blocked state.

The [troubleshooting guide](./troubleshooting.md) records the actual proof
failures behind these checks. A proof-harness defect does not weaken runtime
authority, and a runtime fail-closed result must not be dismissed as a harness
flake without evidence.

## Disclosure Boundary

Useful operational evidence may expose stable keys, revisions, generations,
epochs, digests, bounded stages, failure classes, and trace references.

Do not add:

- raw business contexts or actor state;
- callable source;
- credentials, private keys, tokens, or unrestricted endpoints;
- host objects, descriptors, environment values, or generic commands;
- full stack traces from contained business code.

Actor state keys are represented by digest outside the invocation path.
Aggregate actor drain evidence deliberately omits per-key identities.

## Operator Responsibilities And Limits

Operators must preserve evidence and failure records, maintain supported host
and key assumptions, distinguish semantic denial from unavailability, and
avoid forcefully bypassing authority, custody, containment, or recovery.

Current limits remain:

- no production installer, support SLA, observer UI, CLI, or alerting service;
- local-only PostgreSQL transport for Cell;
- no automated key rotation or secret broker;
- no aggregate hostile-tenant admission;
- abrupt machine loss can lose local evidence not transferred elsewhere;
- TypeScript is the only implemented Chamber language adapter;
- Chamber business execution remains serialized;
- evidence proves execution structure and integrity, not business truth.

See [supported deployment assumptions](../security/supported-deployment-assumptions-v1.md)
and [known security limitations](../security/known-security-limitations-v1.md).
