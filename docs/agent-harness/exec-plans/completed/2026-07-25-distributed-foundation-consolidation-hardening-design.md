# Sprint 10 Distributed Foundation Consolidation And Hardening Design Proposal

Date: 2026-07-25

## Status

- State: `done`; Sprint 10A through Sprint 10F and RC2 publication are
  complete.
- Active WIP: none.
- Prerequisite: Sprint 9 publication, sender-side replica routing closure, and
  supply-restart lifecycle hardening are complete.
- Approval received from the user on 2026-07-27:
  `Design approved. Proceed.`
- Completed Sprint 10B repairs:
  [TypeScript actor API purpose repair](./2026-07-27-typescript-actor-api-purpose-repair-design.md)
  and
  [Core TypeDoc transitive security repair](./2026-07-27-core-typedoc-transitive-security-repair-design.md).
- Completed Sprint 10C:
  [Reproducible proof and performance harness](./2026-07-27-sprint-10c-reproducible-proof-performance-harness.md)
  and
  [closure evidence](../../../publication/sprint-10c-reproducible-proof-performance-closure-v1.md).
- Completed Sprint 10D:
  [failure and custody plan](./2026-07-28-sprint-10d-failure-custody-security-hardening.md)
  and
  [closure evidence](../../../publication/sprint-10d-failure-custody-security-hardening-closure-v1.md).
- Completed Sprint 10E:
  [operational interpretation and stewardship](./2026-07-28-sprint-10e-operational-interpretation-stewardship.md)
  and
  [closure evidence](../../../publication/sprint-10e-operational-interpretation-stewardship-closure-v1.md).
- Completed Sprint 10F:
  [closure and optional RC2 candidate](./2026-07-28-sprint-10f-closure-optional-rc2-candidate.md).
- Published result:
  [Sprint 10F RC2 Publication Evidence V1](../../../publication/sprint-10f-rc2-publication-evidence-v1.md).

## Goal

Turn the proven distributed foundation into one coherent post-RC development
baseline that is easier to validate, operate, inherit, and harden before
generated expansion begins.

This sprint is feature-free. It may repair defects exposed by consolidation,
failure injection, security review, or definitive proof, but it may not absorb
generated expansion, plugins, Memory, observer UI, CLI, remote database
transport, or managed-product work.

## Intended Whole

The distributed foundation should remain a truthful, governed substrate in
which application authors and agents focus on workflows and business logic
while the environment owns authority, materialization, containment,
distribution, scale, evidence, and recovery.

Consolidation serves that whole when:

- one current source and contract baseline is unambiguous;
- every retained state and boundary has a purpose;
- privileged proofs are reproducible without hidden workstation history;
- failures preserve authority and explain what remains in custody;
- future contributors can repeat and interpret the evidence;
- operational simplification improves interpretation without erasing
  security-relevant distinctions.

False success includes:

- a green test suite whose privileged proof depends on stale rootfs content,
  shared database roles, or an undocumented cgroup wrapper;
- public documentation that points at stale active plans or obsolete branch
  heads;
- merging private workspace history into the intentionally fresh public
  workspace;
- broad refactoring that creates churn without repairing an evidenced
  fragmentation;
- calling accepted security limitations resolved by merely documenting them
  again;
- adding advanced features under the name of hardening;
- multiplying tests without improving boundary or failure confidence.

## Current Evidence

### Immutable Public Baseline

- The seven official repositories and curated workspace were published as
  RC1 with signed release authority.
- RC1 tags, manifests, and release assets remain immutable.
- Package-registry publication remains out of scope.

### Post-RC Runtime Changes

- `cadenza-chamber` has one post-RC DCO commit implementing sender-side
  replica selection:
  `09e1197`.
- `cadenza-cell` has two post-RC DCO commits proving replica routing and
  hardening supply-restart lifecycle custody:
  `819bbfb` and `1932252`.
- The latest privileged proof passed two supplied replicas, authority outage,
  provider replacement, fresh generations, post-restart execution,
  scale-down, dormant supply, and exact cleanup in `374.23s`.
- Core, Python, Elixir, C#, and Environment currently have no post-RC source
  change requiring integration.

### Workspace-Custody Fragmentation

- The public workspace `origin/main` now points to the fresh curated public
  history at `574ad51`.
- The active local root branch still descends from the old private workspace
  lineage and has no merge base with the public history.
- The working tree contains the public workspace files plus approved
  post-publication closure and communication artifacts.
