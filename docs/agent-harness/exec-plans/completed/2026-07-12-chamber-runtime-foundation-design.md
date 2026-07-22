# Chamber Runtime Foundation Design Proposal

Date: 2026-07-12

## Goal

- Outcome: introduce the official chamber runtime boundary in a new `cadenza-chamber` repository and prove that a verified runtime image can be constructed and executed without giving the chamber authority it does not own.
- Why it matters: the chamber is where database authority becomes bounded executable behavior. If this boundary is vague, every later cell, placement, distribution, capability, actor, and scaling feature inherits hidden authority and operational ambiguity.

## Current Status

- State: `in_progress`
- Current repo: `cadenza-workspace`
- Authority repos:
  - `cadenza` for primitive semantics, authority/security contracts, and the environment-bootstrap handoff.
  - future `cadenza-chamber` for chamber lifecycle, activation, runtime-image, adapter-host, primitive-ingress, and runtime-evidence contracts.
- Impacted repos:
  - `cadenza-workspace`
  - `cadenza`
  - new `cadenza-chamber`
- Explicitly not impacted:
  - legacy `cadenza-service`
  - legacy `cadenza-db`
  - legacy demos
  - legacy `cadenza-engine`

## Context

### Problem

Environment Bootstrap V0 ends at `handoff_ready`. It creates and attests environment identity, trust-root state, first-cell enrollment, seed provenance, the authority-access slice declaration, and the first activation handoff. It deliberately does not:

- resolve executable artifacts.
- materialize callable source.
- activate a chamber.
- inject host capabilities.
- execute a Cadenza graph.
- make the environment operational.

The next boundary must turn approved authority into an immutable runtime image and execute that image through the appropriate official core implementation. It must do so without confusing any of these identities:

- database authority.
- bootstrap authority.
- cell host authority.
- chamber runtime state.
- language-adapter state.
- materialized primitive state.
- initiating subject and runtime principal.

### Why Now

- Environment Bootstrap V0 is implemented and its residual activation requirements are explicit.
- Primitive contracts exist in TypeScript, Python, Elixir, and C#.
- The language runtime contract defines the materialization, containment, normalization, and evidence requirements adapters must eventually satisfy.
- Cells, distribution, placement, actors, and orchestration all depend on a stable chamber contract.

