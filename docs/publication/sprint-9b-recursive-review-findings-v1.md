# Sprint 9B Recursive Review Findings V1

Date: 2026-07-21

## Scope

This ledger covers the TypeScript, Python, Elixir, and C# cores; Environment;
Chamber; Cell; shared contract snapshots; package surfaces; and publication
governance prepared during Sprint 9B. Findings are dispositions, not an
unprioritized backlog.

## Must Fix: Closed

| Finding | Repair and evidence |
| --- | --- |
| Shared meaning depended on copied fixtures without one machine-checked authority | Declared six snapshot bundles in `contracts.config.json`; synchronization and drift checks pass. |
| C# lacked complete actor, graph-conclusion, specialized-task, schema, and execution-evidence parity | Implemented the missing contract surface, hid mutable internals, and added conformance and hostile-boundary tests. |
| Invalid concurrency, timeout, retry, and delay values could enter core task definitions | TypeScript, Python, and C# now reject invalid numeric policy at definition time; Elixir's existing guards remain authoritative locally. |
| C# retry logic reserved ordinary business-result keys | Retry now follows idiomatic exception failure; `failed` and `errored` remain valid business context keys. |
| A generated Environment artifact version change left dependent bootstrap digests stale | Rebuilt the authority gateway and regenerated its owning fixture; exact digest verification passes. |
| Cell source tests reached outside the repository for generated gateway bytes | Added a governed repository-local artifact snapshot with Environment as authority and Cell as consumer. |
| Rust package discovery included adapters, tests, docs, and build-support files by default | Bounded Chamber and Cell crate manifests to runtime source, contracts, lockfile, README, and license. Chamber now packages 36 files and verifies from the crate. |
| Automatic release automation could publish on an ordinary main-branch push | Removed ambient semantic-release publication; every repository now states the separately gated release procedure. |
| Release identity, licensing, support, and contribution posture were inconsistent or absent | Applied approved prerelease versions, Apache-2.0, DCO guidance, security/support/release policies, CODEOWNERS, templates, and CI. |
| Current docs retained legacy sprint labels, stale runtime wording, obsolete CLI/runtime claims, and inaccurate ownership descriptions | Rewrote public READMEs and current contract wording; retained historical closure records only where they preserve decision evidence. |
| TypeScript retained dead legacy runtime, CLI, routine, exporter, debug, and compatibility surfaces | Removed them and their obsolete tests/exports; retained code now belongs to the core primitive and local-execution boundary. |
| Public mutable C# collections allowed callers to mutate graph topology and runtime bindings outside governed APIs | Exposed read-only views and restricted mutation to internal runtime operations. |

## Accepted Limits

| Limit | Reason and control |
| --- | --- |
| TypeScript graph contexts are mutable values | Core is not a security boundary. Chamber validates and contains materialization and execution; docs no longer imply frozen contexts. |
| Chamber serializes business execution | This is the approved correctness baseline. Concurrency remains a separate optimization pass after the first environment. |
| Chamber and Cell system tests require an assembled release workspace | They deliberately verify exact built core, adapter, and Environment artifacts rather than substitutes. CI assembles the same shape. |
| Linux gVisor claims cannot be re-proved on this macOS host | Claims are limited to the recorded measured Linux profile; Sprint 9C owns fresh clean Linux reproduction. |
| Cell's crate cannot be prepared for crates.io before Chamber exists there | This is the correct dependency order. Registry publication remains separately gated, so no dependency was weakened or faked. |
| Environment currently provides PostgreSQL materialization | Core remains persistence-agnostic and Environment owns the adapter boundary. Additional adapters must prove a need. |
| Performance thresholds are not correctness gates | Sprint 9A replaced unreliable unit thresholds with isolated benchmarks. Sprint 9C will rerun the pinned release-candidate baseline with machine context. |

## Post-Publication Work

- Chamber execution concurrency optimization.
- Additional language adapters and full core languages only when language fit
  proves a benefit.
- Memory as the first official plugin.
- Read-only system observer UI, followed later by the managed UI and agent
  experience.
- CLI and host-agent integration under a future approved boundary.
- Additional persistence and deployment adapters.

## Not Defects

- TypeScript `4.0.0-rc.1`, Python `0.1.0rc1`, and the other
  `0.1.0-rc.1` versions are intentionally independent and use ecosystem-native
  prerelease syntax. Compatibility belongs to the future release manifest.
- Package versions and protocol/contract versions are separate identities.
- JSON is the canonical interchange and fixture form, not an implementation
  requirement for internal language state.
- Language-local retry and callable expression may be idiomatic where the
  portable outcome and conformance fixtures remain equal.
- TypeScript `benchmark:memory` measures process heap and is unrelated to the
  deferred Memory plugin.

## Publication-Time Decisions Still Required

- Confirm a private, monitored code-of-conduct reporting channel. No
  unverified email address was invented.
- Approve repository creation, clean-history construction, branch protection,
  DCO enforcement, legacy notices/archival, tags, and GitHub publication at
  the later explicit gates.
- Approve package-registry publication separately after clean public clones
  reproduce the release.

## Verdict

No unresolved `must_fix` or whole-breaking finding remains in Sprint 9B. The
accepted limits are explicit, bounded, and assigned to later approved gates.