- This is an expected consequence of the approved public-repository
  replacement, not evidence of remote corruption, but it must be reconciled
  before further root commits.
- Private lineage must never be merged, rebased, or made reachable from the
  public workspace.

### Accepted Security And Operational Boundaries

- Node VM contexts are not sandboxes.
- gVisor does not replace host, network, cgroup, or tenant isolation.
- host root, PostgreSQL superuser, launcher, active signing key, and enrolled
  peer-key compromise remain high-authority compromise cases.
- Cell supports local Unix-socket or loopback NoTLS PostgreSQL only.
- key generation, storage, monitoring, and rotation automation remain
  deployment responsibilities.
- aggregate fleet admission and denial-of-service absorption remain external.
- evidence proves execution structure and integrity, not business truth.
- TypeScript is the only distributed Chamber adapter.
- Chamber execution remains intentionally serialized.
- the current system is a release candidate without a production SLA.

Sprint 10 must distinguish limitations that should remain explicit from
defects in the present claims. It must not silently pull later advanced
security features into this pass.

## Principles

1. Preserve RC1 as immutable evidence.
2. Use one active implementation stream and sequential gates.
3. Start from public authority, never from private workspace ancestry.
4. Import post-publication content as new public-lineage commits only.
5. Validate unchanged repositories; do not churn them.
6. Repair only evidenced defects or purpose failures.
7. Keep durable authority, runtime custody, and observed consequence distinct.
8. Prefer bounded state/failure matrices over combinatorial test expansion.
9. Keep secrets and fixture credentials out of source, logs, shell history,
   artifacts, and inherited runtime environments.
10. Make every proof state what it proves and what it does not prove.

## Sprint 10A: Public Baseline And Workspace Custody

### Purpose

Establish one safe post-RC source baseline before reviewing or changing the
system.

### Work

1. Capture a non-destructive root snapshot:
   - current branch and commit identities;
   - a Git bundle of the private-lineage branch;
   - hashes and status for every modified or untracked root path;
   - an explicit list of artifacts produced by the separate communication
     strategy thread.
2. Create a clean branch from public `origin/main` in a separate worktree.
3. Classify root content into:
   - bytes already present in public main;
   - approved post-publication records to import;
   - private/history-only material that must remain outside public ancestry;
   - unrelated or uncertain user work that must remain untouched.
4. Apply approved post-publication records as new commits whose parent is the
   public lineage. Do not merge or rebase the old private branch.
5. Prove:
   - the resulting branch descends only from public main;
   - no private workspace commit is reachable;
   - the public allowlist, documentation authority, link checks, and harness
     pass;
   - all communication artifacts are either intentionally imported or
     explicitly preserved outside the affected scope.
6. Move the primary root worktree to the clean branch only after the
   classification and preservation evidence is complete.
7. Establish `codex/distributed-foundation-consolidation-hardening` branches
   in each repository actually modified.
8. Carry the Chamber and Cell post-RC commits forward without rewriting RC1.
9. Close stale Sprint 9 parent status, roadmap status, active-plan placement,
   and links that still describe completed work as active.

### Gate

Sprint 10B cannot begin until the workspace has one public-lineage baseline,
all local artifacts have explicit custody, and no private history is
reachable from the candidate branch.

### Closure

Sprint 10A passed its gate on 2026-07-27. Exact ancestry, custody, source
identities, validations, and limits are recorded in
[Sprint 10A Public Baseline Closure V1](../../../publication/sprint-10a-public-baseline-closure-v1.md).

## Sprint 10B: Recursive Purpose And Contract Consolidation

### Purpose

Review the current post-RC whole for dead purpose, duplicate authority,
contract drift, and accidental complexity without performing speculative
refactors.

### Work

- rerun the spotless/purpose test across all official repositories;
- review recent Chamber and Cell changes recursively through Environment,
  contract snapshots, reference-system behavior, and public documentation;
- verify all four cores still agree on shared semantic fixtures;
- verify that only TypeScript is claimed as a distributed adapter;
- compare repo-card commands with repository-owned commands and remove current
  documentation drift;
- verify active versus completed execution-plan placement and current-link
  authority;
- audit public exports, unused modules, unreachable runtime states, stale
  feature flags, duplicate fixtures, and obsolete release scaffolding;
- record every finding as repair, justified retention, later-track work, or
  historical-only material.

### Gate

