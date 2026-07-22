# Trusted Cell And First Activation Design Proposal

Date: 2026-07-13

## Goal

- Outcome: implement the minimum trusted cell host required to activate the seeded privileged authority-access slice and move one environment from `handoff_ready` to a separately evidenced `operational` state.
- Why it matters: Cadenza cannot safely extend itself until a contained authority gateway can execute the approved authority flows without exposing database credentials, ambient host powers, or an ungoverned administration API to authored code.

## Status

- State: `done`
- Current phase: Sprint 4C.1, 4C.2, and 4C.3 are implemented, validated, and
  closed. The complete first trusted-control activation passes under the
  approved Linux gVisor profile.
- Complexity gate: required because this is a security boundary, architectural multi-repo change, schema/migration change, new external runtime dependency, and core domain authority implementation.
- Approved by the user with `Design approved. Proceed.` on 2026-07-13.

## Impacted Repos

- `cadenza`
  - authority/security semantics.
  - Environment Bootstrap V0 and PostgreSQL schema authority.
  - official TypeScript primitive semantics.
- `cadenza-chamber`
  - chamber activation, immutable images, contained runtime protocol, primitive ingress, normalized outcomes, and runtime evidence contracts.
- new `cadenza-cell`
  - trusted local host, containment launcher, credential custody, capability brokers, chamber process control, local routing, termination, and containment evidence.
- legacy service, database, engine, CLI, demos, and memory repos are not inputs.

## Context

Environment Bootstrap V0 ends at a signed `handoff_ready` state. Chamber Sprints 4A and 4B can independently verify the handoff and run a non-privileged source slice, but deliberately reject the privileged authority gateway.

The remaining bootstrap constraints are:

- create containment before chamber or adapter code starts.
- keep the bootstrap-owner credential out of the cell runtime path.
- give the gateway no database client, filesystem, network, subprocess, package-loader, or secret-provider object.
- expose `authority_access/admin` only through a method-specific broker.
- replace the placeholder gateway digest with a reproducible artifact digest.
- revalidate current authority and revocation state at activation.
- record materialization, capability, execution, and transition evidence.
- make `operational` a post-bootstrap authority transition rather than another bootstrap step.

## Intended Whole

A trusted cell is the smallest local host that can create and steward isolated chambers, grant only authority-approved capabilities, keep credentials and provider implementations outside executable code, and turn runtime evidence into governed local action.

It exists so Cadenza business and meta logic can remain primitive-shaped while deployment, containment, process custody, authority access, resource control, and failure response are absorbed below that logic.

The minimum cell is not yet the distributed cell system. It does not place replicas, route between cells, assign actors, scale workloads, reconcile a stem cell, or expose a general orchestration API.

## Threat Model

Sprint 4C treats these as potentially hostile or compromised:

- database-authored callable source.
- the TypeScript adapter and Node runtime.
- a running chamber after activation.
- malformed chamber/cell protocol frames.
- gateway requests that exceed their declared method or schema.
- artifact bytes, manifests, and mutable filesystem paths not proven by digest.

The V0 trusted computing base includes:

- the Linux host kernel and hardware boundary.
- the pinned gVisor `runsc` runtime.
- the narrow cell launcher and cell host.
- the Rust chamber kernel.
- the authority broker implementation and reviewed PostgreSQL security-definer functions.
- trusted artifact/key stores, the authority database, and cell key custody.

Compromise of the Linux host, database superuser, cell signing key, gVisor itself, or the cell host remains outside the containment claim. Denial of service by a privileged gateway is bounded by resources and termination but is not claimed to be impossible.

## Proposed Approach

### 1. Separate Official Cell Repository

Create one independent repository:

```text
cadenza-cell/
```

Use Rust for the trusted local host and launcher. This is substrate code, not a fifth core implementation and not a Cadenza meta slice.

The repository contains two binaries with separate privilege:

- `cadenza-cell`: unprivileged long-running host, broker, evidence publisher, and chamber controller.
- `cadenza-cell-launcher`: narrow root-owned or otherwise host-authorized launcher that accepts only a signed, schema-valid containment plan produced by the cell.

The launcher is not a generic OCI API. It cannot accept arbitrary commands, mounts, environment variables, capabilities, network settings, or runtime flags. Its policy is static, versioned, tested, and digest-addressed.

### 2. Mandatory V0 Privileged Containment Profile

Use gVisor `runsc` as the minimum `trusted_control_v0` profile.

Required properties:

- Linux host; macOS may build contracts but cannot produce privileged-containment evidence.
- direct pinned `runsc` invocation through the narrow launcher; no Docker socket or general container daemon API.
- gVisor `systrap` inside a VM or without KVM; gVisor KVM platform may be used on suitable bare metal.
- external networking disabled with `--network=none`.
- dedicated PID, mount, IPC, UTS, user, cgroup, and network namespaces in the OCI plan.
- non-root workload identity and explicit UID/GID mappings.
- empty Linux capability sets and `no_new_privileges`.
- read-only content-addressed root filesystem.
- no host bind mounts except launcher-created protocol descriptors; no host paths visible to the workload.
- bounded tmpfs only where Node/runtime operation requires it, mounted `nosuid`, `nodev`, and `noexec` where compatible.
- cgroup v2 limits for memory, CPU, process count, and output buffers.
- wall-clock deadline, cancellation, kill, and reap owned outside the sandbox.
- fixed environment allowlist containing no credentials, tokens, host paths, proxy variables, or package configuration.
- pinned chamber, Node, core, adapter, gateway, dependency, rootfs, profile, and `runsc` digests.

