# Design Proposal: Environment Bootstrap Foundation

## Status

done

Approved by the user on 2026-07-12 with: "Design approved. Proceed."

Decision log: [docs/decisions/2026-07-12-environment-bootstrap-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-12-environment-bootstrap-foundation.md)

## Context

Cadenza now has a spotless core contract and a language-neutral authority foundation implemented in TypeScript, Python, Elixir, and C#. The next roadmap phase must establish the first environment authority without violating the boundaries those foundations created.

The bootstrap problem is recursive:

- the environment database is intended to become authority for graph and meta definitions.
- normal authority writes must go through a privileged, domain-shaped authority-access slice.
- that slice cannot create or authorize the trust root that allows it to run.
- chambers and cells do not exist yet, so this sprint cannot honestly claim to activate source-bearing runtime work.

Bootstrap therefore needs a deliberately small static root that performs one governed genesis transition and produces an activation handoff for the later chamber runtime.

Evidence:

- `docs/cadenza-intended-whole.md`
- `docs/cadenza-environment.md`
- `docs/cadenza-schema-proposal.md`
- `docs/cadenza-flow-design.md`
- `docs/cadenza-language-runtime-contract.md`
- `docs/contracts/authority-security/v0.md`
- `docs/contracts/authority-security/coherence-review-v0.md`
- `docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md`
- `docs/decisions/2026-07-11-persistence-agnostic-core.md`
- `docs/decisions/2026-07-12-authority-tags-policy-flow-foundation.md`

## Intended Whole

The environment bootstrap should create the smallest trustworthy environment authority that can later regenerate and extend itself through governed Cadenza primitives.

It must preserve Cadenza's larger whole:

> Reduce accidental coding complexity so humans and agents can focus on business logic, workflow shape, and task logic while deployment, persistence, trust, and runtime mechanics remain governed infrastructure concerns.

False success would be:

- a database that contains rows but cannot prove how they became authoritative.
- a static bootstrap layer that remains a permanent parallel management system.
- a generic SQL or CRUD gateway presented as Cadenza authority.
- claiming the environment is operational before a chamber can securely activate the authority slice.
- putting persistence, source evaluation, trust-root creation, or cell lifecycle into `@cadenza.io/core`.

## Proposed Boundary

### Repository And Package Ownership

Keep one official TypeScript repository, `cadenza`, but introduce explicit release boundaries inside it:

- `@cadenza.io/core`
  - remains persistence-agnostic.
  - continues to own primitive semantics and the runtime loop.
  - does not import bootstrap, PostgreSQL, migration, trust-root, or seed-pack code.
- environment-bootstrap package or equivalent isolated package boundary
  - owns bootstrap contracts, seed validation, migration orchestration, genesis state transitions, and the first PostgreSQL adapter.
  - may depend on stable core definition contracts where needed.
  - is not exported through the core package entry point.
- neutral bootstrap contracts and fixtures
  - remain the semantic authority in workspace documentation until a dedicated conformance package is justified.

The preferred first layout is conservative:

- retain the stabilized core package at the repository root.
- add an independently built `environment-bootstrap/` package inside the same Git repository.
- permit dependency only from environment bootstrap to the published/local core contract, never from core to environment bootstrap.
- keep independent package manifests, build output, tests, and dependency graphs.
- do not convert the repository into a workspace or move core files unless the isolated child-package approach fails a concrete tooling requirement.

This avoids a large mechanical core move merely to obtain a conventional monorepo shape. Dependency checks must prove that core's package graph has no persistence dependency.

### Semantic Authority

- language-neutral contracts, invariants, fixtures, seed manifests, and decisions define bootstrap meaning.
- TypeScript provides the first bootstrap implementation.
- the core translations do not receive bootstrap code automatically; static bootstrap is substrate code, not a shared primitive implementation.
- database schemas enforce the already-approved authority invariants transactionally but do not redefine them.

### Persistence

- PostgreSQL is the first supported authority store because the target model is relational, requires transactions and uniqueness constraints, and already anticipates JSONB semantic payloads.
- the new schema is authored from the approved target contracts; legacy `cadenza-db` is reference material only and is not migrated or reused as authority.
- ordered SQL migrations plus an explicit migration ledger are preferred initially over an ORM.
- the bootstrap package owns a narrow adapter interface so PostgreSQL does not become the semantic contract.

## Bootstrap Identities

The initial contract should name these identities explicitly:

