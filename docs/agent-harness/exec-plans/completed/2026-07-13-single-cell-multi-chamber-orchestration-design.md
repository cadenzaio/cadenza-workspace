# Single-Cell Multi-Chamber Orchestration Design Proposal

Date: 2026-07-13

## Goal

- Outcome: prove that one trusted cell can coherently create, project authority to, route between, replace, drain, and stop multiple contained chambers without exposing chamber topology or host powers to authored business logic.
- Why it matters: Sprint 4C closed the first authority-to-runtime loop for one privileged chamber. Distribution would multiply unresolved lifecycle and routing ambiguity unless the cell can first act as a complete local authority and brokered network for several chambers.

## Status

- State: `done`
- Current repo: `cadenza-workspace`
- Current phase: Sprint 5 closed.
- Complexity gate: required for a multi-repo contract change, security boundary expansion, architectural runtime work, and an implementation expected to exceed 200 LOC.

## Context

Sprint 4C established these guarantees:

- the cell creates containment before privileged chamber or adapter code starts.
- the chamber materializes one immutable image and exposes bounded `delegate`, `signal`, `status`, drain, and stop operations.
- the cell owns credentials, provider selection, current-authority enrichment, and fixed capability brokering.
- the first authority slice can advance one environment from immutable `handoff_ready` history to separately evidenced `operational` authority.

The current cell does not yet own a multi-chamber model. It has no host-generation identity, chamber registry, chamber-specific authority projections, local route groups, successor publication protocol, or source-selected chamber-to-chamber transport. Existing revision fields describe the intended shape but are effectively fixed during the first activation.

The older environment and schema proposals contain a useful frontier model, but Sprint 5 should implement only the part needed for a single cell. Actor residency, inter-cell envelopes, static placement units, stem-cell reconciliation, persistence, and general security-kernel expansion remain later work.

## Intended Whole

A cell should absorb local topology, containment, lifecycle, routing, and failure complexity so authored Cadenza definitions continue to express business intent through tasks, signals, intents, actors, helpers, and globals.

For Sprint 5, success means the same business graph can synchronously delegate and detach work across chamber boundaries without containing a cell key, chamber key, route epoch, projection revision, transport retry loop, or lifecycle procedure.

False success would include:

- a generic worker RPC layer that bypasses Cadenza primitives.
- business code selecting chambers or handling host transport metadata.
- a host silently rerouting stale source decisions.
- mutable chamber images or in-place runtime-shape refresh.
- a multi-process demo that does not exercise real containment and stale-state rejection.
- speculative actor, persistence, placement, or distributed-network code that does not serve the Sprint 5 proof.

## Scope

### In Scope

- one cell process generation managing multiple explicit chamber identities.
- `business`, `meta_support`, and existing `trusted_control` lanes.
- a host meta-authority registry for chamber lifecycle, image generation, responsibilities, task-entry groups, signal route groups, and target route groups.
- bounded chamber-specific full-replacement authority projections.
- projection publication, atomic application, exact acknowledgement, and execution eligibility.
- local inter-chamber signals and delegated execution roots.
- generated hidden forwarding tasks and proxy responders needed to preserve ordinary signal and inquiry APIs.
- source-selected direct candidates with host validation.
- `single_fixed` and `round_robin` selection for direct candidates.
- successor-first chamber replacement and ordered drain/stop.
- a non-privileged source-containment profile derived from the proven gVisor baseline.
- deterministic local conformance tests and a real Linux gVisor end-to-end proof.

### Out Of Scope

- multiple cells, network listeners, transport discovery, or distributed envelopes.
- placement units, replicas, capacity advertisement, dynamic placement, or stem-cell reconciliation.
- actor-key residency, `sticky_actor_key`, hydration, persistence, ownership transfer, or actor manager endpoints.
- durable orchestration, flow checkpoints, leases, or recovery scheduling.
- plugins, secrets, general sessions/identity providers, UI, CLI, agents, or memory.
- Python, Elixir, or C# chamber adapters.
- dynamic image mutation or projection deltas.
- durable production storage for the complete host evidence stream.
- hardware remote attestation or production deployment attestation.

## Authority Split

### `cadenza-cell`

Owns:

- cell-generation identity.
- host meta-authority state and monotonic mutation rules.
- chamber registry and execution-eligibility decisions.
- projection derivation, publication tracking, and acknowledgement validation.
- source and target route validation.
- chamber process orchestration, replacement, drain, stop, and failure handling.
- source-containment planning and launcher conformance.
- cell-side local transport evidence.

### `cadenza-chamber`

Owns:

