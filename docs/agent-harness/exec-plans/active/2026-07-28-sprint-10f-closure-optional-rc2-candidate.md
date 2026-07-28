# Sprint 10F Closure And Optional RC2 Candidate

Date: 2026-07-28

## Status

- State: `done`.
- Parent:
  [Sprint 10 distributed foundation consolidation and hardening](./2026-07-25-distributed-foundation-consolidation-hardening-design.md).
- Prerequisite:
  [Sprint 10E Operational Interpretation And Stewardship Closure V1](../../../publication/sprint-10e-operational-interpretation-stewardship-closure-v1.md).
- Approval received from the user on 2026-07-28:
  `Design approved. Proceed.`
- Closure and publication approval received from the user on 2026-07-28:
  `approved. we can proceed with publication`
- Decision:
  [Sprint 10F Closure And Optional RC2 Candidate](../../../decisions/2026-07-28-sprint-10f-closure-optional-rc2-candidate.md).
- Source inventory:
  [Sprint 10F Source And Candidate Inventory V1](../../../publication/sprint-10f-source-candidate-inventory-v1.md).
- Active implementation WIP: none; closure and optional RC2 judgment is
  awaiting the user.
- Affected RC2 version commits are complete in TypeScript core, Environment,
  Chamber, Cell, and the reference system.
- Mixed candidate metadata and explicit candidate-aware release tooling
  validate without a manifest schema change.
- Fast, complete, and privileged hardening proofs passed against the frozen
  executable candidate identities.
- Affected SBOMs and package artifacts reproduce, and the local candidate is
  ready for final manifest assembly and user judgment without remote mutation.
- The external aggregate manifest is frozen at
  `sha256:015e8ca720d7e2a8ea90d70233531644033a1f523c5653a29a4c83337c7af6e6`
  and is documented in the
  [RC2 publication decision package](../../../publication/sprint-10f-rc2-publication-decision-v1.md).

## Context

Sprint 10A established a public-lineage workspace baseline. Sprint 10B removed
dead purpose and repaired bounded contract and package surfaces. Sprint 10C
made fast, complete, and privileged proof reproducible. Sprint 10D challenged
ten failure, custody, and security obligations. Sprint 10E made the resulting
operational truth understandable without changing runtime behavior.

Sprint 10F is the final consolidation gate. It must prove one exact source and
artifact set recursively, decide whether that set is coherent enough to become
an RC2 candidate, and prepare reviewable release evidence without mutating
GitHub.

RC1 remains immutable. RC2 is optional until the final review passes, and
publication remains a separate user decision.

## Intended Whole

Cadenza should let application authors and agents focus on workflow and
business logic while the distributed foundation owns materialization,
authority, containment, routing, scale, evidence, and recovery.

The closure serves that whole when:

- every official repository is validated through its native contract;
- language-neutral primitive meaning remains coherent across four core
  implementations;
- the reference application consumes built artifacts rather than workspace
  accidents;
- privileged proof starts from fresh authority and measured runtime inputs;
- release identities describe only source and artifacts that actually changed;
- retained complexity has an explicit operational or security purpose;
- known limitations remain visible and are not mislabeled as completed
  features;
- future expansion starts from one exact, reproducible baseline.

False closure includes:

- retagging unchanged repositories to make versions look uniform;
- generating artifacts from dirty worktrees or uncommitted files;
- treating a fast or complete proof as gVisor containment evidence;
- carrying RC1 filenames or hard-coded package versions into an RC2 manifest;
- changing runtime behavior merely to make release assembly convenient;
- weakening a test, timeout, authority check, custody barrier, or cleanup
  measurement to obtain a pass;
- signing or publishing a candidate before the final evidence is reviewed;
- starting generated expansion, advanced security, observer UI, plugins,
  Memory, CLI, or managed-product work.

## Frozen Input

The design review is based on these clean heads:

| Repository | RC1 commit | Current commit | Commits after RC1 | RC2 source disposition |
| --- | --- | --- | ---: | --- |
| `cadenza-workspace` | `60994b8` | `43855c2` | 27 | affected; aggregate candidate and current documentation |
| `cadenza` | `f936045` | `a2d38f0` | 5 | affected; public TypeScript package and source changed |
| `cadenza-python` | `9fd99a0` | `b15a306` | 1 | affected by deterministic throttling proof repair; RC2 |
| `cadenza-elixir` | `d1dd15f` | `d1dd15f` | 0 | unchanged; retain RC1 commit and tag |
| `cadenza-csharp` | `d294e53` | `d294e53` | 0 | unchanged; retain RC1 commit and tag |
| `cadenza-environment` | `de8dd66` | `eb9cc00` | 1 | affected; package source changed |
| `cadenza-chamber` | `3bc0dfa` | `10db3f6` | 2 | affected; TypeScript adapter behavior changed |
| `cadenza-cell` | `a9b5e16` | `89e6e54` | 6 | affected; routing, supply, and launcher behavior changed |
| `cadenza-reference-system` | `fbefa9a` | `4d610e3` | 3 | affected; reference artifact and build declaration changed |

