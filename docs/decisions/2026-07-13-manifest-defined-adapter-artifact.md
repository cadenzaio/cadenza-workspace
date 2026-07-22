# Manifest-Defined Adapter Artifact

## Context

The TypeScript adapter entrypoint imports sibling adapter modules and the
TypeScript compiler used to materialize callable definitions. Measuring only
`main.js` left executable inputs outside the named adapter artifact even though
the broader rootfs digest happened to cover their bytes.

## Decision

An adapter is a deterministic manifest-defined multi-file artifact. The build
cleans stale output and packages emitted adapter files, a minimal runtime package
descriptor, and installed production dependencies selected from the measured
package lock.

The manifest binds its runtime and adapter version, one entrypoint, and every
artifact file by sorted relative path, byte size, and SHA-256 digest. The
runtime image identifies the manifest digest. Before spawning Node, the chamber
verifies the manifest contract and digest, configured entrypoint, closed file
set, every file digest and size, and absence of symlinks or redirected paths.
The dependency lock and immutable rootfs remain separate measured inputs.

## Consequences

- every executable adapter input has explicit artifact identity.
- missing, extra, replaced, reordered, or symlinked files fail before process
  creation.
- production dependencies are available without package fetching at runtime.
- independent macOS and Linux builds can prove byte-identical artifact output.
- adapter startup performs bounded hashing over the complete artifact.

## Alternatives

- Bundle the adapter into one file. Deferred because it adds a bundler
  dependency and obscures the current module/dependency boundary.
- Hash the inferred build directory without a manifest. Rejected because the
  runtime-file boundary would remain implicit.
- Rely only on the rootfs tree digest. Rejected because it does not give the
  adapter artifact a coherent independent identity.

## Links

- [Chamber Contract](../../cadenza-chamber/contracts/v0.md)
- [Linux gVisor Evidence](../../cadenza-cell/docs/linux-gvisor-evidence-2026-07-13.md)
- [Trusted Cell And First Activation Plan](../agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md)