- chamber-side projection validation, atomic application, and acknowledgement.
- runtime-only route state.
- generated forwarding/proxy support inside the TypeScript adapter image.
- chamber-side addressed signal and delegation frames.
- exact delegated-execution started/completed boundaries.
- serialized command handling and an explicit quiescent drain acknowledgement.

### `cadenza`

Owns primitive meaning, key-first local graph execution, relationship result-contribution policy, and deterministic graph conclusion semantics. The TypeScript core is the working implementation authority; the neutral graph-conclusion fixture governs official-language conformance.

### `cadenza-workspace`

Owns the language-neutral local-orchestration contract, cross-repo fixtures, authority map, decision record after approval, and coherence review.

The Python, Elixir, and C# core repos consume approved primitive-contract changes through the shared conformance fixture. They remain out of scope for chamber adapters and transport implementation.

## Proposed Approach

### 1. Scope Revisions To A Cell Generation

Each cell host start creates a new `cell_generation_key`. It is not a durable environment identity and does not replace `cell_key`; it disambiguates one in-memory host-authority lifetime from another.

All host meta-authority state, projections, acknowledgements, route requests, and orchestration evidence bind:

- `environment_key`.
- `cell_key`.
- `cell_generation_key`.

`host_meta_authority_revision` starts at `1` and increases monotonically only within that generation. A projection or route frame from a previous generation is rejected even when its numeric revision matches the current generation.

On cell disconnect or process loss, the existing launcher custody contract stops the generation's chambers. A successor cell generation reconstructs desired local topology from explicit static input. Sprint 5 does not claim crash reconciliation or durable host-state recovery.

### 2. Keep Host Meta Authority Explicit And Local

The cell maintains one bounded, in-memory authority object containing:

- exact chamber records and lifecycle states.
- immutable image revision and active image epoch per chamber.
- lane and declared responsibilities.
- task-entry membership.
- direct signal and target candidate groups.
- each chamber's required and last acknowledged projection.

Every accepted mutation validates the complete relationship, increments the host revision once, derives affected projections, and emits canonical evidence. Callers cannot mutate internal maps independently.

Actor-owner state is deliberately absent. Adding empty actor structures now would be speculative dead contract surface and would blur the later actor design gate.

### 3. Separate Static Runtime Shape From Dynamic Routing Truth

Static activation data belongs to the immutable image and includes:

- generated forwarding-task descriptors for declared outbound signals.
- generated proxy-task descriptors for declared target tasks and local intent responder bindings.
- lane and layer rules.
- exact runtime-support implementation digest.

Changing which proxies, responders, or forwarding tasks exist requires a new image revision.

Dynamic projection data contains only current chamber-local truth:

```text
cell generation identity
projection revision and digest
source host-meta-authority revision
self chamber identity and image epoch
support-slice responsibilities
signal route groups with candidate chambers and route epochs
target route groups with candidate chambers and route epochs
```

Sprint 5 uses bounded canonical JSON and full replacement snapshots. A chamber rejects the wrong cell generation, self identity, image epoch, stale projection revision, duplicate route identity, unknown static proxy/forwarder, invalid candidate, or oversized snapshot. Accepted snapshots replace runtime route state atomically.

The acknowledgement binds the projection digest, projection revision, source host revision, chamber, image epoch, and cell generation. Receipt of a frame is not acknowledgement of application.

### 4. Make Projection State Part Of Eligibility

A chamber can receive new work only when:

- lifecycle is `ready`.
- its image revision and image epoch are current for the responsibility.
- it has acknowledged the exact required projection.
- the relevant task-entry or route membership is ready.
- it is not draining or failed.

Readiness before projection application is runtime readiness, not routing eligibility. The cell must preserve that distinction in state and evidence.

### 5. Preserve Primitive-Shaped Inter-Chamber Communication

There are still only two execution-time cross-chamber relationships:

- signals for detached work.
- delegation for synchronous execution-root handoff.

`inquire` remains local. The source image's generated proxy task registers as an ordinary responder for the declared intent, then delegates to a target task through the fixed local transport port. No `routes_by_intent` contract is introduced.

Generated forwarding and proxy support receives a private, fixed adapter port. It is not placed in authored callable input, helpers, globals, ambient globals, or a generic capability facade. Requests are descriptor-scoped to static image declarations.

The source chamber selects a candidate from its applied projection. The cell validates source generation, source projection, route epoch, target membership, target image epoch, target readiness, layer rules, and deadline. It either forwards to that exact target or returns a structured rejection. It never silently substitutes another chamber.

### 6. Keep Delegation Retry Meaning Explicit

