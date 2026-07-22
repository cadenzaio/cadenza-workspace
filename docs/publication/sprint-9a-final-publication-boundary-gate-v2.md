# Sprint 9A Final Publication Boundary Gate V2

Date: 2026-07-21

## Status

- State: `closed`.
- Environment-authority extraction: closed and approved.
- Adapter ownership and performance amendment: closed and approved.
- External repository mutation: none performed.
- Required approval phrase:
  `Sprint 9A publication boundary approved. Proceed.`
- Approved by the user on 2026-07-21 with the required phrase.
- Decision record:
  [Distributed Foundation Publication Boundary](../decisions/2026-07-21-distributed-foundation-publication-boundary.md).

## Purpose

This gate replaces the pre-amendment repository recommendation in the Sprint
9A truth baseline. It decides what will eventually be public and how it will be
presented; it does not publish, archive, license, push, or release anything.

Sprint 9B may begin after this gate. Actual GitHub publication still requires
the separate final approval defined by Sprint 9F.

## Current Truth

- The official implementation now has seven repositories: four language cores,
  Environment, Chamber, and Cell.
- Durable authority no longer lives in any core repository.
- The TypeScript adapter is Chamber-owned and does not create another repo.
- The retired default performance tests have been replaced by deterministic
  lifecycle tests and explicit isolated benchmarks.
- `cadenzaio/cadenza` is public.
- `cadenzaio/cadenza-workspace` exists but is private.
- the other six implementation repositories have no GitHub remotes.
- `cadenzaio/cadenza-service`, `cadenza-db`, `cadenza-ui`, `cadenza-console`,
  and `cadenza-demo-2` are public, unarchived, and describe legacy directions.
- the reference system does not exist yet; Sprint 9C will create it as a clean
  consumer and whole-system proof.

## Decision 1: Public Repository Set

Use the `cadenzaio` GitHub organization and prepare these nine public
repositories:

| Repository | Public purpose | Initial publication state |
| --- | --- | --- |
| `cadenza` | TypeScript primitive and local-execution authority | preserve existing public history; establish v4 release-candidate boundary |
| `cadenza-python` | idiomatic Python core | clean initial history |
| `cadenza-elixir` | idiomatic Elixir/BEAM core | clean initial history |
| `cadenza-csharp` | idiomatic C# core | clean initial history |
| `cadenza-environment` | durable environment authority, bootstrap, reconciliation, supply, ledger processing, actor authority, and PostgreSQL adapters | clean initial history |
| `cadenza-chamber` | Rust Chamber runtime and Chamber-owned language adapters | clean initial history |
| `cadenza-cell` | Rust trusted local host, containment, process custody, transport, and local orchestration | clean initial history |
| `cadenza-workspace` | curated architecture, cross-repo governance, neutral contract map, decisions, diagrams, release manifests, and system validation | curate private working history into a clean public history |
| `cadenza-reference-system` | realistic outside-in business system, clean consumer, agent-authoring trial, and whole-system proof | create in Sprint 9C with clean initial history |

All nine become public only after the release-candidate and final publication
gates. `cadenza-reference-system` owns no framework contract.

Excluded from this publication set:

- `cadenza-integrations`, CLI, MCP, host-agent adapters, and managed-product
  integration code.
- Memory/Weave and its private development corpus.
- managed cloud, multi-environment UI, and final agent experience.
- the post-publication read-only observer UI, which receives its own design and
  boundary later.

## Decision 2: Legacy Public Repositories

Before archival, update each public legacy repository description and README
opening with an exact notice that:

- it is a legacy pre-v4 Cadenza implementation.
- it does not define the current architecture or contracts.
- no compatibility with the new major direction is promised.
- current architecture and release links live in the curated public workspace.

After verifying those notices, archive:

- `cadenza-service`.
- `cadenza-db`.
- `cadenza-ui`.
- `cadenza-console`.
- `cadenza-demo-2`.

Private legacy/demo repositories remain private. Archival and description
changes occur only during the separately approved publication operation, not
during Sprint 9A or ordinary cleanup.

## Decision 3: License And Contributions

- Apply Apache License 2.0 consistently to published code, contracts,
  documentation, diagrams, generated source where applicable, and the
  reference system.
- Use Developer Certificate of Origin 1.1 sign-off for contributions.
- Do not introduce a bespoke contributor license agreement for the initial
  release.
- Add per-repository copyright/license files and source headers only where
  legally or toolchain-required; avoid noisy blanket headers without need.

Approval adopts this as the working publication posture. It is not legal
advice. A material change recommended by legal review requires an explicit
amendment before publication.

## Decision 4: Git History

- Preserve `cadenza` public history. Introduce the new direction through clear
  v4 release notes, tags, migration posture, and branch history.
