# Cadenza Architecture Atlas Catalog

This catalog is generated from `manifest.json`. Each entry is an interpretive
contract for one canonical visual, not a decorative caption.

## The Intended Whole

- **Audience:** all readers.
- **Question:** What complexity should an application author see, and where does the rest go?
- **Scope:** The authoring experience and the governed substrate that preserves it.
- **Intentionally omits:** runtime protocols, database tables, provider-specific infrastructure.
- **Identities:** human or agent author, workflow, business task, Cadenza substrate.
- **States:** authored, governed, executing, interpretable.
- **Affects:** authoring, coordination, runtime support, evidence feedback.
- **Boundaries:** business logic to runtime substrate.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/01-intended-whole.svg) and [canonical Mermaid source](./diagrams/01-intended-whole.mmd).
- **Evidence:** [docs/cadenza-intended-whole.md](../../cadenza-intended-whole.md), [docs/publication/sprint-9c-agent-authoring-trial-v1.md](../../publication/sprint-9c-agent-authoring-trial-v1.md).

## Repository And Contract Ownership

- **Audience:** contributors, release maintainers.
- **Question:** Which repository owns each meaning, runtime boundary, and consumer direction?
- **Scope:** Official source repositories, cross-repository contract authority, and the reference consumer.
- **Intentionally omits:** legacy repositories, managed product, file-level modules.
- **Identities:** workspace governance, language cores, Environment, Chamber, Cell, reference system.
- **States:** authority, translation, runtime consumption, proof consumption.
- **Affects:** contract publication, conformance, runtime integration, outside-in proof.
- **Boundaries:** semantic authority, durable authority, runtime substrate, consumer.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/02-repository-contract-ownership.svg) and [canonical Mermaid source](./diagrams/02-repository-contract-ownership.mmd).
- **Evidence:** [contracts.config.json](../../../contracts.config.json), [docs/architecture.md](../../architecture.md), [docs/publication/sprint-9a-final-publication-boundary-gate-v2.md](../../publication/sprint-9a-final-publication-boundary-gate-v2.md).

## System Planes

- **Audience:** application authors, runtime contributors, operators.
- **Question:** How do semantic definition, durable authority, runtime execution, business affect, and evidence remain distinct?
- **Scope:** The five cooperating planes and their legitimate directional affect.
- **Intentionally omits:** individual processes, protocol fields, deployment topology.
- **Identities:** definition plane, authority plane, runtime plane, business-affect plane, evidence plane.
- **States:** declared, authorized, materialized, affected, interpreted.
- **Affects:** definition, authorization, execution, business consequence, observation.
- **Boundaries:** authority crossing, runtime crossing, evidence disclosure.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/03-system-planes.svg) and [canonical Mermaid source](./diagrams/03-system-planes.mmd).
- **Evidence:** [docs/architecture.md](../../architecture.md), [docs/security/cadenza-security-model-v1.md](../../security/cadenza-security-model-v1.md), [docs/contracts/execution-evidence/v0.md](../../contracts/execution-evidence/v0.md).

## Definition To Execution

- **Audience:** application authors, runtime contributors, security reviewers.
- **Question:** How does serialized callable authority become a running primitive without core evaluating source?
- **Scope:** Authority selection, Chamber admission, controlled callable materialization, core primitive materialization, and execution.
- **Intentionally omits:** placement planning, language-specific compiler internals, business provider calls.
- **Identities:** durable definition, Cell, Chamber, language adapter, core runtime, task.
- **States:** serialized, authorized, contained, callable, materialized, executed.
- **Affects:** admission, callable compilation, primitive creation, task execution.
- **Boundaries:** authority to Cell, Cell to sandbox, adapter to core.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/04-definition-to-execution.svg) and [canonical Mermaid source](./diagrams/04-definition-to-execution.mmd).
- **Evidence:** [docs/decisions/2026-07-11-callable-materialization-boundary.md](../../decisions/2026-07-11-callable-materialization-boundary.md), [docs/cadenza-language-runtime-contract.md](../../cadenza-language-runtime-contract.md), [cadenza-chamber/contracts/v0.md](../../../cadenza-chamber/contracts/v0.md).

## Environment Bootstrap

