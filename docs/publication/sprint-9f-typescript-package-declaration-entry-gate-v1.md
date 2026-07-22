# Sprint 9F TypeScript Package Declaration Entry Gate V1

Date: 2026-07-22
Status: design amendment approved; repair in progress

## Context

The Sprint 9F clean-context authoring trial inspected the frozen
`@cadenza.io/core` package before authoring a realistic order-quote flow. It
found that the package manifest declares both its top-level `types` entry and
its conditional `exports["."].types` entry as
`dist/types/index.d.ts`. That file does not exist in the frozen npm tarball.
The package instead contains `dist/index.d.ts` and `dist/index.d.mts` beside
its CommonJS and ESM runtime entries.

An independent clean consumer under exact Node `24.18.0` and TypeScript
`5.9.3` established the practical boundary:

- strict `NodeNext` ESM and CommonJS compilation succeeds because TypeScript
  rejects the missing declared target and recovers through the adjacent
  declaration for the selected runtime export;
- classic `Node10` module resolution fails with `TS7016` because its primary
  `types` entry is missing;
- changing both declared paths to the existing `dist/index.d.ts` makes all
  three checks pass without a consumer path alias.

The package therefore remains usable in the preferred modern configuration,
but only through compiler fallback after invalid metadata. This is not a
spotless or coherent publication state. It also created avoidable friction in
the autonomous authoring trial, whose agent added a local path mapping after
observing the mismatch.

The existing package smoke compiles a `NodeNext` consumer. That proves the
fallback path but does not assert that the package's declared type and runtime
entry targets exist, which allowed the invalid manifest to pass CI and the
earlier clean-room validation.

## Decision Proposal

Repair only the TypeScript package declaration metadata and its regression
proof:

1. Change `package.json` `types` from `dist/types/index.d.ts` to
   `dist/index.d.ts`.
2. Change `exports["."].types` from `./dist/types/index.d.ts` to
   `./dist/index.d.ts`.
3. Extend `scripts/package-smoke.mjs` so the installed tarball must contain
   every declared public type and runtime entry before consumer compilation.
4. Retain the current ESM, CommonJS, `NodeNext`, build, and public API
   behavior. Do not move generated declarations or alter runtime bundles.
5. Add a classic TypeScript resolution check only as regression evidence that
   the top-level `types` entry resolves; it does not establish a general legacy
   compatibility commitment.

No Cadenza primitive, contract, callable, runtime behavior, public symbol,
dependency, or minimum toolchain changes.

## Required Proof

- Core formatting, typecheck, tests, build, audit, and enhanced package smoke
  pass under exact Node `24.18.0`.
- The packed tarball contains every path named by `main`, `module`, `types`,
  and the root export conditions.
- Fresh strict TypeScript consumers compile named and default imports under
  modern `NodeNext`, CommonJS `NodeNext`, and classic resolution without path
  aliases.
- The clean-context order-quote trial is repeated from a new empty directory
  with full semantic `tsc`, runtime tests, and build against the replacement
  tarball.
- The complete reference-system release validation passes against the
  replacement package and reproduces its existing runtime artifact and
  executable-module binding byte for byte.
- The built `dist/index.js`, `dist/index.mjs`, declarations, and source maps are
  compared with the current freeze; only package metadata is expected to
  change inside the npm artifact.

## Impacted Scope

- Source repair: `cadenza/package.json` and
  `cadenza/scripts/package-smoke.mjs`.
- Required replacement: TypeScript Core commit, source-tree digest, source
  archive, npm package, and Core SBOM.
- Dependent public-index replacement: curated workspace identity and source
  archive because this gate and resulting evidence are publication records.
- Aggregate replacement: distributed manifest and exact affected-artifact
  records.
- Validation-only dependent scope: reference-system and clean-context
  authoring acceptance.
- Expected byte-identical scope: Core runtime bundles and declarations,
  reference generated artifact, all non-TypeScript implementations, all
  adapters, Environment, Chamber, Cell, authority artifacts, and every
  unrelated package and SBOM.

No external publication is authorized.

