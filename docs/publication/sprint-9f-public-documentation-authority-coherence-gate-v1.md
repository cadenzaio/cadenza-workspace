# Sprint 9F Public Documentation Authority Coherence Gate V1

Date: 2026-07-23
Status: affected-scope replacement freeze required

## Context

The final recursive Sprint 9F review followed the public agent entry path from
`AGENTS.md` and `docs/index.md` into `docs/cadenza-learning-path.md`. The
learning path still presents the legacy
`cadenza -> cadenza-service -> cadenza-db` metadata flow as required
knowledge, links to the absent legacy service repository, and asks agents to
route changes among core, service, DB, UI, and demo code.

This contradicts the approved official repository model. The public workspace
already states elsewhere that `cadenza-service`, `cadenza-db`,
`cadenza-engine`, old UI experiments, and demos are reference-only.

The same review found related live-document drift:

- `docs/cadenza-environment.md` calls `cadenza-environment` non-official,
  predicts future Chamber and Cell repositories that now exist, and later
  reuses the retired `engine` term;
- `docs/vision.md` describes engines, legacy service/DB repositories, and a
  future Environment repository as the current implementation bridge;
- the integrations routing card still sends distribution contract changes to
  `cadenza-service`;
- the harness quality score still describes `cadenza-engine` as a current
  placeholder risk.

The exact curated workspace archive passes the allowlist validator because
these are allowed files and contains no forbidden private material. The public
link checker does not inspect the learning path, Environment definition,
vision, quality score, or repo cards, so it did not see the missing legacy
link. Its reported passing scope is therefore true but too narrow for the
public navigation authority it is intended to protect.

This is a documentation and validation defect under the Sprint 9F failure
rule. It can misdirect a new human or agent into obsolete repositories and
fragment the intended whole even though runtime behavior is correct.

## Proposed Approach

Repair only the curated workspace documentation authority and its regression
proof:

1. Rewrite the learning path around the official language cores, Environment,
   Chamber, Cell, reference system, contract map, and architecture atlas.
2. Give the Environment definition an explicit current status, preserve
   genuinely prospective material as proposal material, and correct the
   implemented repository ownership and retired-engine terminology.
3. Update the vision's current implementation bridge to the official
   Environment/Chamber/Cell architecture while preserving the longer-term
   database-native direction.
4. Correct the integrations routing card and harness quality score so neither
   assigns current responsibility to a legacy repository.
5. Expand public documentation link validation to cover all primary
   authority documents named by the public entry path, including the learning
   path, intended whole, language doctrine/runtime contract, Environment,
   schema and flow references, vision, workspace map, official repo cards,
   security posture, and release guidance.
6. Add a bounded current-direction assertion so the primary learning and
   routing surfaces cannot again assign authority to legacy service, DB,
   engine, UI, CLI, or demo repositories.

Historical decisions, sprint records, and explicitly labeled legacy repo cards
remain valid provenance. They will not be rewritten to pretend the earlier
architecture never existed.

## Impacted Scope

- Authority repo: curated `cadenza-workspace`.
- Expected source changes: primary public documentation, the public
  documentation validator, and its release/publication evidence.
- Required replacement: curated workspace commit, source-tree digest, source
  archive, and aggregate manifest.
- Expected byte-identical scope: all eight implementation/reference
  repositories, all packages, all generated runtime artifacts, all seven
  SBOMs, all six contract bundles, and all executable behavior.
- Candidate metadata digest remains unchanged because repository membership,
  versions, protocols, registry posture, and toolchains do not change.

No external publication is authorized.

## Required Proof

- Root agent harness and workspace snapshot checks pass.
- A newly prepared public workspace contains only allowlisted material and no
  private path, secret, Memory, CLI, or legacy implementation payload.
- Every primary public authority document has complete local-link coverage.
- Current learning and routing surfaces contain no legacy authority assignment.
- Architecture atlas, catalog, contract snapshots, release-candidate metadata,
  required-checks data, and security/publication links pass unchanged.