A delegation starts a normal Cadenza graph at one `target_key`. One absolute deadline covers selection, forwarding, execution, and any caller-controlled retry.

The cell and target chamber distinguish:

- accepted but not started.
- target graph started.
- target graph completed.

Source-facing outcomes remain:

- `fulfilled`.
- `execution_failed` with `execution_started: true`.
- `retryable_reject` with `execution_started: false`.
- `denied` with `execution_started: false`.
- `transport_failed` with explicit `execution_started` uncertainty.

Sprint 5 direct-candidate retryable reasons are `stale_route` and `target_draining`. Actor-specific owner reasons remain out of scope. A channel or chamber failure after the started boundary must not be presented as safely retryable.

### 7. Keep Signal Acceptance Detached

The generated forwarding task observes only statically declared signals that currently have foreign-chamber routes. It selects a projected destination and sends one addressed signal request to the cell.

The cell validates and forwards to the exact target chamber. The target injects the signal locally with a no-forward ingress marker so the same cross-chamber route cannot loop. Acceptance means bounded delivery into the target runtime; it does not promise completion of detached work.

### 8. Replace Chambers By Successor, Publication, Then Drain

Replacement is an ordered operation:

1. create a successor chamber with a new chamber identity or image epoch.
2. contain, activate, and make the successor runtime-ready.
3. update host meta authority and derive new source projections.
4. require affected source chambers to acknowledge those projections.
5. make the successor eligible for new work.
6. mark the predecessor `draining` and reject new ingress to it.
7. issue drain after earlier work on the serialized chamber command stream has returned.
8. stop the predecessor, using bounded deadlines, cancellation, and forced termination when required.

No running image is mutated. A failed successor leaves the predecessor current when that is still safe. Failure after route publication triggers a compensating host-authority mutation and projection publication rather than hidden rollback of revision history.

### 9. Add A Non-Privileged Source Containment Profile

Business and meta-support code are still source-bearing and must not be called isolated merely because they run in child processes.

Sprint 5 adds `source_isolated_v0`, derived from the proven gVisor baseline:

- pinned `runsc`, read-only content-addressed rootfs, separate namespaces, no network, empty capabilities, non-root identity, no-new-privileges, fixed environment, and bounded resources.
- image-specific closed artifacts and runtime components.
- no authority gateway mount, database role, provider credential, or privileged operation broker.

`trusted_control_v0` remains the existing privileged profile and its golden plan/digest behavior must not drift. Shared implementation may normalize common profile construction, but profile-specific validation stays explicit.

Local process tests prove semantics only. Sprint 5 closes only after the multi-chamber workflow and replacement proof pass under real Linux gVisor containment.

### 10. Record Evidence Without Inventing The Final Evidence Store

The cell emits a canonical ordered evidence stream for:

- host meta-authority mutation.
- projection published, applied, acknowledged, and rejected.
- route accepted and rejected.
- delegation accepted, started, completed, or uncertain.
- signal accepted or rejected.
- chamber replacement, drain, failure, and stop.

The stream binds cell generation, host revision, projection revision, route epoch, image revision/epoch, chamber identities, and correlation identities. Tests and Linux closure preserve it as a deterministic proof artifact.

Sprint 5 does not widen the four-category PostgreSQL pre-transition evidence API or claim a production durable orchestration-evidence store. That belongs to the later evidence design.

## Sprint Structure

### Sprint 5A: Neutral Contract And Host Meta Authority

- add language-neutral schemas and adversarial fixtures.
- add cell-generation identity and host meta-authority state machine.
- add chamber registry, direct route groups, revisions, and eligibility rules.
- prove deterministic mutation, projection derivation, and stale-generation rejection.

### Sprint 5B: Projection Application And Lifecycle Orchestration

- add chamber projection apply/ack protocol.
- add cell publication tracking and exact acknowledgement validation.
- add source-isolated containment profile.
- add multi-chamber create, ready, drain, replace, fail, and stop orchestration.

### Sprint 5C: Primitive Transport

- add deterministic core graph conclusions using one immutable run-entry baseline.
- add relationship-level result contribution without changing completion participation.
- add generated forwarding/proxy descriptors to immutable images.
- add private adapter-to-host signal and delegation ports.
- implement source selection, host validation, target ingress, and local inquiry proxying.
- prove deadlines, started/completed boundaries, stale-route rejection, detached signal semantics, and layer boundaries.

### Sprint 5D: Integrated Closure

