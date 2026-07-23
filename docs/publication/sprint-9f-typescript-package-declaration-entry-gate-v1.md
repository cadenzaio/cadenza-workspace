# Sprint 9F TypeScript Package Declaration Entry Gate V1

Date: 2026-07-22
Status: affected-scope replacement freeze approved

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

## Repair Result

Core now exposes format-aware declaration conditions while preserving the
classic top-level type entry. The installed-package smoke verifies that every
declared public entry exists and compiles real `Cadenza.defineIntent` calls
through ESM `NodeNext`, CommonJS `NodeNext`, and classic resolution.

The repair is committed in two DCO-signed commits:

- `6e8df5ab6fd9de7158a811ac8bcd718f4e7387d4` aligns the top-level type entry
  and adds installed-artifact validation;
- `f936045b5710e40db272435b6cf68741803824e6` supersedes the interim
  conditional entry with the approved format-aware map and strengthens the
  compiler fixtures.

Exact Node `24.18.0` validation passed:

- complete formatting and semantic typecheck;
- all 148 Core tests;
- build and enhanced installed-package smoke;
- production dependency audit with zero vulnerabilities;
- byte comparison proving every generated runtime bundle, declaration, and
  source map is identical to the prior freeze.

A new autonomous authoring agent started from only the replacement tarball,
public README, task brief, and ordinary installed consumer dependencies. In
approximately ten minutes it produced the required `quote-order` intent,
validation and integer-cent calculation graph, valid EUR 140.00 case, invalid
order case, and report. Strict `NodeNext` typecheck, two runtime tests, and
production build passed under exact Node `24.18.0` without path aliases,
`Bundler` resolution, package-internal imports, or infrastructure leakage.

The trial recorded two non-blocking API lessons: task callbacks narrow from the
general business context at their boundary, and responder failures expose the
bounded inquiry-level error instead of the internal validation message.

Complete reference-system release validation then passed against the
replacement package: all 9 tests, typecheck, build, and artifact regeneration.
The generated reference artifact remains
`sha256:9b9f1118e5313ac9867cec4bba9162296df5b2d2515ae6b1085dc9a51538b3a1`
and remains bound to the byte-identical executable Core ESM module
`sha256:ecdda04fc00ceb6aeb7c39ce58cce32277617422c526c27a29ae6e33ac05ae2a`.

## Replacement Assembly

Two complete assemblies and manifests from the same clean commits are
byte-identical. The candidate metadata digest remains
`sha256:fb000ad25a00edbb0c8e6ff8c9887a42e6865680a854896a6673c4f22fdb9b3a`,
the manifest still contains 20 artifacts, and `registry_publication` remains
false.

Replacement repository identities are:

- Core commit `f936045b5710e40db272435b6cf68741803824e6`, source tree
  `sha256:e9cb3fd1f487b907fbce6cef30ddb606a4e8fb42beaaace6560f6580392d2c2c`;
- curated workspace commit `529134c6b165048df80589c4d83ab92667a037f1`,
  source tree
  `sha256:672da1547e1c757305562771ed84be3895bb4ab06ff9a7114c09baed33e594f8`.

Replacement artifact identities are:

- Core npm package:
  `sha256:77d124434af753cd6e7711608acd2e306d3044321bb9a8abfa57209d7eaad13d`;
- Core source archive:
  `sha256:a7cb6579619ac429d01afc1160dc9fd1aaa82061968b9647fbb7634ca1c051dd`;
- curated workspace source archive:
  `sha256:13d25d72011dab709c8ea32634e1f59005dcc3da31636e50ea568484caa14bf1`;
- aggregate manifest:
  `sha256:d87bdae6b189a83ead0cde7261e32949cc6d2fa439aa0f9707979965ea7aa954`.

Pinned Syft `1.49.0` regeneration proved the Core SBOM remains byte-identical at
`sha256:8f73418b8e4a51abb697f5a09315fa1d2bbeda730aa73fc3d14bc79891ca2fd5`.
Every other SBOM is also unchanged. Independent manifest comparison proves
that the two repository records and three artifacts above are the only changes
from the approved Cell supply occupancy freeze.

The final nine-archive clean room passed workspace governance, public export,
release metadata, all six contract snapshot bundles, public documentation
links, rendered architecture validation, and catalog validation. All nine
extracted source trees match their manifest source-tree identities. The
manifest passes its Draft 2020-12 schema, and all 20 artifact byte sizes and
SHA-256 digests were independently verified.

Retained replacement inputs:

- manifest:
  `/tmp/cadenza-distributed-foundation-rc1-types-entry-manifest-v1.json`;
- artifacts: `/tmp/cadenza-release-artifacts-rc1-types-entry-v1`;
- independently reproduced artifacts:
  `/tmp/cadenza-release-artifacts-rc1-types-entry-repro-v1`;
- autonomous authoring trial: `/tmp/cadenza-9f-agent-trial-v4`.

## Affected-Scope Refreeze Gate

Explicit approval replaces only the Core and curated-workspace repository
identities and the three artifact identities listed above, together with the
aggregate manifest. Every other repository record and 17 artifact records
remain frozen at their previously approved identities. Approval reauthorizes
Sprint 9F against the retained replacement inputs and does not authorize any
external publication.

The user approved this affected-scope replacement freeze on 2026-07-23. The
replacement manifest and artifact paths above are now authoritative for the
remaining Sprint 9F proof.
