# Sprint 9F Chamber Standalone Contract Fixture Gate V1

Date: 2026-07-23
Status: implemented; affected-scope replacement freeze pending

## Context

The exact frozen Chamber commit
`243543d20ad02d2a40ca02ae3e0e5e5f13f8bab1` was published to
`cadenzaio/cadenza-chamber`. GitHub Actions run `30043523985` passed the pinned
Core and Environment checkouts, TypeScript adapter installation, audit, type
checking and build, Rust formatting, and dependency compilation. It failed
when Clippy compiled the `authority_projection` integration test.

That test uses:

```text
../../docs/contracts/local-orchestration/fixtures/v0-local-orchestration.json
```

The path resolves only when `cadenza-chamber` is nested inside the private or
combined release workspace. The standalone Chamber repository and source
archive do not contain that parent file. Previous combined clean-room proof
therefore supplied undeclared ambient test authority and masked the
standalone-repository defect.

Publication stopped before any Chamber tag, Cell source, reference-system
source, workspace source, prerelease, release asset, protection, legacy
mutation, or registry package was published.

## Proposed Decision

Make the neutral local-orchestration fixture an explicit governed contract
snapshot:

1. register `local_orchestration_v0` in `contracts.config.json`;
2. retain the curated workspace fixture as the shared neutral authority;
3. declare `cadenza-chamber/contracts/fixtures/local-orchestration-v0.json` as
   its Chamber consumer;
4. sync the fixture byte-for-byte through the existing contract snapshot
   tooling;
5. update `authority_projection.rs` to consume only the repo-local snapshot;
6. run Chamber formatting, Clippy, tests, audit, package verification, adapter
   checks, standalone source-archive proof, and live GitHub CI; and
7. add standalone repository/archive validation to the final publication
   proof rather than relying only on combined workspace topology.

After repair:

1. create a DCO-signed Chamber replacement commit;
2. require the live `chamber` context to pass on that exact commit;
3. rebuild and compare the Chamber crate, source archive, SBOM, generated
   adapter artifact, contract bundle, and aggregate manifest;
4. update the curated workspace with this gate and resulting evidence;
5. assemble twice and run both standalone and combined archive-only proof;
6. request an exact Chamber-and-workspace affected-scope replacement freeze;
   and
7. resume signed tagging and downstream publication.

## Consequences

- Chamber tests and package verification become repository-local and
  reproducible.
- The fixture remains governed by one declared authority instead of becoming
  an untracked copy.
- Runtime behavior, protocol schemas, and projection semantics do not change.
- The contract snapshot count increases from six to seven.
- The Chamber commit, source tree, source archive, and crate package require
  replacement.
- Any SBOM or generated artifact that changes after deterministic rebuilding
  requires explicit replacement; byte-identical artifacts remain frozen.
- The curated workspace commit, workspace archive, contract-bundle projection,
  and aggregate manifest require replacement.

## Alternatives

1. Checkout the workspace repository in Chamber CI. Rejected because Chamber
   must remain independently buildable and must not receive ambient parent
   files.
2. Copy the fixture without contract governance. Rejected because the copy
   would drift without an authority relationship.
3. Remove or skip the projection test. Rejected because projection validation
   is a critical Chamber boundary.
4. Keep only combined clean-room validation. Rejected because it reproduces the
   topology that hid the defect.
5. Continue publication with a failing required check. Rejected by the
   fail-closed release posture.

## Implementation Evidence

- `local_orchestration_v0` is registered as a seventh governed contract bundle,
  with the curated workspace fixture as authority and the Chamber repository
  fixture as consumer.
- Chamber commit
  `3bc0dfa23d7c5fd16baf4a29f584127003cc2d5b` carries DCO sign-off and changes
  only the fixture snapshot, its provenance note, and the repository-local test
  path.
- Local formatting, Clippy, tests, audit, package verification, and TypeScript
  adapter checks pass.
- An extracted Chamber source archive passes Clippy, the complete test suite,
  and package verification without access to parent workspace documentation.
  Its intentional integration checks use unauthenticated clones of the exact
  signed Core and Environment release-candidate tags.
- GitHub Actions run `30044868343` passes the complete public `chamber` job on
  the exact replacement commit.

## Approval Required

The user approved the Chamber standalone contract fixture repair design on
2026-07-23. Implementation may proceed. Any resulting affected-scope
replacement freeze still requires explicit approval.