- bootstrap and activate an operational environment.
- run a contained trusted-control chamber, two contained business chambers, and one contained meta-support chamber.
- execute a business inquiry whose local proxy delegates to another business chamber.
- emit a business signal accepted by the meta-support chamber.
- replace the target business chamber successor-first.
- prove stale-route rejection, projection refresh, successful post-replacement execution, drain, and orderly stop.
- run the final coherence and security-boundary review.

## Acceptance Criteria

### Identity And State

- every runtime frame is bound to the current cell generation.
- host and projection revisions are monotonic and cannot be confused across generations.
- chamber image revisions are immutable and replacement uses a successor identity or epoch.
- actor state and actor ownership are absent from the Sprint 5 contract.

### Projection

- projections are chamber-specific, bounded, canonical, digest-bound full snapshots.
- stale, duplicated, cross-generation, cross-image, or malformed projections fail closed.
- acknowledgement proves exact application, not receipt.
- no chamber is eligible before its required projection is acknowledged.

### Transport

- authored business definitions contain no topology or retry machinery.
- signals and delegation are the only cross-chamber execution relationships.
- inquiry remains local through ordinary responder registration.
- the source selects and the host validates; the host never silently reroutes.
- deadlines do not reset across the boundary.
- post-start uncertainty cannot be reported as safe retry.
- delegated results use the core graph conclusion rather than exported topology or completion order.
- compatible terminal provenance deltas compose and deterministic conflicts fail explicitly.
- excluded relationships remain completion participants and do not become detached work.

### Security

- all Linux closure chambers run under measured gVisor containment.
- business and meta-support authored callables receive no authority gateway, credential, SQL, network, filesystem API, subprocess, package-loader, or generic host object.
- static generated support receives only its descriptor-scoped transport port.
- hostile projection, route, generation, layer, lifecycle, and callback tests fail closed.
- the existing trusted-control proof remains green and digest-stable where declared stable.

### Lifecycle

- successor readiness and projection acknowledgement precede predecessor drain.
- draining chambers receive no new work.
- active execution and cancellation bounds are visible to the host.
- failure and compensation advance history instead of mutating prior evidence.

## Validation Strategy

### Workspace

- `./scripts/check-agent-harness.sh`
- cross-repo contract fixture and authority-map validation.

### `cadenza`

- run the existing core build, typecheck, and tests as a regression consumer.
- add no core code unless a separately approved authority change is required.

### `cadenza-chamber`

- formatting, strict Clippy, all tests, RustSec audit, and deterministic adapter build.
- projection parser and atomic apply adversarial tests.
- generated proxy/forwarder, delegation-boundary, signal-loop, deadline, drain, and adapter-hostile tests.

### `cadenza-cell`

- formatting, strict Clippy, all tests, and RustSec audit.
- host meta-authority model tests and deterministic evidence tests.
- hostile generation, revision, route, acknowledgement, lifecycle, and layer-boundary tests.
- launcher and existing privileged-containment regressions.
- explicit Linux gVisor integrated closure.

## Risks

### Host Meta Authority Becomes A Second Environment Authority

Risk: local runtime truth starts redefining semantic objects or policy.

Control: host authority may own only cell-local generated identities, runtime state, and environment-derived responsibilities. It cannot create semantic business objects, change policy, or mutate environment authority.

### Generated Runtime Support Becomes Ambient Authority

Risk: authored callables discover or invoke generic chamber transport.

Control: fixed adapter-owned closures are generated only from immutable descriptors; authored handlers never receive the port or select undeclared target identities.

### Revision Proliferation Becomes Opaque

Risk: image, epoch, host, projection, and route revisions become interchangeable counters.

Control: each revision has one authority, scope, transition rule, and evidence role. Cell generation prevents reuse across host lifetimes.

### Replacement Loses Or Duplicates Affect

Risk: routing changes while executions or detached signals are in flight.

Control: publish and acknowledge successor routes before drain, reject new predecessor ingress, preserve started/completed boundaries, and never promise detached signal completion.

### Sprint 5 Expands Into Distribution

Risk: network transport, placement, actors, or stem-cell policy enter because local structures resemble future distributed structures.

Control: every implemented relationship must terminate inside one cell generation. Cross-cell identities and envelopes are forbidden in this sprint.

### Linux Proof Becomes Operationally Heavy

Risk: several contained Node runtimes make integration slow or machine-sensitive.

Control: keep fixtures minimal, use lane-specific bounded resources, separate deterministic contract tests from the explicit Linux closure, and do not convert performance thresholds into functional pass criteria.

## Migration Strategy