gVisor is selected because it interposes a userspace application kernel and restricts direct workload access to the host kernel while remaining OCI-compatible and regularly testing Node compatibility. Linux namespaces, cgroups, capabilities, LSM/filesystem controls, and seccomp remain defense in depth; Linux documentation explicitly warns that seccomp alone is not a sandbox.

Firecracker remains the recommended later `trusted_control_microvm_v1` profile for higher-assurance or multi-tenant deployments. Requiring it now would add KVM, guest kernel, rootfs, jailer, update, and guest-agent stewardship before the first cell contract is proven. Plain runc/OCI containment is insufficient for this first privileged gateway.

Primary technology evidence:

- gVisor security architecture: https://gvisor.dev/docs/architecture_guide/intro/
- gVisor Node/runtime compatibility: https://gvisor.dev/docs/user_guide/compatibility/
- gVisor network isolation: https://gvisor.dev/docs/user_guide/networking/
- OCI Linux isolation model: https://specs.opencontainers.org/runtime-spec/config-linux/
- Linux seccomp boundary warning: https://docs.kernel.org/userspace-api/seccomp_filter.html
- Firecracker security and jailer model: https://firecracker-microvm.github.io/

### 3. Contain The Chamber And Adapter Together

The sandbox entrypoint is a new `cadenza-chamber` executable. The Rust chamber kernel and its Node adapter run inside the same gVisor sandbox. The cell, credentials, authority broker, artifact/key readers, and durable evidence sink remain outside.

The cell must not run the Rust chamber in trusted host memory and contain only Node. A compromised chamber kernel is part of the sandbox threat domain and must not inherit host authority.

### 4. Explicit Cell-Chamber Host Protocol

Add a bounded, multiplexed, canonical-JSON protocol over launcher-created inherited descriptors. It carries:

- activation and lifecycle commands from cell to chamber.
- key, current-authority, artifact, capability-mount, and evidence requests from chamber to cell.
- capability invocations from chamber to cell.
- delegation, signal, status, drain, cancellation, and stop traffic.

Every frame has:

- protocol/version.
- request and correlation identity.
- direction and operation.
- chamber, cell, environment, image, epoch, authority, and projection identity where applicable.
- absolute deadline and cancellation identity.
- bounded payload and declared maximum response size.
- normalized success or failure with `execution_started` where relevant.

No live Rust object, file descriptor supplied by authored code, provider object, callback, database handle, socket handle, or generic host-call operation crosses this protocol.

### 5. Measured Containment Attestation

The launcher produces a measured containment record after creating the sandbox and before chamber activation. It contains:

- cell and launcher identity.
- profile id/version and profile digest.
- `runsc` binary/version/digest and platform.
- OCI plan digest.
- rootfs and every executable artifact digest.
- namespace, UID/GID, capability, no-new-privileges, network, mount, environment, and cgroup facts.
- protocol descriptor identities.
- issued/expiry time and activation nonce.

The cell signs the canonical record with its enrolled cell key. The chamber resolves the enrolled public key through the existing trust boundary and verifies the signature and nonce before privileged image construction.

This is measured host attestation, not hardware remote attestation. The contract must say so explicitly. A future TPM/TEE or cloud-attestation proof may replace or supplement the signer without changing containment meaning.

### 6. Domain-Shaped Capability Broker

`authority_access/admin` is mounted as one opaque broker identity. The Node adapter receives a generated capability facade, not a database client or general RPC client.

Invocation path:

```text
gateway task
-> generated authority capability facade
-> adapter/chamber-local capability channel
-> Rust chamber validates image mount and request identity
-> cell-chamber protocol
-> cell validates chamber/image/epoch/revision/method/deadline
-> authority broker method
-> PostgreSQL approved function
-> normalized result and evidence
```

Each request binds:

- capability mount identity and mode.
- exact operation name and request schema version.
- chamber/image/epoch and primitive definition/version.
- subject, runtime principal, authority revision, and idempotency key.
- absolute deadline and maximum result size.

Unknown operations, generic SQL, table names, arbitrary predicates, dynamic procedure names, multi-statement text, and raw transaction control fail closed.

### 7. Separate Database Roles And Credential Custody

Use three distinct database authorities:

- bootstrap owner/migrator
  - schema and static bootstrap only.
  - absent from cell configuration after handoff.
  - login disabled or credential rotated and active sessions terminated before operational transition.
- activation reader
  - execute-only access to exact read functions needed for current authority, trust, revocation, artifact, and policy checks.
  - cannot mutate authority.