- **Audience:** operators, security reviewers, Environment contributors.
- **Question:** How does a new environment move from no authority to operational authority without retaining bootstrap power?
- **Scope:** Genesis, root establishment, seed application, handoff, root retirement, and operational activation.
- **Intentionally omits:** migration SQL, provider implementation, ordinary runtime scaling.
- **Identities:** environment, genesis authority, trust root, first Cell, authority-access slice.
- **States:** uninitialized, genesis, rooted, seeded, handoff-ready, operational, failed.
- **Affects:** authority creation, trust establishment, handoff, retirement, operational transition.
- **Boundaries:** bootstrap principal, retired trust root, operational authority.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/05-environment-bootstrap.svg) and [canonical Mermaid source](./diagrams/05-environment-bootstrap.mmd).
- **Evidence:** [docs/contracts/environment-bootstrap/v0.md](../../contracts/environment-bootstrap/v0.md), [cadenza-environment/contracts/environment-bootstrap/README.md](../../../cadenza-environment/contracts/environment-bootstrap/README.md).

## Runtime Topology

- **Audience:** operators, runtime contributors.
- **Question:** Which runtime identities exist, where do they execute, and which boundaries do they cross?
- **Scope:** One environment with authority, stem, supply, two Cells, contained Chambers, adapters, and authored logic.
- **Intentionally omits:** cloud provider topology, load balancers, managed-product control.
- **Identities:** PostgreSQL authority, stem, supply supervisor, Cell, Chamber, adapter, business logic.
- **States:** desired, planned, resident, ready, executing, observed.
- **Affects:** reconciliation, supply, containment, routing, execution, evidence.
- **Boundaries:** durable authority, host trust, sandbox, peer transport.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/06-runtime-topology.svg) and [canonical Mermaid source](./diagrams/06-runtime-topology.mmd).
- **Evidence:** [docs/architecture.md](../../architecture.md), [docs/contracts/local-orchestration/v0.md](../../contracts/local-orchestration/v0.md), [docs/contracts/distribution/v0.md](../../contracts/distribution/v0.md).

## Graph Behavior And Result Composition

- **Audience:** application authors, core contributors.
- **Question:** How do tasks coordinate, detach, answer inquiries, and produce deterministic results or explicit conflicts?
- **Scope:** A local graph run with relationships, a detached signal, an inquiry response, contribution policy, and conclusion.
- **Intentionally omits:** distributed routing, runtime placement, evidence storage.
- **Identities:** intent, task, relationship, signal, terminal contribution, graph conclusion.
- **States:** requested, running, detached, terminal, completed, composition-failed.
- **Affects:** task succession, detached coordination, result contribution, conflict detection.
- **Boundaries:** graph completion, detached work, result composition.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/07-graph-behavior.svg) and [canonical Mermaid source](./diagrams/07-graph-behavior.mmd).
- **Evidence:** [docs/contracts/graph-conclusion/v0.md](../../contracts/graph-conclusion/v0.md), [cadenza/tests/unit/graph-conclusion.test.ts](../../../cadenza/tests/unit/graph-conclusion.test.ts), [cadenza/tests/unit/inquiry-broker.test.ts](../../../cadenza/tests/unit/inquiry-broker.test.ts).

## Local And Remote Distribution Path

- **Audience:** runtime contributors, security reviewers, operators.
- **Question:** How does one primitive request reach an exact local or remote Chamber and fail closed on stale authority?
- **Scope:** Route interpretation, peer authentication, generation verification, target ingress, continuation, and rejection.
- **Intentionally omits:** placement planning, provider-specific networking, business result shape.
- **Identities:** source Chamber, source Cell, route authority, target Cell, target Chamber.
- **States:** selected, verified, started, completed, stale-rejected.
- **Affects:** route selection, peer delegation, primitive ingress, result continuation.
- **Boundaries:** Chamber to Cell, Cell to Cell TLS, Cell to Chamber.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/08-distribution-path.svg) and [canonical Mermaid source](./diagrams/08-distribution-path.mmd).
- **Evidence:** [docs/contracts/cell-peer-transport/v0.md](../../contracts/cell-peer-transport/v0.md), [cadenza-cell/tests/peer_transport.rs](../../../cadenza-cell/tests/peer_transport.rs), [cadenza-cell/tests/orchestrator.rs](../../../cadenza-cell/tests/orchestrator.rs).

