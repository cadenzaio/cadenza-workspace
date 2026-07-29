# Sprint 10E Operational Interpretation And Stewardship

Date: 2026-07-28

## Status

- State: `done`.
- Parent:
  [Sprint 10 distributed foundation consolidation and hardening](./2026-07-25-distributed-foundation-consolidation-hardening-design.md).
- Prerequisite:
  [Sprint 10D Failure, Custody, And Security Hardening Closure V1](../../../publication/sprint-10d-failure-custody-security-hardening-closure-v1.md).
- Approval received from the user on 2026-07-28:
  `Design approved. Proceed.`
- Decision:
  [Sprint 10E Operational Interpretation And Stewardship](../../../decisions/2026-07-28-sprint-10e-operational-interpretation-stewardship.md).
- Audit:
  [Sprint 10E Operational Interpretation Matrix V1](../../../publication/sprint-10e-operational-interpretation-matrix-v1.md).
- Audit result: four documentation gaps; no diagnostic projection, contract,
  or product-source gap.
- Cold-reader review:
  [Sprint 10E Cold-Reader Review V1](../../../publication/sprint-10e-cold-reader-review-v1.md).
- Closure recommendation:
  [Sprint 10E Operational Interpretation And Stewardship Closure V1](../../../publication/sprint-10e-operational-interpretation-stewardship-closure-v1.md).
- Closure approved by the user on 2026-07-28:
  `Sprint 10E closure approved. Proceed.`
- Active implementation WIP: none.
- Living guidance implemented:
  [operational interpretation](../../../guides/operational-interpretation.md),
  [runtime operator](../../../guides/runtime-operator.md),
  [troubleshooting](../../../guides/troubleshooting.md), and
  [evidence interpretation](../../../guides/evidence-interpretation.md).

## Context

Sprint 10D proved the distributed foundation against ten failure obligations
and three proof tiers. Its strongest operational result is that Cadenza does
not reduce health to process liveness or failure to one generic error. Desired
state, current authority, runtime state, signed observation, retained custody,
and evidence can disagree for legitimate and security-relevant reasons.

The current guides and visual atlas preserve these distinctions, but their
operator-facing explanation is too compressed. A contributor can learn each
state machine from its owning contract, yet still has to reconstruct the
cross-boundary reading order and safe recovery posture from implementation
history and sprint closure records.

Sprint 10E will close that interpretation gap. It will not simplify the system
by merging truthful states. It will give operators and future contributors one
repeatable way to answer:

1. what is desired;
2. what is currently authorized;
3. what is running or materialized;
4. what has been observed, by whom, and for how long it remains current;
5. what remains in custody;
6. what can safely happen next.

## Intended Whole

Cadenza exists to let humans and agents focus on workflows and business logic
while the runtime absorbs deployment, distribution, scale, evidence, and
recovery complexity. That transfer of complexity remains coherent only when
the runtime's internal truth is understandable to its stewards.

Operational interpretation serves the whole when:

- an operator can identify the exact blocked identity and owning stage without
  reading source code;
- a recovery action follows current authority and cannot duplicate uncertain
  affect;
- process liveness, readiness, authority, observation, and custody remain
  distinct;
- evidence explains execution without exposing contexts, callable source,
  credentials, or host-private material;
- repository-local state machines remain authoritative while root guidance
  explains their cross-boundary composition;
- guidance is derived from current contracts, code, tests, and proof failures
  rather than historical intent alone.

False simplification includes:

- one aggregate `healthy` state that hides which source of truth disagrees;
- treating a running process as authorized or ready;
- treating an observation as authority;
- retrying started or uncertain affect on another replica;
- treating `stopped` as proof that all custody is absent;
- presenting a generic error string without the safe identity and owning
  stage needed for diagnosis;
- copying repository-owned state machines into root docs until they drift;
- building the observer UI, CLI, monitoring service, or automation under the
  name of documentation.

## Current Evidence

The design is grounded in:

- the Sprint 10D failure coverage ledger and security review;
- all three clean Sprint 10D proof reports;
- the current Cell, Chamber, reconciliation, evidence-custody, and actor
  lifecycle diagrams;