- authority gateway broker
  - execute-only access to reviewed authority-flow and operational-transition functions.
  - no direct table DML, DDL, role management, arbitrary function execution, or schema creation.

Database functions use fixed `search_path`, explicit argument types, no dynamic SQL, revoked `PUBLIC` access, and a non-login owner. Mutating functions create authority and runtime evidence in the same transaction as their decision.

Credentials enter only the unprivileged cell process through deployment-owned secret descriptors or a later secret provider. They are never written into images, OCI configs, environment passed to the sandbox, logs, evidence payloads, chamber frames, adapter frames, or callable context.

### 8. Reproducible Authority Gateway Bundle

Add an independently built package under the authority-owning `cadenza` repository:

```text
cadenza/authority-gateway/
```

It is not part of the root core package and must not introduce persistence into the core. It builds a deterministic, dependency-locked gateway bundle consumed as a `prebuilt_artifact` by `cadenza-chamber`.

The bundle contains:

- artifact manifest and format version.
- handler identity.
- official core/runtime/adapter requirements.
- exact primitive definitions and versions.
- bundled callable modules and source/build digests.
- schemas and capability operation declarations.
- dependency lock and reproducibility metadata.

The gateway has no `pg`, network, filesystem, subprocess, package-fetch, secret, or cell-control dependency. Its only external affect is the generated `authority_access/admin` facade.

It exposes explicit intents/tasks for the eight approved canonical flows:

- `Version.CreateInitialObject`
- `Version.CreateNextVersion`
- `Version.SetCurrent`
- `Tag.Assign`
- `Tag.Remove`
- `Tag.RecomputeEffectiveForObject`
- `Policy.EvaluateResourceAction`
- `Policy.EvaluateTagAction`

The seeded families `graph_query`, `graph_command`, `projection_command`, and `bootstrap_admin` remain grouping metadata. They do not become generic dispatch APIs.

`bootstrap_admin` contains one V0 command: request the post-activation operational transition with its complete proof bundle.

### 9. Preserve Bootstrap State; Add Operational Authority

`bootstrap_run.state` and `environment.bootstrap_state` remain `handoff_ready`. Bootstrap history is immutable and must not be rewritten to look operational.

Add post-bootstrap authority records through a new ordered migration:

- current environment operational state, initially `pending_activation`.
- immutable environment operational transitions.
- append-only runtime/capability evidence needed by the proof.

The sole V0 transition is:

```text
pending_activation -> operational
```

It is executed only through the gateway broker and requires:

- exact environment, cell, chamber, image, epoch, gateway artifact, and handoff identity.
- current active trust root and cell enrollment.
- current compatible authority revision and activation policy.
- valid signed containment attestation.
- gateway materialization/readiness evidence.
- successful brokered authority self-test through the running gateway.
- evidence that the bootstrap owner is absent from runtime configuration and retired according to deployment policy.
- no intervening revocation, containment, or authority drift.

The database transition uses compare-and-set semantics, increments authority revision, records immutable evidence, and returns the resulting revision. The cell then revalidates that revision and may report the environment as operational.

The chamber does not mark the environment operational. The cell does not mutate the state directly. The contained gateway requests a domain operation; the broker and authority transaction decide it.

## Sprint Structure

### Sprint 4C.1: Cell Contract And Containment Proof

- create `cadenza-cell` and workspace authority/routing records.
- define cell identity, lifecycle, containment plan, attestation, launcher, host protocol, and evidence contracts.
- add the `cadenza-chamber` executable and remote host-port protocol.
- implement the deterministic `trusted_control_v0` gVisor plan and narrow launcher.
- prove no network, host filesystem, ambient environment, Linux capabilities, extra processes, or undeclared mounts are available.
- prove timeout, cancellation, output limits, crash, and forced termination across the sandbox boundary.
- use a synthetic privileged fixture with no real credential or authority mutation.
- stop for containment coherence review before database credentials are introduced.

### Sprint 4C.2: Authority Broker And Gateway

- add PostgreSQL migration 002 for roles, execute-only authority functions, operational state, and runtime evidence.
- implement all eight canonical authority flows against the approved neutral contracts.
- add the activation-reader and authority-gateway broker adapters in `cadenza-cell`.
- build the deterministic gateway bundle and replace the placeholder artifact digest in bootstrap authority/fixtures.
- implement prebuilt-artifact materialization and generated capability facades in `cadenza-chamber` and the TypeScript adapter.
- prove malformed, overbroad, stale, revoked, duplicate, oversized, and unauthorized operations fail closed.
- prove neither gateway nor chamber can obtain credentials or invoke SQL directly.
- stop for authority and broker coherence review before operational transition.

### Sprint 4C.3: First Trusted-Control Activation

- bootstrap a fresh disposable PostgreSQL environment.
- retire the bootstrap owner from the runtime path.
- start the enrolled first cell under the approved Linux profile.
- activate the real digest-approved authority gateway.
- execute gateway self-test and operational-transition command.
- revalidate resulting authority revision and readiness.
- prove restart/replay is idempotent and interruption cannot create false operational state.
- run attack/failure tests and final coherence review.