1. Consolidate Sprint 4C records and freeze its proof fixtures.
2. Approve this design and record the decision without changing product behavior.
3. Update neutral contracts and `contracts.config.json` authority entries first.
4. Implement Sprint 5A in `cadenza-cell` with fixture-only chamber consumers.
5. Implement Sprint 5B chamber projection and lifecycle contracts in `cadenza-chamber`, then consume them in `cadenza-cell`.
6. Implement the authority-first graph conclusion contract in `cadenza`, propagate official-core conformance, then implement Sprint 5C adapter support and cell routing against approved fixtures.
7. Build the integrated static topology and run local hostile tests.
8. Run the real Linux gVisor closure and coherence review.
9. Move this plan to completed only when every acceptance criterion is proven or explicitly returned to a new design gate.

Backward compatibility with legacy service, engine, demo, CLI, or old major-version APIs is not required. Existing Sprint 4C bootstrap and trusted-control fixtures are regression authorities and must remain interpretable.

## Alternatives

### Start With Multi-Cell Distribution

Rejected because network identity, envelopes, retry, and partition behavior would be added before local lifecycle and routing authority are coherent.

### Implement Static Placement Units In Sprint 5

Rejected because placement is environment desired state, while Sprint 5 needs only explicit static local assignments. Placement units and replicas belong to the next distribution phase.

### Route Everything Through The Cell

Rejected because a host-selected generic dispatcher would hide stale state and make the host a second workflow engine. Source selection from a bounded projection keeps local and future distributed semantics aligned.

### Add A Generic Chamber RPC Or Capability

Rejected because it would bypass primitive meaning and create ambient horizontal authority.

### Include Actor Residency Fields But Leave Them Empty

Rejected under the spotless standard. Unused actor contract surface would prejudge the actor design and serve no Sprint 5 behavior.

### Use Development Child Processes For Closure

Rejected as the final proof because process separation does not establish source isolation. It remains useful for fast semantic tests only.

## Assumptions

- The first multi-chamber implementation remains TypeScript-adapter-only while cross-boundary contracts stay language neutral.
- Static local assignment input is acceptable before placement units and stem-cell reconciliation exist.
- `single_fixed` and `round_robin` are sufficient before actor-aware routing.
- A cell process restart ends its generation and all chambers in that generation; durable restart reconciliation is deferred.
- The final local evidence store is intentionally deferred, but deterministic canonical evidence is required now.
- Performance thresholds remain deferred to the agreed clean-machine rerun and are not Sprint 5 functional criteria.
- The approved V0 signal-lane policy permits same-lane delivery and `business -> meta_support`, while rejecting every other cross-lane direction. Expansion requires a superseding decision and environment-derived policy.

## Coherence Review

### Identity

Environment, cell, cell generation, chamber, image revision, image epoch, host authority revision, chamber projection, route group, delegation, signal delivery, and evidence remain distinct identities. Actor-owner identity is not invented before it participates.

### Affect And Security

Authored logic can affect another chamber only through generated primitive-shaped support constrained by immutable descriptors and current projection. The cell validates and mediates that affect without entering business semantics or exposing host powers.

### Relationships And Interpretation

Environment-derived responsibilities flow into host authority; host truth becomes bounded chamber projections; chamber decisions carry revisions back to the host for validation; outcomes and acknowledgements let the host interpret chamber state. Sibling chambers remain mutually interpretable through route groups without receiving a full chamber directory.

### Temporal Stewardship

Cell generations prevent revision ambiguity across restart. Successor-first replacement, monotonic revisions, immutable images, exact acknowledgements, and ordered evidence preserve why a chamber was eligible and where execution uncertainty began.

### Preliminary Judgment

The design `fits` the intended whole if implementation preserves the stated exclusions. It moves deployment and local distribution complexity beneath authored workflows while avoiding a generic orchestration product, ambient transport, speculative actor model, or hidden mutable topology.

## Implementation Checkpoint

Sprint 5A and 5B are implemented and validated:

- language-neutral projection fixtures and schemas, cell-generation identity, host meta authority, exact projection acknowledgement, and source-selected route validation.
- immutable runtime-support declarations bound to the adapter artifact and rejected on prebuilt privileged images.
- chamber projection application through the real cell protocol.
- distinct `source_isolated_v0` gVisor planning and launcher enforcement without changing `trusted_control_v0` behavior.
- successor-first multi-chamber replacement with source projection acknowledgement before predecessor drain and stop.
- complete chamber and cell validation, npm audit, and RustSec audit with no reported vulnerabilities.

The delegated-result design gate is resolved, approved, implemented, and validated:

- one internal conclusion boundary is synthesized per graph-run identity rather than persisted into authored topology.
- every terminal delta uses the immutable context supplied at run entry as its baseline; intermediate splits never reset provenance.
- disjoint changes merge, identical changes collapse, and same-path or parent/child conflicts produce an explicit composition failure.
- an authored unique join task owns any custom domain merge and passes its output to the internal conclusion.
- relationship contribution policy is flow-specific, defaults to contributing, and never changes completion participation.
- composition and terminal execution failures cross chamber delegation as started `execution_failed` outcomes.
- the TypeScript authority tracks one conclusion per run identity, preserves terminal task-path provenance, and exposes completed or explicit failure outcomes without persisting an internal conclusion node.
- inquiries use the same deterministic composition rule rather than completion-order shallow merge.
- the TypeScript chamber adapter preserves relationship contribution policy during materialization and maps composition failure to a started `execution_failed` delegation outcome.
- Python, Elixir, and C# provide idiomatic pure composers, explicit relationship contribution APIs, deterministic direct-run behavior, and shared-fixture conformance.

Validation at this checkpoint:

- workspace agent harness and JSON contract documents pass.
- TypeScript typecheck and build pass; all 143 non-performance tests pass.
- the full TypeScript run reached 143 passing functional tests; only the separately deferred machine-sensitive CPU and retry performance tests failed their threshold/timeout.
- chamber formatting, strict Clippy, adapter typecheck/build, and all Rust test targets pass.
- Python compile and 86 tests pass.
- Elixir formatting and 74 tests pass.
- C# formatting, warning-free build, and 41 tests pass.

The generated forwarding/proxy and private local-transport slice is now implemented:

- source images materialize adapter-owned target proxies and signal forwarders from immutable descriptors; authored callables receive no transport object.
- projection application reaches the TypeScript adapter and is acknowledged only after Rust and adapter acceptance of the same full snapshot.
- generated support selects `single_fixed` and epoch-scoped `round_robin` candidates from the applied projection.
- adapter callbacks carry addressed delegation or signal envelopes; Rust revalidates immutable descriptor, source image, projection, route group, selected candidate, ingress identity, correlation, deadline, and result bound before calling the cell.
- the cell validates current host truth and forwards only to the exact selected control. It never silently reroutes.
- local inquiry proxies preserve retryable pre-target route outcomes without inferring results from exported graph topology.
- target signal ingress applies adapter-owned no-forward state, and hostile unbrokered adapter transport requests fail closed.
- the chamber-cell protocol advanced to `0.3.0` with explicit `deliver_signal`, `delegate_local`, and `forward_signal` operations.

Validation at this transport checkpoint:

- workspace agent harness passes.
- TypeScript adapter typecheck and deterministic artifact build pass.
- chamber formatting, strict Clippy, and all test targets pass, including generated proxy, normalized stale-route, Rust revalidation, no-forward, and hostile callback coverage.
- cell formatting, strict Clippy, and all test targets pass; the PostgreSQL integration remains explicitly ignored and Linux-only suites contain no tests on macOS as before.

Sprint 5C is closed:

- the V0 signal-lane decision permits same-lane and `business -> meta_support` delivery and rejects every other cross-lane direction before route mutation, at projection publication, and at addressed delivery.
- the real TypeScript adapter and Rust chamber broker prove one authored signal emission becomes one addressed host callback.
- target ingress applies adapter-owned `no_forward` state and remains suppressed after asynchronous listener execution.
- invalid lane configuration leaves host-authority revision and route state unchanged.
- full chamber and cell formatting, strict Clippy, and test suites pass; the adapter typecheck and deterministic build pass; root contract JSON and agent harness pass.
- the PostgreSQL-backed integration remains explicitly ignored pending its separately provisioned local services, as before.

The next implementation step is Sprint 5D contained multi-chamber Linux closure.

## Sprint 5D Source Activation Amendment

### Context

Sprint 5D requires real business and meta-support chambers. Their immutable images must use `MaterializationPlan::SourceSlice` so the adapter can materialize authored primitives and generated proxy/forwarder support. The current production `ActivationEnvelope -> ChamberActivator` path always constructs `PrebuiltArtifact`; only direct runtime-image tests can currently construct a source image.

The existing contracts already distinguish prebuilt bootstrap-kernel artifacts from digest-locked, database-authored source slices, but they do not define how resolved source-artifact bytes become the source-slice materialization plan during production activation. Continuing without closing this boundary would force the Linux proof to use special test glue and create false success.

### Proposed Approach