- the current runtime operator, troubleshooting, evidence interpretation, and
  Sprint 9C operational lifecycle guides;
- Cell supply and restart custody documentation;
- current Cell and Chamber public failure codes;
- historical proof failures involving shared PostgreSQL roles, obsolete
  rootfs protocol content, self-counted cgroups, PostgreSQL restart handling,
  standalone contract fixtures, and artifact-tamper classification.

These sources show that the implementation already preserves the necessary
states. The primary planned change is interpretation and stewardship, not
runtime behavior.

## Design Principles

1. **Six questions, never one status.** Every operational walkthrough answers
   desired, authorized, running, observed, custody, and safe-next-action
   separately.
2. **Authority before observation.** An observation reports what a bounded
   identity saw. It cannot create desired state or authorize affect.
3. **Custody before absence.** No guide may infer absence from a completed
   command, exited process, or expired observation while a resource can still
   be retained.
4. **Affect-aware recovery.** Recovery distinguishes pre-affect rejection,
   bounded unavailability, started execution, uncertain commit, superseded
   authority, and completed affect.
5. **Identity without disclosure.** Diagnostics use stable non-secret
   identities, revisions, generations, epochs, digests, stages, and trace
   references. They exclude credentials, keys, callable source, raw business
   contexts, host objects, and generic commands.
6. **One owner per meaning.** Root guidance composes repository-owned
   contracts; it does not redefine them.
7. **Evidence before advice.** Each recovery statement cites a current
   contract, executable test, proof report, or present code path.
8. **Finding-driven code.** Product source changes are not planned. A missing
   diagnostic field that requires a schema, shared contract, protocol, or
   public API returns to a focused design amendment.

## Operational Interpretation Model

Sprint 10E will create one authoritative cross-boundary guide under
`docs/guides/`. It will define the following lens without introducing new
runtime states:

| Question | Meaning | Must not be confused with |
| --- | --- | --- |
| Desired | The declared outcome the Environment is trying to converge | A process request, assignment claim, or observed process |
| Authorized | The current revision, generation, epoch, lease, grant, route, or policy that may legitimately affect | Desired state alone or stale signed material |
| Running | The process, residency, materialized primitive, or in-flight operation currently held by a runtime owner | Readiness, current authority, or durable completion |
| Observed | A bounded signed or local report tied to an observer and validity interval | Authority or timeless fact |
| Custody | The owner accountable for a process, descriptor, route, actor mutation, evidence batch, or other retained consequence | Liveness or a cleanup command |
| Safe next action | The action allowed by current authority and affect state | Generic retry, substitution, or forced cleanup |

The guide will make disagreements explicit. For example, a supply provider may
hold a running Cell process while placement cannot use it because Cell-signed
readiness is absent. This is not one ambiguous intermediate state; it is a
precise disagreement between running, observed, and authorized truth.

## Failure Interpretation

Operational guidance will classify a block by meaning rather than by transport
symptom alone:

| Class | Affect meaning | Default posture |
| --- | --- | --- |
| Pre-affect rejection | The protected affect did not start | Correct invalid or unauthorized input; retry only if a current contract permits it |
| Bounded unavailability | The provider or transport failed before affect under still-current authority | Retain exact identity and defer within its bound |
| Started | Affect may already be in progress | Do not move work to another identity as if nothing started |
| Outcome uncertain | Commit may have happened but no authoritative receipt returned | Resolve the exact idempotency or mutation identity |
| Superseded | Generation, epoch, lease, route, grant, or revision is no longer current | Fence the stale identity and reconcile from current authority |
| Custody blocked | Required process, evidence, actor, route, or cleanup custody is unresolved | Preserve custody, stop unsafe new affect, and escalate to its owner |
| Completed | Required authority and durable acknowledgement agree | Continue only from the resulting current state |

This table interprets existing contracts. It does not create a universal retry
enum or replace subsystem-specific failure codes.

## Actionable Diagnostic Audit

Sprint 10E will audit the current failure and evidence surfaces for the
information an operator needs. For each selected failure path, the audit will
record:

- safe non-secret operation or resource identity;
- owning subsystem and lifecycle stage;
- relevant revision, generation, epoch, route, mutation, or trace identity;
- whether affect is known not to have started, started, uncertain, or
  completed;
- retained custody owner;
- current retry, resolution, fencing, or escalation posture;
- source that makes the interpretation authoritative.

Existing failure codes, bounded public messages, evidence records, and
authority views should be composed rather than replaced. Free-form messages
are not promoted into a new contract.

If an actionable path lacks enough current information, the finding is
classified as:

- **documentation gap:** the information exists but is not connected;
- **diagnostic projection gap:** existing non-secret state is not exposed at
  the owning boundary;
- **contract gap:** the required identity or affect state does not exist in
  current authority or evidence.

Documentation gaps remain in Sprint 10E. A diagnostic projection gap may
receive a narrow repository-local repair only when it preserves all current
contracts and stays below the complexity gate. Contract gaps stop for a design
amendment.

## Required Walkthroughs

The final guidance must let a cold reader work through these eight current
scenarios:

1. desired, authorized, running, and observed state disagree;
2. a failure occurs before affect versus after execution starts or becomes
   uncertain;
3. authority is stale, temporarily unavailable, or forbidden to the caller's
   role;
4. a Cell supply directive is pending while process custody survives an
   outage, provider replacement requires a fresh generation, or drain waits on
   exact local custody;
5. a Chamber selects one route member, the source Cell validates that exact
   selection, and a changed route epoch forbids substitution;
6. an actor owner is lost around a mutation commit, exact outcome resolution
   precedes reassignment, and relinquishment fences the old epoch;
7. evidence admission pressure or ledger outage retains bounded custody and
   can fail closed after business code starts;
8. draining, stopped, dormant, absent, and complete cleanup remain distinct
   across process, route, actor, evidence, container, cgroup, filesystem,
   authority, and credential custody.

Each walkthrough will name the owning source of truth, observable evidence,
forbidden shortcut, bounded recovery path, escalation boundary, and closure
condition.

## Documentation Shape

### New Authoritative Guide

Create `docs/guides/operational-interpretation.md` as the cross-boundary entry
point. It will contain:

- the six-question lens;
- affect-aware failure classification;
- one compact subsystem matrix;
- the eight walkthroughs;
- escalation ownership;
- residual operational risks and operator responsibilities;
- links to owning contracts, diagrams, proof evidence, and repo-local docs.

### Existing Guides

- `docs/guides/runtime-operator.md` will become the concise operating sequence
  and link into the new interpretation model.
- `docs/guides/troubleshooting.md` will become a stage-first decision path
  based on actual proof and CI failures.
- `docs/guides/evidence-interpretation.md` will distinguish execution,
  observation, durable custody, and what evidence cannot prove.
- `docs/guides/glossary.md`, the documentation index, and learning path will be
  updated only where navigation or definitions require it.
- `docs/publication/sprint-9c-operational-lifecycle-v1.md` remains historical
  closure evidence. Current guidance may link to it but will not rewrite it as
  the living authority.

### Visual Atlas

No new diagram is planned. The current lifecycle diagrams already preserve the
relevant state and recovery distinctions. Sprint 10E will:

- verify their labels and evidence links against current code and contracts;
- repair a source and regenerate its SVG only if it is materially stale;
- update catalog metadata only for diagrams actually revalidated;
- avoid a new aggregate-health visual that would collapse independent state
  axes.

An additional diagram requires a finding that cannot be explained clearly by
the existing atlas and a short design amendment identifying its unique
question.

## Repository Ownership

- Workspace root owns the cross-repository interpretation model, navigation,
  atlas stewardship, troubleshooting composition, residual-risk summary, and
  Sprint 10E closure.
- `cadenza-environment` owns durable authority, reconciliation, supply,
  evidence-ledger, and actor-persistence meanings.
- `cadenza-cell` owns trusted-host process, containment, route validation,
  transport, provider, local evidence, and cleanup meanings.