## Acceptance Criteria

### Containment

- privileged chamber starts only under an unexpired signed `trusted_control_v0` attestation.
- gVisor and every image/runtime input are digest pinned.
- network is absent; host loopback and abstract Unix sockets are unreachable.
- rootfs is read-only and host paths are absent.
- no Linux capability or privilege escalation is available.
- memory, CPU, PIDs, frames, logs, and wall time are bounded.
- killing the chamber cannot kill or corrupt the cell host.

### Authority And Credentials

- bootstrap owner is not present in cell/chamber configuration and cannot authenticate after retirement proof.
- activation-reader and gateway-broker roles are distinct and execute-only.
- gateway cannot send SQL, name tables, select arbitrary functions, or widen its transaction.
- every broker method validates image, operation, schema, revision, deadline, and idempotency.
- authority mutation and evidence commit atomically.

### Artifact

- two clean builds of the gateway produce identical artifact bytes and digest.
- bootstrap handoff, authority rows, artifact store, runtime image, and loaded bytes agree on the real digest.
- mutable tags, package registries, ambient paths, and runtime dependency fetching cannot select executable code.

### Operational Transition

- `handoff_ready` bootstrap history remains unchanged.
- operational state cannot be written before all proof requirements exist.
- stale authority, revoked trust/cell/artifact, failed containment, missing evidence, or active bootstrap credentials reject the transition.
- exact replay returns the existing transition; conflicting replay fails.
- the final state and authority revision are independently readable through the activation reader.

## Validation Strategy

- Rust formatting, Clippy with warnings denied, tests, rustdoc, dependency audit, and duplicate-dependency review in cell and chamber.
- TypeScript typecheck, build, tests, package audit, and deterministic artifact rebuild in core/gateway.
- PostgreSQL migration checksums, idempotency, transaction, role-permission, concurrency, and restart tests.
- protocol mutation, frame-bound, timeout, cancellation, crash, and evidence-chain tests.
- Linux-only gVisor integration suite that records runtime/profile/kernel details.
- negative escape probes for network, host filesystem, environment, process
  creation, capabilities, mount changes, and credential discovery.
- full workspace harness and contract-authority validation.
- repeat the system-level threat model and security review after the trusted
  activation architecture has matured and before any production-readiness or
  multi-cell security claim.

## Sprint 4C.1 Implementation Record

Sprint 4C.1 implementation completed on 2026-07-13:

- created the independent Rust `cadenza-cell` repository and workspace authority
  routing.
- defined deterministic containment plans, signed measurements, static launcher
  policy, cell lifecycle, and bounded cell/chamber protocol contracts.
- added the contained `cadenza-chamber` executable and remote host-port protocol.
- made privileged chamber activation independently verify the enrolled cell key,
  signed measurement, activation nonce, authority identity, containment shape,
  resource bounds, and artifact identities.
- proved a real cell-generated plan reaches the deliberately unavailable artifact
  boundary through the chamber protocol and shared bootstrap fixture.
- kept credentials, database/authority persistence, broker implementation,
  gateway execution, and authority mutation absent.
- implemented the typed unprivileged launcher client and root-owned systemd
  `SOCK_SEQPACKET` service with `SO_PEERCRED`, enrolled-cell Ed25519
  authorization, exact `SCM_RIGHTS` descriptor transfer, and no generic OCI or
  process input.
- made `Launched` mean observed `runsc state == running`, then retained deadline,
  cancellation, disconnect, bounded stderr, crash, kill, delete, cleanup, and
  reap custody in the privileged service.
- persisted bounded activation-nonce reservations in a root-owned atomic ledger
  so replay remains rejected after service restart.

Linux/gVisor execution, hostile-boundary, runtime-input measurement, and live
cgroup evidence passed on 2026-07-13 and are recorded in
`cadenza-cell/docs/linux-gvisor-evidence-2026-07-13.md`.

The root-owned systemd socket-activated launcher approved on 2026-07-13 is
implemented. Valid custody, tampered authorization, wrong peer identity,
deadline, cancellation, bounded crash diagnostics, disconnect cleanup, and
restart replay proofs pass through the unprivileged/privileged split. No runsc
container or test bundle remained after acceptance. Details are recorded in
`docs/decisions/2026-07-13-cell-launcher-service.md` and the Linux evidence file.

The user reviewed and accepted the Sprint 4C.1 containment coherence result on
2026-07-13. This closes the gate and permits Sprint 4C.2 to begin under the
already approved authority-first migration order. The user also required a
broader security review later, after the system has matured; this acceptance is
therefore a scoped sprint decision, not final security certification.

The dedicated Lima Linux runner is provisioned with pinned gVisor and has
produced Sprint 4C.1 evidence. Future containment-profile, launcher, rootfs,
runtime, chamber, or systemd changes invalidate that evidence and require the
Linux suite to be rerun before any privileged-activation claim.

## Migration Strategy

There is no backward-compatibility requirement.