- define one fixed source artifact class selected by the authority-bound handler key `cadenza-source-slice-v0`.
- keep source authority behind the existing immutable `ArtifactResolver` host port; do not add a generic definition or database port.
- require resolved artifact bytes to match the authority-approved artifact digest before parsing, as today.
- require the bytes to be bounded canonical JSON that deserialize exactly to `RuntimeSlice`; reject duplicate keys, non-canonical bytes, trailing data, and unknown fields before image construction.
- construct `MaterializationPlan::SourceSlice` only from that verified payload. Every other handler remains `PrebuiltArtifact` and retains existing behavior.
- require source-slice identity and version to equal the verified authority slice identity and version.
- keep dependency-lock, core, adapter, callable, primitive, generated-support, and image-digest validation unchanged and fail closed.
- add hostile tests for handler confusion, digest mismatch, malformed/non-canonical payload, identity drift, dependency drift, and source support on a prebuilt artifact.

### Impacted Repos

- `cadenza-chamber`: source-artifact classification, bounded canonical decoding, activation image construction, contracts, and hostile tests.
- `cadenza-cell`: source-artifact activation fixtures and the Sprint 5D integration proof; no new host capability or protocol operation.
- `cadenza-workspace`: contract clarification and the approved amendment decision.
- `cadenza`: consumer regression only; primitive semantics and source definitions do not change.

### Risks

- handler-key confusion could interpret a prebuilt module as source authority. Control: one exact reserved handler and mutually exclusive decoding paths.
- a valid digest could still cover ambiguous JSON. Control: bounded duplicate-rejecting canonical decoding and exact canonical byte equality.
- source identity could diverge from activated slice authority. Control: exact slice and version equality before image construction.
- the artifact payload could become a generic package format. Control: V0 accepts exactly one `RuntimeSlice` object and no dependency payloads or executable host references.

### Migration Strategy

This is a new major-version foundation with no backward-compatibility requirement. Existing `authority-gateway-v0` activation remains unchanged. New business and meta-support fixtures use `cadenza-source-slice-v0`; no legacy artifact is reinterpreted.

### Alternatives

- add the full materialization plan to `ActivationEnvelope`: rejected because it duplicates source authority outside the already digest-verified artifact resolver and increases disagreement states.
- add a `read_source_slice` host port: rejected because immutable artifact resolution already owns this affect and a second source-authority port widens the chamber protocol without adding meaning.
- build test-only source images outside production activation: rejected as false success because Sprint 5D must prove the real authority-to-contained-runtime path.

### Approval And Implementation

The user approved this amendment with `Design approved. Proceed.` on 2026-07-14. The reserved source handler, canonical strict decoding, authority identity checks, and hostile source-artifact tests are implemented in `cadenza-chamber`.

## Sprint 5D Operational Activation Grant Amendment

### Context

The source-artifact amendment closes how verified source bytes become a runtime image, but production activation still accepts only the original Environment Bootstrap handoff. That handoff is cryptographically and semantically bound to the one seeded authority-access slice. A business or meta-support slice cannot reuse it without pretending to be bootstrap authority, and the current contracts define no later signed activation authority.

Sprint 5D therefore cannot activate real source chambers coherently until the environment can issue a bounded operational chamber activation grant. This is a separate authority identity from the bootstrap handoff and from the cell's containment attestation.

### Proposed Approach

- replace the bootstrap-only field in `ActivationEnvelope` with a tagged authority proof: `bootstrap_handoff` or `operational_activation_grant`.
- preserve the current bootstrap verifier unchanged for the first trusted-control chamber.
- define canonical `OperationalActivationGrantV0` containing:
  - grant key, environment key, cell key, complete chamber identity and lane, activation nonce, and authority revision.
  - slice key, object key, version key, trust profile, artifact reference, runtime requirement, activation policy reference, and required capabilities.
  - the canonical digest of the exact immutable `RuntimeSupportManifest` supplied in the activation envelope.
  - issue and expiry times, grant digest, signing key identity, algorithm, and signature.
- require V0 grants to be signed by the active environment trust-root key. Key custody remains outside the cell; the cell receives a grant, not signing authority.
- have the chamber resolve that key independently, verify canonical digest/signature/time bounds, reread current activation authority, and require exact agreement before artifact resolution.
- keep the cell's separate containment signature and measurement checks. The environment grant authorizes what may run; the cell attestation proves how and where it is contained.
- bump the cell-chamber protocol to `0.4.0` because the activation envelope is intentionally breaking in this new major-version foundation.
- add hostile tests for cross-environment/cell/chamber/image/lane/nonce use, stale authority, support-manifest drift, expiry, wrong signer, signature/digest mutation, and bootstrap/operational proof confusion.
- use root-signed deterministic grants in Sprint 5D conformance fixtures. Delegated operational activation signers remain a later explicit design.