### Evidence

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-environment.md`
- `docs/cadenza-language-role-doctrine.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/contracts/environment-bootstrap/v0.md`
- `docs/contracts/environment-bootstrap/coherence-review-v0.md`
- `docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md`
- `cadenza/environment-bootstrap/`

Historical cell and multi-runtime documents may be consulted for questions and failure cases, but they do not own the design.

## Intended Whole

A chamber is a disposable, isolated execution domain that faithfully turns one governed, immutable runtime image into Cadenza primitive behavior while exposing no authority except the exact capabilities granted by its trusted host.

It exists so creators can keep attention on intended function and workflow logic while Cadenza absorbs runtime construction, language materialization, lifecycle, evidence, and failure normalization.

The chamber must preserve:

- primitive meaning across runtime languages.
- authority-to-runtime traceability.
- explicit and revocable host affect.
- copy-in/copy-out boundaries between host and executable code.
- deterministic lifecycle state even when business execution is not deterministic.
- enough evidence for future participants to know what ran, why, where, under which authority, and with what result.

### False Success

This sprint must avoid:

- calling a child process a security sandbox.
- treating a valid handoff as sufficient proof that current authority still allows activation.
- resolving artifacts from ambient files, package registries, or mutable tags.
- passing database credentials, secrets, sockets, filesystem handles, or host objects directly into business callables.
- embedding cell placement, routing, scaling, or distributed actor ownership in the chamber.
- implementing a generic worker protocol instead of a Cadenza primitive runtime.
- making TypeScript API shape the neutral chamber contract.
- claiming the environment is operational before privileged authority access is externally contained.

## Foundational Decision

The chamber and cell boundaries must remain distinct even though they cooperate closely.

### Chamber Owns

- activation-input verification.
- immutable runtime-image construction.
- runtime-adapter selection and protocol.
- controlled materialization orchestration.
- construction of core-represented primitives from already-materialized callables.
- local Cadenza execution.
- local inquiry resolution.
- chamber lifecycle and readiness state.
- normalized execution outcomes.
- normalized runtime evidence.
- the chamber side of `delegation`, `signal`, and `status`.

### Cell Or Trusted Host Owns

- creating the containment boundary before chamber code starts.
- chamber process identity and lifecycle authority.
- OS, container, micro-VM, or equivalent resource isolation.
- capability providers and scoped capability mounts.
- secret brokering.
- runtime database credential custody.
- artifact and trust-key resolution from configured trusted sources.
- chamber-to-chamber and cell-to-cell routing.
- host meta authority, image epochs, placement, and actor residency ownership.
- stopping or replacing a chamber when authority is revoked.

### Consequence

`cadenza-chamber` will define a narrow `ChamberHostPort` contract, but it will not implement the future distributed cell host.

The chamber can be fully tested with a conformance host. It may be run locally with an explicitly unsafe development host for non-privileged fixtures. It must refuse privileged activation unless the host presents a conforming contained-execution attestation and required capability mounts.

The initial authority-access slice is privileged. Therefore its real activation is a joint chamber-and-trusted-host milestone. Chamber Foundation can prepare and prove the chamber boundary, but it must not bypass the subsequent cell containment gate to manufacture an `operational` claim.

This is a justified refinement of the roadmap sequence. The chamber contract still precedes cell orchestration, but privileged production activation cannot precede the minimum trusted host.

## Proposed Repository And Language

### Repository

Create one independent official repository:

```text
cadenza-chamber/
```

The old `engine` term and any `cadenza-engine` implementation remain legacy.

### Implementation Language

Use Rust for the chamber substrate.

Rust is selected as a runtime implementation language, not as a fifth official primitive core. The reasons are:

- memory-safe systems programming without a garbage-collected host runtime.
- explicit ownership around lifecycle, process handles, protocol state, and capability handles.
- small deployable substrate and predictable resource behavior.
- strong typed modeling for fail-closed state machines and normalized envelopes.
- mature process, cryptographic, serialization, and observability ecosystems.
- compatibility with later OS isolation, container, WebAssembly, or micro-VM integrations.

Rust does not itself provide containment. A Rust chamber launched with ambient host authority is still unsafe. The trusted host boundary remains mandatory.

Elixir/BEAM supervision remains relevant for future orchestration and meta-layer work, but the chamber kernel primarily needs containment-adjacent systems behavior, strict protocol state, and a small trusted computing base. TypeScript remains the first adapter target because the bootstrap authority slice and working semantic authority are TypeScript-centered.

## Contract Model

All cross-boundary contracts use bounded canonical JSON for V0 control and evidence envelopes. Bulk or streaming payload optimization is deferred until profiling proves it necessary.

### Chamber Identity

Minimum identity:

- `chamber_key`
- `cell_key`
- `environment_key`
- `lane`
- `image_digest`
- `image_revision`
- `image_epoch`
- `authority_revision`
- `projection_revision`
- `runtime_id`
- `adapter_version`

For Chamber Foundation, `image_epoch` and `projection_revision` may be fixed host-supplied values because placement and dynamic projection are not implemented yet. They must still exist so later distribution does not change identity shape.

### Lifecycle

The chamber lifecycle is:

```text
created
  -> verifying
  -> resolving
  -> materializing
  -> ready
  -> draining
  -> stopped