1. Complete and review 4C.1 without database credentials or authority mutation.
2. Add authority source contracts and PostgreSQL migration in `cadenza` before implementing their consumers.
3. Propagate containment and capability protocol changes into `cadenza-chamber` in the same task.
4. Build and digest the real gateway artifact reproducibly.
5. Replace the placeholder artifact identity in bootstrap authority and regenerate all dependent fixtures and snapshots together.
6. Implement `cadenza-cell` broker consumers against those approved contracts.
7. Bootstrap only a new disposable environment for first activation; do not mutate legacy databases or demos.
8. Require Linux gVisor evidence before the operational-transition test is enabled.

Existing handoff fixtures with the placeholder artifact remain historical conformance inputs only. They are not migrated into executable authority.

## Risks

### False Containment

Risk: treating OCI configuration, seccomp, or process separation as the security boundary.

Response: gVisor is mandatory for V0 privileged execution; the launcher verifies the complete measured profile and chamber verifies signed attestation.

### Privileged Launcher Expansion

Risk: a generic root launcher becomes more dangerous than the chamber.

Response: separate binary, static plan schema, no arbitrary arguments/mounts/env/network, digest allowlist, unprivileged caller, tiny protocol, and exhaustive negative tests.

### Broker Becomes SQL Tunnel

Risk: flexible operations recreate generic database access.

Response: exact method enums and schemas, fixed PostgreSQL functions, execute-only roles, no dynamic SQL, transaction/evidence ownership in the database.

### Gateway Becomes Parallel Core

Risk: the gateway invents a second primitive or authority architecture.

Response: it materializes ordinary official primitives and implements the eight already-approved authority flow contracts through explicit intents, tasks, signals, and capability calls.

### Cell Scope Expansion

Risk: placement, distribution, actors, scaling, secrets, plugins, UI, or agents enter the first trusted host.

Response: V0 hosts one enrolled cell and one trusted-control gateway chamber. Everything beyond local lifecycle, containment, broker, evidence, and activation remains out of scope.

### gVisor Compatibility Or Availability

Risk: Node/runtime behavior differs under gVisor or the target lacks Linux support.

Response: conformance runs on the exact bundle; unsupported platforms cannot claim privileged activation. Firecracker and other profiles remain replaceable behind the containment contract.

## Alternatives

### Plain OCI/runc

More available and operationally simple, but still exposes the host Linux kernel directly. Retained for future non-privileged profiles; rejected for the first privileged authority gateway.

### Firecracker Immediately

Provides a stronger hardware virtualization boundary and minimal device model. Deferred because first implementation would also need guest kernel/rootfs supply chain, KVM, jailer, guest transport, patching, and VM lifecycle stewardship. It remains the preferred next assurance profile after V0 contracts stabilize.

### Docker Or Kubernetes As The Cell API

Convenient integration, but their generic daemon/control APIs are far broader than the minimum cell launcher and can obscure which component owns containment. They may host a future deployment adapter but are not the V0 trusted protocol.

### Cell And Chamber In One Process

Rejected because a compromised adapter or chamber could reach credentials and broker implementations directly.

### Database Client Inside The Gateway

Rejected because it gives source-bearing execution credential and transport authority, defeats capability evidence, and makes containment escape equivalent to database compromise.

### Read-Only Gateway First

Smaller, but insufficient for Cadenza to extend itself through the approved authority flows and risks a false `operational` claim. The first operational gateway implements all eight canonical flows.

## Assumptions

- `cadenza-cell` is the official repository name.
- Rust is acceptable for the minimum trusted cell substrate.
- gVisor `runsc` is acceptable as the mandatory V0 privileged profile, with Firecracker deferred to a higher-assurance profile.
- a dedicated Linux runner can be provided before containment acceptance and real privileged activation.
- the authority gateway belongs as an isolated package inside the authority-owning `cadenza` repository rather than as another top-level repository.
- the eight canonical authority flow contracts are stable enough to become the broker/gateway method surface.
- the bootstrap owner can be retired or rotated by deployment before the operational transition.
- no backward compatibility with the placeholder artifact digest or pre-operational fixtures is required.

## Active Clarification Gate

Discovered on 2026-07-13 before migration 002 implementation:

- `Version.CreateInitialObject` must persist `taggable`, `policy_subject`, and
  `policy_resource`, but its canonical request does not carry those values and
  no object-type profile contract derives them.
- canonical flow results contain newly created version, mark, assignment,
  removal, and decision keys, but the contracts do not define whether the
  caller proposes them or the authority provider derives them.

The PostgreSQL provider cannot choose either policy silently because both are
authority semantics shared by every future provider. Migration implementation
was paused pending explicit user direction.

Resolved on 2026-07-13: the user approved explicit object authority properties
and caller-proposed identities for every created version, mark, assignment,
removal, and decision. Providers validate or reject these identities and do not
invent replacements. The neutral contract and all four official core
implementations must be updated before migration 002 resumes.

Second gate discovered on 2026-07-13 during provider transaction design:

- `Tag.Assign` and `Tag.Remove` require tag-management policy evaluation but do
  not reference an authorization decision or name an inline decision identity.