- `cadenza-chamber` owns contained lifecycle, selection, adapter,
  materialization, execution, and runtime-evidence meanings.
- `cadenza` owns graph, execution, composition, and evidence semantics.
- Python, Elixir, C#, and the reference system are evidence sources or
  consumers only; no change is planned.

Root documentation will link to repo-local details rather than copying
commands or redefining local contracts. Any child-repository documentation
repair is committed separately in that repository.

## Implementation Sequence

1. Freeze the clean Sprint 10D source identities and inventory current
   operator-facing states, diagnostics, and evidence fields.
2. Build a source-backed interpretation matrix for the eight walkthroughs.
3. Classify every missing connection as a documentation, diagnostic
   projection, or contract gap.
4. Stop for amendment if any contract, schema, protocol, public API,
   architecture, dependency, or substantial product change is required.
5. Write the authoritative operational interpretation guide.
6. Repair runtime-operator, troubleshooting, evidence, glossary, navigation,
   and repo-local docs where the matrix proves drift or omission.
7. Validate existing atlas views; repair and rerender only materially stale
   diagrams.
8. Perform a cold-reader walkthrough against all eight scenarios and record
   exact source evidence, retained limitations, and operator
   responsibilities.
9. Publish a Sprint 10E closure and prepare the Sprint 10F design gate.

## Stop Conditions

Implementation stops for a focused design decision when:

- a missing identity or affect state requires a schema, shared contract,
  protocol, or public API change;
- a diagnostic repair risks exposing credentials, keys, callable source, raw
  contexts, host-private material, or generic command execution;
- guidance would make started or uncertain work automatically retryable;
- an operational shortcut would weaken authority, containment, evidence,
  generation, epoch, route, or cleanup fencing;
- a product repair exceeds roughly 200 lines, changes architecture, or adds an
  external dependency;
- a proposed operator action depends on an unsupported installer, service
  manager, remote database transport, key-rotation system, or production SLA;
- a current diagram or guide contradicts executable behavior and the owning
  contract is itself ambiguous;
- the work begins to implement observer UI, CLI, monitoring, plugins, Memory,
  generated expansion, or managed-product functionality.

Small documentation or diagnostic-projection findings that preserve current
contracts may continue after being recorded in the plan. Product changes
remain separate signed and DCO-compliant commits in their owning repository.

## Validation

Planned root checks:

```bash
./scripts/workspace-snapshot.sh
./scripts/check-agent-harness.sh
node scripts/check-contract-snapshots.mjs
node scripts/check-public-documentation-links.mjs
node scripts/validate-architecture-atlas.mjs
node scripts/prepare-public-workspace.mjs --check
node scripts/run-proof.mjs fast
```

If an atlas source changes:

```bash
./scripts/render-architecture-atlas.sh
```

Any affected child repository must run its repo-native formatting,
documentation, lint, typecheck, and focused test commands. A product repair
must also run the complete affected repository suite. Sprint 10D's clean
complete and privileged reports remain behavioral evidence unless source
changes invalidate them; Sprint 10F owns the next unconditional full and
privileged rerun.

## Acceptance Criteria

- one current guide defines the six-question operational lens;
- all eight walkthroughs identify desired, authorized, running, observed,
  custody, and safe-next-action truth where applicable;
- every recovery path identifies its owning stage, current authority, affect
  state, forbidden shortcut, escalation boundary, and closure condition;
- actionable examples use stable non-secret identities and cite current
  sources;
- stale, unavailable, forbidden, started, uncertain, superseded,
  custody-blocked, and completed outcomes remain distinct;
- root guidance composes rather than duplicates repository-owned contracts;
- troubleshooting incorporates actual proof and CI failure lessons;
- atlas sources, projections, metadata, and evidence links agree for every
  affected diagram;
- operator responsibilities and unsupported production claims are explicit;
- no observer UI, CLI, feature expansion, advanced-security feature, or hidden
  runtime contract enters the sprint;
- a cold reader can complete all eight walkthroughs without implementation
  history;
- validation passes and Sprint 10F receives exact remaining risks.

## Non-Goals

- changing runtime semantics, state machines, retry policy, or health
  contracts;