## Execution Evidence And Trace Relationships

- **Audience:** operators, application authors, evidence contributors.
- **Question:** How are local work, graph runs, detached continuations, distribution, transport, custody, and durable interpretation related without exposing business context?
- **Scope:** Evidence identity layers from trace through durable ledger processing.
- **Intentionally omits:** observer UI, raw context, provider logs.
- **Identities:** trace, graph execution, task or signal execution, distribution execution, transport attempt, custody batch, ledger record.
- **States:** started, completed, failed, custodied, processed, interpretable.
- **Affects:** causal linkage, commitment, custody, normalization, projection.
- **Boundaries:** runtime capture, Cell journal, durable ledger, disclosure.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/09-execution-evidence.svg) and [canonical Mermaid source](./diagrams/09-execution-evidence.mmd).
- **Evidence:** [docs/contracts/execution-evidence/v0.md](../../contracts/execution-evidence/v0.md), [docs/contracts/execution-evidence/system-closure-v0.md](../../contracts/execution-evidence/system-closure-v0.md), [cadenza-cell/docs/execution-evidence-ledger-processing-closure-2026-07-17.md](../../../cadenza-cell/docs/execution-evidence-ledger-processing-closure-2026-07-17.md).

## Scale And Reconciliation

- **Audience:** operators, runtime contributors.
- **Question:** How does desired state become fenced runtime change without confusing intent, action authority, observation, and readiness?
- **Scope:** Desired state, singleton stem lease, canonical plan, exact actions, supply, Cell convergence, observations, and succession.
- **Intentionally omits:** cloud autoscaler APIs, cost policy, concurrent Chamber execution.
- **Identities:** desired state, stem lease, reconciliation plan, action, supply directive, Cell, Chamber observation.
- **States:** desired, planned, authorized, applied, observed, ready, superseded.
- **Affects:** planning, action issuance, capacity supply, local convergence, observation feedback.
- **Boundaries:** singleton planning, action capability, provider custody, Cell generation.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/10-scale-reconciliation.svg) and [canonical Mermaid source](./diagrams/10-scale-reconciliation.mmd).
- **Evidence:** [docs/contracts/distribution/v0.md](../../contracts/distribution/v0.md), [docs/contracts/distribution/sprint-7g-closure-review-v0.md](../../contracts/distribution/sprint-7g-closure-review-v0.md), [cadenza-cell/tests/autonomous_cell_convergence.rs](../../../cadenza-cell/tests/autonomous_cell_convergence.rs).

## Distributed Actor Lifecycle

- **Audience:** application authors, runtime contributors, operators.
- **Question:** How does one actor remain singular, durable, and recoverable across owner loss and uncertain commits?
- **Scope:** First touch, assignment, residency, hydration, strict write-through mutation, uncertainty resolution, drain, and recovery.
- **Intentionally omits:** actor business schema, placement scoring, provider storage internals.
- **Identities:** actor key, assignment epoch, owner residency, durable state, mutation outcome.
- **States:** unassigned, assigned, hydrating, ready, commit-uncertain, draining, owner-lost, reassigned.
- **Affects:** owner selection, state hydration, mutation commit, fencing, recovery.
- **Boundaries:** assignment authority, owner residency, persistence facade, epoch fence.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/11-actor-lifecycle.svg) and [canonical Mermaid source](./diagrams/11-actor-lifecycle.mmd).
- **Evidence:** [docs/contracts/actor-distribution/v1.md](../../contracts/actor-distribution/v1.md), [docs/contracts/actor-distribution/sprint-8d-closure-review-v1.md](../../contracts/actor-distribution/sprint-8d-closure-review-v1.md), [cadenza-cell/tests/autonomous_cell_convergence.rs](../../../cadenza-cell/tests/autonomous_cell_convergence.rs).

## Security And Capability Boundaries