- silently evaluating without decision evidence would violate the canonical
  policy contract; silently skipping evaluation would make the gateway admin
  capability bypass tag policy.

Recommended resolution: add `authorization_decision_key` to both requests and
require an immediately preceding `Policy.EvaluateTagAction` allow decision for
the same subject/caller, object, tag, action, environment, and current authority
revision. This composes the existing explicit flows and prevents stale policy
decisions from authorizing later mutations.

Resolved on 2026-07-13: the user approved the recommended revision-bound
authorization decision reference. The neutral contract and all four official
core implementations must be updated before migration 002 resumes.

Third gate discovered on 2026-07-13 during the Sprint 4C.2 coherence pass:

- the immutable chamber image records the authority revision revalidated at
  activation, and the current chamber implementation copies that source
  revision into every authority gateway invocation.
- runtime proof evidence originally incremented the environment authority
  revision, which made the image stale before operational transition. This was
  corrected as an implementation defect because the approved contract defines
  only the operational transition as an authority mutation; the five proof
  categories now bind without changing the activation revision.
- the operational transition and every later authority mutation must still
  advance the current revision. Reusing the image's source revision for the
  next invocation is therefore stale, while replacing the immutable runtime
  image after every authority operation would couple execution identity to
  unrelated authority history and create continuous churn.

Recommended resolution: the contained chamber sends immutable image, mount,
primitive, subject, deadline, size, and payload authority to the cell, but not
the current authority revision. The trusted cell authority session revalidates
current authority through its separate activation-reader credential, validates
the request against its active chamber/image binding, and constructs the exact
provider invocation with that current revision before using the separate
gateway-broker credential. The database remains the final compare-and-set
authority. This preserves immutable image provenance, distinct database roles,
and per-operation current-authority checks without letting callable source or a
compromised chamber choose the revision.

Resolved on 2026-07-13: the user approved cell-owned current-authority
enrichment as safer and more coherent. The chamber now emits a revision-free
`AuthorityAccessRequest`. A cell authority session independently verifies the
real artifact catalog and immutable session binding, rereads current authority
through its activation-reader provider for every operation, and constructs the
revision-bearing `AuthorityGatewayInvocation` before calling the fixed gateway
provider. Hostile image, primitive, artifact, revocation, and authority drift
fail before provider use.

Fourth gate discovered on 2026-07-13 during the first real Sprint 4C.3
activation:

- the operational transition requires an immutable `gateway_self_test` runtime
  evidence reference at the transition's current authority revision.
- all eight ordinary authority-gateway operations are intentionally rejected
  while the environment is `pending_activation`; only
  `Environment.RequestOperationalTransition` is allowed before `operational`.
- the transition cannot create its prerequisite self-test evidence because that
  evidence is currently required before the transition begins.
- the existing PostgreSQL gateway test bypasses this missing runtime path by
  appending synthetic `gateway_self_test` evidence directly, so it does not
  prove the approved first-activation sequence.

Implementation is paused before the PostgreSQL operational transition.
Recommended resolution: treat the exact operational-transition invocation as
the gateway self-test and create its `gateway_self_test` evidence inside the
same fixed PostgreSQL transaction after the cell/image/primitive/artifact
invocation has been validated but before operational state is committed. The
transition would continue to require independently published containment,
materialization, readiness, and bootstrap-owner-retirement proofs. This removes
the circular precondition without adding a probe primitive or permitting
ordinary authority effects before the environment is operational.

Alternatives requiring explicit consideration are a tenth pre-operational,
non-mutating gateway probe primitive, or weakening self-test to a local/mock
provider proof. The latter does not prove the real PostgreSQL role and provider
path and is not recommended.

Resolved on 2026-07-13: the user approved the recommended atomic self-test
design. The fixed PostgreSQL transition now validates four independently
published proofs and creates the gateway-self-test evidence inside the same
transaction before committing `operational`; any later failure rolls both back.
External evidence append rejects synthetic gateway-self-test evidence.

Fifth gate discovered on 2026-07-13 during the complete Linux gVisor activation:

- the contained chamber, pinned Node 22 runtime, PostgreSQL bootstrap, and
  descriptor-only gVisor protocol all start successfully.
- the TypeScript adapter entrypoint imports `frame.js`, `materialize.js`,
  `prebuilt.js`, and `protocol.js` from its distribution directory.
- the signed runtime image and chamber startup currently measure only
  `main.js`; the imported executable modules therefore have no adapter authority
  digest even though the rootfs tree measurement happens to cover their bytes.
- copying those modules into the rootfs would make startup proceed while
  preserving an incoherent adapter contract in which executable code lies
  outside the named adapter artifact.

Implementation is paused before weakening that boundary. Recommended
resolution: make the adapter a manifest-defined multi-file artifact. A
deterministic build manifest names the entrypoint and every runtime file with
its digest; the runtime image's adapter artifact digest identifies the
manifest, and the chamber verifies the manifest plus every named file before
spawning Node. This requires no bundler dependency and makes the executable
boundary explicit. Alternatives are introducing a bundler to produce one file,
or hashing the entire inferred build directory without an explicit runtime-file
manifest.

