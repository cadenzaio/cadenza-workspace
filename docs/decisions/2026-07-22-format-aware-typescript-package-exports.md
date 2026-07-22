# Format-Aware TypeScript Package Exports

Date: 2026-07-22
Supersedes: [Valid TypeScript Package Declaration Entries](2026-07-22-valid-typescript-package-declaration-entries.md)

## Context

The first package-entry repair made every declared path exist, but an
autonomous authoring trial exposed a declaration-format mismatch. A single
conditional `dist/index.d.ts` target made TypeScript `NodeNext` ESM consumers
interpret the default import as a module namespace. Import resolution itself
passed, but `Cadenza.defineIntent`, `createTask`, and `inquire` were not visible.

The build already emits format-adjacent declarations: `dist/index.d.mts` for
ESM and `dist/index.d.ts` for CommonJS and classic resolution.

## Decision

The root package export uses nested format-aware conditions:

- `import.types` targets `dist/index.d.mts` and `import.default` targets
  `dist/index.mjs`;
- `require.types` targets `dist/index.d.ts` and `require.default` targets
  `dist/index.js`;
- the top-level `types` field remains `dist/index.d.ts` for classic resolution.

Package smoke validation must inspect installed artifact entries and compile
fixtures that invoke a real public static API under ESM `NodeNext`, CommonJS
`NodeNext`, and classic TypeScript resolution.

## Consequences

- Each runtime format resolves the declaration form emitted for that format.
- Default-import usability is proven rather than inferred from successful
  module resolution.
- Consumers require no path alias or package-internal import.
- Runtime bundles, declarations, primitive contracts, and public APIs remain
  unchanged.
- The affected Core source, package, SBOM, workspace index, and distributed
  manifest still require replacement and exact refreeze.

## Alternatives

- Requiring `Bundler` resolution was rejected because Cadenza is a normal Node
  runtime package and its primary smoke uses `NodeNext`.
- Using `.d.mts` for every consumer was rejected because CommonJS and classic
  resolution require the CommonJS declaration form.
- Removing CommonJS output was rejected as an unrelated compatibility change.
- Keeping import-only smoke fixtures was rejected because resolution without a
  usable public API is not authoring proof.

## Links

- [Sprint 9F TypeScript Package Declaration Entry Gate](../publication/sprint-9f-typescript-package-declaration-entry-gate-v1.md)
- [Sprint 9F Definitive Proof And Publication Review](../agent-harness/exec-plans/active/2026-07-22-sprint-9f-definitive-proof-publication-review.md)