- `EnvironmentIdentity`
  - stable `environment_key` and lifecycle state.
- `EnvironmentTrustRoot`
  - public root identity/reference, version, status, and creation evidence.
  - never stores root private-key material in ordinary authority rows.
- `BootstrapRun`
  - one idempotent genesis attempt bound to bootstrap version, input digest, seed-pack digests, and actor identity.
- `BootstrapStepEvidence`
  - monotonic state transition evidence with before/after state and failure classification.
- `CellEnrollment`
  - first trusted-control cell identity and public-key reference established by static bootstrap.
- `CapabilityDefinition`
  - governed V1 capability vocabulary.
- `SeedPack`
  - immutable, digest-addressed set of authority records and package/artifact references.
- `SeedApplication`
  - evidence that a specific pack digest was applied to an environment under a bootstrap run.
- `AuthorityAccessSliceDefinition`
  - immutable declaration of the sole initial holder of direct `authority_access`.
- `BootstrapHandoff`
  - signed or digest-bound activation input for the future trusted cell/chamber substrate.

## Bootstrap State Machine

The first state machine should be monotonic:

```text
uninitialized
-> schema_ready
-> trust_established
-> foundation_seeded
-> authority_slice_ready
-> handoff_ready
```

`operational` is intentionally not a Sprint 3 state. A future chamber/runtime integration may add:

```text
handoff_ready
-> authority_slice_activated
-> operational
```

Rules:

- no state may be skipped.
- every transition is transactional and records evidence.
- rerunning with the same normalized input digest resumes or returns the existing result.
- rerunning with conflicting input after trust establishment rejects instead of mutating genesis history.
- failure leaves the last committed state interpretable and resumable.
- repair and trust-root rotation are separate privileged flows, not bootstrap reruns.

## Static Root

Static bootstrap code may do only what cannot yet be delegated safely:

1. connect to the configured authority store.
2. acquire an environment-scoped bootstrap lock.
3. apply and verify the minimal schema.
4. create the environment identity and trust-root public record.
5. enroll the first trusted-control cell from explicit bootstrap input.
6. verify and apply pinned seed packs.
7. produce the authority-slice handoff.
8. record structured evidence for every committed step.

Static bootstrap must not:

- evaluate source strings.
- execute business or plugin code.
- expose arbitrary SQL as an environment API.
- activate marketplace or user plugins.
- create normal application objects outside approved seed packs.
- retain a permanent broad administration surface after handoff.
- store private trust-root or cell key material in ordinary authority tables.

## Seed Model

Use deterministic, immutable JSON seed packs with canonical serialization and declared digests.

### Structural Foundation Pack

Contains only schema-dependent vocabulary:

- lifecycle states.
- version marks.
- authority reason vocabulary where required.
- canonical object types required for bootstrap records.
- the governed V1 capability registry:
  - `authority_access`
  - `filesystem`
  - `subprocess`
  - `network_client`
  - `network_server`
  - `package_runtime`
  - `secret_access`
  - `cell_control`

### Authority Kernel Pack

Contains first-class logical objects and immutable versions for:

- the authority-access slice declaration.
- domain-shaped authority query/command task declarations.
- the baseline policy-evaluation declarations required to guard authority access.
- the initial tag/category vocabulary needed by those rules.
- pinned package/artifact handler references for the gateway implementation.

The kernel pack may reference trusted built-in handler artifacts by digest and handler key. It must not require uncontained source evaluation during bootstrap.

### Deferred Packs

Do not include in the first bootstrap closure:

- agent APIs or agent initialization.
- stem-cell reconciliation.
- plugin activation controllers beyond minimal inactive registry vocabulary.
- general identity/session providers.
- secrets providers or secret values.
- generated PostgresActor surfaces.
- UI, CLI, memory, placement, distribution, actor persistence, or business graphs.

Those become later governed seed packs after the authority gateway and chamber boundary exist.

## Minimal Persistence Surface

The schema should include only tables required to prove the bootstrap whole:

- migration ledger.
- environment identity and bootstrap-state singleton.
- environment trust-root public records.
- first-cell enrollment records.
- bootstrap runs and step evidence.
- seed-pack and seed-application records.
- governed capability definitions.
- the Sprint 2 authority foundation tables needed by kernel objects:
  - logical objects.
  - immutable versions and semantic payloads.
  - current pointers and marks.
  - tag categories, tags, direct assignments/removals, and effective tags with provenance.
  - policy rules and decisions needed by the baseline.