The untracked `docs/strategy/` tree and
`docs/agent-harness/exec-plans/completed/2026-07-28-restore-strategy-artifacts.md`
belong to separate user work. They are outside the Sprint 10F affected scope
unless the user explicitly reclassifies them.

The implementation must freeze heads again before edits and before every
proof or artifact assembly stage. The table above is design evidence, not a
future license to ignore source drift.

## Design Principles

1. **RC1 is immutable.** Existing RC1 commits, tags, manifests, assets, and
   evidence are never rewritten.
2. **Affected-only identity.** A repository receives an RC2 version or tag only
   when its public source or artifact changed.
3. **One exact candidate.** Validation, package builds, runtime images,
   generated artifacts, SBOMs, archives, proofs, and the aggregate manifest
   bind the same committed source identities.
4. **Proof before authority.** Candidate evidence is assembled and reviewed
   before signing, tagging, releasing, or changing GitHub.
5. **Clean builds.** Release outputs are generated outside source repositories
   from clean commits and pinned toolchains.
6. **Finding-driven repair.** Product changes require a reproduced defect,
   exact owner, and focused amendment where the complexity gate applies.
7. **No meaningless churn.** Unchanged language cores are validated but not
   version-bumped, retagged, rebuilt as new identities, or recommitted.
8. **Truthful proof tiers.** Fast, complete, and privileged reports state their
   exact claims and cannot substitute for each other.
9. **No publication implication.** A locally assembled candidate is not a
   release and grants no deployment or GitHub authority.
10. **Coherence at closure.** The final review tests purpose, identity, state,
    affect, relationships, interpretation, time, security, and fragmentation
    across repository boundaries.

## Candidate Identity

If the validation gate remains clean, prepare:

- aggregate release key: `cadenza-distributed-foundation-rc2`;
- workspace tag candidate: `distributed-foundation-rc.2`;
- TypeScript core: `4.0.0-rc.2`, tag candidate `v4.0.0-rc.2`;
- Environment: `0.1.0-rc.2`, tag candidate `v0.1.0-rc.2`;
- Chamber: `0.1.0-rc.2`, tag candidate `v0.1.0-rc.2`;
- Cell: `0.1.0-rc.2`, tag candidate `v0.1.0-rc.2`;
- reference system: `0.1.0-rc.2`, tag candidate `v0.1.0-rc.2`.

Elixir and C# remain bound to their RC1 commits, versions, and signed tags
inside the aggregate RC2 manifest. Python moved to RC2 after complete proof
found and repaired a machine-sensitive throttling test.

Version declaration changes in affected repositories are release identity
changes, not feature work. They must be separate signed, DCO-compliant commits
in each repository and must happen before the definitive candidate proof.

Protocol versions do not change merely because a package version changes.
Any discovered need to change a runtime protocol, contract, schema, or
migration stops for a focused design amendment.

## Release Metadata Evolution

The current `release/candidate.json` and release scripts encode RC1 names and
package filenames. Rewriting them in place would erase historical
reproducibility.

Sprint 10F will:

1. preserve the RC1 declaration as a versioned candidate input;
2. add a separate RC2 candidate declaration;
3. make release validation, archive assembly, SBOM generation, and manifest
   generation consume an explicit candidate path;
4. derive package and archive names from that candidate rather than a
   hard-coded RC1 list;
5. reject an affected package whose built version does not match its declared
   candidate identity;
6. allow unchanged repositories to reference prior signed RC1 identities
   without pretending to create new artifacts;
7. emit the frozen aggregate manifest outside the source commit to avoid a
   self-reference cycle;
8. retain `registry_publication: false`.

The existing manifest schema should be reused if it can express mixed RC1 and
RC2 repository identities truthfully. A schema change requires an explicit
finding and a focused amendment before implementation.

## Implementation Sequence

### Phase 1: Freeze And Classify