- **Audience:** security reviewers, operators, runtime contributors.
- **Question:** Which identities may hold credentials or capabilities, what exact affect may cross each boundary, and what is forbidden?
- **Scope:** Administrative authority, purpose-separated database roles, Cell, launcher, Chamber, adapter, peer transport, and evidence disclosure.
- **Intentionally omits:** cloud IAM, hardware security modules, managed ingress.
- **Identities:** administrator, database roles, Cell, launcher, Chamber, adapter, peer Cell, evidence ledger.
- **States:** authorized, contained, credentialed, revoked, denied.
- **Affects:** literal authority operation, process launch, capability mediation, peer delegation, bounded evidence.
- **Boundaries:** credential custody, privilege, containment, network trust, disclosure.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/12-security-capability-boundaries.svg) and [canonical Mermaid source](./diagrams/12-security-capability-boundaries.mmd).
- **Evidence:** [docs/security/cadenza-security-model-v1.md](../../security/cadenza-security-model-v1.md), [docs/security/cadenza-threat-model-v1.md](../../security/cadenza-threat-model-v1.md), [docs/security/supported-deployment-assumptions-v1.md](../../security/supported-deployment-assumptions-v1.md).

## Reference Order Journey

- **Audience:** application authors, new contributors, operators.
- **Question:** How does an authored order intent travel through business logic and hidden runtime support, including failure and recovery?
- **Scope:** Order submission, deterministic composition, provider boundaries, actor state, detached audit, distributed pricing, evidence, and recovery.
- **Intentionally omits:** every reference test branch, provider implementation internals, UI.
- **Identities:** order intent, business graph, provider, order actor, Cell, Chamber, evidence trace.
- **States:** submitted, validated, priced, reserved, authorized, committed, audited, recovered.
- **Affects:** inquiry, business decision, state mutation, detached consequence, distributed execution, recovery.
- **Boundaries:** business to provider, Chamber to Cell, actor persistence, evidence custody.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/13-reference-business-journey.svg) and [canonical Mermaid source](./diagrams/13-reference-business-journey.mmd).
- **Evidence:** [cadenza-reference-system/README.md](../../../cadenza-reference-system/README.md), [cadenza-reference-system/docs/business-architecture.md](../../../cadenza-reference-system/docs/business-architecture.md), [docs/publication/sprint-9c-reproducibility-evidence-v1.md](../../publication/sprint-9c-reproducibility-evidence-v1.md).

## Local Graph Run And Detached Trace Continuation

- **Audience:** application authors, core contributors.
- **Question:** How does a local graph complete while detached work starts a new graph under the same trace?
- **Scope:** Inquiry, local task relationships, conclusion, detached signal, and trace continuation.
- **Intentionally omits:** remote routing, durable evidence processing.
- **Identities:** trace, inquiry, graph execution, task, signal emission.
- **States:** started, completed, detached, continued.
- **Affects:** task execution, composition, signal delivery, trace propagation.
- **Boundaries:** graph completion, detached continuation.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/14-local-run-detached-trace.svg) and [canonical Mermaid source](./diagrams/14-local-run-detached-trace.mmd).
- **Evidence:** [docs/contracts/execution-evidence/v0.md](../../contracts/execution-evidence/v0.md), [cadenza/src/engine/GraphRunner.ts](../../../cadenza/src/engine/GraphRunner.ts), [cadenza/src/engine/SignalBroker.ts](../../../cadenza/src/engine/SignalBroker.ts).

## Cell Lifecycle

- **Audience:** operators, Cell contributors.
- **Question:** When may a Cell generation host affect, drain, stop, or fail?
- **Scope:** One immutable Cell process generation and its monotonic lifecycle.
- **Intentionally omits:** Cell supply provider process, Chamber internals.
- **Identities:** Cell identity, Cell generation, current observation.
- **States:** created, starting, operational, draining, stopped, failed.
- **Affects:** host activation, route publication, drain, generation fencing.
- **Boundaries:** stable enrollment, ephemeral generation.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/15-cell-lifecycle.svg) and [canonical Mermaid source](./diagrams/15-cell-lifecycle.mmd).
- **Evidence:** [docs/contracts/distribution/v0.md](../../contracts/distribution/v0.md), [cadenza-cell/src/lifecycle.rs](../../../cadenza-cell/src/lifecycle.rs), [cadenza-cell/tests/lifecycle.rs](../../../cadenza-cell/tests/lifecycle.rs).

## Chamber Lifecycle

