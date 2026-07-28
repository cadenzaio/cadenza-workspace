# Sprint 10D Failure, Custody, And Security Hardening

Date: 2026-07-28

## Status

- State: `done`.
- Parent:
  [Sprint 10 distributed foundation consolidation and hardening](../active/2026-07-25-distributed-foundation-consolidation-hardening-design.md).
- Approval received from the user on 2026-07-28:
  `Design approved. Proceed.`
- Closure:
  [Sprint 10D Failure, Custody, And Security Hardening Closure V1](../../../publication/sprint-10d-failure-custody-security-hardening-closure-v1.md).
- Active implementation WIP: none.

## Context

Sprint 10C proved that the current distributed foundation can be rebuilt and
validated through declared fast, complete, and privileged paths. Sprint 10D
must now challenge failure and security boundaries without turning hardening
into an unbounded feature or test program.

The parent plan names ten failure concerns and a broad security-review surface.
Most individual invariants already have focused tests:

- Environment rejects stale or conflicting authority, fences actor mutation,
  separates PostgreSQL roles, and preserves immutable evidence.
- Chamber rejects stale activation, replaced artifacts, unbounded or
  noncanonical frames, missing evidence custody, and stale actor residency.
- Cell rejects stale generations, replay, route drift, lost distribution
  custody, uncertain actor commits, invalid drain, and hidden local custody.
- Existing privileged scenarios prove real authority outage, provider restart,
  Cell and Chamber replacement, actor reassignment, stem loss, resupply,
  execution recovery, and exact cleanup.

The remaining problem is to prove that these controls compose at the right
boundaries and to update the security judgment for the post-RC changes. Adding
the same failure at every layer would increase cost without increasing
confidence.

## Intended Whole

The distributed foundation should absorb deployment, distribution, failure,
and recovery complexity while preserving explicit authority and truthful
custody. Application authors should receive a fulfilled result, a bounded
failure, or explicit uncertainty without needing to coordinate infrastructure
recovery inside business logic.

Hardening serves this whole when:

- failure cannot widen authority or silently move affect to another identity;
- uncertainty preserves custody and prevents duplicate affect;
- replacement advances generation and epoch instead of adopting stale state;
- evidence remains bounded and excludes sensitive business or deployment data;
- cleanup claims correspond to measured process, container, descriptor,
  authority, and filesystem absence;
- each test has one clear purpose and one authoritative owner.

False success includes:

- multiplying tests without identifying a missing claim;
- treating a timeout as evidence of a specific failure transition;
- retrying started or uncertain work on another replica;
- accepting a stale route, generation, assignment, artifact, or grant because
  the replacement is otherwise healthy;
- calling a process stopped while retained custody remains;
- weakening evidence or authority requirements to improve availability;
- accepting a security limitation that contradicts a supported public claim;
- absorbing deferred advanced-security features into this sprint.

## Design Principles

1. **Obligation before test.** Every retained or added test must map to one
   named failure obligation and one current contract claim.
2. **Cheapest authoritative proof.** Use deterministic repository tests for
   local invariants, process tests for cross-process custody, and privileged
   Linux only for containment or system convergence that lower layers cannot
   prove.
3. **No combinatorial matrix.** Failure timing is represented by meaningful
   authority states, not every possible pairwise interleaving.
4. **No silent retries.** Pre-affect stale or unavailable outcomes may be
   retryable; started or uncertain outcomes remain explicit and non-retryable.
5. **Finding-driven repair.** Product source changes require an evidenced
   defect. Tests, review records, and proof orchestration are the only planned
   changes.
6. **Authority-first correction.** Any shared-contract defect is repaired in
   its authority repository before consumers.
7. **No independent-review claim.** Codex performs the technical review and
   repository owners retain implementation responsibility. The user owns final
   acceptance of bounded residual risk.

## Failure Coverage Ledger

Sprint 10D will create one current coverage ledger under `docs/security/`.
Each row must record:

- obligation and contract claim;
- participating identities and authority owner;
- injection checkpoint expressed as a deterministic state;
- expected outcome, retained custody, and forbidden affect;
- exact existing or added tests;
- required evidence and cleanup assertions;
- exact source commit and execution result;
- finding or accepted-limit disposition.

The ledger starts with these ten obligations:

