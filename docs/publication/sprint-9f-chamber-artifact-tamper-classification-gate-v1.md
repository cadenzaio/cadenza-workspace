# Sprint 9F Chamber Artifact Tamper Classification Gate V1

Date: 2026-07-22
Status: affected-scope replacement freeze approved

## Context

The approved replacement candidate reached the Chamber validation pass in a
fresh Linux clean room built from the frozen source archives. The hostile
adapter-supervision test
`rejects_replaced_manifest_and_runtime_files_before_process_start` failed both
in the complete suite and in an isolated single-test rerun.

The test replaces a declared adapter runtime file with different bytes. The
replacement also changes the byte length. Chamber currently checks the
manifest size before checking the digest, so it returns
`AdapterProtocolInvalid`; the security contract and test expect
`ArtifactDigestMismatch` for replacement of a declared artifact file.

## Decision Proposal

Separate artifact-shape validation from signed-content validation:

- Keep `AdapterProtocolInvalid` for an unavailable path, non-regular file,
  symlink, invalid manifest shape, undeclared file, or entrypoint redirection.
- Return `ArtifactDigestMismatch` when a declared regular file differs from its
  manifest in byte size or SHA-256 digest.
- Add or refine hostile tests so same-size and different-size replacement both
  prove the same tamper classification.

This keeps error meaning stable regardless of whether hostile replacement
happens to preserve the original byte length.

## Impacted Scope

- Source repair: `cadenza-chamber` only.
- Required revalidation: complete Chamber Rust and TypeScript-adapter gates,
  then complete Cell validation because Cell depends on Chamber behavior.
- Required artifact replacement: Chamber source archive and Chamber crate.
- Required manifest replacement: Chamber commit, source-tree digest, two
  Chamber artifact records, and aggregate manifest digest.
- Expected unchanged inputs: curated workspace commit, the other seven
  implementation/reference commits, TypeScript adapter artifact, contracts,
  generated runtime artifacts, other package artifacts, protocols, migrations,
  and toolchains.

No approved clean-room file will be patched and no external publication is
authorized.

## Alternatives

1. Change the test to accept `AdapterProtocolInvalid` for a size-changing
   replacement. Rejected because tamper classification would depend on an
   incidental byte-length property.
2. Collapse all artifact-validation failures into one generic code. Rejected
   because it weakens operational evidence and obscures whether authority,
   shape, or signed content failed.

## Approval Gate

Approval authorizes the narrow Chamber source repair, dependent Cell
revalidation, replacement artifact assembly, and a new affected-scope freeze
request. It does not authorize publication or permit unrelated source changes.

The user approved the design on 2026-07-22.

## Repair Result

- Chamber now keeps unavailable paths, non-regular files, symlinks, invalid
  manifests, undeclared files, and entrypoint redirection under
  `AdapterProtocolInvalid`.
- A declared regular file with a different byte size or SHA-256 digest now
  returns `ArtifactDigestMismatch`.
- Hostile coverage proves both same-size and different-size replacement before
  adapter process start.
- The complete Chamber Rust and TypeScript-adapter gates pass under Rust
  `1.97.0` and Node `24.18.0`, including formatting, strict Clippy, all tests,
  package verification, npm audit, and RustSec audit.
- The complete ordinary Cell Linux suite passes against the repaired Chamber
  under Rust `1.97.0`, Node `24.18.0`, and PostgreSQL `16.14`.

## Replacement Identity

- Chamber commit:
  `e416e6823acf20b0b073cd3ff26e10c13a610280`.
- Chamber source-tree digest:
  `sha256:fd0b2d550a56b0e8ac71253fad7daa98dd6162849455d2bf75c214397bb4493a`.
- Chamber source archive:
  `sha256:0c91ebb0d7fc6b8af92e1d68547d22cc9ea06df8ddf0dedf232e9dfacec1501b`.
- Chamber crate:
  `sha256:58ebb38dfb00abe3e08934a397643b463afc11b3641d93c182da5784ee97b183`.
- Replacement manifest:
  `sha256:6517a39c1a090e8a7c0fd9c9fd619d191f67c14459ee5b7b0e55bbaedd9bdbdf`.
- Candidate metadata remains:
  `sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`.

The artifact assembly and manifest reproduce byte-for-byte. All nine source
trees and all 20 artifact digests and sizes validate independently. The other
eight repository records and 18 artifact records are unchanged from the
approved public-index replacement freeze.

## Refreeze Gate

Explicit approval replaces only the Chamber commit, Chamber source archive,
Chamber crate, and distributed manifest. It reauthorizes Sprint 9F against
`/tmp/cadenza-release-artifacts-rc1-chamber-refreeze` and
`/tmp/cadenza-distributed-foundation-rc1-chamber-refreeze-manifest.json`. It
does not authorize publication.

The user approved the affected-scope replacement freeze on 2026-07-22. The
replacement identity in this document is now authoritative for Sprint 9F.