Resolved on 2026-07-13: the user approved the manifest-defined artifact. The
build now packages emitted adapter modules, a minimal ESM descriptor, and every
installed production dependency selected from the measured lockfile. The
chamber verifies the manifest, closed file set, entrypoint, sizes, digests, and
absence of symlinks before Node starts. Independent macOS and Linux builds
produce the same 148-file artifact digest.

## Sprint 4C.2 Implementation Checkpoint

Recorded on 2026-07-13 after the user directed implementation of the authority
operation functions and hostile role-boundary tests:

- the neutral revision-bound tag authorization contract is propagated through
  TypeScript, Python, Elixir, C#, and the isolated TypeScript authority-gateway
  invocation package.
- `cadenza/environment-bootstrap/migrations/002_runtime_authority.sql` now
  defines fixed security-definer functions for all eight canonical authority
  operations and `Environment.RequestOperationalTransition`; no runtime role
  receives the private validation/evidence helpers or direct table authority.
- exact invocation shape, trusted mount identity, deadlines, result bounds,
  optimistic authority revision, deterministic idempotency replay, immutable
  evidence, and revision-bound tag authorization are enforced by the provider.
- `cadenza/environment-bootstrap/tests/postgres-authority-gateway.test.ts`
  bootstraps a signed environment, submits the then-modeled five activation
  proofs, executes
  all authority operations, and attacks direct table access, cross-role API
  access, private helpers, DDL, malformed payloads, stale decisions, conflicting
  replay, and caller-controlled `search_path`.

The migration applied and the pre-existing PostgreSQL migration suite passed
after the nine functions were added. The hostile suite exposed and drove fixes
for transition-key JSON/text operator precedence and a deferred policy
constraint that initially escaped the security-definer boundary. The complete
environment-bootstrap suite then passed serially on 2026-07-13: five test files
and twenty tests, including signed genesis, migration, all authority
operations, operational transition, hostile roles, malformed payloads, stale
authorization, idempotency conflict, immutable evidence, and search-path
poisoning. Serial execution avoids an intermittent macOS parallel-`initdb`
System V shared-memory limitation without changing production behavior.

The deterministic authority-gateway artifact is now built from its exact
nine-task catalog with zero runtime package dependencies. Independent clean
builds reproduce the same canonical bytes at
`sha256:ec0e3c1b535259a5bf21d1f9013ef28e1317b625a8bc5bb9fbaaf1452df241ea`.
The signed bootstrap conformance fixture was regenerated through the existing
genesis implementation with that digest and a deterministic conformance-only
signer, then synchronized to the chamber consumer fixture. Repeated fixture
generation is byte-identical. The gateway is evaluated as an isolated IIFE in a
string/wasm-code-generation-disabled VM context and exposes only its declared
nine-method facade. The complete environment-bootstrap suite passes with twenty
tests, and the complete chamber suite passes against the updated trust chain.

The cell now has validated PostgreSQL adapters for the activation reader, all
nine fixed gateway operations, and the then-modeled runtime-evidence categories.
Sprint 4C.3 subsequently narrows external publication to four proofs and makes
gateway-self-test evidence transaction-owned. Operation selection is an exhaustive match to literal reviewed
function calls; there is no generic SQL or procedure surface. Injected and
connected activation readers reject empty cell identities, provider rejections
are normalized by SQLSTATE, and credentials remain inside the cell-side client
objects rather than protocol or callable values.

The approved current-authority split is implemented across the chamber and
cell contracts. The chamber's `AuthorityAccessRequest` cannot serialize an
authority revision. The cell establishes a session only after independently
verifying the real nine-operation artifact catalog and matching the initial
current authority to the image. Every call revalidates trust-root, cell, slice,
policy, runtime, artifact, revocation, and revision state before constructing
the complete provider invocation. Hostile image, primitive, current-authority,
and revocation drift are rejected before provider use.

Runtime proof insertion was corrected to bind without advancing authority;
only the operational transition advances authority in that evidence surface.
Durable idempotency remains convergent after current authority advances:
PostgreSQL substitutes the original evidenced revision solely for replay digest
comparison, while preserving the original full invocation digest and requiring
every caller-controlled and image-bound field to remain exact.

Sprint 4C.2 closure validation passes:

- gateway typecheck, deterministic build, 14 tests, artifact verification, and
  byte-identical rebuild at the recorded digest.
- environment-bootstrap typecheck, build, deterministic fixture generation,
  and 20 serial tests against fresh disposable PostgreSQL clusters.
- chamber formatting, 36 tests, Clippy with warnings denied, TypeScript adapter
  typecheck/build, and canonical contract checks.
- cell formatting, 17 tests, and Clippy with warnings denied.
- npm production dependency audits and RustSec audits report no advisories.
  Cell duplicate review finds only the transitive `digest`/`sha2` 0.10 and 0.11
  generations used by Ed25519 and PostgreSQL authentication respectively.
- authority and chamber bootstrap fixtures remain byte-identical.

## Coherence Review

### Identity And State