### Impacted Repos

- `cadenza-chamber`: neutral grant contract, verifier, tagged activation authority proof, protocol version, activation integration, and hostile tests.
- `cadenza-cell`: grant construction/fixture consumption, activation coordinator updates, and four-chamber integration.
- `cadenza-workspace`: contract documentation and approved decision record.
- `cadenza`: regression consumer only; bootstrap output and primitive meaning remain unchanged.

### Risks

- keeping the trust root online would weaken the root boundary. Control: Cadenza stores and transports only signed grants; V0 does not give the cell a root private key or define online custody.
- cell containment authority could be confused with environment execution authority. Control: two distinct signatures, identities, and verification purposes remain mandatory.
- runtime support could be injected after grant issuance. Control: the grant binds its canonical digest and the chamber compares the exact envelope manifest.
- a reusable grant could cross chamber generations. Control: bind complete chamber identity, image epoch, activation nonce, cell, environment, validity window, and authority revision.

### Migration Strategy

Backward compatibility is not required. Existing bootstrap callers move their current `bootstrap_case` into the tagged `bootstrap_handoff` proof without semantic change. Operational source chambers require the new grant. No legacy activation envelope is silently reinterpreted.

### Alternatives

- trust the cell's current-authority read without a signed grant: rejected because a compromised or confused host could invent source execution authority.
- reuse the bootstrap handoff for every slice: rejected because it is explicitly bound to the seeded authority-access slice.
- let the cell sign operational grants: rejected because containment custody must not become environment semantic authority.
- introduce delegated activation signers now: deferred because signer delegation and revocation deserve their own authority design; root-signed conformance grants prove the narrow boundary first.

## Questions Or Blockers

- None. V0 replacement is explicitly serialized. The chamber accepts drain only after earlier commands on that control stream return, then acknowledges its `draining` state with new ingress closed. Concurrent execution and control multiplexing are deferred to an optimization pass after the first Cadenza environment is complete.

## Sprint 5D Implementation Checkpoint

The authority and macOS conformance portions of Sprint 5D are implemented:

- `ActivationEnvelope` now carries a strict tagged bootstrap handoff or operational activation grant and the cell-chamber protocol is `0.5.0`.
- operational grants bind complete chamber identity, runtime support, current source authority, validity, digest, and environment-root Ed25519 signature; hostile identity, nonce, support, time, signature, policy, and revocation changes fail closed.
- authority-bound `cadenza-source-slice-v0` artifacts become source materialization plans only after canonical byte, digest, strict shape, and source identity verification.
- runtime images use neutral authority-proof provenance and the TypeScript adapter validates image contract `0.2.0`.
- a four-chamber multi-process conformance test activates a business source, business target, meta-support signal consumer, and successor target through production protocol paths. It proves generated proxy delegation, detached business-to-meta-support signal ingress, projection publication, successor-first replacement, predecessor drain/stop, and post-replacement delegation.
- chamber and cell formatting and strict Clippy pass at this checkpoint.

The same four-chamber path now passes in the provisioned ARM64 Linux environment with every chamber running under a signed `source_isolated_v0` gVisor plan. The proof independently checks each live systemd cgroup's memory, CPU, and PID limits and finishes with no remaining runsc container, bundle, or test cgroup. Exact measured inputs are recorded in `cadenza-cell/docs/linux-gvisor-evidence-2026-07-13.md`.

Sprint 5D is closed. The final coherence and security review found and removed
the dead active-execution contract, formalized serialized V0 quiescence, and
deferred concurrency to the post-first-environment optimization pass. Complete
formatting, strict Clippy, Rust test, RustSec, TypeScript dependency, and ARM64
Linux gVisor validation passed. The macOS conformance proof and Linux
containment proof remain explicitly distinguished.

## Approval

The user approved this design with `Design approved. Proceed.` on 2026-07-13.

The user approved the deterministic graph-conclusion amendment with `agreed. proceed` on 2026-07-14 after explicitly selecting run-entry-baseline provenance merging, relationship contribution policy, authored custom joins, and conflict-detecting composition.

The user approved the V0 signal-lane restriction on 2026-07-14: same-lane and `business -> meta_support` signals are allowed; every other cross-lane direction is rejected for now.

The user approved the Sprint 5D source-activation amendment with `Design approved. Proceed.` on 2026-07-14.

The user approved serialized V0 quiescence on 2026-07-14 and explicitly deferred concurrent chamber execution and control multiplexing to an optimization pass after the first Cadenza environment is complete.

The user approved the Sprint 5D operational activation grant amendment with `Design approved. Proceed.` on 2026-07-14.