- authority-slice declaration and bootstrap handoff records.

Relational constraints must enforce the Sprint 2 closure invariants, including version content identity, primary marks, active tag cardinality, provenance agreement, policy family/action agreement, and canonical seed proof coverage where represented.

JSONB is appropriate for canonical semantic payloads and bounded evidence details. Stable identity, lifecycle, relationship, uniqueness, policy family/action, state-machine, and provenance fields should remain relational columns or relational edges.

## Authority-Access Slice Contract

The first slice should expose domain-shaped task families:

- `graph_query`
- `graph_command`
- `projection_command`
- `bootstrap_admin`
- `repair_admin`

Only the internal gateway adapter receives direct `authority_access`. Exported tasks and intents expose bounded operations, including the eight Sprint 2 canonical flows.

Non-goals:

- arbitrary SQL.
- generic table CRUD.
- direct database handles in task context.
- implicit authorization.
- capability widening by child tasks.

`bootstrap_admin` is available only during the static bootstrap/handoff lifecycle. Normal post-handoff authority mutations use domain-shaped graph commands. `repair_admin` remains separately gated and unseeded until a repair design is approved.

## Bootstrap Handoff Contract

The handoff must be sufficient for the future trusted cell/chamber implementation to activate the authority-access slice without reinterpreting bootstrap state.

Minimum fields:

- environment key.
- bootstrap run key and completed state.
- authority revision.
- trust-root key id and version.
- enrolled first-cell key and public-key reference.
- authority-slice object/version identity.
- seed-pack identities and digests.
- handler artifact identity and digest.
- required runtime/language adapter identity.
- required capabilities and trust profile.
- activation policy reference.
- handoff digest and creation evidence reference.

The later runtime must reject handoff if any identity, digest, trust version, enrollment, authority revision, capability, or artifact reference is missing or stale.

## Sprint Shape

### Sprint 3A: Neutral Bootstrap Contract

- define identities, state machine, failure classes, seed manifest, handoff, and evidence contracts.
- create positive and negative conformance fixtures.
- define canonical serialization and digest rules.
- define translation/runtime impact explicitly.

Gate: coherence review before schema work.

### Sprint 3B: Repository And Package Boundary

- establish the isolated bootstrap package/module boundary inside `cadenza`.
- prove `@cadenza.io/core` has no bootstrap or persistence dependency.
- preserve existing core conformance suites unchanged.
- add package-level dependency-direction tests or checks.

Gate: core remains spotless after structural change.

### Sprint 3C: Minimal PostgreSQL Authority Store

- implement ordered migrations and migration ledger.
- implement transactional constraints for bootstrap and Sprint 2 invariants.
- implement the narrow authority-store adapter.
- add clean-create, idempotency, rollback, and concurrent-bootstrap integration tests.

Gate: schema and transaction review.

### Sprint 3D: Seed Packs And Genesis Runner

- validate pinned packs and digests.
- implement the monotonic bootstrap state machine.
- establish trust-root public records and first-cell enrollment.
- apply structural and authority-kernel packs.
- emit the bootstrap handoff and evidence chain.

Gate: security and coherence review.

### Sprint 3E: Local Bring-Up Proof And Chamber Handoff

- bring up a fresh local PostgreSQL environment.
- run bootstrap from empty state to `handoff_ready`.
- prove exact rerun idempotency and conflicting-input rejection.
- verify every seeded authority record through domain validators.
- document the activation contract required from the chamber/runtime sprint.

This sprint does not claim `operational` status or execute seeded source.

## Failure Model

Initial failure classes:

- `configuration_invalid`
- `authority_store_unavailable`
- `migration_failed`
- `schema_drift`
- `bootstrap_lock_unavailable`
- `trust_input_invalid`
- `trust_conflict`
- `seed_manifest_invalid`
- `seed_digest_mismatch`
- `seed_invariant_failed`
- `state_transition_invalid`
- `handoff_generation_failed`
- `evidence_commit_failed`

No failure should be reduced to an unstructured thrown error at the contract boundary.

## Security Requirements

- default deny after trust establishment.
- explicit bootstrap identity and environment-scoped lock.
- private keys remain in external/bootstrap key custody.
- seed packs and handler artifacts are digest pinned.
- SQL identifiers are static; values are parameterized.
- no plugin or seed object grants authority to itself.
- first-cell `trusted_control` status is established only by static bootstrap evidence.
- bootstrap evidence is append-only and ordered per environment.
- conflicting reruns fail closed.
- database credentials used by static bootstrap are not passed into seeded task context or handoff payloads.

