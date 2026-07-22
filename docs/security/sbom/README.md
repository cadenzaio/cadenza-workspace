# Cadenza Source SBOMs

These CycloneDX 1.7 inventories describe dependency declarations and CI action
inputs found in the seven official source repositories. They are release
evidence, not runtime vulnerability verdicts.

Generate them from the workspace root with Syft `1.49.0` and `jq`:

```bash
./scripts/generate-sboms.sh
```

The generator uses only the relevant lock/package catalogers, runs one worker,
and excludes installed dependencies, build output, and VCS storage. It removes
timestamps, random serial numbers, and local source-root prefixes so identical
source produces byte-identical output and no developer path is disclosed.

Release-artifact SBOMs must be generated separately from the exact packaged
artifacts during Sprint 9E. Those artifact SBOMs complement rather than replace
these source inventories.