| ID       | Failure obligation                                                                                                                                              | Primary owner                         | Required proof level                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `FCS-01` | Stale or conflicting authority cannot mutate local or durable state.                                                                                            | Environment, interpreted by Cell      | Existing PostgreSQL and deterministic convergence tests; add only a demonstrated gap.                                          |
| `FCS-02` | Activation-issuer or purpose-specific database-role outage cannot create partial activation authority or widen a credential boundary.                           | Cell and Environment                  | Focused activation boundary plus the existing system outage proof.                                                             |
| `FCS-03` | Supply-provider death before launch, during activation custody, or after ready state cannot overlap, adopt, or abandon a Cell generation.                       | Cell                                  | Existing process/state tests for pre-ready windows and the existing privileged provider-restart scenario for live generations. |
| `FCS-04` | Cell or Chamber replacement advances identity before old authority can affect new work.                                                                         | Cell and Chamber                      | Existing convergence tests plus the existing privileged replacement path.                                                      |
| `FCS-05` | Withdrawal of pending or prepared activation cancels the exact retained request, grant, or process before absence is claimed.                                   | Cell                                  | Existing deterministic convergence tests; process coverage only if the ledger finds an unproved custody boundary.              |
| `FCS-06` | Stale peer generation, replay, or changed content under an existing identity fails before duplicate target affect.                                              | Cell                                  | Existing authenticated peer and replay tests.                                                                                  |
| `FCS-07` | Route-member replacement fences the old epoch; source Cell validates but never substitutes the Chamber-selected member.                                         | Chamber and Cell                      | Existing sender-selection and exact-resolution tests plus real replacement execution.                                          |
| `FCS-08` | Evidence pressure or ledger unavailability remains bounded and fails closed at the declared custody barrier.                                                    | Chamber, Cell, and Environment        | Existing custody, journal, and ledger tests; one cross-layer test only if current tests do not bind the same operation state.  |
| `FCS-09` | Uncertain actor commit and owner reassignment resolve by stable mutation authority without duplicate commit or stale-owner affect.                              | Environment, Cell, and Chamber        | Existing actor scenario matrix plus the existing privileged actor reassignment path.                                           |
| `FCS-10` | Drain and shutdown cannot report stopped or clean while member, route, actor, process, descriptor, container, cgroup, credential, or authority custody remains. | Cell with workspace proof stewardship | Existing drain/launcher tests and all three existing privileged scenarios with exact cleanup.                                  |

An existing test may satisfy an obligation only when its assertion reaches the
claimed boundary. A test name or historical closure statement alone is not
evidence.

## Proof Tiers

### Tier 1: Deterministic Boundary Proof

- Inventory existing tests against `FCS-01` through `FCS-10`.
- Remove no useful coverage merely to reduce counts.
- Add a focused regression only where the ledger identifies a missing
  authority transition, forbidden affect, or cleanup assertion.
- Prefer parameterized state cases when they share one transition contract.

### Tier 2: Process And Protocol Proof

- Exercise only failures whose meaning crosses a real process, descriptor,
  transport, or persistence facade.
- Use explicit checkpoints or test-controlled providers; do not depend on
  arbitrary sleeps to claim that a failure occurred in a specific phase.
- Preserve normalized non-secret diagnostics and exact started/uncertain state.

### Tier 3: Privileged System Proof

Closure will run the three existing root Linux/gVisor scenarios from fresh
PostgreSQL authority:

1. `two_real_cells_converge_database_authority_without_lifecycle_commands`;
2. `desired_replica_state_supplies_and_releases_pre_enrolled_cells`;
3. `scale_orchestration_survives_stem_loss_and_resupplies_fresh_capacity`.

Together they cover real distribution, route and actor replacement, database
role outage, provider restart, stem loss, resupply, post-recovery execution,
drain, and cleanup. The third scenario will be declared in the proof manifest
as a hardening scenario without making it part of the ordinary two-scenario
privileged development path.

No new privileged scenario is planned. Adding one requires a focused design
amendment proving that a containment-specific claim cannot be established in
Tier 1 or Tier 2.

## Security Review

### Threat-Model Delta

Update the current threat register only where post-RC behavior changed:

- sender-side replica selection and bounded selection-state custody;
- source Cell exact-selection validation and no-substitution behavior;
- supply restart, generation replacement, and retained launcher custody;
- Core actor-definition authority tightening;
- privileged proof credential, toolchain, database, rootfs, and cleanup
  custody.

Accepted limitations remain limitations unless evidence shows that a current
claim is false. Repeating them is not closure work.

### Manual Review Surfaces

- Root workspace:
  proof input custody, report disclosure, source/commit binding, SBOM and
  archive consistency, workflow permissions, action pinning, release
  signatures, and public/private boundary.