## Coherence Review

### Intended Whole

The design creates a trustworthy starting state from which Cadenza can later extend itself through its own primitives.

### Identities And State

Environment, trust root, bootstrap run, steps, seed packs, first cell, capabilities, authority slice, and handoff are explicit. State is monotonic and evidence-bearing.

### Affect And Boundaries

Static code can affect only genesis state. The authority-access slice becomes the future path for normal authority affect. Core, chamber materialization, plugins, and business graphs remain outside the static root.

### Relationships And Interpretation

Every seed row traces to a pack digest and bootstrap run. The handoff translates database authority into exact runtime activation requirements without activating it prematurely.

### Horizontal Interpretability

Neutral contracts and JSON fixtures govern meaning. PostgreSQL and TypeScript are first implementations, not semantic authorities by themselves. Core language translations are not burdened with substrate code.

### Shared Fields And Time

Trust identity, seed manifests, authority records, evidence, and handoff digests are stewarded as shared fields. Idempotency, migration history, state evidence, and digest pinning preserve future interpretation.

### Fragmentation Test

Primary risks are static-root expansion, core persistence leakage, database-shaped public APIs, source execution before containment, and claiming operational readiness too early. The proposed boundaries directly reject each false success.

### Judgment

`fits with risks`

The design is coherent if implementation preserves the isolated package boundary and stops at `handoff_ready` until the chamber/runtime boundary exists.

## Impacted Repositories

- `cadenza-workspace`
  - neutral contracts, conformance fixtures, decision record, architecture corrections, and execution plan.
- `cadenza`
  - package boundary, TypeScript bootstrap implementation, seed packs, migrations, and tests after approval.
- `cadenza-python`, `cadenza-elixir`, `cadenza-csharp`
  - no implementation change in Sprint 3 unless a shared primitive contract changes unexpectedly.
- legacy repos
  - no changes; `cadenza-db`, `cadenza-service`, demos, and legacy engine remain reference-only.

## Migration Strategy

- no backwards compatibility is required.
- do not migrate legacy database state.
- prove clean environment creation first.
- later import tooling, if needed, must enter through approved authority flows and preserve provenance; it is not part of bootstrap.
- preserve all existing core conformance tests while introducing the repository package boundary.

## Documentation Reconciliation

After approval, update the architecture documents before code implementation:

- supersede the old `cadenza-environment` repository ownership in `docs/cadenza-environment.md`; environment bootstrap now belongs to the official `cadenza` repository behind a package boundary.
- replace legacy `cadenza-engine` runtime-host references with the later chamber runtime repository and separate cell-host layer.
- retain the valid semantic lessons in the older document while marking agent APIs, stem-cell activation, plugins, identity/session providers, and broader security-kernel slices as post-bootstrap work.
- ensure `docs/cadenza-schema-proposal.md` distinguishes the minimal Sprint 3 seed from the broader eventual V1 security base.
- update `contracts.config.json` with explicit bootstrap semantic and persistence authority only when implementation begins.

## Risks

- package restructuring could disturb the newly stabilized core.
- PostgreSQL constraints could accidentally encode implementation-specific semantics.
- bootstrap scope could expand into full security, cell, or plugin implementation.
- static bootstrap credentials could become ambient authority if handoff boundaries are weak.
- seed pack updates could become hidden migrations without immutable identity and digest rules.
- the authority-access slice cannot be activated end to end until chamber/runtime implementation exists.

## Alternatives

### Keep Bootstrap Inside The Core Package

Rejected. It violates the persistence-agnostic core decision and gives `@cadenza.io/core` environment authority responsibilities.

### Create A Separate `cadenza-environment` Repository Now

Rejected for this phase. Current user direction makes `cadenza` the official repository that lays the environment foundation. A separate repo would reintroduce premature hard boundaries and coordination overhead.

### Reuse `cadenza-db` And `cadenza-service`

Rejected. They are legacy and encode the previous service-centered model.

### Bootstrap Through A Generated `PostgresActor`

Rejected. It requires authority-access and generated-bundle machinery before the authority gateway exists.

### Use An In-Memory Store Only

Rejected as the primary proof. It cannot prove relational constraints, transactional genesis, migration behavior, or concurrent bootstrap safety. A memory adapter may support unit tests but cannot close Sprint 3.