- **Audience:** operators, Chamber contributors.
- **Question:** Which preparation and custody transitions make a Chamber eligible for primitive ingress?
- **Scope:** Activation, preparation, readiness, draining, stop, and monotonic failure.
- **Intentionally omits:** placement, adapter implementation details.
- **Identities:** Chamber identity, runtime image, adapter process, Cell protocol.
- **States:** created, activated, prepared, ready, draining, stopped, failed.
- **Affects:** admission, materialization, primitive ingress, drain.
- **Boundaries:** activation grant, runtime readiness, accepted-before-release.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/16-chamber-lifecycle.svg) and [canonical Mermaid source](./diagrams/16-chamber-lifecycle.mmd).
- **Evidence:** [cadenza-chamber/contracts/v0.md](../../../cadenza-chamber/contracts/v0.md), [cadenza-chamber/src/lifecycle.rs](../../../cadenza-chamber/src/lifecycle.rs), [cadenza-chamber/tests/lifecycle.rs](../../../cadenza-chamber/tests/lifecycle.rs).

## Reconciliation Action Lifecycle

- **Audience:** operators, reconciliation contributors.
- **Question:** How does one fenced reconciliation action move from plan to verified outcome?
- **Scope:** Canonical action authority, claim, execution, uncertain outcome, resolution, and supersession.
- **Intentionally omits:** plan generation algorithm, provider internals.
- **Identities:** plan, action, stem epoch, outcome.
- **States:** planned, authorized, claimed, applied, deferred, uncertain, resolved, superseded.
- **Affects:** claim, runtime change, outcome recording, retry.
- **Boundaries:** stem lease epoch, action identity, semantic failure.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/17-reconciliation-action-lifecycle.svg) and [canonical Mermaid source](./diagrams/17-reconciliation-action-lifecycle.mmd).
- **Evidence:** [docs/contracts/distribution/v0.md](../../contracts/distribution/v0.md), [docs/contracts/distribution/sprint-7b-closure-review-v0.md](../../contracts/distribution/sprint-7b-closure-review-v0.md).

## Execution Evidence Custody Lifecycle

- **Audience:** operators, evidence contributors.
- **Question:** When may execution evidence be acknowledged, retried, compacted, or retained?
- **Scope:** Report admission, journal append, sealing, claim, ledger processing, receipt, acknowledgement, and compaction.
- **Intentionally omits:** event-family detail, observer projections.
- **Identities:** evidence record, journal segment, batch, processing attempt, ledger receipt.
- **States:** reported, appended, sealed, claimed, commit-unknown, durable, acknowledged, compacted.
- **Affects:** admission, custody transfer, idempotent processing, deletion.
- **Boundaries:** Chamber success barrier, Cell journal, durable ledger.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/18-evidence-custody-lifecycle.svg) and [canonical Mermaid source](./diagrams/18-evidence-custody-lifecycle.mmd).
- **Evidence:** [docs/contracts/execution-evidence/v0.md](../../contracts/execution-evidence/v0.md), [docs/contracts/execution-evidence/system-closure-v0.md](../../contracts/execution-evidence/system-closure-v0.md), [cadenza-cell/src/journal.rs](../../../cadenza-cell/src/journal.rs).

## Scale Change And Stem Succession

- **Audience:** operators, reconciliation contributors.
- **Question:** How does a scale request converge, and how does work continue after the stem owner is lost?
- **Scope:** Desired replica change, action execution, observation, lease loss, takeover, and continued convergence.
- **Intentionally omits:** provider billing, placement scoring.
- **Identities:** desired state, stem owner, authority, Cell, Chamber.
- **States:** desired, planned, applied, ready, owner-lost, taken-over.
- **Affects:** scale intent, fenced action, local convergence, succession.
- **Boundaries:** stem lease, Cell generation, readiness observation.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/19-scale-change-stem-succession.svg) and [canonical Mermaid source](./diagrams/19-scale-change-stem-succession.mmd).
- **Evidence:** [docs/contracts/distribution/sprint-7g-closure-review-v0.md](../../contracts/distribution/sprint-7g-closure-review-v0.md), [cadenza-cell/docs/scale-orchestration-system-closure-2026-07-20.md](../../../cadenza-cell/docs/scale-orchestration-system-closure-2026-07-20.md).

