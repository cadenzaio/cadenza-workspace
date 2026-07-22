# Sprint 9A Truth Baseline And Publication-Boundary Gate V1

Date: 2026-07-21

## Status

- Sprint state: `superseded_by_final_gate_v2`.
- Scope: the six official implementation repositories, the workspace
  architecture/contract authority, candidate support repositories, existing
  public GitHub surfaces, package metadata, artifact classes, and executable
  validation baseline.
- Product repair: not started. Sprint 9A records truth before Sprint 9B changes
  code or contracts.
- Decision required: review the corrected
  [Final Publication Boundary Gate V2](sprint-9a-final-publication-boundary-gate-v2.md).
- Historical note: this document preserves the pre-repair truth baseline. Its
  environment ownership, repository count, and performance-failure findings
  were superseded by the approved Environment and adapter/performance
  amendments; they must not be read as current implementation state.

## Intended Whole

The public foundation must let application authors and future agents focus on
business logic and workflow shape while still being able to understand,
reproduce, audit, and repair the operational system beneath it. Publication
must not depend on this machine's directory layout, unpublished oral context,
legacy repository claims, or mutable working trees.

## Executive Conclusion

The distributed implementation is behaviorally strong but not yet a bounded
public release.

- 724 correctness tests pass across the official implementation set.
- TypeScript core typecheck and build pass; Python, Elixir, C#, Chamber, Cell,
  environment authority, and authority gateway baselines pass.
- the default TypeScript test command fails all four performance tests and
  reports 12,015 unhandled evidence-reporter errors. This is more than ordinary
  machine timing variance and requires test-isolation/evidence-lifecycle
  repair.
- five official repositories have no commits or remotes. The complete new
  foundation in `cadenza` is also uncommitted across 86 dirty paths.
- independent repository validation is not currently independent: tests and
  build metadata consume sibling repositories and private workspace fixtures.
- licensing is inconsistent and incomplete.
- public documentation does not yet explain the distributed whole visually.
- existing public legacy repositories still describe themselves as current
  Cadenza surfaces.

Sprint 9 should continue. Nothing in this baseline suggests abandoning the
architecture, but publication before repair would export avoidable ambiguity
and operational risk.

## Repository Truth

| Repository | Purpose | Git/Public State | Bounded Source Shape | Publication Conclusion |
| --- | --- | --- | --- | --- |
| `cadenza-workspace` | Cross-repo governance, architecture, neutral contracts, decisions, release coordination | Private GitHub repo; 3 historical commits; 228 untracked paths | Authoritative July foundation is mixed with 126 older completed plans, deferred Memory material, benchmarks, local scripts, and legacy routing | Curate and publish as the architecture/contract home; do not expose unchanged |
| `cadenza` | TypeScript primitive authority plus isolated environment-bootstrap and authority-gateway packages | Existing public GitHub repo; 360 commits; public npm `3.28.1`; 86 dirty paths | About 200 bounded non-generated files across core, 15 migrations, gateway, neutral contracts, tests, and docs | Preserve public history, establish an explicit v4 boundary, and replace unsafe release automation before merge |
| `cadenza-python` | Idiomatic Python core | No commits or remote; 8 untracked top-level paths | 62 bounded files; standard-library runtime; 100 passing tests | Create a clean initial history after parity and packaging repair |
| `cadenza-elixir` | Idiomatic Elixir/BEAM core | No commits or remote; 10 untracked top-level paths | 46 bounded files; 85 passing tests | Create a clean initial history after fixture independence and packaging repair |
| `cadenza-csharp` | Idiomatic C# core | No commits or remote; 8 untracked top-level paths | 27 bounded files; 56 passing tests | Create a clean initial history after semantic-parity and packaging repair |
| `cadenza-chamber` | Rust Chamber runtime and TypeScript adapter | No commits or remote; 14 untracked top-level paths | 77 bounded files; 86 passing tests | Create a clean initial history after standalone/integration separation and release packaging |
| `cadenza-cell` | Rust trusted Cell host, containment, distribution, supply, evidence, and actors | No commits or remote; 13 untracked top-level paths | 90 bounded files; 112 passing tests and 1 ignored local integration case | Create a clean initial history after dependency and clean-checkout repair |