- introducing a universal diagnostic or retry protocol;
- observer UI, CLI, monitoring service, alerting platform, or production
  installer;
- remote PostgreSQL TLS, key automation, secret brokers, or hostile
  multi-tenant admission;
- plugins, Memory, generated expansion, or managed-product work;
- concurrency or performance optimization;
- repeating the complete or privileged proof without an invalidating source
  change;
- claiming production readiness, an SLA, or independent operational review.

## Risks

- **False simplification:** a compact runbook can erase meaningful
  disagreement. Mitigation: retain the six independent questions in every
  walkthrough.
- **Documentation drift:** root guidance can become a second contract.
  Mitigation: cite owning sources and avoid copying complete state machines or
  repo-local commands.
- **Unsafe retry advice:** availability language can hide possible affect.
  Mitigation: classify affect state before recommending any retry.
- **Sensitive disclosure:** useful diagnostics can tempt broad payload
  exposure. Mitigation: use the existing disclosure boundary and list excluded
  data explicitly.
- **Documentation-only masking:** a real diagnostic or contract gap could be
  narrated away. Mitigation: classify gaps and stop at the complexity gate
  where implementation is required.
- **Unbounded scope:** every historical failure could become a runbook case.
  Mitigation: use the eight Sprint 10D handoff scenarios and current supported
  deployment boundary.

## Migration Strategy

This sprint changes guidance, not runtime contracts. Current links will be
updated in place, historical closure evidence will remain immutable, and the
new guide will become the living cross-boundary interpretation entry point.

If a narrow diagnostic projection changes product source, its repository owns
the commit and validation. No compatibility shim is required for the new major
version, but no such change may occur without satisfying the stop conditions
and contract governance.

## Alternatives

1. **Create one aggregate health model.** Rejected because it would hide
   security-relevant disagreement between authority, runtime, observation, and
   custody.
2. **Document each repository independently.** Rejected because the unresolved
   problem is interpretation across repository and runtime boundaries.
3. **Build the observer UI now.** Rejected because a UI would encode an
   interpretation model before that model is explicit and reviewed.
4. **Introduce a universal structured diagnostic contract.** Rejected as
   premature. Current failures and evidence must first be audited for a
   concrete gap.
5. **Repeat all system proofs as documentation validation.** Rejected because
   unchanged source is already bound to clean Sprint 10D proof; Sprint 10F owns
   unconditional final repetition.
6. **Turn every historical failure into a runbook branch.** Rejected because
   it would preserve implementation history rather than current operational
   meaning.

## Coherence Review

- **Intent:** clearer stewardship protects the goal that application authors
  do not absorb infrastructure coordination.
- **Identity:** every diagnosis remains tied to exact authority, generation,
  epoch, route, actor, evidence, process, and trace identities.
- **State:** independent sources of truth are made comparable without being
  merged.
- **Affect:** recovery begins by deciding whether consequential work did not
  start, started, became uncertain, or completed.
- **Relationships:** root guidance composes Environment, Cell, Chamber, and
  Core ownership without changing their direction of authority.
- **Interpretation:** evidence and diagnostics connect a blocked stage to the
  safe next action and explicit limits of knowledge.
- **Shared fields:** cross-boundary terms receive one living steward while
  repository contracts remain authoritative.
- **Time:** revisions, leases, generations, epochs, deadlines, mutation
  identities, and validity intervals prevent stale truth from appearing
  current.
- **Security:** interpretation never widens authority, weakens fail-closed
  posture, or discloses protected runtime material.
- **Fragmentation control:** one lens and eight bounded walkthroughs replace
  scattered historical reconstruction without inventing a parallel runtime
  model.

## Assumptions

- The current implementation contains the authority and evidence identities
  needed for the eight walkthroughs; the diagnostic audit must verify this
  before documentation claims closure.
- Repository-local contracts and docs remain authoritative for local state and
  commands; the workspace owns only cross-boundary interpretation.
- The user accepts a documentation-first sprint and the explicit amendment
  gate for any missing runtime diagnostic or contract surface by approving
  this design.