## Actor Write, Uncertain Commit, And Owner Recovery

- **Audience:** application authors, operators, actor contributors.
- **Question:** How does an actor mutation preserve one durable truth through connection loss and owner loss?
- **Scope:** Strict write-through mutation, unknown commit resolution, epoch fencing, reassignment, hydration, and continued mutation.
- **Intentionally omits:** actor placement scoring, business-specific state.
- **Identities:** caller, actor owner, Cell facade, authority, successor owner.
- **States:** ready, commit-in-progress, uncertain, resolved, owner-lost, rehydrated.
- **Affects:** mutation, commit, outcome resolution, reassignment, hydration.
- **Boundaries:** owner residency, assignment epoch, persistence capability.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](./rendered/20-actor-write-failure-recovery.svg) and [canonical Mermaid source](./diagrams/20-actor-write-failure-recovery.mmd).
- **Evidence:** [docs/contracts/actor-distribution/v1.md](../../contracts/actor-distribution/v1.md), [docs/contracts/actor-distribution/sprint-8d-closure-review-v1.md](../../contracts/actor-distribution/sprint-8d-closure-review-v1.md), [cadenza-cell/tests/autonomous_cell_convergence.rs](../../../cadenza-cell/tests/autonomous_cell_convergence.rs).

## Cadenza Core Module Ownership

- **Audience:** core contributors.
- **Question:** How are TypeScript core semantics, execution, conclusion, and evidence separated?
- **Scope:** Stable TypeScript source ownership areas.
- **Intentionally omits:** individual functions, legacy runtime host.
- **Identities:** public facade, definitions, registry, engine, conclusion, evidence.
- **States:** defined, registered, executed, concluded, reported.
- **Affects:** API use, execution, composition, reporting.
- **Boundaries:** public API, neutral core.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza/docs/module-ownership.mmd).
- **Evidence:** [cadenza/src](../../../cadenza/src), [cadenza/tests/unit](../../../cadenza/tests/unit), [cadenza/contracts](../../../cadenza/contracts).

## Python Core Module Ownership

- **Audience:** Python core contributors.
- **Question:** How does Python express portable primitive meaning idiomatically?
- **Scope:** Stable Python package ownership areas.
- **Intentionally omits:** individual functions, distributed adapter.
- **Identities:** facade, definitions, task API, runtime, actor, conclusion, evidence.
- **States:** defined, executed, concluded, reported.
- **Affects:** API use, local execution, conformance.
- **Boundaries:** public package, shared contract.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-python/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-python/docs/module-ownership.mmd).
- **Evidence:** [cadenza-python/src/cadenza](../../../cadenza-python/src/cadenza), [cadenza-python/tests](../../../cadenza-python/tests), [cadenza-python/conformance](../../../cadenza-python/conformance).

## Elixir Core Module Ownership

- **Audience:** Elixir core contributors.
- **Question:** How do portable primitives and BEAM-native runtime behavior cooperate?
- **Scope:** Stable Elixir application and library ownership areas.
- **Intentionally omits:** Phoenix, distributed adapter.
- **Identities:** facade, OTP application, definitions, Runtime process, actor, conclusion, evidence.
- **States:** started, defined, executed, concluded, reported.
- **Affects:** application lifecycle, local execution, conformance.
- **Boundaries:** public package, runtime process, shared contract.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-elixir/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-elixir/docs/module-ownership.mmd).
- **Evidence:** [cadenza-elixir/lib](../../../cadenza-elixir/lib), [cadenza-elixir/test](../../../cadenza-elixir/test), [cadenza-elixir/mix.exs](../../../cadenza-elixir/mix.exs).

## C# Core Module Ownership

- **Audience:** C# core contributors.
- **Question:** How does the .NET package divide primitive, registry, validation, policy, conclusion, and evidence concerns?
- **Scope:** Stable C# project ownership areas.
- **Intentionally omits:** individual classes, distributed adapter.
- **Identities:** facade, primitives, registry, schema, signal policy, conclusion, evidence.
- **States:** defined, validated, executed, concluded, reported.
- **Affects:** API use, local execution, conformance.
- **Boundaries:** public package, shared contract.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-csharp/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-csharp/docs/module-ownership.mmd).
- **Evidence:** [cadenza-csharp/src/Cadenza](../../../cadenza-csharp/src/Cadenza), [cadenza-csharp/tests/Cadenza.Tests](../../../cadenza-csharp/tests/Cadenza.Tests), [cadenza-csharp/Cadenza.sln](../../../cadenza-csharp/Cadenza.sln).