`cadenza-integrations` is not an official candidate. It is not an independent
repository and implements the removed legacy CLI/runtime-stdio, MCP, Codex, and
Claude adapter direction. Prior user decisions defer CLI and agent integration.
It should be classified as private legacy/exploratory material and removed from
the official repo-card list.

## Artifact Classification

### Retain As Foundation Authority Or Implementation

- workspace intended-whole, architecture, language doctrine/runtime contract,
  authority map, current contracts, current decisions, official repo cards,
  Sprint 0 through Sprint 9 foundation plans, and bounded validation scripts.
- TypeScript primitive source, tests, public contracts, environment-bootstrap
  source/migrations/tests, authority-gateway source/artifact builder/tests, and
  deterministic generated contract artifacts.
- Python, Elixir, and C# core source, language-local tests, and synchronized
  neutral conformance fixtures.
- Chamber source, runtime contract, TypeScript adapter source, deterministic
  adapter manifest/build inputs, hostile tests, and runtime documentation.
- Cell source, runtime contract, deployment unit examples, deterministic
  scripts, hostile tests, and operational documentation.

### Retain Privately Or Defer

- Memory and Weave documents, harnesses, benchmarks, generated projections,
  and scripts.
- CLI, host-agent adapters, MCP integrations, and current
  `cadenza-integrations` material.
- managed-product UI, agent, cloud, and multi-environment material.
- legacy execution plans and decisions that do not govern the new major
  version, except where a current decision cites them as historical evidence.

### Remove Or Exclude From Release Inputs

- `.DS_Store`, `__pycache__`, build directories, `node_modules`, `target`,
  `_build`, `deps`, `bin`, `obj`, local tarballs, and stale generated outputs.
- the TypeScript `heap-snapshots/` directory. It currently contains many
  unignored snapshots, including individual files between hundreds of
  megabytes and 1.5 GB.
- absolute `<absolute-user-path>` links and commands in public docs.
- stale links to completed plans under `active/`.
- sprint-chronology README content that does not help a public reader understand
  current purpose, boundaries, usage, validation, or limitations.

Diagnostic snapshots may be produced only by an explicit bounded diagnostic
command into an ignored external or temporary location. They are not source or
release artifacts.

## Contract And Checkout Findings

### Authority Map Strength

`contracts.config.json` clearly separates:

- TypeScript core, execution-evidence, authority/security, environment, and
  distribution authority in `cadenza`.
- Chamber runtime authority in `cadenza-chamber`.
- Cell runtime authority in `cadenza-cell`.
- Python, Elixir, and C# as primitive-contract consumers.

The execution-evidence fixture digest is identical in all four core languages.
The reconciliation stem fixture digest is identical in `cadenza`, Chamber, and
Cell. These are positive cross-language and cross-runtime evidence.

### Shared Fixture Fragmentation

The broader core conformance suite is not yet authority-clean:

- neutral primitive fixtures currently live under `cadenza-python` rather than
  the TypeScript authority or a governed release bundle.
- Elixir tests read those fixtures directly from the sibling Python checkout.
- C# copied only `core_identity` and a shortened `runtime_execution` fixture.
- the C# runtime fixture omits retry, ephemeral, throttle, and debounce cases;
  corresponding public implementation surfaces are absent.
- Elixir has broad shared-fixture behavior but does not carry the fixtures
  needed for a standalone checkout.

Sprint 9B must establish one neutral fixture authority, make every core test
standalone against a versioned local snapshot, and verify synchronization by
digest. The C# semantic gap is a must-fix contract-parity finding, not an
accepted language idiom.