No code repair proceeds without an evidenced owner, blast radius, and
validation plan. Schema, shared-contract, dependency, or architectural changes
require a focused design amendment.

## Sprint 10C: Reproducible Proof And Performance Harness

### Purpose

Make the strongest system evidence repeatable from declared inputs rather than
operator memory.

### Work

- define fast, complete, and privileged proof tiers;
- provide one declared privileged-proof entrypoint that:
  - provisions a fresh isolated PostgreSQL cluster;
  - generates fixture credentials without exposing them in command history or
    logs;
  - verifies the exact Chamber/Cell protocol compatibility before a long run;
  - assembles and measures the canonical rootfs from explicit inputs;
  - uses a neutral delegated cgroup wrapper;
  - cleans processes, containers, bundles, sockets, cgroups, temporary
    authority, and proof files on success or failure;
- reject stale rootfs, shared cluster-role custody, mutable artifact inputs,
  and undeclared timeout changes before execution;
- consolidate proof manifests, commands, durations, component digests, and
  claims;
- replace machine-sensitive pass/fail performance thresholds with isolated
  measurements, distributions, and explicitly reviewed budgets;
- keep a small focused smoke path for routing and lifecycle behavior so the
  long proof is not the first detector.

### Gate

The harness must reproduce the distributed reference path and the
replica/provider-restart path from fresh authority with exact cleanup. A wider
timeout cannot substitute for evidenced forward progress.

## Sprint 10D: Failure, Custody, And Security Hardening

### Purpose

Challenge the existing distributed foundation at its real boundaries without
starting the later advanced-security feature track.

### Work

- update the threat model for the post-RC routing and lifecycle changes;
- review unsafe Rust, protocol parsers, frame/collection bounds, path handling,
  descriptor custody, process cleanup, key purpose separation, PostgreSQL
  `SECURITY DEFINER` posture, role grants, evidence disclosure, artifact
  measurement, and CI supply-chain controls;
- run dependency, license, secret, SBOM, source/artifact consistency, and
  release-signature checks against exact candidate commits;
- execute a bounded failure matrix covering:
  - stale and conflicting authority;
  - activation-issuer and database-role outage;
  - provider death before, during, and after Cell activation;
  - Cell and Chamber replacement;
  - pending and prepared activation withdrawal;
  - stale peer generation and replay;
  - route-member replacement;
  - evidence pressure and unavailable ledger;
  - uncertain actor commit and owner reassignment;
  - drain and shutdown with retained custody;
- require exact identity, state, authority, and cleanup evidence for each
  selected scenario;
- classify findings by severity and coherence impact;
- block closure on unresolved critical/high findings;
- explicitly justify accepted medium/low findings and limitation retention.

### Deferred Boundaries

Remote PostgreSQL TLS, automatic key rotation, secret brokers, general plugin
security, aggregate fleet admission, hostile multi-tenant scheduling, new
containment profiles, and distributed-envelope features beyond a repair of the
current contract remain later design tracks.

## Sprint 10E: Operational Interpretation And Stewardship

### Purpose

Reduce operational complexity by making truthful states easier to understand,
not by collapsing them.

### Work

- align state-transition, custody, authority, failure, and evidence
  documentation with the final code;
- ensure actionable failures identify the safe non-secret identity and stage
  that owns the block;
- document bounded recovery and escalation paths for authority, containment,
  evidence, supply, routing, actor, and cleanup failures;
- update troubleshooting and runtime-operator guidance from actual proof
  failures;
- add or repair diagrams only where they clarify a changed current boundary;
- preserve the read-only observer as a later feature rather than building UI
  in this sprint;
- record residual operational risks and explicit operator responsibilities.

### Gate

A future contributor must be able to identify what is desired, what is
authorized, what is running, what is observed, what remains in custody, and
what can safely happen next without reading implementation history.

## Sprint 10F: Closure And Optional RC2 Candidate

### Work

- run all repository-native validation;
- run cross-language conformance and contract snapshot checks;
- rerun clean-consumer and reference-system proofs;
- run the fresh privileged Linux/gVisor proof matrix;
- regenerate affected SBOMs, source archives, artifacts, diagrams, and
  manifests from clean commits;
- run a final recursive coherence and security review;
- publish a closure report separating:
  - repaired defects;
  - retained necessary complexity;
  - accepted limitations;
  - deferred advanced features;
  - exact evidence and residual risk.

### Release Posture