## Risks

- A package-entry assertion that checks source output instead of the installed
  tarball could repeat the current blind spot. The smoke must inspect the
  actual installed package.
- Reconfiguring `tsup` or moving declaration files would broaden the repair
  unnecessarily and could alter downstream runtime bindings. Generated output
  locations remain unchanged.
- Treating successful `NodeNext` fallback as sufficient would leave factually
  invalid public metadata and tool-dependent behavior in the release.

## Alternatives

1. Accept the package because preferred `NodeNext` consumers compile. Rejected:
   the manifest names a nonexistent public file and already confused the clean
   authoring agent.
2. Move declarations into `dist/types`. Rejected: the build deliberately emits
   format-adjacent declarations, and moving them is broader than correcting
   stale metadata.
3. Remove the top-level `types` field and rely only on conditional exports.
   Rejected: it reduces compatibility and does not serve the smallest coherent
   repair.
4. Add a consumer workaround to the documentation. Rejected: consumers should
   not repair publisher metadata with path aliases.

## Approval Gate

Approval authorizes the two metadata corrections, enhanced installed-package
smoke, complete affected validation, clean-context and reference reruns,
replacement artifact assembly, and a new exact affected-scope freeze request.
It does not authorize runtime changes, API changes, declaration relocation,
unrelated cleanup, or publication.

The user approved this design on 2026-07-22.

## Implementation Finding

The approved direct replacement was implemented and committed as interim Core
commit `6e8df5a`. Complete Core validation passed, including the strengthened
smoke as initially designed, and every generated runtime and declaration file
remained byte-identical to the frozen candidate.

A new autonomous clean-context trial then exercised actual `Cadenza` static
methods rather than merely assigning the default import to itself. Under
`NodeNext`, the single conditional `types` target at `dist/index.d.ts` was
interpreted as a module namespace. Full semantic compilation failed because
`defineIntent`, `createTask`, and `inquire` were not visible on the default
import. The trial could compile only after changing to `Bundler` resolution.

This exposes a second blind spot in the initial enhanced smoke: its ESM and
CommonJS fixtures proved that an import resolved, but did not call any public
API and therefore did not prove the declaration's default-export shape.

The interim Core commit and package have not been frozen or assembled into a
replacement candidate. No external state changed.

## Design Amendment Proposal

Use format-aware conditional exports while keeping the valid classic entry:

```json
{
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

This map has been independently tested under exact Node `24.18.0` and
TypeScript `5.9.3`:

- ESM `NodeNext` resolves the `.d.mts` declaration and exposes the default
  `Cadenza` class with its static API;
- CommonJS `NodeNext` resolves the `.d.ts` declaration and exposes the same
  API;
- classic resolution uses the valid top-level `types` entry;
- no path alias or package-internal import is required.

Strengthen all three smoke fixtures to call a real public static method such as
`Cadenza.defineIntent`, not merely compare the import's self-type. Keep the
installed-artifact existence assertions from the approved design.

All original scope, proof, byte-identity, and publication restrictions remain
unchanged. This amendment supersedes only the approved single conditional type
target; it does not change generated files or add a compatibility promise.

## Amendment Alternatives

1. Require consumers to use `Bundler` resolution. Rejected because the public
   package and README currently present a normal Node runtime package, and the
   repository's own package smoke declares `NodeNext` as the primary check.
2. Point every consumer at `.d.mts`. Rejected because CommonJS and classic
   consumers need the CommonJS declaration form.
3. Collapse the build to ESM-only. Rejected because it removes an existing
   runtime format and is far broader than package metadata repair.
4. Keep the weak smoke. Rejected because import resolution without public API
   visibility is not usable authoring proof.

## Amendment Approval Gate

Approval authorizes replacing the interim simple conditional export with the
format-aware map above, strengthening the smoke fixtures to exercise real
public APIs, superseding the earlier package-entry decision with a new decision
record, and resuming all previously approved validation and affected-scope
replacement work. It does not authorize generated-output, runtime, API, or
publication changes.

The user approved this design amendment on 2026-07-22.
