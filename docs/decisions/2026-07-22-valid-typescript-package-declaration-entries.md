# Valid TypeScript Package Declaration Entries

Date: 2026-07-22

## Context

The Sprint 9F clean-context authoring trial found that the frozen TypeScript
package declared `dist/types/index.d.ts` as its public type entry even though
the npm tarball emitted declarations at `dist/index.d.ts` and
`dist/index.d.mts`. Modern TypeScript recovered through runtime-export
fallback, but classic resolution failed and the invalid metadata confused an
autonomous authoring agent. The existing package smoke tested only the
successful fallback.

## Decision

The TypeScript package must point both its top-level and conditional type
entries at the generated `dist/index.d.ts`. Its package smoke must inspect the
installed tarball and fail when any declared public type or runtime entry does
not exist.

The generated declaration and runtime output locations remain unchanged. The
repair does not alter primitives, contracts, public symbols, runtime behavior,
dependencies, or supported minimum toolchains.

## Consequences

- Public npm metadata names files that actually exist in the artifact.
- TypeScript consumers no longer depend on compiler fallback or path aliases.
- Package validation covers metadata integrity as well as runtime and compiler
  consumption.
- Core source identity, npm package, Core SBOM, workspace publication index,
  and distributed manifest require an affected-scope refreeze.
- Runtime bundles, declarations, non-TypeScript implementations, and
  downstream runtime artifacts are expected to remain byte-identical.

## Alternatives

- Accepting modern compiler fallback was rejected because public metadata
  would remain factually invalid.
- Moving declarations into `dist/types` was rejected because it broadens the
  repair and conflicts with the existing format-adjacent build output.
- Removing the top-level `types` field was rejected because it reduces
  compatibility without serving the smallest coherent repair.
- Documenting a consumer path alias was rejected because consumers should not
  repair publisher metadata.

## Links

- [Sprint 9F TypeScript Package Declaration Entry Gate](../publication/sprint-9f-typescript-package-declaration-entry-gate-v1.md)
- [Sprint 9F Definitive Proof And Publication Review](../agent-harness/exec-plans/active/2026-07-22-sprint-9f-definitive-proof-publication-review.md)