- RC1 remains unchanged.
- An aggregate `distributed-foundation-rc.2` candidate may bind unchanged RC1
  repository identities together with newer affected-repository commits.
- Unchanged repositories should not receive meaningless retags or source
  churn.
- Affected repositories receive new prerelease identities only when their
  public artifacts change.
- Package registries remain out of scope.
- No GitHub branch, tag, release, protection, or public asset mutation occurs
  without a separate explicit final publication decision.

## Impacted Repositories

- Workspace root: definitely, for public-lineage custody, plans, contracts,
  proof orchestration, security records, and release evidence.
- `cadenza-chamber`: definitely, because sender-side routing is post-RC.
- `cadenza-cell`: definitely, because routing proof and supply lifecycle
  hardening are post-RC.
- `cadenza-environment`: validation and review; source changes only if proof or
  security findings establish an Environment-owned defect.
- `cadenza`, `cadenza-python`, `cadenza-elixir`, and `cadenza-csharp`:
  validation and semantic-conformance review only unless an evidenced defect
  requires a focused amendment.

No legacy or demo repository is in implementation scope.

## Contract And Migration Posture

- No schema or shared-contract change is currently proposed.
- No backward-compatibility work is required for the new major direction.
- If review finds a required schema, shared-contract, public API, or external
  dependency change, stop and present a focused design amendment before
  implementation.
- Contract authority must be updated first and propagated to every affected
  consumer in the same approved task.

## Risks

### Private/Public Workspace Contamination

Risk: a normal merge or rebase makes private workspace history reachable from
the public repository.

Control: clean worktree from public authority, content classification, external
bundle custody, ancestry proof, allowlist validation, and no merge of the old
lineage.

### Concurrent Root Work Loss

Risk: communication-strategy or user-authored artifacts are overwritten during
root reconciliation.

Control: hash every path, identify thread ownership, preserve all uncertain
content, and move the primary worktree only after explicit classification.

### Hardening Scope Expansion

Risk: later security, plugin, observer, Memory, or operational-product features
enter under a hardening label.

Control: feature-free scope, explicit deferred list, sequential gates, and
focused amendments for boundary changes.

### Test Combinatorics

Risk: exhaustive scenario multiplication creates slow, brittle evidence that
agents and contributors avoid running.

Control: boundary-based failure classes, focused deterministic tests, one
definitive composed proof, and explicit proof tiers.

### Security Theater

Risk: repeating scans without challenging authority and custody creates
confidence without new evidence.

Control: threat scenarios, hostile inputs, fault injection, exact state
assertions, and severity-based closure.

### Operational Simplification By State Loss

Risk: reducing visible states makes the system easier to describe while hiding
uncertainty.

Control: simplify tooling and interpretation; retain every state distinction
needed for authority, custody, recovery, and evidence truth.

## Alternatives

1. Start generated expansion immediately. Rejected because the local workspace
   and post-RC source baselines are not yet consolidated.
2. Merge the old workspace branch into public main. Rejected because it would
   violate the intentional private-history boundary.
3. Publish Chamber and Cell fixes immediately as ad hoc patches. Rejected
   because the fixes should enter one reviewed post-RC baseline and proof
   manifest.
4. Retag every repository as RC2. Rejected because unchanged source should not
   receive ceremonial version churn.
5. Implement every accepted security limitation now. Rejected because several
   are deployment or later-feature boundaries, not defects in current claims.
6. Perform a broad cleanup refactor first. Rejected because cleanup without an
   evidenced purpose can damage the foundation it intends to improve.

## Validation

Planning checks:

```bash
./scripts/workspace-snapshot.sh
./scripts/check-agent-harness.sh
```

Each pass must record repository-native commands, exact commits, toolchains,
durations, ignored tests, platform requirements, and residual limitations.

## Exit Criteria

- the workspace root descends only from the curated public history;
- private workspace commits are not reachable from any public candidate;
- all approved local post-publication artifacts have explicit custody;
- Chamber and Cell post-RC changes are integrated into one candidate baseline;
- current plans, repo cards, contracts, and docs identify the same authority;
- every official repository passes native validation and cross-contract checks;
- privileged proofs start from isolated declared inputs and clean up exactly;
- the selected failure matrix passes or produces explicitly accepted findings;
- no unresolved critical/high security finding remains;
- operational states and recovery paths are interpretable without collapsing
  authority or custody distinctions;
- RC1 remains immutable;
- generated expansion has a clean, explicit entry baseline;
- any RC2 publication remains separately approved.