## Environment Module Ownership

- **Audience:** Environment contributors, operators.
- **Question:** Which package owns contracts, bootstrap, literal authority access, and reconciliation?
- **Scope:** Environment monorepo packages and PostgreSQL adapter.
- **Intentionally omits:** table-level schema, individual operations.
- **Identities:** authority contracts, bootstrap, gateway, stem, PostgreSQL adapter.
- **States:** specified, bootstrapped, authorized, planned, committed.
- **Affects:** contract generation, migration, literal operations, reconciliation.
- **Boundaries:** portable contract, durable authority, contained meta slice.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-environment/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-environment/docs/module-ownership.mmd).
- **Evidence:** [cadenza-environment/packages](../../../cadenza-environment/packages), [cadenza-environment/contracts](../../../cadenza-environment/contracts), [cadenza-environment/README.md](../../../cadenza-environment/README.md).

## Chamber Module Ownership

- **Audience:** Chamber contributors, security reviewers.
- **Question:** How does Chamber separate admission, image authority, hosting, adapters, execution, actors, and custody?
- **Scope:** Stable Rust Chamber and TypeScript adapter ownership areas.
- **Intentionally omits:** individual protocol fields, Cell containment implementation.
- **Identities:** activation, runtime image, host, adapter, runtime, actor, custody.
- **States:** verified, prepared, ready, executing, custodied.
- **Affects:** admission, supervision, primitive ingress, actor execution, evidence.
- **Boundaries:** Cell protocol, adapter process, execution custody.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-chamber/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-chamber/docs/module-ownership.mmd).
- **Evidence:** [cadenza-chamber/src](../../../cadenza-chamber/src), [cadenza-chamber/adapters/typescript](../../../cadenza-chamber/adapters/typescript), [cadenza-chamber/tests](../../../cadenza-chamber/tests).

## Cell Module Ownership

- **Audience:** Cell contributors, security reviewers, operators.
- **Question:** How does Cell separate identity, host convergence, containment, routing, providers, actors, and evidence custody?
- **Scope:** Stable Rust Cell ownership areas.
- **Intentionally omits:** individual protocol fields, provider SQL.
- **Identities:** identity, host, containment, Chamber custody, routing, providers, actor coordination, journal.
- **States:** enrolled, current, contained, routed, custodied.
- **Affects:** host lifecycle, launch, distribution, provider mediation, actor ownership, evidence.
- **Boundaries:** generation authority, root launcher, peer TLS, Chamber sandbox, ledger.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-cell/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-cell/docs/module-ownership.mmd).
- **Evidence:** [cadenza-cell/src](../../../cadenza-cell/src), [cadenza-cell/tests](../../../cadenza-cell/tests), [cadenza-cell/contracts](../../../cadenza-cell/contracts).

## Reference System Module Ownership

- **Audience:** application authors, reference-system contributors.
- **Question:** How does the reference consumer keep domain behavior separate from providers, deployment authority, artifacts, and proofs?
- **Scope:** Reference-system authored modules and proof surfaces.
- **Intentionally omits:** runtime implementation, provider infrastructure.
- **Identities:** domain, system facade, providers, authority descriptor, distributed artifact, tests.
- **States:** authored, assembled, described, generated, proved.
- **Affects:** business execution, provider boundary, artifact generation, proof.
- **Boundaries:** business logic, provider, deployment descriptor, framework consumer.
- **Owner:** Cadenza architecture maintainers.
- **Last validated:** 2026-07-22.
- **Visual:** [rendered SVG](../../../cadenza-reference-system/docs/module-ownership.svg) and [canonical Mermaid source](../../../cadenza-reference-system/docs/module-ownership.mmd).
- **Evidence:** [cadenza-reference-system/src](../../../cadenza-reference-system/src), [cadenza-reference-system/tests](../../../cadenza-reference-system/tests), [cadenza-reference-system/artifacts](../../../cadenza-reference-system/artifacts).