```

Any pre-ready state may enter `failed`. A ready or draining chamber may enter `failed` on runtime loss or integrity failure.

Rules:

- transitions are monotonic except that a host creates a new chamber identity for retries or replacement.
- `ready` means the complete image is verified, materialized, locally registered, and consistent with the required authority and projection revisions.
- no delegation or signal ingress is accepted before `ready`.
- `draining` rejects new delegation roots and accepts only explicitly allowed completion traffic.
- `failed` and `stopped` identities never return to `ready`.
- image replacement creates a successor chamber; it does not mutate a running image in place.

### Activation Envelope

The host supplies an activation envelope containing:

- chamber identity and intended lane.
- bootstrap handoff or later authority activation handoff.
- trust-key resolution references.
- immutable image manifest.
- approved runtime-adapter identity.
- artifact-resolution grants.
- capability mounts.
- resource limits.
- contained-execution attestation.
- evidence sink identity.
- deadlines and cancellation identity.

The envelope carries references and grants, not credentials, private keys, provider tokens, secret values, raw host objects, or unbounded environment variables.

### Mandatory Activation Verification

Before artifact resolution, the chamber must verify:

1. canonical handoff digest and Ed25519 attestation.
2. final evidence-chain continuity and digest.
3. environment and first-cell identity agreement.
4. active trust-root and cell-enrollment status through a trusted current-authority reader.
5. seed-pack identities and content digests.
6. authority-slice object, version, artifact, and required capability identity.
7. runtime id, language id, adapter version, and isolation requirement.
8. activation-policy reference and current allow decision.
9. authority revision compatibility and revocation state.
10. host trust profile, containment attestation, capability grants, and resource controls.

Verification fails closed. A failure produces evidence but no artifact is loaded and no adapter starts.

### Artifact Resolution

The chamber must never search ambient paths or fetch arbitrary packages.

`ArtifactResolver` receives an artifact identity and digest and returns immutable bytes or a sealed executable reference plus provenance. The chamber verifies the returned digest before use.

The bootstrap authority-gateway handler is a pinned bootstrap-kernel artifact, not database-authored source. Its real release digest must replace the placeholder fixture digest before an environment can be activated outside conformance tests.

Later database-authored primitive definitions use the language materialization envelope and source/dependency digests defined by the language runtime contract. These are a different artifact class from the bootstrap-kernel gateway.

### Runtime Image

A runtime image manifest is immutable and content-addressed. It contains:

- image identity, revision, and digest.
- source authority revision.
- lane and trust requirement.
- primitive definitions and versions.
- declared graph wiring.
- handler slots and artifact/source references.
- runtime adapter and core implementation requirements.
- locked dependencies.
- helper/global/actor definitions and bindings needed locally.
- responder bindings for intents.
- capability requirements.
- schemas.
- generated hidden support descriptors when supplied by host authority.

The chamber must materialize the whole image or none of it. Partial registration must not become ready.

### Runtime Adapter Protocol

The first adapter is TypeScript/Node and uses the official TypeScript core. Adapter communication is an explicit framed protocol over host-created IPC, not shared in-process objects.

Required adapter operations:

- `identify`
- `prepare_image`
- `materialize`
- `activate`
- `delegate`
- `deliver_signal`
- `status`
- `drain`
- `stop`

Required adapter properties:

- no dependency fetching during materialization or execution.
- exact runtime, adapter, core, and dependency identity reporting.
- bounded input, output, log, and error envelopes.
- deadline and cancellation propagation.
- structured failure normalization.
- evidence for materialization and execution boundaries.
- no authority to widen capability mounts.

Python, Elixir, and C# adapters are deferred until the neutral chamber contract and TypeScript adapter pass conformance. They should reuse the same image and evidence semantics while remaining idiomatic internally.

### Host Capability Port

The chamber receives opaque, scoped capability endpoints. It never receives provider implementations or provider credentials.

V0 host operations are limited to:

- resolve trusted public key.
- read activation-relevant current authority state.
- resolve immutable artifact.
- invoke a mounted capability operation.
- append runtime evidence.
- report status and health.
- request cancellation or termination.

The port is deny-by-default and method-specific. There is no generic host-call, SQL, filesystem, process, environment, or network escape.

`authority_access/admin` is implemented as a domain-shaped broker capability for the seeded gateway task families. The broker owns the narrow runtime database credential. Neither the chamber kernel nor the TypeScript callable receives that credential.

### Primitive Transport

The chamber execution surface remains:

- `delegation`: synchronous root handoff with one absolute deadline and normalized outcome.
- `signal`: detached delivery into the local runtime; chamber-level acknowledgement means accepted or rejected, not completed.
- `status`: lifecycle, image, revision, health, and bounded runtime metrics.

Local `inquire` uses the official core inquiry mechanism and materialized responder bindings. Inter-chamber routing and generated proxy topology belong to the later cell/orchestration design.

### Delegation Outcomes

The neutral result taxonomy is:

- `fulfilled`
- `execution_failed`
- `retryable_reject`
- `denied`
- `transport_failed`

Every non-fulfilled result states whether execution started. Retry is automatically safe only when execution did not start and the absolute deadline remains valid.

### Evidence

Evidence is required for:

- activation requested, accepted, and rejected.
- every verification decision.
- artifact resolution and digest verification.
- adapter selection and identity negotiation.
- materialization start, success, and failure.
- capability grant, denial, invocation, and revocation.
- chamber readiness, drain, failure, and stop.
- delegation and signal ingress.
- execution start and completion.
- cancellation, deadline, resource, adapter, and runtime failures.

Evidence links environment, cell, chamber, image, authority revision, projection revision, adapter, runtime, primitive definition/version, initiating subject, runtime principal, capability decision, and prior evidence where ordering matters.

The chamber publishes evidence through the host sink. It does not own durable evidence authority.

## Sprint Structure

### Sprint 4A: Chamber Contract And Kernel

- create `cadenza-chamber` as an independent Rust repository.
- add repo governance and workspace routing.
- define language-neutral activation, image, lifecycle, host-port, transport, outcome, and evidence schemas.
- add bounded canonical JSON and digest conformance against bootstrap fixtures.
- implement the fail-closed chamber lifecycle state machine.
- implement bootstrap-handoff verification independently from the TypeScript bootstrap implementation.
- implement artifact-resolver and host-port interfaces.
- implement an in-memory conformance host and immutable test artifact store.
- prove interrupted activation leaves no ready partial image.
- do not execute source yet.

### Sprint 4B: TypeScript Adapter And Primitive Runtime

- implement the framed adapter protocol.
- launch a Node adapter as a separately supervised process.
- materialize a non-privileged fixture image through the official TypeScript core.
- prove task, signal, intent/inquiry, actor, helper, global, and ephemeral/throttled/debounced task semantics required by the shared core contract.
- expose delegation, signal, and status locally.
- normalize outcomes, errors, deadlines, cancellation, logs, and evidence.
- prove adapter crash containment and chamber failure transitions.
- keep development-host execution explicitly non-production and reject privileged images.

### Sprint 4C Gate: First Trusted-Control Activation

This is not approved by approving 4A/4B.

Before activating the seeded authority-access slice:

- approve the minimum trusted cell-host containment design.
- provide a real content-addressed authority-gateway artifact and release digest.
- provide a narrow runtime database role and broker owned outside the chamber.
- prove the bootstrap-owner credential is absent and retired or inaccessible.
- prove current-authority and revocation revalidation.
- prove privileged adapter containment and default-denied ambient powers.
- add an explicit `operational` environment transition owned by post-bootstrap authority, not by static bootstrap.

## Scope

### In Scope

- official chamber repo creation.
- Rust chamber kernel.
- neutral chamber contracts and fixtures.
- independent bootstrap-handoff consumption and verification.
- immutable image model.
- trusted artifact-resolution contract.
- host capability port.
- TypeScript adapter and non-privileged local primitive execution.
- primitive-shaped ingress.
- lifecycle and runtime evidence.
- conformance, failure, interruption, and crash tests.

### Out Of Scope

- production activation of the privileged authority-access slice.
- full cell implementation.
- OS/container/micro-VM selection and implementation.
- secrets.
- plugin installation or activation.
- arbitrary package acquisition.
- Python, Elixir, and C# runtime adapters.
- inter-cell transport.
- chamber placement, replicas, scaling, or load balancing.
- dynamic host projections and route maps.
- actor residency, hydration, persistence, or assignment epochs.
- stem-cell reconciliation.
- persistent/resumable flows.
- memory, CLI, agent, UI, or console work.

## Contract Governance

- `cadenza` remains authority for core primitives, authority/security semantics, canonical bootstrap JSON, and the bootstrap handoff.
- `cadenza-chamber` becomes authority for chamber activation, image, lifecycle, adapter-host, primitive-ingress, outcome, and runtime-evidence contracts.
- the first cross-repo integration fixture is produced by `cadenza` bootstrap and consumed independently by `cadenza-chamber`.
- contract changes update the authority first and propagate in the same task or through linked follow-up.
- no TypeScript interface is accepted as neutral authority merely because TypeScript is the first adapter.

## Risks

### Security Risk

Highest risk: mistaking process separation or Rust memory safety for complete containment.

Mitigation:

- model containment as a host-provided attested requirement.
- reject privileged activation in the development host.
- defer real gateway activation until the minimum cell host passes its own gate.

### Contract Risk

The current bootstrap fixture uses a placeholder artifact digest and does not define artifact retrieval.

Mitigation:

- define artifact resolution in the chamber contract.
- keep bootstrap handoff reference-only.
- replace the placeholder only when a reproducible gateway artifact exists.

### Scope Risk

The chamber can easily absorb cell routing, distribution, policy, authority, or package management.

Mitigation:

- enforce the ownership table above.
- keep host interactions behind the narrow port.
- reject features that require chamber awareness of peer topology.

### Polyglot Risk

A Node-first adapter could leak JavaScript assumptions into neutral contracts.

Mitigation:

- canonical JSON fixtures and language-neutral schemas are authoritative.
- adapter-local protocol details may differ, but normalized identities, lifecycle, outcomes, capabilities, and evidence cannot.
- review the contract against Python, Elixir, and C# before declaring 4B complete even though their adapters are deferred.

### Operational Risk

Adapter crashes, hangs, excessive output, or partial image construction can corrupt chamber state.

Mitigation:

- supervisor-enforced deadlines, cancellation, output bounds, and process termination.
- transactional in-memory image assembly followed by one activation step.
- immutable image identity and one-way lifecycle.

## Migration Strategy

There is no backward-compatibility requirement. This is a new major-version runtime direction.

Order:

1. approve this proposal.
2. log the architecture decision.
3. create `cadenza-chamber` and register its contract authority and repo card.
4. implement Sprint 4A.
5. run a coherence review before source execution is introduced.
6. implement Sprint 4B.
7. run cross-language contract pressure review.
8. design the minimum trusted cell host before Sprint 4C.

Legacy engine/service transports are not migrated. Useful failure cases may become new tests, but old APIs and wire shapes do not constrain the design.

## Validation Plan

### Contract Validation

- chamber schemas accept valid canonical fixtures and reject mutations.
- Rust independently reproduces bootstrap and image digests.
- handoff signature, evidence chain, seed, artifact, runtime, policy, capability, and revision drift fail closed.
- TypeScript core fixture meanings remain intact after adapter normalization.

### Lifecycle Validation

- only legal lifecycle transitions succeed.
- no ingress before ready.
- partial materialization cannot publish ready state.
- drain rejects new delegation roots.
- failed/stopped chambers cannot reactivate.
- replacement uses a new chamber identity/image epoch.

### Adapter Validation

- exact runtime/core/adapter/dependency identity is reported.
- task, signal, inquiry, actor, helper, global, and task-type fixtures execute coherently.
- timeouts, cancellation, output limits, malformed frames, crashes, and protocol mismatch are normalized.
- dependency fetching and undeclared capability access are rejected.

### Security Validation

- privileged image activation is rejected by the development host.
- host credentials and provider objects never enter chamber or callable payloads.
- artifact digest mismatch is rejected before adapter start.
- capability calls are method-scoped, revision-bound, and evidenced.
- ambient environment input is allowlisted and recorded.

### Workspace Validation

- workspace harness passes.
- each repo typecheck/build/test suite passes independently.
- contract authority map and repo routing agree.
- no product code is committed from workspace root.

## Alternatives

### TypeScript Chamber Host

Advantages: fastest path to the TypeScript core and adapter.

Rejected as the long-term chamber kernel because it couples the substrate to the first business runtime, expands the trusted Node surface, and makes process and capability ownership easier to blur. Node remains the first adapter runtime.

### Elixir Chamber Host

Advantages: excellent supervision, concurrency, failure isolation, and alignment with Cadenza resilience ideas.

Not selected for the chamber kernel because the immediate problem is a small containment-adjacent substrate around heterogeneous language processes. Elixir remains a strong candidate for later orchestration, web/UI, and resilient meta services where BEAM-native processes are the actual managed work.

### Go Chamber Host

Advantages: simple deployment, strong operational ecosystem, good concurrency, and straightforward process control.

Viable, but Rust better serves the desired small trusted computing base, explicit resource ownership, embedding options, and future low-level containment integrations. Go should be reconsidered if implementation evidence shows Rust complexity materially slows delivery without improving the boundary.

### Chamber And Cell In One Repository

Advantages: simplest immediate integration of containment, capabilities, and execution.

Rejected because it collapses execution-domain behavior into host/distribution authority and makes the chamber harder to test, replace, and interpret independently. Shared contracts are preferable to shared ownership.

### Activate The Gateway In A Plain Child Process

Advantages: fastest visible bootstrap demo.

Rejected. It would give privileged database-affecting code ambient Node and host powers while presenting process separation as security. That is exactly the false success this architecture must prevent.

## Assumptions

- `cadenza-chamber` is an acceptable official repository name.
- Rust is acceptable as a runtime substrate language and is not expected to implement the Cadenza primitive core.
- TypeScript/Node is the first adapter because the first authority slice and current working semantic authority are TypeScript-centered.
- Chamber Foundation may stop short of `operational`; production privileged activation requires the next trusted-cell design gate.
- V0 control envelopes use bounded canonical JSON; protocol optimization follows evidence, not anticipation.
- no backward compatibility with legacy engine or service APIs is required.

## Coherence Review

### Identities And State

The design names chamber, cell host, activation handoff, authority reader, artifact resolver, image, adapter, core runtime, capability mount, subject, runtime principal, ingress request, and evidence sink separately. Lifecycle and image states have explicit meaning and monotonic transitions.

### Affect And Boundaries

The chamber may verify, materialize, execute, and report. It may not grant capabilities, resolve mutable artifacts, custody credentials, route across cells, change authority, or claim containment. Host affect enters only through attested activation input and scoped ports. Executable affect leaves only through primitive outputs and capability calls.

### Relationships And Interpretation

Bootstrap passes signed authority to activation. The host establishes containment and supplies references. The chamber verifies and constructs the runtime image. The adapter materializes language callables. The official core expresses primitive behavior. Evidence carries local state back upward without giving the chamber authority over the evidence store.

Sibling adapters share neutral image, lifecycle, capability, outcome, and evidence meaning without sharing language-local objects.

### Shared Fields And Time

Trust, canonical identity, artifact content, capability semantics, authority revision, runtime image, and evidence are shared fields. They are stewarded through authority-owned contracts, content digests, immutable images, monotonic lifecycle, versioned adapters, and append-only evidence.

Future cells can replace the conformance/development host because the host port is explicit. Future adapters can be added without changing primitive meaning. Failed activations preserve enough trace for repair rather than requiring forensic reconstruction from logs.

### Fragmentation Test

The largest fragmentation risk is local success through an unsafe Node process that bypasses the future cell. The explicit privileged-activation gate repairs that risk. The next risk is turning the chamber into a generic polyglot worker; primitive-shaped ingress and official-core execution preserve the whole.

### Judgment

- Coherence judgment: `fits with risks`.
- Required follow-up: minimum trusted cell-host containment design before privileged authority-gateway activation.

## Questions Or Blockers

The user approved all three design choices on 2026-07-12:

1. Official repo name: `cadenza-chamber`.
2. Chamber substrate language: Rust, with TypeScript/Node as the first adapter.
3. Security gate: Sprint 4A/4B may prove non-privileged execution, but the seeded privileged gateway cannot be activated until the minimum trusted cell host is approved and implemented.

There are no Sprint 4A blockers.

## Exit Criteria

- the chamber intended whole and authority boundary are approved.
- repository and language decisions are approved.
- activation, image, lifecycle, adapter, host-port, ingress, outcome, and evidence contracts are precise enough to implement.
- Sprint 4A and 4B have bounded deliverables and tests.
- the privileged activation dependency on minimum cell containment is explicit and cannot be mistaken for completed work.

## Sprint 4A Implementation Record

Status: `done` on 2026-07-12. The overall plan remains `in_progress` through Sprint 4B closure and the Sprint 4C design gate.

Implemented:

- created the independent `cadenza-chamber` Rust repository.
- registered chamber contract authority and workspace routing.
- pinned Rust 1.97.0 and a locked reviewed dependency graph.
- added neutral activation, runtime-image, evidence, lifecycle, and host-port contracts.
- mirrored the Environment Bootstrap V0 fixture byte-for-byte.
- independently verified canonical JSON, SHA-256 identities, seed packs, seed applications, adjacent transitions, evidence chaining, strict Ed25519 handoff signatures, current authority, revocation state, artifact/runtime identity, policy, capabilities, trust root, and first-cell state.
- added monotonic lifecycle enforcement and prevented partial activation from reaching ready.
- added exact capability matching and deterministic mount ordering.
- rejected artifact substitution even when returned bytes match their own digest.
- bound runtime images to the current revalidated authority revision.
- rejected privileged preparation from the development-process host.
- emitted structured rejection evidence for verification and artifact failures.

Validation:

- 16 Rust tests pass.
- formatting, Clippy with warnings denied, and rustdoc pass.
- RustSec reports no vulnerabilities across 44 locked dependencies.
- no duplicate dependency versions are present.
- the workspace agent harness and authority-map validation pass.

Coherence review:

- `cadenza-chamber/docs/coherence-review-sprint-4a.md`
- verdict: `fits`.
- Sprint 4B may begin.

## Sprint 4B Implementation Record

Status: `done` on 2026-07-12. Implementation stops at the unapproved Sprint 4C trusted-cell design gate.

Implemented:

- a separately supervised TypeScript/Node adapter with bounded framed IPC.
- explicit identify, image-prepare, materialize, activate, delegation, signal, status, drain, and stop phases.
- generic digest-locked source-slice authority with language-local support validation.
- complete TypeScript primitive fixture materialization for tasks, intents, signals, actors, helpers, globals, and specialized task kinds.
- chamber-owned readiness, ingress validation, absolute deadlines, cancellation, normalized outcomes, and append-only evidence.
- process timeout, cancellation, crash, stderr, malformed-frame, oversized-input/output, and interrupted-start handling.
- neutral snake-case actor authority and explicit TypeScript translation.
- reserved, non-spoofable invocation identity propagated into execution.
- a repair for false completion when detached signal work leaves the shared core runner busy.

Validation and reviews:

- `cadenza-chamber/docs/coherence-review-sprint-4b.md`
- `cadenza-chamber/docs/cross-language-pressure-review-sprint-4b.md`
- 24 Rust integration tests, strict Clippy, adapter typecheck/build, RustSec, npm audit, repeated end-to-end execution, core typecheck/build, and workspace harness pass.
- 137 TypeScript core non-performance tests pass; the two machine-sensitive performance failures remain deferred by prior user decision.

Next gate:

- design and explicitly approve the minimum trusted cell host before any privileged authority-gateway activation or `operational` environment transition.
