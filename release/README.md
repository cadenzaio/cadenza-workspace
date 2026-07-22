# Distributed Foundation Release Metadata

This directory owns the machine-readable boundary for the first public Cadenza
distributed-foundation release candidate.

- `candidate.json` declares repositories, independent versions, tags,
  toolchains, compatibility, migrations, required CI jobs, and publication
  controls.
- `required-checks.json` fixes the GitHub branch-protection projection and
  one-time bootstrap assumptions.
- `public-workspace-allowlist.json` declares the only workspace paths eligible
  for the curated public export.
- `manifest.schema.json` defines the frozen release-manifest shape.
- generated candidate manifests and package outputs are build artifacts and are
  not authoritative until bound to approved source commits.

Validate the declared boundary:

```bash
node scripts/validate-release-candidate.mjs
```

After package artifacts have been built with the pinned toolchains, assemble
source archives and bounded release assets from clean commits:

```bash
node scripts/assemble-release-artifacts.mjs \
  --staging /tmp/cadenza-package-staging \
  --workspace-repo /tmp/cadenza-workspace-public \
  --output /tmp/cadenza-release-artifacts
node scripts/build-release-manifest.mjs \
  --workspace-repo /tmp/cadenza-workspace-public \
  --artifacts /tmp/cadenza-release-artifacts \
  --output /tmp/cadenza-distributed-foundation-rc1-manifest.json
```

The metadata prepares publication but grants no GitHub, tag, release, or
package-registry authority.