- Create clean first commits for Python, Elixir, C#, Environment, Chamber,
  Cell, and the reference system after stabilization.
- Curate `cadenza-workspace` into a clean public history containing only
  publishable architecture, governance, contracts, current decisions,
  diagrams, manifests, and validation automation.
- Preserve excluded workspace history and private artifacts in a private/local
  archive that is never pushed as a public branch, tag, release asset, or git
  object.
- Keep every repository commit independent. Cross-repo compatibility is bound
  by a release manifest, never by a multi-repo commit fiction.

## Decision 5: Release Identity

- Name the first public distributed foundation a release candidate, not a
  stable production promise.
- Target `@cadenza.io/core` version `4.0.0-rc.1`.
- Let new language and runtime repositories use honest independent prerelease
  versions, initially expected to be `0.1.0-rc.1` unless packaging review finds
  an existing versioning constraint.
- Bind exact repository commits, package/crate versions, protocol versions,
  schema/migration range, toolchains, generated artifact digests, and contract
  fixture digests in one distributed-foundation manifest.
- Publish limitations and deployment assumptions with the release candidate.

Independent versions are deliberate. Matching numbers must not imply
compatibility; the manifest is the compatibility authority.

## Decision 6: Publication Channels

Sprint 9 prepares, builds, packages, audits, and clean-consumer-tests npm,
Python, Hex, NuGet, and Rust artifacts. The first publication approval covers:

- public GitHub source repositories.
- signed/tagged GitHub prereleases and release assets.
- the exact distributed-foundation manifest.

It does not automatically publish package registries. Registry publication
requires a later explicit gate after clean public clones reproduce the release.
The existing npm `latest` remains legacy `3.28.1`; any approved v4 prerelease
uses a non-`latest` tag such as `next`.

## Decision 7: Repository Governance And Support

For each public repository:

- use `main` as the default protected branch.
- prohibit force pushes and branch deletion.
- require pull requests and applicable required CI checks after initial
  repository bootstrap.
- enforce DCO sign-off.
- add scoped `CODEOWNERS`, issue and pull-request templates, a code of conduct,
  contribution guidance, security policy, support policy, and release policy.
- state that the release candidate has no support SLA.
- use GitHub issues/discussions for public support and GitHub private
  vulnerability reporting/security advisories for confidential reports.
- publish known limitations instead of implying production maturity.

Initial repository creation may require an explicitly recorded bootstrap push
before branch protection can exist. That exception ends immediately after the
default branch and required checks are established.

## Consequences

- The public system has more repositories, but every boundary corresponds to a
  distinct semantic, authority, security, runtime, or proof responsibility.
- The architecture repository becomes a maintained public product surface, not
  a dump of the current private workspace.
- A realistic reference system is release evidence, not a revived legacy demo.
- Legacy repositories stop competing with the official direction.
- Registry users receive no premature compatibility promise.
- Publication work remains reversible until the final explicit push/archive
  approval.

## Sprint 9B Entry Conditions

After approval, Sprint 9B may:

1. establish artifact exclusions and safe local stabilization branches.
2. repair fixture authority and standalone/release-workspace validation.
3. close C# core parity gaps.
4. perform recursive purpose, dead-code, API, contract, dependency, and
   coherence review across the seven implementation repositories and curated
   workspace surface.
5. prepare governance and packaging files consistent with this gate.

Sprint 9B may not publish, push new remotes, archive legacy repositories,
publish packages, or claim release-candidate readiness.

## Approval Gate

Approval accepts all seven decisions together:

1. nine named public repositories under `cadenzaio`.
2. exact legacy notices followed by later archival of five public repositories.
3. Apache-2.0 and DCO 1.1 working posture.
4. preserved core history, clean new histories, and curated workspace history.
5. release-candidate identity with manifest-bound independent versions.
6. GitHub-first publication with package registries separately gated.
7. protected-main, PR/CI, no-SLA, public-support, and private-security posture.

Required approval phrase:

`Sprint 9A publication boundary approved. Proceed.`

## Evidence

- [Truth Baseline V1](sprint-9a-truth-baseline-and-boundary-gate-v1.md)
- [Environment Authority Amendment](sprint-9a-environment-authority-boundary-amendment-v1.md)
- [Environment Extraction Closure](sprint-9a-environment-authority-extraction-closure-v1.md)
- [Adapter And Performance Amendment](sprint-9a-adapter-ownership-performance-harness-amendment-v1.md)
- [Adapter And Performance Closure](sprint-9a-adapter-performance-closure-v1.md)
- [Core Performance Baseline](sprint-9a-core-performance-baseline-v1.md)
- [Contract Authority Map](../../contracts.config.json)
- GitHub organization inventory queried on 2026-07-21.