### Workspace Coupling

Current paths make the complete repository set function as an implicit
monorepo without declaring one:

- TypeScript and environment-bootstrap tests read neutral fixtures from
  `../docs` outside `cadenza`.
- Elixir reads Python fixtures from `../cadenza-python`.
- Chamber adapter tests load `../cadenza/dist/index.mjs`.
- Cell uses a path-only Chamber dependency and tests compile in the sibling
  authority-gateway artifact.
- Cell integration fixtures import the sibling environment-bootstrap build and
  its installed `pg` dependency.
- Chamber and Cell tests read workspace-level fixtures by relative path.

The repair should preserve two honest test layers:

1. **Standalone repository validation:** build, package, unit, hostile, and
   contract-snapshot tests pass from one clean checkout without siblings.
2. **Release-workspace validation:** an explicit manifest checks out exact
   sibling commits and runs cross-repository and whole-system scenarios.

Hidden sibling assumptions must not remain inside commands described as
repo-local.

## Executable Baseline

Environment: macOS, Node `24.14.1`, repo-local Yarn `1.22.22`, Python `3.10.8`,
Elixir `1.17.3` on OTP 27, .NET SDK `10.0.301`, repo-pinned Rust/Cargo `1.97.0`,
PostgreSQL `14.15`, Docker `29.4.0`. `runsc` is not installed on the macOS host;
Linux/gVisor evidence remains a separate definitive environment.

| Surface | Result | Evidence |
| --- | --- | --- |
| Workspace harness | Pass | `./scripts/check-agent-harness.sh` |
| TypeScript typecheck | Pass | `yarn tsc --noEmit` |
| TypeScript build | Pass | `yarn build` |
| TypeScript correctness | Pass | 18 files, 152 tests |
| TypeScript performance harness | Fail | 4/4 tests fail; 12,015 unhandled reporter errors; snapshots generated |
| Environment bootstrap | Pass | typecheck, build, 19 files and 107 tests including PostgreSQL |
| Authority gateway | Pass | typecheck, deterministic artifact verification, build, 26 tests |
| Python | Pass | compileall and 100 tests |
| Elixir | Pass | format and 85 tests |
| C# | Pass | format, zero-warning build, and 56 tests |
| Chamber | Pass | format, Clippy with warnings denied, and 86 tests |
| Cell | Pass with explicit local limitation | format, Clippy with warnings denied, 112 tests pass, 1 PostgreSQL/Node test ignored, Linux-only cases not run on macOS |

The TypeScript performance failures include expected machine-sensitive CPU and
heap thresholds, but also evidence reporter sequence drift, capacity
exhaustion, and asynchronous errors continuing across test boundaries. Sprint
9B must repair correctness/isolation before Sprint 9C records a performance
baseline after restart.

## Publication Blockers

### P0: Unsafe Existing Core Release Path

`cadenzaio/cadenza` is already public. Its unprotected `main` branch runs a
release workflow on every main push and can publish to npm through
semantic-release. That workflow builds but does not run the current test,
typecheck, contract, security, or package smoke gates. No Sprint 9 work may be
pushed to main until release automation is made release-candidate aware and
branch protection is active.

### P0: No Coherent License Grant

There are no top-level license files. Metadata currently claims ISC for core,
MIT for Rust, and `UNLICENSED` for Python; Elixir and C# metadata is incomplete.
Public source without an explicit consistent grant cannot meet the publication
whole.

### P0: Current Foundation Is Not Commit-Addressable

The new TypeScript foundation and five new repositories exist only in dirty or
untracked working trees. Exact release candidates, rollback, provenance, and
clean-room reproduction are impossible until reviewed histories exist.

### P1: Standalone Validation Is False

Sibling paths and workspace fixture access make several repo-local tests fail
from isolated clones. This must be repaired before public commands are claimed
as reproducible.