### Build The Chamber First

Rejected. The chamber needs an exact authority, handoff, capability, and activation contract. Sprint 3 deliberately produces that boundary first.

## Acceptance Criteria

- neutral bootstrap contract and fixtures define every genesis identity and transition.
- static bootstrap authority is finite and explicitly enumerated.
- core package imports no persistence or bootstrap code.
- a fresh PostgreSQL database reaches `handoff_ready` deterministically.
- exact reruns are idempotent; conflicting reruns fail closed.
- all Sprint 2 relational invariants are enforced transactionally.
- seed packs are immutable, digest-addressed, and provenance-linked.
- the authority-access slice is the sole declared holder of direct `authority_access`.
- no source string is materialized or executed.
- bootstrap produces structured evidence and a complete chamber activation handoff.
- full existing core tests and new bootstrap integration tests pass.
- final coherence review returns `fits` before the chamber sprint begins.

## Assumptions

- PostgreSQL is the first authority-store implementation.
- TypeScript is the first static-bootstrap implementation.
- the first environment is created from empty state; legacy migration is excluded.
- the bootstrap milestone ends at `handoff_ready`, not `operational`.
- private key custody is external to ordinary authority tables.
- no core-language translation is required for static bootstrap.
- the existing core package remains at repository root and bootstrap begins as an isolated `environment-bootstrap/` child package unless a concrete tooling blocker requires a new approved layout.

## Approval Gate

Implementation requires explicit approval:

> Design approved. Proceed.

## Progress - 2026-07-12

- Recorded the approved decision in `docs/decisions/2026-07-12-environment-bootstrap-foundation.md`.
- Reconciled obsolete environment/bootstrap repository ownership and engine terminology in `docs/cadenza-environment.md`.
- Added the neutral V0 bootstrap contract, conformance requirements, positive fixture, and mutation-based negative cases under `docs/contracts/environment-bootstrap/`.
- Added deterministic canonical JSON and SHA-256 rules, chained bootstrap evidence, explicit static-principal traces, complete seed provenance, and Ed25519 handoff attestation.
- Completed the Sprint 3A coherence review with a `fits` judgment after repairing three draft gaps: hidden bootstrap-principal identity, digest-only handoff authenticity, and incomplete capability seed provenance.

## Current Gate

Sprint 3 is complete through `handoff_ready`.

## Implementation Progress

- Created the isolated `cadenza/environment-bootstrap/` package without moving or coupling the root core package.
- Implemented bounded canonical JSON and SHA-256 identities.
- Implemented the neutral conformance validator, mutation-based negative proof runner, evidence-chain validation, semantic seed validation, and Ed25519 handoff verification.
- Added an ordered SQL migration ledger with checksum-drift rejection.
- Added the minimal PostgreSQL authority schema and transactional enforcement of the Sprint 2 relational invariants.
- Added the domain-level `bootstrapEnvironment` API, generated genesis evidence, environment-scoped locking, compare-and-set transitions, resumability, idempotency, conflict rejection, and signed handoff persistence.
- Seeded full capability definitions, authority object/version/pointer/mark, activation policy, all eight canonical flow declarations, and one authority-access slice declaration.
- Completed a clean local PostgreSQL bring-up to `handoff_ready` without source materialization.
- Completed the implementation coherence review with a `fits` verdict.

## Validation

- `cadenza/environment-bootstrap`: typecheck passed.
- `cadenza/environment-bootstrap`: 14 tests passed, including real temporary PostgreSQL integration.
- `cadenza/environment-bootstrap`: build and Prettier checks passed.
- `cadenza/environment-bootstrap`: npm audit found 0 vulnerabilities.
- `cadenza/environment-bootstrap`: package dry run contains only the implementation, declarations, migration, README, and package manifest.
- root `cadenza`: dependency scan found no bootstrap or PostgreSQL import.
- root `cadenza`: 135 non-performance tests passed.
- root `cadenza`: typecheck, build, Prettier, and diff checks passed.
- workspace agent harness and diff checks passed.

## Closure

- Environment Bootstrap V0 is complete at `handoff_ready`.
- `operational` remains reserved for the future chamber/runtime integration.
- Bootstrap database-credential retirement and narrower runtime authority credentials are mandatory deployment/chamber handoff requirements.
- The next roadmap stream may begin the chamber runtime design against the signed handoff contract.
