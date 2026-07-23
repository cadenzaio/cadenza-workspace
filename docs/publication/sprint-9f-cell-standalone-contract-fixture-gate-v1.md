# Sprint 9F Cell Standalone Contract Fixture Gate V1

Date: 2026-07-23
Status: implemented; affected-scope replacement freeze pending

## Context

The exact frozen Cell commit
`752ae0d2a47103d42966b22dbc83e01159ec1219` was published to
`cadenzaio/cadenza-cell` after the approved Chamber replacement was signed and
tagged. GitHub Actions run `30046591757` passed all pinned dependency
checkouts and builds, Rust formatting, and Cell dependency compilation. It
failed when Clippy compiled `tests/host_meta_authority.rs`.

That test reads:

```text
../../docs/contracts/local-orchestration/fixtures/v0-local-orchestration.json
```

The path resolves only when Cell is nested inside the private or combined
workspace. The standalone Cell repository and source archive do not contain
that parent file. The defect is the same ambient-authority class repaired in
Chamber, but Cell was not declared as a consumer of the newly governed
`local_orchestration_v0` contract bundle.

Publication stopped before any Cell tag, reference-system source, workspace
source, prerelease, release asset, protection, legacy mutation, or registry
package was published.

## Proposed Decision

Keep the existing curated workspace fixture as the single neutral authority
and add Cell as a second explicit consumer:

1. add
   `cadenza-cell/contracts/fixtures/local-orchestration-v0.json` to the
   `local_orchestration_v0` consumer list in `contracts.config.json`;
2. synchronize the fixture byte-for-byte through the existing contract
   snapshot tooling;
3. update `tests/host_meta_authority.rs` to consume only the repository-local
   snapshot;
4. document fixture provenance in
   `cadenza-cell/contracts/fixtures/README.md`;
5. run Cell formatting, Clippy, complete tests, audit, metadata validation,
   standalone source-archive proof, and live GitHub CI; and
6. scan all Cell compile-time fixture paths so no second parent-document
   dependency remains.

After repair:

1. create a DCO-signed Cell replacement commit;
2. require live `cell` context success on that exact commit;
3. regenerate the Cell source archive and SBOM, proving the SBOM is either
   byte-identical or explicitly replaced;
4. update the curated workspace with the approved gate and implementation
   evidence;
5. assemble twice and run standalone and combined archive-only proof;
6. request an exact Cell-and-workspace affected-scope replacement freeze; and
7. resume signed Cell tagging and downstream publication.

## Impacted Repositories

- `cadenza-cell`: fixture snapshot, provenance note, and test path.
- curated `cadenza-workspace`: contract consumer registration, decision,
  publication evidence, and resulting release metadata.

No Core, Environment, Chamber, reference-system, protocol, runtime behavior,
or database authority changes are proposed.

## Risks

- A copied fixture could drift if it bypasses snapshot governance.
- Combined workspace validation could again mask an undeclared parent
  dependency if standalone proof is omitted.
- The Cell SBOM may change if the synchronized JSON is represented in its file
  inventory; that result must be measured rather than assumed.
- Continuing with the current Cell commit would publish a required-check
  failure and violate the fail-closed release posture.

## Migration Strategy

This is a release-candidate source replacement, not a compatibility migration.
The already-published failing Cell commit remains in Git history. Public
`main` advances by one narrow DCO-signed commit, and no Cell tag exists to
replace. The approved Chamber tag remains immutable and unchanged.

## Alternatives

1. Checkout the workspace repository in Cell CI. Rejected because it preserves
   ambient authority and does not make the Cell source archive independently
   verifiable.
2. Copy the fixture without registering Cell as a consumer. Rejected because
   the copy would have no governed drift check.
3. Remove or skip the test. Rejected because it verifies host-side projection
   digest and acknowledgement coherence.
4. Reuse the Chamber fixture through a relative sibling path. Rejected because
   the Cell contract test would still depend on ambient repository topology.
5. Continue publication with the failing check. Rejected by the approved
   required-check policy.

## Implementation Evidence

The approved repair is implemented in DCO-signed Cell commit
`a9b5e168f4c29e7579657c563242a15ca0ba473c`:

- `contracts/fixtures/local-orchestration-v0.json` is byte-identical to the
  workspace authority at
  `docs/contracts/local-orchestration/fixtures/v0-local-orchestration.json`;
- `contracts/fixtures/README.md` records that authority and synchronization
  relationship;
- `tests/host_meta_authority.rs` reads only the repository-local consumer; and
- `contracts.config.json` declares both Chamber and Cell as consumers of the
  existing `local_orchestration_v0` bundle.

Contract synchronization and drift validation pass all seven governed bundles.
A compile-time path scan found no remaining Cell reference to parent workspace
documentation.

Local Cell validation passes formatting, strict Clippy, all executable tests,
RustSec audit, and locked Cargo metadata. The one ignored PostgreSQL-dependent
test remains explicitly identified by the existing suite. GitHub Actions run
`30047551235` passes the exact public commit under required context `cell`.

An independent source proof extracted Cell at the exact commit together with
the signed Core `v4.0.0-rc.1`, Environment `v0.1.0-rc.1`, and Chamber
`v0.1.0-rc.1` archives into a topology with no parent workspace documentation.
Dependency builds, formatting, strict Clippy, all executable Cell tests,
RustSec audit, and locked metadata pass there.

The normalized Syft `1.49.0` Cell CycloneDX SBOM regenerates byte-identically
at `180741` bytes with
`sha256:1a11bb915c4d31a6ba7485337979f44c0907f4e02d75267fe18d43a1c9e86111`.
No runtime, protocol, schema, generated artifact, package, dependency, or
software-inventory identity changed.

## Approval Required

Approval authorizes only the Cell fixture repair, its standalone validation,
the resulting DCO-signed Cell and curated workspace replacement commits, and a
new exact affected-scope freeze request. It does not authorize a Cell tag or
downstream publication until that replacement freeze is separately approved.

The user approved the Cell standalone contract fixture repair design on
2026-07-23. Implementation is complete. The exact resulting Cell and curated
workspace identities still require an affected-scope replacement freeze before
Cell tagging or downstream publication may resume.
