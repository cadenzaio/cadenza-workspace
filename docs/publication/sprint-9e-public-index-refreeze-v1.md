# Sprint 9E Public Index Refreeze V1

Date: 2026-07-22
Status: approved

## Finding

The first archive-only Sprint 9F documentation check rejected the frozen
workspace because `docs/index.md` linked to files intentionally excluded from
the curated public repository. The invalid links covered two distinct cases:

- Python, Elixir, and C# translation-readiness/closure documents were valid
  official history accidentally omitted from the allowlist.
- Memory, legacy product/release-sync, and private active-inventory material
  was correctly excluded but incorrectly retained in public navigation.

No implementation repository, package, contract, generated runtime artifact,
protocol, migration, or toolchain failed or changed.

## Repair

- Added four official translation documents to the public allowlist.
- Removed public-index links to Memory, legacy product/release-sync, and the
  private inventory.
- Regenerated the curated workspace from source rather than patching the clean
  room.
- Re-ran public link, allowlist, private-path, contract, diagram, governance,
  artifact, manifest-schema, and double-assembly checks.

## Unchanged Freeze Inputs

The eight implementation/reference commits and all eight package artifact
digests from the original Sprint 9E closure remain unchanged. The candidate
metadata digest remains
`sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`.

## Self-Reference Boundary

The replacement curated-workspace commit and external manifest digest are
reported in the approval request and, after approval, in the private approval
record. They cannot be embedded in this document before its own workspace
commit is created.

## Approval Gate

Approval replaces only the prior curated-workspace commit and distributed
manifest. It reauthorizes Sprint 9F against the repaired exact candidate. It
does not authorize publication.

The user approved the public-index replacement freeze on 2026-07-22. The
replacement curated-workspace commit is
`fa1a018d3a2cd6c77fa0ef826f0c58aed6da0b32`; the replacement external
manifest digest is
`sha256:75650cba76ed56b6d31fc169f59399a040769f72fa4406d37db917e25290c64f`.
Sprint 9F must use only `/tmp/cadenza-release-artifacts-rc1-refreeze` and
`/tmp/cadenza-distributed-foundation-rc1-refreeze-manifest.json` as its frozen
release inputs.
