# Sprint 9C Security Review V1

Date: 2026-07-22

## Executive Summary

The current review found no unresolved critical or high-severity security
finding. It found and repaired vulnerable JavaScript dependencies, mutable CI
action references, missing workflow permission narrowing, one stale
legacy-repository CI dependency, and missing hostile regression coverage for
untrusted context merging. Existing authority, materialization, containment,
transport, evidence, replay, and role boundaries are unusually explicit and
well covered for a release candidate.

The strongest accepted limit is intentional: Node's VM context is not a
security sandbox. Cadenza correctly places the security boundary around the
entire Chamber workload through a measured Linux/gVisor Cell profile. Fresh
assembled-rootfs, scale/recovery, and two-Cell reference-system proofs passed
against the Sprint 9C candidate.

## Method

- reviewed official source and contract boundaries across seven repositories;
- scanned current trees and available git history with Gitleaks `8.30.1`;
- audited npm/Yarn, Cargo, Hex, and NuGet dependencies;
- reviewed direct and transitive licenses where package metadata was available;
- reviewed every GitHub Actions use and workflow token permission;
- reviewed callable compilation, adapter process creation, fixed descriptors,
  privileged launcher admission, containment profiles, TLS peer validation,
  PostgreSQL roles/functions, evidence disclosure/custody, replay, and bounds;
- executed focused hostile merge coverage and existing validation suites;
- generated normalized CycloneDX source SBOMs with Syft `1.49.0`.

The available security skill references did not include a matching non-web
framework profile for this mixed TypeScript/Rust/PostgreSQL runtime. The review
therefore used repository contracts plus primary Node.js, PostgreSQL, GitHub,
gVisor, and ecosystem tooling guidance.

## Critical

No unresolved critical finding.

### SEC-001: Vulnerable TypeScript Dependency Graph

- Severity: `critical`
- Disposition: `resolved`
- Affected: `cadenza`
- Impact: published installs or development workflows could execute dependency
  versions with known critical/high vulnerabilities.
- Evidence: the initial Yarn audit reported 1 critical, 29 high, and 20
  moderate advisories, including Vitest/build-chain and direct runtime package
  findings.
- Repair: upgraded the direct toolchain/runtime dependencies and constrained
  vulnerable transitives in `cadenza/package.json:55`; regenerated
  `cadenza/yarn.lock` using `--ignore-scripts`.
- Verification: `yarn audit` reports zero vulnerabilities; format, typecheck,
  148 tests, and build pass.

## High

No unresolved high finding.

### SEC-002: Mutable And Outdated GitHub Action References

- Severity: `high`
- Disposition: `resolved`
- Affected: workspace and all official repositories
- Impact: a moved or compromised action tag could execute unreviewed code in a
  workflow context.
- Evidence: CI and commitlint workflows referenced version tags; one workflow
  used the old commitlint action major.
- Repair: pinned every external action to a reviewed full commit SHA, updated
  commitlint action `v5` to `v6.2.1`, and added explicit read-only workflow
  permissions. Representative repairs:
  `cadenza/.github/workflows/commitlint.yml:7` and
  `.github/workflows/agent-harness-check.yml:29`.
- Verification: no workflow under the candidate scope retains a `vN`, `main`,
  `master`, or `latest` action reference; all retained workflows declare
  `permissions`.

## Medium

### SEC-003: Legacy Repository CI Dependency

- Severity: `medium`
- Disposition: `resolved`
- Affected: workspace meta repository
- Impact: official validation retained an active dependency on legacy
  `cadenza-service` documentation and could make legacy state appear current.
- Evidence: `.github/workflows/docs-mirror-check.yml` invoked
  `scripts/check-docs-mirror.sh`, whose source of truth was
  `cadenza-service/docs`.
- Repair: removed the workflow and script. Historical legacy documentation is
  not made authoritative by CI.
- Verification: no retained workflow or active script references the deleted
  mirror check.

### SEC-004: Developer-Specific .NET Invocation Paths

- Severity: `medium`
- Disposition: `resolved`
- Affected: `cadenza-csharp`
- Impact: validation depended on one developer's private tool path and could
  conceal an unreviewed SDK selection on another machine.
- Repair: replaced absolute invocations with `dotnet` in the repository README
  and agent contract.
- Verification: restore, format, Release build, and 38 tests pass through the
  PATH-resolved SDK with zero warnings.

