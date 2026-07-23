# Chamber Standalone Contract Fixture

Date: 2026-07-23
Status: accepted

## Context

The frozen Chamber release candidate compiled one integration test against a
local-orchestration fixture outside the repository. Combined workspace proof
supplied that ambient file, while the standalone GitHub checkout correctly
failed. The fixture expresses a shared Cell/Chamber/Core boundary and needs an
explicit authority relationship.

## Decision

The curated workspace fixture under
`docs/contracts/local-orchestration/fixtures/` remains the shared neutral
authority. It is registered as contract snapshot bundle
`local_orchestration_v0`, with a byte-identical consumer under
`cadenza-chamber/contracts/fixtures/`.

Chamber tests consume only the repo-local snapshot. Final release proof must
validate each repository archive independently as well as in the combined
workspace topology.

## Consequences

- Chamber becomes independently compilable, testable, and packageable.
- Fixture drift is detected by the existing contract snapshot tooling.
- The shared contract bundle count increases from six to seven.
- Runtime behavior, protocol schemas, and projection semantics do not change.
- Chamber and curated-workspace release records require affected-scope
  replacement.

## Alternatives

- Checking out the workspace in Chamber CI was rejected because it preserves
  the ambient dependency.
- An unmanaged fixture copy was rejected because it could drift.
- Removing the projection test was rejected because it protects a critical
  runtime boundary.

## Links

- [Sprint 9F Chamber Standalone Contract Fixture Gate V1](../publication/sprint-9f-chamber-standalone-contract-fixture-gate-v1.md)
- GitHub Actions run `30043523985`
- User approval: `Sprint 9F Chamber standalone contract fixture repair design approved. Proceed.`