1. Capture workspace and child repository heads, branches, worktree status,
   tags, toolchains, and source-tree digests.
2. Compare every current head with its RC1 tag.
3. Classify changed paths as product source, test, generated artifact,
   documentation, governance, or release metadata.
4. Confirm that Elixir and C# remain unchanged and require no new identity.
5. Classify any complete-proof finding that makes a previously unchanged
   repository affected.
6. Confirm custody for all untracked or unrelated root files.

### Phase 2: Candidate Metadata And Versions

1. Version the RC1 and RC2 candidate declarations without weakening RC1
   validation.
2. Generalize release tooling only as far as required to assemble either
   candidate from an explicit input.
3. Apply affected-only prerelease version declarations.
4. Regenerate native lockfiles or package metadata only where the owning
   ecosystem requires it.
5. Validate candidate declarations and source assertions before building.

### Phase 3: Repository-Native Validation

Run the complete repository-owned commands for:

- TypeScript format, lint, typecheck, tests, build, docs, package smoke, and
  reviewed performance collection;
- Python format, lint, typecheck, tests, build, and package smoke;
- Elixir format, compile with warnings as errors, tests, docs, package build,
  and package smoke;
- C# format, build with warnings as errors, tests, package build, docs, and
  package smoke;
- Environment installation, typecheck, full PostgreSQL tests, package builds,
  migration checksums, and contract fixtures;
- Chamber format, clippy, all tests, TypeScript adapter checks, crate/package
  build, and standalone contract fixture validation;
- Cell format, clippy, all tests, Linux-specific launcher tests where
  applicable, and standalone contract fixture validation;
- reference-system typecheck, tests, build, generated artifact validation,
  agent-authoring proof, and clean release consumption.

Warnings, skipped required checks, relaxed assertions, dirty generated output,
and undeclared toolchain substitutions are failures.

### Phase 4: Shared And Clean-Consumer Proof

1. Validate all shared contract snapshots.
2. Run primitive conformance across TypeScript, Python, Elixir, and C#.
3. Build all affected packages from clean committed source.
4. Install those packages into isolated clean consumers.
5. Rebuild the distributed reference artifact from the candidate core.
6. Verify exact artifact digests and runtime module bindings.
7. Run the fast and complete proof tiers against the candidate identities.
8. Collect performance distributions and compare them with reviewed budgets;
   do not use machine-sensitive single-run pass/fail thresholds.

### Phase 5: Fresh Privileged Proof

Run the privileged Linux/gVisor proof from:

- a fresh isolated PostgreSQL cluster per scenario;
- generated fixture credentials outside source and logs;
- measured rootfs, Chamber, Core, adapter, and reference artifact inputs;
- the neutral proof-service namespace;
- the pinned `runsc` and declared toolchains.

The final matrix includes all three current hardening scenarios:

1. two real Cells converge and execute across the distributed foundation;
2. desired state supplies, replaces, drains, and releases pre-enrolled Cells;
3. stem loss advances authority and resupplies fresh capacity.

The report must prove exact final cleanup of containers, bundles, cgroups,
processes, sockets, temporary authority clusters, credential files, and other
declared proof resources.

### Phase 6: Security And Coherence Closure

1. Rerun secret scanning across reachable official histories.
2. Regenerate source SBOMs for affected repositories and verify source-tree
   hashes.
3. Audit dependency advisories and retired dependencies in every ecosystem.
4. Recheck workflow permissions, pinned actions, DCO, commit signatures, and
   required-check declarations.
5. Recheck PostgreSQL role boundaries and `SECURITY DEFINER` functions.
6. Reconcile every Sprint 10D obligation with the definitive reports.
7. Review all retained code, tests, docs, and release tooling for current
   purpose.
8. Reapply the coherent-creation review across every changed boundary.
9. Classify every finding as repaired, retained necessary complexity,
   accepted limitation, or deferred feature.

Critical or high findings block closure. Medium or low findings require an
explicit purpose and risk judgment; they cannot disappear into a summary.

### Phase 7: Candidate Assembly

From clean committed source:

1. assemble affected packages and generated artifacts;
2. reuse unchanged RC1 identities by digest and signed tag reference;
3. create source archives for affected repositories and the curated workspace;
4. generate affected SBOMs and any changed atlas projections;
5. freeze the aggregate RC2 manifest outside the source tree;
6. validate every source, package, artifact, archive, SBOM, and manifest
   digest;
7. write the final Sprint 10 and Sprint 10F closure records;
8. prepare a publication decision package that names every proposed tag,
   release, asset, signature, branch action, and verification step.