- The workspace source archive and aggregate manifest reproduce byte for byte
  from two independent assemblies.
- All non-workspace repository and artifact records compare byte-identically
  with the approved TypeScript package declaration freeze.
- A fresh archive-only reader trial reaches the official repository model from
  `README.md`, `AGENTS.md`, `docs/index.md`, and the learning path without
  relying on local child repositories or private history.

## Risks

- Rewriting historical design material as if it were current could destroy
  useful provenance. Prospective and historical sections must be labeled
  rather than indiscriminately deleted.
- A phrase-only regression check could become brittle. Mechanical assertions
  must be limited to primary authority/routing surfaces and paired with a
  human coherence review.
- Updating only the broken learning-path link would leave deeper semantic
  contradictions in Environment and vision documentation.
- Expanding the link checker to every historical document would create false
  failures for intentionally preserved references. The checked authority set
  must distinguish current guidance from history.

## Alternatives

1. Remove the stale documents from the public allowlist. Rejected because the
   learning path, Environment model, and vision are necessary public
   explanatory surfaces; hiding them does not repair their meaning.
2. Fix only the missing legacy link. Rejected because the surrounding guidance
   still assigns authority to the legacy architecture.
3. Accept the drift as historical context. Rejected because these files are
   linked as current agent and architecture guidance, not merely archived
   records.
4. Rewrite every historical decision and sprint document. Rejected because it
   would erase temporal provenance and greatly broaden the affected scope.

## Approval Gate

Approval authorizes the root-only documentation-authority repair, validator
strengthening, affected workspace validation, deterministic replacement
assembly, and a new exact workspace-scope freeze request. It does not authorize
implementation-repository changes, runtime or contract changes, removal of
historical provenance, or publication.

Required approval phrase:

`Design approved. Proceed.`

The user approved this design on 2026-07-23.

## Repair Result

The approved root-only repair is complete:

- the learning path now teaches the intended whole, official repository
  ownership, controlled materialization boundary, evidence identities, and
  current application-author path;
- Environment documentation now distinguishes the implemented
  Environment/Cell/Chamber foundation from prospective tags, plugins, Facts,
  UI, Memory, agents, and database-native authoring;
- vision and routing guidance now use the official Environment, Cell, Chamber,
  language-core, and reference-system architecture;
- the deferred integrations card grants no current CLI, transport, or contract
  authority;
- the public README no longer links the excluded legacy release-sync guide;
- `release/public-documentation-authority.json` now declares the current public
  authority set and five bounded legacy-authority checks.

The expanded validator covers 61 current documentation files. Its first
archive-only run exposed the stale README release-sync link that the previous
24-file scope had missed. After that link was repaired, a newly assembled
archive-only workspace passes all current-document links and direction checks
using only the curated workspace and the eight unchanged source archives.

Validation passes:

- root agent harness and workspace snapshot;
- 343-file public allowlist and private-content projection;
- six contract snapshot bundles;
- 28-diagram architecture atlas and generated catalog;
- release-candidate metadata with the unchanged candidate digest;
- JavaScript syntax and repository formatting;
- archive-only public navigation from README, index, learning path, official
  repository cards, guides, contracts, security posture, and release guidance.

No implementation repository, package, generated runtime artifact, SBOM,
contract bundle, protocol, migration, toolchain, or executable behavior
changed. During assembly, exact manifest comparison rejected a stale local
staging directory whose Core package did not match the approved digest. The
replacement assembly uses only the staging set whose eight package artifacts
match the current frozen manifest.

## Replacement Boundary

The replacement changes only:

- the curated workspace commit and source-tree identity;
- `source/cadenza-workspace-2026.07-rc.1.tar.gz`;
- the aggregate manifest that records those identities.

The exact commit, tree, archive, and manifest digests are reported outside this
source commit in the affected-scope freeze request to avoid a self-referential
identity cycle. Two independent final assemblies must be byte-identical before
that request is valid.