### P1: TypeScript Default Test Isolation Is Broken

Heavy diagnostics run by default, generate multi-gigabyte files, cross test
boundaries, exhaust evidence custody, and produce millions of lines of output.
Correctness, deterministic performance measurement, and explicit heap
diagnostics need separate bounded commands.

### P1: Polyglot Conformance Is Incomplete

C# lacks approved specialized task behavior and consumes only a subset of the
neutral fixture surface. Fixture authority and standalone snapshots also drift
across languages.

### P1: Public Interpretation Is Insufficient

Only one general Mermaid diagram exists across the candidate public
documentation. Cell and Chamber READMEs primarily narrate sprint history.
Public readers cannot yet traverse from intended whole to code, trust,
execution, distribution, evidence, scale, actor, and failure behavior.

### P1: Legacy Public Repositories Misstate Direction

The GitHub organization publicly exposes `cadenza-service`, `cadenza-db`,
`cadenza-ui`, `cadenza-console`, and `cadenza-demo-2` without archival status;
some descriptions still claim official roles. They can divert users back into
the rejected architecture.

### P2: Packaging And Governance Are Incomplete

- new repositories lack CI, contribution, security, support, and ownership
  files.
- Python, Elixir, C#, and Rust package metadata is incomplete for public dry
  runs.
- Cell's path-only Chamber dependency is not independently consumable.
- supported toolchain/version matrices are undocumented.
- absolute local paths and stale plan links remain.
- `.DS_Store` and other local artifacts are unignored in several repos.

## Historical Pre-Amendment Publication Recommendation

This original recommendation has been amended in review. The proposed
replacement adds `cadenza-environment` and makes all core repositories
authority- and persistence-agnostic. See the
[Environment Authority Boundary Amendment](sprint-9a-environment-authority-boundary-amendment-v1.md).

### 1. Public Repository Set

Publish and maintain:

1. `cadenza` - TypeScript core and environment authority.
2. `cadenza-python` - Python core.
3. `cadenza-elixir` - Elixir core.
4. `cadenza-csharp` - C# core.
5. `cadenza-chamber` - Chamber runtime.
6. `cadenza-cell` - Cell runtime.
7. `cadenza-workspace` - curated public architecture, neutral contracts,
   decisions, diagrams, release manifest, and cross-repo validation authority.
8. `cadenza-reference-system` - public outside-in business system, clean
   consumer, agent-authoring trial, and whole-system proof; it owns no Cadenza
   contract.

Keep `cadenza-integrations`, Memory/Weave, managed-product code, current UI,
CLI, agent adapters, and cloud/multi-environment work private or deferred.

### 2. Existing Legacy GitHub Repositories

Before archival, replace their descriptions and README opening with an exact
legacy notice pointing to the current architecture. Then archive
`cadenza-service`, `cadenza-db`, `cadenza-ui`, `cadenza-console`, and
`cadenza-demo-2`. GitHub documents that archival makes a repository read-only
and recommends updating description and README first:
[GitHub repository archival guidance](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories).

Private legacy/demo repositories may remain private and unchanged unless a
later inventory finds disclosure or credential risk.

### 3. License And Contribution Posture

