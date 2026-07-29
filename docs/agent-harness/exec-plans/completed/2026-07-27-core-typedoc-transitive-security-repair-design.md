# Sprint 10B Core TypeDoc Transitive Security Repair Design

Date: 2026-07-27

## Status

- State: `done`.
- Parent WIP:
  [TypeScript actor API purpose repair](2026-07-27-typescript-actor-api-purpose-repair-design.md).
- External GitHub mutation: none.
- Approval received from the user on 2026-07-27:
  `Sprint 10B TypeDoc transitive security repair design approved. Proceed.`
- Outcome: the existing `brace-expansion@^5.0.5` lock entry now resolves to
  `5.0.8`; `package.json` and all unrelated lock entries are unchanged.
- Core commit: `1cf98d5`.

## Context

The approved actor API repair requires a high-severity dependency audit before
closure. `yarn audit --level high` found:

- `typedoc@0.28.20`
- `minimatch@10.2.5`
- `brace-expansion@5.0.7`
- advisory class: denial of service through unbounded expansion
- patched release: `brace-expansion@5.0.8`

The existing `minimatch` declaration already permits `brace-expansion@^5.0.5`.
The vulnerable version persists only because `yarn.lock` resolved that range
to `5.0.7`. Registry metadata confirms `5.0.8` supports Node `20 || >=22`;
the core requires Node `>=24.18.0`.

Sprint 10B requires explicit approval before dependency changes, including a
transitive lock refresh.

## Proposed Approach

1. Refresh only the existing `brace-expansion@^5.0.5` lock resolution from
   `5.0.7` to `5.0.8`.
2. Keep `package.json`, direct dependencies, TypeDoc, and minimatch unchanged.
3. Use the package manager to regenerate the scoped lock entry rather than
   hand-editing integrity metadata.
4. Verify that no unrelated lock entry changes.
5. Run frozen installation, `yarn why brace-expansion`, high-severity audit,
   TypeDoc generation, strict typecheck, 148 tests, build, formatting, and
   package smoke.

## Impacted Repos

- Dependency authority and validation: `cadenza`.
- Evidence only: `cadenza-workspace`.
- No dependency propagation: `cadenza-reference-system` consumes the packed
  production package, which does not include TypeDoc or its transitive tree.

## Risks

- Lock regeneration could update unrelated transitive packages.
  Control: reject any delta beyond the one permitted lock stanza.
- The patch could be incompatible with minimatch or the project Node runtime.
  Control: the existing semver range permits it and all release checks rerun.
- A direct dependency or broad resolution could accidentally make a
  documentation-only package part of production authority.
  Control: do not change `package.json`.

## Migration Strategy

- This is a lock-only patch inside the post-RC development lineage.
- RC1 tags and history remain unchanged.
- No compatibility shim, schema migration, package version change, or
  cross-language propagation is required.

## Alternatives

- Add `brace-expansion` as a direct dependency: rejected because the core does
  not use it.
- Add a broad root `resolutions` override: rejected because the existing
  transitive range already admits the patch.
- Upgrade TypeDoc or minimatch: rejected as a larger toolchain change without
  evidence that it is needed.
- Defer to Sprint 10D: rejected because the current approved validation gate
  cannot close with a known high-severity dependency finding.

## Assumptions

- The official registry metadata and integrity for `5.0.8` remain the source
  used by the lock refresh.
- The resulting diff is limited to the existing transitive lock entry.

## Approval Gate

Required approval phrase:

`Sprint 10B TypeDoc transitive security repair design approved. Proceed.`
