# Distributed Foundation Release Metadata

This directory owns the machine-readable boundary for the first public Cadenza
distributed-foundation release candidate.

- `candidate.json` preserves the RC1 declaration.
- `candidates/distributed-foundation-rc2.json` declares the mixed RC1/RC2
  repository identities, toolchains, compatibility, migrations, required CI
  jobs, release actions, and publication controls for the local RC2 candidate.
- `required-checks.json` fixes the GitHub branch-protection projection and
  one-time bootstrap assumptions.
- `public-workspace-allowlist.json` declares the only workspace paths eligible
  for the curated public export.
- `public-documentation-authority.json` declares current public documentation
  roots and bounded legacy-authority regression checks.
- `manifest.schema.json` defines the frozen release-manifest shape.
- generated candidate manifests and package outputs are build artifacts and are
  not authoritative until bound to approved source commits.

Validate the declared boundary:

```bash
node scripts/validate-release-candidate.mjs \
  --candidate release/candidates/distributed-foundation-rc2.json
```

After package artifacts have been built with the pinned toolchains, assemble
source archives and bounded release assets from clean commits:

```bash
node scripts/assemble-release-artifacts.mjs \
  --candidate release/candidates/distributed-foundation-rc2.json \
  --staging /tmp/cadenza-package-staging \
  --workspace-repo /tmp/cadenza-workspace-public \
  --output /tmp/cadenza-release-artifacts
node scripts/build-release-manifest.mjs \
  --candidate release/candidates/distributed-foundation-rc2.json \
  --workspace-repo /tmp/cadenza-workspace-public \
  --artifacts /tmp/cadenza-release-artifacts \
  --output /tmp/cadenza-distributed-foundation-rc2-manifest.json
```

Repositories marked `reuse` remain bound to their existing signed RC1
identities and are not rebuilt or retagged. The metadata prepares publication
but grants no GitHub, tag, release, signing, or package-registry authority.

Python wheel staging must preserve the reproducible build environment enforced
by `cadenza-python/scripts/package_smoke.py`, including
`SOURCE_DATE_EPOCH=315532800`. A raw wheel build without that epoch is not a
candidate artifact even when its installed behavior is identical.