- Core:
  post-RC actor API changes, callable/definition boundary, dependency graph,
  package contents, and generated documentation isolation.
- Environment:
  `SECURITY DEFINER` ownership and `search_path`, revoke-first grants,
  purpose-separated roles, idempotency, stale revision fencing, evidence
  ledger bounds, and actor commit/outcome authority.
- Chamber:
  unsafe Rust justification, canonical frame parsing, allocation and
  collection bounds, path and artifact closure, adapter process supervision,
  source disclosure, selection-state bounds, and evidence capture.
- Cell:
  unsafe Rust justification, descriptor transfer and closure, path and symlink
  handling, launcher and child cleanup, key-purpose separation, peer replay,
  provider custody, route replacement, evidence pressure, and normalized
  diagnostics.
- Python, Elixir, C#, and reference system:
  unchanged-source dependency, package, secret, license, and conformance
  validation only unless a finding identifies a concrete defect.

### Automated Supply-Chain Review

Run exact candidate checks for:

- dependency vulnerabilities and deprecated/retired packages;
- direct and transitive license posture;
- current-tree and reachable-history secrets;
- generated SBOM source hashes and dependency edges;
- source archive and package-content consistency;
- mutable or over-privileged CI dependencies;
- signed commit and release-manifest consistency.

Generated evidence must record tool versions, exact commits, ignored findings,
and triage. A scanner's zero result is supporting evidence, not proof of
absence.

## Finding Classification

| Severity        | Meaning in Sprint 10D                                                                                                                                                                                    | Closure treatment                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `critical`      | Supported inputs can escape the host boundary, execute arbitrary unauthorized code, exfiltrate privileged credentials, or compromise release authority.                                                  | Must be repaired and re-proved, or the affected capability must be removed through an approved design amendment.        |
| `high`          | Supported inputs can cause unauthorized affect, duplicate started work, accept stale authority, lose process/actor custody, disclose sensitive runtime material, or bypass a mandatory security barrier. | Same blocking treatment as critical. Documentation-only acceptance is forbidden.                                        |
| `medium`        | Bounded denial of service, operational ambiguity, defense-in-depth weakness, or stewardship defect that does not cross a mandatory boundary.                                                             | Repair by default. Acceptance requires explicit rationale, an owner, and user approval when it affects a current claim. |
| `low`           | Narrow hygiene, maintainability, or non-sensitive diagnostic weakness with no current authority consequence.                                                                                             | Repair when local and low-risk; otherwise document an owner and follow-up.                                              |
| `informational` | Confirmed property, supported assumption, or detector result that is not a defect.                                                                                                                       | Record without presenting it as remediation.                                                                            |

Coherence impact is recorded separately as `whole_breaking`, `boundary`,
`interpretation`, `stewardship`, or `none`. Severity and coherence impact must
not be collapsed into one label.

## Stop Conditions

Implementation stops for a new design decision when:

- a finding requires a schema, shared contract, public API, architecture, new
  external dependency, or more than roughly 200 lines of product repair;
- a repair would implement remote database transport, automatic key rotation,
  a secret broker, multi-tenant admission, a new containment profile, plugin
  security, or another deferred feature;
- a privileged scenario needs a new authority role, credential path,
  containment capability, or undeclared host assumption;
- a failure checkpoint cannot be observed deterministically and the proposed
  response is only to increase a timeout;
- a critical or high finding cannot be repaired inside the approved boundary;
- medium-risk acceptance would contradict a current supported claim;
- cleanup leaves any unexplained process, container, bundle, cgroup, socket,
  database cluster, credential file, route, assignment, or generation.

The sprint may continue through local low-risk test or implementation repairs
that preserve current contracts and repository ownership. Every such repair
must be committed separately in its owning repository and rebound into the
coverage ledger.

## Repository Ownership

- Workspace:
  cross-repo threat model, coverage ledger, proof declaration, supply-chain
  evidence, finding register, coherence review, and closure.
- `cadenza-environment`:
  durable authority, role, ledger, reconciliation, and actor persistence
  findings.
- `cadenza-chamber`:
  adapter, materialization, parser, supervision, selection, and runtime
  evidence findings.
- `cadenza-cell`:
  containment, descriptor, process, provider, transport, custody, and cleanup
  findings.
- `cadenza`:
  Core dependency, actor-definition, package, and callable-boundary findings.
- Other official repositories:
  validation only unless evidence changes their status.