Cell, launcher, containment profile, sandbox, chamber, adapter, gateway artifact, capability mount, broker method, database role, subject, principal, evidence, bootstrap state, and operational state are separate identities. Bootstrap history remains immutable while post-bootstrap operational state has its own authority and evidence.

### Affect

The launcher may create only one approved sandbox shape. The cell may resolve trust/artifacts, broker named capabilities, publish evidence, and terminate chambers. The chamber may verify, materialize, execute, and request mounted capabilities. The gateway may request only explicit authority operations. PostgreSQL functions own final mutation invariants.

### Relationships

Authority approves a slice and artifact. The enrolled cell measures and creates containment. The chamber verifies both authority and containment. The adapter materializes the pinned gateway. Gateway primitives request brokered authority affect. The broker validates local runtime identity. PostgreSQL decides and commits authority with evidence. No participant silently inherits another participant's authority.

### Shared Fields And Time

Digests, revisions, epochs, deadlines, idempotency, attestation nonce, evidence sequence, role identity, and operational proof preserve interpretation across process restart and future hosts. Replacement produces new image/epoch identities rather than mutating running authority.

### Judgment

Sprint 4C.2 coherence judgment: `fits`.

The authority gateway remains primitive-shaped, callable code receives only a
fixed facade, current authority is owned outside containment, database roles
remain separate, and final affect stays with fixed compare-and-set provider
transactions. The contained cell-chamber delegation transport, bootstrap-owner
retirement, and first real operational transition remain explicit Sprint 4C.3
work; Sprint 4C.2 does not claim those effects.

## Approval

The user approved the three-part Sprint 4C implementation and its listed
cross-repo/schema changes on 2026-07-13. That approval did not authorize
production infrastructure modification, production secrets, or claims beyond
the measured Linux conformance environment.

## Sprint 4C.3 Closure

The final implementation adds the bounded `activate` and `delegate` chamber
protocol, cell-owned activation coordination and current-authority sessions,
four independently published pre-transition proofs, deployment-owned
bootstrap-principal retirement proof, and atomic transition-created gateway
self-test evidence. The environment advances authority `1 -> 2` and becomes
`operational` without rewriting immutable `handoff_ready` bootstrap history.

The full Linux proof uses Ubuntu 24.04.4 ARM64, kernel 6.8.0-124, pinned gVisor
`release-20260706.0`, Node 22.23.1, PostgreSQL 16.14, a content-addressed
read-only rootfs, no network, empty capabilities, descriptor-only chamber
communication, 256 MiB memory, 128 tasks, and one CPU quota. It completes real
gateway materialization, evidence publication, owner login disablement and
authentication rejection, operational transition, exact durable replay, and
orderly stop.

Closure validation passes:

- deterministic authority gateway build and 14 tests at
  `sha256:c546c4805d3d3bcd320b1590d2328ce31b6b72b1ddf807ea916f59c3c35b5bb8`.
- environment-bootstrap typecheck/build, deterministic fixture generation, and
  20 serial fresh-PostgreSQL tests.
- deterministic 148-file adapter build on macOS and Linux at
  `sha256:43390ea7384cf2ad4880e80345edff6e51944983a8a723a2a5d70c8c3f827e7b`.
- 39 chamber tests and 19 non-ignored cell tests, formatting, and strict Clippy.
- explicit local PostgreSQL end-to-end transition and explicit Linux gVisor
  end-to-end transition.
- npm production audits and RustSec audits with no advisories.
- byte-identical authority/chamber bootstrap fixtures.

## Final Coherence Review

### Identity And State

Cell, chamber, containment plan, rootfs, runtime components, adapter manifest,
gateway artifact, authority session, four external proofs, transaction-created
self-test, operation evidence, operational transition, and bootstrap history
retain separate identities. Mutable operational state does not rewrite genesis.

### Affect And Security

Callable code can request only nine fixed gateway operations through a frozen
facade. The chamber has no credentials, network, SQL, provider object, or
current-authority choice. The cell owns current-authority enrichment and fixed
provider selection. PostgreSQL owns final compare-and-set mutation. Owner
retirement facts expose no credential or raw authentication error.

### Relationships And Interpretation

The cell measures containment; the chamber verifies it; the manifest defines
all adapter executable inputs; the adapter materializes the exact gateway; the
cell brokers its fixed requests; and PostgreSQL commits authority with evidence.
Digests, epochs, revisions, deadlines, idempotency, evidence sequence, and proof
references preserve meaning across process and database restart.

### Judgment

Sprint 4C coherence judgment: `fits`.

The implementation serves the intended whole by keeping authored logic
primitive-shaped while containment, runtime materialization, credential
custody, authority enrichment, persistence, evidence, and failure handling stay
below it. No compatibility layer, generic administration surface, synthetic
self-test path, unmeasured adapter code, or legacy repository dependency was
introduced.

Residual scope is explicit: this is measured host conformance, not hardware
remote attestation or production deployment attestation. Performance thresholds
remain deferred until the agreed clean-machine rerun, and another security
review remains appropriate after distribution and orchestration mature.
