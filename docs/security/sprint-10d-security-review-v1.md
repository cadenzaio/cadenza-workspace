# Sprint 10D Security Review V1

Date: 2026-07-28

## Status

- Manual review: complete.
- Automated candidate review: complete.
- Finding repair: complete.
- Final complete and privileged proof binding: passed.

This is a maintainer technical review, not an independent security audit.

## Executive Judgment

No unresolved critical or high-severity finding was identified. One
medium-severity privileged descriptor-custody defect was found and repaired in
`cadenza-cell@89e6e54`. The repair has a Linux regression that observes actual
descriptor closure and passes the repository's warnings-denied Clippy gate.

The post-RC routing, supply restart, actor API, documentation isolation, and
proof-harness changes do not widen authority. Their main residual cost is
operational: fail-closed states remain explicit and must be interpreted
correctly. Sprint 10E should improve that interpretation without weakening the
states.

## Review Scope

- Workspace proof inputs, reports, workflows, SBOMs, public/private boundaries,
  release provenance, and generated credential cleanup.
- Core actor construction, callable/definition boundary, package contents,
  dependency graph, benchmark posture, and TypeDoc isolation.
- Environment elevated PostgreSQL functions, role grants, idempotency,
  revisions, evidence bounds, reconciliation, and actor mutation outcomes.
- Chamber unsafe boundaries, parsers, artifact and path closure, process
  supervision, sender selection, evidence capture, and residency fencing.
- Cell unsafe boundaries, descriptors, launcher cleanup, path and symlink
  handling, key purposes, peer replay, provider custody, routing, journals, and
  diagnostics.
- Unchanged Python, Elixir, C#, and reference-system dependency, packaging,
  conformance, secret, and license posture.

## Finding

### SEC-10D-001: Rejected Launcher Packet Retained Received Descriptors

- Severity: `medium`
- Coherence impact: `boundary`
- Disposition: `resolved`
- Affected repository: `cadenza-cell`
- Affected obligation: `FCS-10`

The root-owned launcher called `recvmsg` and did not convert received
`SCM_RIGHTS` descriptors to `OwnedFd` until after JSON parsing,
canonicalization, and command validation. A peer that had already passed the
Cell UID/GID boundary could repeatedly send malformed packets with descriptors.
Each rejected packet could retain the launcher's received descriptor copies and
eventually deny launcher service.

Commit `89e6e54` now adopts every readable descriptor immediately after
`recvmsg`, before truncation or payload validation. All later errors therefore
drop the `OwnedFd` values. The control-message parser also bounds its read by
the actual returned control buffer before constructing descriptor ownership.

The regression
`launcher_service::tests::malformed_packet_closes_transferred_descriptors`
passes a pipe descriptor with malformed JSON, drops the sender's copy, and
asserts EOF on the read side. It would observe `EAGAIN` if the privileged
launcher retained the received write descriptor.

Verification:

- pinned Rust `1.97.0` Linux regression: `1` passed;
- Linux `cargo clippy --locked --all-targets --all-features -- -D warnings`:
  passed;
- Linux library tests: `76` passed;
- the broader bare-Rust-image test run reached the new test but one unrelated
  Chamber protocol integration failed because that image has no Node runtime.
  The declared complete proof uses the repository validation environment and
  remains the authoritative full-suite result.

## Automated Review

### Dependency And Retirement Checks

| Surface | Result |
| ------- | ------ |
| TypeScript Core | `yarn audit --level high`: zero vulnerabilities across 289 packages |
| Environment | All three package audits: zero vulnerabilities |
| Chamber adapter | npm audit: zero vulnerabilities |
| Chamber Rust | `cargo audit`: zero vulnerabilities across 44 locked crate dependencies |
| Cell Rust | `cargo audit`: zero vulnerabilities across 164 locked crate dependencies |
| Elixir | `mix hex.audit`: no retired dependency |
| C# | Pinned .NET SDK reports no vulnerable or deprecated package |
| Python | No third-party runtime dependency; build requirement is pinned to `setuptools==83.0.0` |

Core license metadata contains permissive MIT, ISC, Apache-2.0, BSD, 0BSD,
BlueOak, Python-2.0, and MPL-2.0 licenses. MPL-2.0 remains confined to
development tooling. The post-RC dependency changes introduce no
release-incompatible license. Other dependency graphs are unchanged from the
RC1 license review.

### Secret Scan

Gitleaks `8.30.1` scanned every reachable `HEAD` history:

| Repository | Detector alerts | Confirmed secrets |
| ---------- | --------------- | ----------------- |
| Workspace | 4 | 0 |
| Core | 0 | 0 |
| Python | 0 | 0 |
| Elixir | 0 | 0 |
| C# | 0 | 0 |
| Environment | 5 | 0 |
| Chamber | 10 | 0 |
| Cell | 27 | 0 |
| Reference system | 0 | 0 |

Every alert was manually triaged as a deterministic Cadenza identity or digest,
including generation, idempotency, reconciliation-plan, peer-envelope, and
release-key test values. No credential, private key, token, or payment/contact
identifier was found.

### SBOM And License Input

Syft `1.49.0` regenerated all seven source CycloneDX SBOMs. Dependency
inventories stayed stable. The Core SBOM changed only because reviewed workflow
and `yarn.lock` source hashes advanced after RC1; no hidden dependency edge was
introduced.

The downloaded Gitleaks and Syft Darwin arm64 archives were checked against
their published checksums before use.

### CI And Provenance

- Every retained GitHub Actions `uses:` value is pinned to a 40-character
  commit SHA.
- Every workflow declares explicit token permissions.
- Current post-publication workspace, Core, Environment, Chamber, Cell, and
  reference-system heads verify with the dedicated Ed25519 commit key.
- The unchanged Python, Elixir, and C# RC1 commits predate commit signing, carry
  DCO sign-off, and remain bound by the verified signed RC1 tags and detached
  release signatures. Current governance does not claim every historical
  commit is cryptographically signed.
- Privileged proof accepts only clean Git archives, binds the proof manifest
  digest and source commits, and now records whether the ordinary or hardening
  profile ran.

## Manual Review Results

### Core

Actor constructors now keep implementation classes internal and expose only
the intended factories and definitions. Core remains persistence- and
placement-agnostic. TypeDoc builds in an isolated dependency context and does
not reintroduce runtime authority. Benchmark thresholds remain advisory and do
not silence correctness failures.

### Environment

All 139 `SECURITY DEFINER` functions are schema-qualified and bind
`search_path` to `pg_catalog`. Migrations retain revoke-first, exact-grant,
transactional application. Hostile role tests cover direct tables, wrong
purpose roles, broad residency mutation, actor role separation, and execution
evidence readers/appenders. Stale and conflicting idempotency paths assert no
mutation.

### Chamber

The production unsafe surface remains limited to fixed inherited descriptor
adoption after argument validation. Frame reads, JSON, stderr, result sizes,
source files, declared artifacts, dependencies, route groups, and sender
selection state are bounded. Route selection resets on epoch advance. Replaced,
undeclared, or symlinked artifacts fail before adapter process start. Evidence
custody distinguishes pre-start rejection from post-start uncertainty.

### Cell

Unsafe calls remain narrow libc or fixed-descriptor boundaries with ownership
transferred immediately into Rust types. Filesystem and journal paths reject
symlinks, ownership drift, mutable root-owned configuration, inode replacement,
and incomplete corruption outside the one allowed final-frame recovery case.
Peer transport rechecks generation and assignment before the proceed boundary.
Supply restart and withdrawal preserve exact generation and directive custody.
The launcher descriptor gap found during this review is repaired.

## PostgreSQL And Failure-Custody Composition

The assertion-level mapping is
[Sprint 10D Failure And Custody Coverage V1](sprint-10d-failure-coverage-v1.md).
It finds no need for another privileged scenario or a combinatorial outage
matrix. The three existing system scenarios compose the local controls across
real PostgreSQL, Cell, Chamber, gVisor, provider restart, route replacement,
actor reassignment, stem loss, resupply, and cleanup.

## Accepted Limits

The current
[Known Security Limitations V1](known-security-limitations-v1.md) remain
accurate. In particular:

- Node VM is defense in depth, not containment;
- host root, active database superuser, active signing key, and reviewed
  `runsc` remain trusted;
- PostgreSQL transport is local-only;
- automatic key rotation and aggregate hostile admission are not implemented;
- prolonged authority or evidence outage can intentionally stop work;
- automated detectors cannot prove absence;
- the project remains single-maintainer and does not claim independent review.

No accepted limit contradicts a current supported claim.

## Closure Verdict

- Fast proof: 7/7 passed.
- Complete proof: 30/30 passed.
- Privileged hardening: 3/3 scenarios passed from separate fresh authority
  clusters.
- Privileged cleanup: zero retained container, bundle, cgroup, temporary
  cluster, or credential-file custody.
- Repaired Cell commit `89e6e54` and reviewed workspace commit `d1036b9` are
  cryptographically signed.
- Seven SBOMs were regenerated with Syft `1.49.0`.

No unresolved critical, high, medium, or low security finding remains in the
approved Sprint 10D scope. The review is closed with the accepted limitations
above and the existing advanced-security track unchanged.