Use Apache License 2.0 consistently for published code, contracts,
documentation, diagrams, and reference-system material, subject to the user's
final legal choice. Apache-2.0 is OSI-approved and the Apache guidance describes
its copyright and patent terms and application to source, documentation, and
binary distributions:
[OSI license list](https://opensource.org/licenses),
[Apache application guidance](https://www.apache.org/legal/apply-license).

Begin with the Developer Certificate of Origin 1.1 and signed-off commits
rather than a bespoke contributor license agreement. The DCO records a
contributor's certification that they have the right to submit the work:
[Developer Certificate of Origin](https://developercertificate.org/).

This is a practical project recommendation, not legal advice. The final license
choice should receive appropriate legal review before publication.

### 4. History Strategy

- preserve the already-public `cadenza` history and establish the new direction
  through an explicit v4 boundary, release notes, and tags. Rewriting public
  history would not erase already distributed legacy commits.
- create clean first histories for Python, Elixir, C#, Chamber, Cell, and the
  reference system after review.
- curate a clean public `cadenza-workspace` history. Preserve the current
  private history and excluded material in a private/local archive that is not
  pushed as a branch when the repository becomes public.
- never combine commits across independent repositories; bind them through the
  release manifest.

### 5. Release Maturity And Versioning

- publish the first distributed foundation as a GitHub prerelease, not a stable
  compatibility promise.
- use `4.0.0-rc.1` for `@cadenza.io/core` because this is explicitly a new
  incompatible major direction.
- let new language/runtime repositories begin at their honest prerelease
  versions, such as `0.1.0-rc.1`; do not manufacture lockstep semantic versions.
- bind exact compatibility through one named distributed-foundation release
  manifest containing repository commits, package versions, protocol versions,
  database migration range, toolchains, and artifact digests.

### 6. Package Registries

Sprint 9 should build, dry-run, and clean-consumer-test npm, Python, Hex, NuGet,
and Rust artifacts, but should publish only GitHub source and prerelease assets
at the first external gate. Registry publication receives a later explicit
approval after the public clean-clone proof. The existing npm `latest` remains
the legacy `3.28.1` release until that decision; any v4 prerelease would use a
non-`latest` tag such as `next`.

### 7. Public Governance And Support

- protect `main`; require pull requests and the scoped validation matrix.
- use `CODEOWNERS`, DCO sign-off, issue/PR templates, and a code of conduct.
- state clearly that the prerelease has no support SLA.
- use GitHub issues/discussions for public support and private vulnerability
  reporting/security advisories for confidential reports.
- publish known limitations and supported deployment assumptions rather than
  implying production maturity from architectural breadth.

## Superseded Decision Gate

This original gate is retained as decision history and must not be approved.
The current request is the
[Final Publication Boundary Gate V2](sprint-9a-final-publication-boundary-gate-v2.md).
The superseded recommendation was:

1. eight public repositories: six implementation repos, curated workspace, and
   reference system.
2. explicit legacy notices followed by archival of misleading public legacy
   repositories.
3. Apache-2.0 plus DCO as the working legal/contribution posture.
4. preserved public core history, clean new-repo histories, and curated public
   workspace history with private archive preservation.
5. distributed-foundation release candidate with core `4.0.0-rc.1` and
   manifest-bound independent repo versions.
6. GitHub source/prerelease publication in Sprint 9; package registries only
   after a separate approval.
7. protected-main, PR/CI, no-SLA, public support, and private vulnerability
   reporting posture.

No Sprint 9B repair or external GitHub mutation begins until this gate and the
environment-authority amendment are resolved. Local documentation of the
baseline does not alter public state.

## Superseded Repair Order

Before the two amendments, the proposed Sprint 9B repair order was:

1. make accidental core publication impossible while stabilization branches
   are prepared.
2. establish governed clean histories and exact artifact exclusion.
3. repair TypeScript correctness/performance-test isolation.
4. repair shared fixture authority and C# parity.
5. separate standalone repo validation from release-workspace integration.
6. complete the recursive purpose, dead-code, API, contract, and coherence
   review before security/reproducibility work advances.

## Evidence

- [Sprint 9 Design](../agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md)
- [Sprint 9 Decision](../decisions/2026-07-21-distributed-foundation-stabilization-and-publication.md)
- [Contract Authority Map](../../contracts.config.json)
- [Workspace Architecture](../architecture.md)
- [Cadenza Intended Whole](../cadenza-intended-whole.md)
- Local validation and inventory commands executed on 2026-07-21.
- GitHub organization/repository state read through authenticated `gh` on
  2026-07-21; no remote mutation performed.