## Low

### SEC-005: Deprecated Test Runner Dependency

- Severity: `low`
- Disposition: `resolved`
- Affected: `cadenza-csharp`
- Impact: the C# test surface depended on deprecated xUnit v2 packages, which
  increases maintenance and future security-update risk.
- Repair: migrated to xUnit v3 and current test/coverage packages in
  `cadenza-csharp/tests/Cadenza.Tests/Cadenza.Tests.csproj:3`.
- Verification: NuGet reports no vulnerable or deprecated dependency; all 38
  tests pass.

### SEC-006: Untrusted Context Merge Lacked Explicit Hostile Regression

- Severity: `low`
- Disposition: `resolved`
- Affected: `cadenza`
- Impact: a future dependency or merge change could reintroduce prototype
  pollution through squashed signal contexts.
- Repair: dependency upgrades include patched merge behavior; added a hostile
  `__proto__`/`constructor.prototype` signal-squash test at
  `cadenza/tests/unit/async-graph.test.ts:379`.
- Verification: the target test passes and confirms neither `Object.prototype`
  nor delivered context inherits the hostile field.

## Informational Results

### SEC-007: Secret And Private-Material Scan

- Severity: `informational`
- Disposition: `not_a_defect`
- Current-tree result: no confirmed secret across official repositories.
- History result: no confirmed secret in the existing TypeScript or workspace
  histories.
- Triage: Environment, Chamber, and Cell detector alerts were deterministic
  Cadenza identifiers. Five Cell alerts were generated Rust metadata under
  `target/`, not source. Explicit test passwords are marked fixture values.
- Control: publication must scan clean candidate histories and artifacts again;
  build output is excluded from source SBOM and publication scope.

### SEC-008: PostgreSQL Elevated Function Posture

- Severity: `informational`
- Disposition: `not_a_defect`
- Result: reviewed `SECURITY DEFINER` functions set `search_path` to
  `pg_catalog`; owned objects are schema-qualified; public function/schema
  access is revoked and exact execution is selectively granted.
- Evidence: representative function and grants at
  `cadenza-environment/packages/environment-bootstrap/migrations/002_runtime_authority.sql:220`.
- Control: migrations are transactional, eliminating the create/revoke exposure
  window under the supported exclusive administrative migration assumption.

### SEC-009: Dependency And License Results

- Severity: `informational`
- Disposition: `not_a_defect`
- npm: zero known vulnerability in all four Environment packages and the
  Chamber TypeScript adapter.
- Yarn: zero known vulnerability after SEC-001.
- Cargo: zero known vulnerability in Chamber and Cell.
- Hex: no retired package; one Apache-2.0 dependency (`jason`).
- NuGet: zero vulnerable or deprecated package after SEC-005.
- Python: no third-party runtime dependency.
- Licenses: reviewed dependency metadata is compatible with the Apache-2.0
  release posture; copyleft-like alternatives occur only in permissive `OR`
  expressions, while MPL-2.0 is confined to TypeScript development tooling.

## Accepted Security Limits

1. The Node VM context is defense in depth, not containment. Production
   execution of untrusted source requires the measured Linux/gVisor Cell path.
2. gVisor does not eliminate hardware side channels and protects only resources
   excluded from the sandbox. Host kernel, firmware, network policy, and cgroup
   operation remain deployment responsibilities.
3. Purpose-separated PostgreSQL credentials currently use NoTLS only over an
   explicit local Unix socket or loopback host. Remote database transport is not
   supported by the Cell host contract.
4. An active host root, database superuser, launcher, signing key, or enrolled
   peer-key compromise remains outside its subordinate boundary. Revocation
   limits future affect but cannot undo prior authorized affect.
5. Resource limits bound one Chamber and several internal stores; aggregate
   capacity and hostile multi-tenant admission remain operator concerns.
6. Exact commit binding and public unauthenticated clone repetition remain
   Sprint 9E and Sprint 9F release gates.

## Current Verdict

No unresolved critical or high finding remains. Supported deployment
assumptions are documented, and the fresh Linux/gVisor proofs passed against
the same Sprint 9C candidate source. Security is ready for the Sprint 9C
closure gate; Sprint 9E must bind these results to exact clean commits and
Sprint 9F must repeat them from public unauthenticated clones.
