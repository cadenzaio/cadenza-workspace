# Sprint 9F SBOM Source Hash Consistency Gate V1

Date: 2026-07-22
Status: affected-scope replacement freeze approved

## Context

The clean-room reproducibility pass regenerated all seven CycloneDX SBOMs from
the approved source archives with pinned Syft `1.49.0`. Every regenerated SBOM
differs from its frozen public-index copy.

The result is narrow and deterministic. Each SBOM has exactly two stale scalar
values: the SHA-1 and SHA-256 content hashes for
`/.github/workflows/ci.yml`. Package inventories, dependency edges, lockfile
hashes, metadata, and all other file records are identical. Two independent
regenerations produced byte-identical outputs.

The source archives contain the final release-candidate workflow files, while
the frozen SBOMs were generated from their earlier contents. The frozen SBOMs
therefore do not accurately describe the approved sources.

## Decision Proposal

Regenerate and replace the seven SBOMs from the exact approved source archives:

- `cadenza`
- `cadenza-python`
- `cadenza-elixir`
- `cadenza-csharp`
- `cadenza-environment`
- `cadenza-chamber`
- `cadenza-cell`

Keep workflow files in the SBOM file inventory. Their hashes are useful source
provenance and should describe the released bytes rather than be removed to
make the old output pass.

## Impacted Scope

- Source repair: none in the nine implementation/reference repositories.
- Public-index repair: seven generated files under `docs/security/sbom/`.
- Required revalidation: pinned SBOM regeneration twice, semantic delta audit,
  public allowlist/link/atlas/harness checks, archive inspection, and complete
  artifact and manifest validation.
- Required replacement: curated workspace commit and workspace source archive.
- Required aggregate replacement: workspace repository record and distributed
  manifest digest.
- Expected unchanged inputs: candidate metadata, all nine
  implementation/reference commits, their source trees and source archives,
  every package artifact, every generated runtime artifact, contracts,
  diagrams, protocols, migrations, and toolchains.

No clean-room file will be patched and no external publication is authorized.

## Alternatives

1. Accept the stale hashes as a documentation limitation. Rejected because an
   SBOM that claims the wrong hash for released source is not authoritative
   evidence.
2. Remove GitHub workflow file records from SBOM generation. Rejected because
   it hides executable supply-chain configuration and changes the published
   inventory contract to preserve an invalid freeze.
3. Replace all repository source archives. Rejected because their bytes are
   correct; only the workspace-owned generated SBOM projection is stale.

## Approval Gate

Approval authorizes the narrow workspace-publication repair, deterministic
SBOM regeneration, public-index validation, replacement artifact assembly, and
a new affected-scope freeze request. It does not authorize publication or any
implementation/reference repository change.

The user approved the design on 2026-07-22.

## Repair Result

- Pinned Syft `1.49.0` generated all seven SBOMs twice from the exact approved
  source archives; both passes were byte-identical.
- Each repaired SBOM differs from the previous projection only at the SHA-1
  and SHA-256 values for `/.github/workflows/ci.yml`.
- All seven workflow records now match their archived source bytes.
- The curated public workspace remains 330 files and differs from the approved
  workspace archive only at the seven SBOM paths.
- Public allowlist, link, contract-snapshot, architecture-atlas, catalog,
  release-metadata, and agent-harness validation pass.
- All nine source trees and all 20 artifact hashes and sizes match the
  replacement manifest.
- Independent complete artifact assembly and manifest generation are
  byte-identical.

A redundant workspace-local Syft invocation was interrupted when Docker
Desktop became unavailable. It terminated before replacing any files. The
repair uses the two already completed pinned clean-room generations, and the
installed bytes compare exactly with both retained outputs.

## Replacement Identity

- Candidate metadata remains:
  `sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`.
- Curated workspace commit:
  `d6a3b981eaec30860b23dd561854fa69c4b129b5`.
- Curated workspace source-tree digest:
  `sha256:fee6ddf87e380bf07b7ee2bc620305b3d2dd44591d4178217370e68adee2ea10`.
- Curated workspace source archive:
  `sha256:a6a458d04633032ae5c231208619fc4d23625e493cc12c13b352b460f39bf310`.
- Replacement manifest:
  `sha256:a2e756ed1cbb5286c9d7f69e0edf28ca1e03a7f61b9955ba9321f29378de49c2`.
- Manifest input:
  `/tmp/cadenza-distributed-foundation-rc1-sbom-refreeze-manifest.json`.
- Artifact input: `/tmp/cadenza-release-artifacts-rc1-sbom-refreeze`.

Compared with the approved Chamber replacement manifest, exactly four scalar
values change: workspace commit, workspace source-tree digest, workspace source
archive byte size, and workspace source archive digest. The other eight
repository records and 19 artifact records are unchanged.

## Refreeze Gate

Explicit approval replaces only the curated workspace commit, workspace source
archive, workspace repository record, and distributed manifest. It
reauthorizes Sprint 9F against the paths above. It does not authorize external
publication.

The user approved the affected-scope replacement freeze on 2026-07-22. The
replacement identity in this document is now authoritative for Sprint 9F.