No signing, tag creation, GitHub release, branch update, protection change,
asset upload, registry publication, or legacy-repository mutation occurs in
this phase.

## Repository Ownership

- Workspace root owns candidate metadata, proof orchestration, public
  documentation, SBOM custody, aggregate manifest, closure, and publication
  decision evidence.
- `cadenza` owns its package version, primitive source, package artifacts, and
  performance evidence.
- `cadenza-environment` owns its package versions, migrations, authority
  artifacts, and PostgreSQL validation.
- `cadenza-chamber` owns its crate version, TypeScript adapter artifact, and
  Chamber proof inputs.
- `cadenza-cell` owns its crate version, trusted runtime source, and privileged
  host proof.
- `cadenza-reference-system` owns its version, generated business artifact,
  clean-consumer proof, and agent-authoring evidence.
- Python owns its deterministic test repair, RC2 package identity, and
  reproducible Python 3.13/3.14 wheel.
- Elixir and C# are validation participants and unchanged RC1 identities only.

Every modified child repository receives its own branch-local signed,
DCO-compliant commit. No root commit contains child repository changes.

## Stop Conditions

Stop for a focused design amendment when:

- a schema, migration, shared contract, runtime protocol, public API, or
  architecture must change;
- release metadata cannot represent mixed RC1 and RC2 identities without a
  manifest schema change;
- a product repair exceeds roughly 200 lines, adds a dependency, or crosses an
  ownership boundary;
- a proof fails because current behavior contradicts an authoritative
  contract;
- a candidate artifact cannot be reproduced from committed source;
- a version-only change unexpectedly alters runtime protocol or behavior;
- security review finds a critical or high issue without a bounded approved
  repair;
- required toolchain or privileged Linux assumptions cannot be provisioned;
- cleanup cannot prove absence of a declared resource;
- unrelated user work enters the affected scope;
- the work would begin generated expansion, advanced-security features,
  observer UI, CLI, plugins, Memory, or managed-product functionality.

Stop for user judgment when:

- all closure evidence is clean and the optional RC2 candidate is ready;
- any medium or low security finding is proposed for acceptance;
- a repository is proposed for RC2 identity despite being unchanged;
- signing or any GitHub mutation is proposed.

## Validation

Workspace checks include:

```bash
./scripts/workspace-snapshot.sh
./scripts/check-agent-harness.sh
node scripts/check-contract-snapshots.mjs
node scripts/check-public-documentation-links.mjs
node scripts/validate-architecture-atlas.mjs
node scripts/prepare-public-workspace.mjs --check
node scripts/validate-release-candidate.mjs --candidate <rc2-candidate>
node scripts/run-proof.mjs fast
node scripts/run-proof.mjs complete
node scripts/run-proof.mjs privileged --hardening
```

Repository-native commands remain owned by each repository and its repo card.
The final closure records exact commands, versions, durations, source digests,
report digests, and results rather than relying on this planned list.

## Acceptance Criteria

- exact clean source heads and source-tree digests are frozen;
- every official repository passes its native validation;
- all seven shared contract bundles and four-language semantic conformance
  pass;
- affected packages pass clean-consumer installation and smoke validation;
- the reference business flows and generated artifact bind the candidate core;
- fast, complete, and three-scenario privileged proof pass against the same
  candidate inputs;
- final cleanup reports zero retained resources in every declared class;
- performance distributions remain within reviewed development budgets or
  receive explicit non-blocking interpretation;
- affected SBOMs, archives, artifacts, and manifests reproduce from clean
  committed source;
- RC1 candidate metadata and artifacts remain reproducible and unchanged;
- Elixir and C# remain on their RC1 identities without meaningless retags;
- Python RC2 replaces its machine-sensitive throttling proof without changing
  runtime semantics;
- every changed repository has a justified RC2 identity and matching version
  declaration;
- no critical or high security finding remains;
- all medium and low findings are explicitly repaired or presented for user
  acceptance;
- final coherence review finds no dead purpose, duplicate authority, hidden
  affect, weak custody, or unjustified fragmentation;
- a closure report separates repaired defects, retained necessary complexity,
  accepted limitations, deferred features, evidence, and residual risk;
- the candidate remains local and unsigned until a separate final publication
  decision.

## Non-Goals

- GitHub tags, releases, uploads, branch changes, protection changes, or other
  remote mutation;