Cross-repository coordination lives in this plan. Product changes remain
separate signed and DCO-compliant commits in each child repository.

## Implementation Sequence

1. Freeze the exact clean candidate commits and create the failure coverage
   ledger.
2. Update the threat-model delta and classify existing accepted limitations.
3. Perform manual source review and automated supply-chain checks.
4. Run Tier 1 tests and add only coverage-ledger-backed regressions.
5. Run Tier 2 process/protocol failures and repair evidenced local defects.
6. Run all three Tier 3 scenarios from isolated authority with exact cleanup.
7. Repeat affected validation, package, contract, SBOM, secret, and signature
   checks.
8. Publish a closure review separating repaired defects, retained complexity,
   accepted limitations, deferred controls, and exact evidence.

## Validation

At minimum:

```bash
./scripts/workspace-snapshot.sh
./scripts/check-agent-harness.sh
node scripts/check-contract-snapshots.mjs
node scripts/check-public-documentation-links.mjs
node scripts/prepare-public-workspace.mjs --check
node scripts/run-proof.mjs fast
node scripts/run-proof.mjs complete
node scripts/run-proof.mjs privileged --lima cadenza-gvisor --hardening
```

Repository-native format, lint, typecheck, test, package, documentation, audit,
and metadata commands remain required for every affected repository. The
privileged hardening proof runs in the approved Linux environment through the
declared proof harness.

## Acceptance Criteria

- every `FCS-*` obligation has one authoritative, current, passing proof;
- no added test lacks a named contract or boundary purpose;
- post-RC threat-model changes are explicit;
- unsafe, parser, bounds, path, descriptor, process, key, PostgreSQL,
  evidence, artifact, and CI surfaces are reviewed;
- exact candidate dependency, license, secret, SBOM, archive, package, and
  signature checks are recorded;
- all three privileged scenarios pass from fresh authority;
- each privileged run proves zero retained custody;
- no unresolved critical or high finding remains;
- every accepted medium or low finding has a rationale, owner, and follow-up
  posture;
- retained limitations do not contradict supported claims;
- product code changes, if any, are narrowly finding-driven;
- Sprint 10E receives an exact list of operational states and recovery paths
  that remain difficult to interpret.

## Non-Goals

- remote PostgreSQL TLS;
- automatic key generation, storage, monitoring, or rotation;
- secret brokers;
- hostile multi-tenant scheduling or fleet admission;
- new containment profiles;
- general plugin or Memory security;
- concurrency or performance optimization;
- observer UI, CLI, managed product, or generated expansion;
- a production SLA or independent security-audit claim.

## Alternatives

1. **Repeat every failure at every layer.** Rejected because it multiplies
   cost and maintenance without proving more boundary meaning.
2. **Run only the existing full suites.** Rejected because test presence does
   not establish a current cross-boundary coverage argument.
3. **Add a large new privileged chaos suite.** Rejected because state-blind
   process killing is expensive, timing-sensitive, and less interpretable than
   authority-state injection.
4. **Implement all accepted security limitations now.** Rejected because this
   would absorb the later advanced-security track and obscure present defects.
5. **Use documentation as acceptance for critical/high findings.** Rejected
   because a supported boundary cannot remain knowingly false.

## Coherence Review

- **Intent:** the pass protects the promise that business authors do not own
  distribution recovery.
- **Identity:** failure obligations preserve authority, generation, route,
  process, evidence, actor, and release identities instead of merging them.
- **Affect:** every injection names the exact point before, during, or after
  consequential affect.
- **Relationships:** repository ownership follows the boundary that can
  authorize or retain the consequence.
- **Interpretation:** the ledger connects local tests to system claims and
  records uncertainty without hiding it behind generic failure.
- **Shared fields:** threat model, contracts, proof manifest, SBOMs, and
  evidence reports receive explicit stewardship.
- **Time:** generation, epoch, mutation, replay, and source commit preserve
  meaning across replacement and rerun.
- **Security:** failure is allowed to reduce availability but not to widen
  authority or erase custody.
- **Fragmentation control:** tiered proof prevents both local green-test false
  success and an unmaintainable all-pairs failure suite.

## Assumptions

- The existing three privileged scenarios remain the authoritative system
  scenarios unless the coverage ledger proves a containment-specific gap.
- RC1 and published assets remain immutable.
- The current candidate has no production SLA and makes no independent-audit
  claim.
- Use best judgment for low-risk, contract-preserving regression repairs; stop
  at every condition listed above.
