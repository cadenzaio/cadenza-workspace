# Core TypeDoc Transitive Security Repair

Date: 2026-07-27

## Context

The final TypeScript actor API validation found a high-severity denial-of-
service advisory in development tooling:
`typedoc@0.28.20 -> minimatch@10.2.5 -> brace-expansion@5.0.7`.
The existing minimatch dependency range already permitted the patched
`brace-expansion@5.0.8`.

The user approved the focused dependency design on 2026-07-27 with:

`Sprint 10B TypeDoc transitive security repair design approved. Proceed.`

## Decision

Refresh only the existing `brace-expansion@^5.0.5` Yarn lock entry from
`5.0.7` to `5.0.8`. Keep `package.json`, direct dependencies, TypeDoc,
minimatch, and unrelated lock entries unchanged.

Yarn regenerates the version, package URL, integrity, and dependency metadata
from the existing declared range.

## Consequences

- The core development dependency audit reports zero vulnerabilities.
- Production package contents and dependency declarations do not gain
  `brace-expansion`.
- Frozen installation, documentation generation, typecheck, tests, build, and
  package smoke remain reproducible.
- RC1 remains immutable; the lock repair belongs to post-RC consolidation.

## Alternatives

- Add a direct dependency: rejected because core runtime code does not use it.
- Add a broad root resolution: rejected because the existing transitive range
  already admits the patch.
- Upgrade TypeDoc or minimatch: rejected as unnecessary toolchain expansion.
- Defer to Sprint 10D: rejected because Sprint 10B could not close with a known
  high-severity validation failure.

## Links

- [Approved design](../agent-harness/exec-plans/completed/2026-07-27-core-typedoc-transitive-security-repair-design.md)
- [Actor API repair decision](2026-07-27-typescript-actor-api-purpose-repair.md)
- [Sprint 10B review](../publication/sprint-10b-recursive-purpose-contract-review-v1.md)