- package-registry publication;
- changing RC1;
- retagging unchanged language repositories;
- feature expansion, generated bundles, advanced security, observer UI, CLI,
  plugins, Memory, agents, or managed-product work;
- remote PostgreSQL transport, secret brokers, automatic key rotation,
  aggregate hostile admission, or a production SLA;
- concurrency or performance optimization;
- contract, protocol, schema, migration, or runtime behavior changes without a
  focused amendment.

## Risks

- **Candidate identity drift:** version edits can invalidate earlier proof.
  Mitigation: definitive proof runs only after candidate version commits and
  artifact rebuild.
- **RC1 history erosion:** in-place metadata edits can make RC1 impossible to
  reproduce. Mitigation: preserve versioned RC1 input and introduce explicit
  candidate selection.
- **Meaningless release churn:** an aggregate version can pressure every repo
  to retag. Mitigation: mixed RC1/RC2 identity is an explicit design
  requirement.
- **Dirty-source artifacts:** local generated files can enter packages without
  authority. Mitigation: build outside source from clean commits and verify
  tracked-tree digests.
- **Proof mismatch:** separate proof tiers can accidentally use different
  binaries. Mitigation: bind every report to one manifest and measured
  artifact set.
- **Privileged environment leakage:** prior containers, cgroups, roles, or
  rootfs content can create false results. Mitigation: fresh clusters, measured
  inputs, neutral namespaces, and exact cleanup.
- **Security-review fatigue:** repeated clean scans can hide boundary changes.
  Mitigation: review the post-RC diff and affected authority paths before
  interpreting tool output.
- **Publication by implication:** a signed or uploaded asset can be mistaken
  for approval. Mitigation: keep the candidate local and unsigned until a
  separate explicit decision.

## Migration Strategy

There is no runtime migration in the proposed scope.

The release metadata migrates from one hard-coded RC1 candidate to explicit
versioned candidate inputs. RC1 remains a supported historical input. RC2
version declarations are applied only to affected repositories and are
validated as clean prerelease identities.

If a runtime or persistence migration becomes necessary, Sprint 10F stops and
returns to the complexity gate.

## Alternatives

1. **Close Sprint 10 without an RC2 candidate.** Valid but leaves the post-RC
   source and proof baseline without one distributable identity. Retained as
   fallback if candidate assembly exposes unjustified risk.
2. **Retag every repository as RC2.** Rejected because unchanged language
   implementations would receive meaningless identities.
3. **Overwrite `release/candidate.json` with RC2.** Rejected because it would
   damage RC1 reproducibility and historical authority.
4. **Publish immediately after proof.** Rejected because release evidence and
   remote mutation require separate judgment.
5. **Reuse Sprint 10D complete and privileged reports.** Rejected for final
   closure because candidate version and artifact identities must receive an
   unconditional definitive run.
6. **Build only affected repositories.** Rejected because unchanged
   cross-language and contract consumers must still prove compatibility.
7. **Add deferred security or operational features before closure.** Rejected
   because it would move the baseline while attempting to freeze it.

## Coherence Review

- **Intent:** definitive validation protects the application-authoring goal
  before expansion resumes.
- **Identity:** candidate versions, commits, tags, trees, packages, images,
  artifacts, reports, and manifests remain exact and non-interchangeable.
- **State:** clean source, built artifact, validated candidate, signed release,
  and published release are separate states.
- **Affect:** build, sign, tag, upload, publish, deploy, and withdraw are
  separately authorized affects.
- **Relationships:** aggregate RC2 composes affected RC2 and the unchanged
  Elixir and C# RC1 identities without rewriting either.
- **Interpretation:** each proof and scan states what it proves, what it does
  not prove, and which source it measured.
- **Shared fields:** candidate metadata owns release identities while
  repository manifests own native package declarations.
- **Time:** RC1 remains immutable; RC2 supersedes it only when explicitly
  published and selected.
- **Security:** clean builds, pinned tools, signatures, DCO, custody, and
  publication separation preserve authority.
- **Fragmentation control:** one aggregate manifest unifies a deliberately
  mixed set of repository versions without forcing false uniformity.

## Assumptions

- The user wants Sprint 10F to prepare an optional RC2 candidate but not publish
  it.
- The current manifest schema can represent a mixed RC1/RC2 repository set;
  implementation must verify this before editing release tooling.
- The existing privileged Linux environment and pinned toolchain can be
  reprovisioned for the definitive proof.
- Version-only prerelease changes are acceptable in affected repositories once
  this focused design is approved.
- The unrelated strategy artifacts remain outside affected scope.
