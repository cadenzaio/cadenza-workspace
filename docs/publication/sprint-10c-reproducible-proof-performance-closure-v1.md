# Sprint 10C Reproducible Proof And Performance Closure V1

Date: 2026-07-27

## Verdict

Sprint 10C is complete. Cadenza now has one declared fast, complete, and
privileged proof harness, plus a separate performance interpretation path that
uses distributions and advisory runtime-specific budgets instead of
machine-sensitive correctness thresholds.

The strongest privileged run rebuilt the runtime from clean archived commits,
created separate fresh PostgreSQL authority for both scenarios, passed the
contained protocol preflight, completed both distributed scenarios, and
removed every measured proof resource.

## Implemented Boundaries

- `proof/manifest.json` owns tier membership, pinned privileged substrate
  expectations, and timeout declarations.
- `scripts/run-proof.mjs` owns report-oriented orchestration and exact source
  identity capture.
- privileged fixture credentials exist only in one generated root-owned
  `0600` file; the process environment carries only its path.
- privileged failures report a non-secret phase, source line, and exit status.
- each long scenario receives a fresh PostgreSQL cluster, generated roles, a
  short owned socket path, and a neutral delegated systemd unit.
- Core benchmark workers still measure completed operations in isolated
  processes; collection, aggregation, and advisory review are separate tools.
- performance excursions return `review_required` and do not fail the
  correctness suite.

## Privileged Proof

The final run used Linux `6.8.0-136-generic` on ARM64, Node `24.18.0`, Rust
`1.97.0`, PostgreSQL `16.14`, and the pinned `runsc` digest.

| Scenario                                                     | Result | Duration |
| ------------------------------------------------------------ | ------ | -------: |
| two real Cells converge from database authority              | passed |    376 s |
| desired replica state supplies, replaces, and releases Cells | passed |    344 s |

The complete proof duration was 826 seconds. It reproduced:

- fresh authority genesis and migration;
- exact Cell/Chamber protocol compatibility;
- distributed reference execution across two Cells;
- sender-side selection across two target replicas;
- supply outage without false absence;
- provider-generation replacement and fresh Cell generations;
- post-restart execution and scale-down.

Cleanup and a separate host-side residue audit found zero retained containers,
bundles, Cadenza cgroups, temporary clusters, credential files, proof sockets,
proof workspaces, or Cadenza processes.

The privileged report binds Core runtime digest
`sha256:26b4f78288e0a15a749af46af7524f3446b64292f4f9843ecb14c0947417bdf0`.
The later Core performance-only commits do not change runtime source or output;
the current fast and complete proofs reproduced the same digest through the
exact reference consumer.

## Performance Review

Three full timing runs and three full retained-memory runs were collected from
clean Core commit `5cb3104` on the named Apple M1 Pro, macOS `25.5.0`,
Node `24.18.0` runtime.

Observed maximum p95 latency ranged from `0.076 ms/op` for one boundary task
to `3.934 ms/op` for the structural retry lifecycle. Retained-heap maxima were
`123856` bytes for graph work, `223440` bytes for signal work, and `145312`
bytes for retry work. Maximum later-batch slopes were `21.312`, `22.56`, and
`-13.768 B/op` respectively.

The reviewed budget:

- requires the exact named runtime and at least three runs;
- gives timing measurements at least 50 percent headroom;
- uses wider retained-memory envelopes for garbage-collection variance;
- evaluates timing and memory independently;
- reports incompatible machines rather than applying a false comparison;
- is development regression evidence, not an SLA.

Both collection reviews returned `within_budget`.

## Defects Exposed

The new harness exposed and repaired five proof-custody defects:

1. root execution could see Rust binaries but not the pinned user toolchain;
2. three Cell tests bypassed the protected fixture config for the rootfs path;
3. PostgreSQL socket path length and socket-directory ownership were invalid;
4. a global restrictive umask prevented deliberately dropped runtime
   identities from traversing non-secret Cargo build artifacts;
5. command evidence expanded and retained an absolute workstation path instead
   of the declared workspace placeholder.

Each failure occurred before a false successful claim. Cleanup passed on every
failed attempt. The final design keeps secrets explicitly restricted while
allowing non-secret runtime artifacts to serve the identities that must
execute them.

## Validation

- fast proof: 7/7 steps passed in 25.4 seconds;
- complete proof: 30/30 steps passed in 328.5 seconds;
- privileged proof: protocol preflight and 2/2 scenarios passed;
- Core: 148 tests, format, typecheck, build, TypeDoc, package smoke, benchmark
  check, benchmark smoke, and zero-vulnerability audit passed;
- Python: 76 tests on both pinned Python versions and identical wheel output;
- Elixir: 61 tests, audit, compile, format, and package smoke passed;
- C#: 38 tests, dependency review, build, format, and package smoke passed;
- Environment: 112 tests, build, typecheck, audit, and package smoke passed;
- Chamber and Cell repository validation passed;
- exact reference consumer: 9 tests and artifact digest
  `sha256:f128946cba37e65eb77d7f0c81182798cf603a7a0aaa2cf96c15e96f566fbeb2`.

## Evidence

| Artifact                                                              | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [fast proof](evidence/sprint-10c/fast-proof.json)                     | `7bbdc7f55d932b520e4a3898676e0e426a27d7227d91c3a74ef25d5d48f8d823` |
| [complete proof](evidence/sprint-10c/complete-proof.json)             | `dd1917b738f9c4db6376a57e67ae30ce3fcac0fe245897c60a539fb60e9b9b9e` |
| [privileged proof](evidence/sprint-10c/privileged-proof.json)         | `b0af13380f5d6ff33b8def7240d407b7261e712afa14c3abad7f1b94149247bb` |
| [timing collection](evidence/sprint-10c/core-collection.json)         | `e8cd4b3d9619adff08a63b09882a1572ad197dd140cb0e9eea9c13ecd1dc718b` |
| [memory collection](evidence/sprint-10c/memory-collection.json)       | `b959e68307a511bc01c874d49444890b9d7696041cc24e38d9fd1a4011dcf61d` |
| [timing budget review](evidence/sprint-10c/core-budget-review.json)   | `ef06c79affc15516853d6084ac60ac478b7f9f08af7d67ffecbdad513786b528` |
| [memory budget review](evidence/sprint-10c/memory-budget-review.json) | `1cdbd5593ab3c5ca75662ec4a20f3a0c6809419bfd2304b682ae08424d313394` |

## Coherence Review

- **Whole:** the harness reduces accidental validation and operational
  complexity so contributors can focus on runtime and business behavior.
- **Identity:** every report binds source commits, runtime identity, manifest,
  measured artifacts, and scenario names.
- **Boundary:** Core owns benchmark semantics; the workspace owns cross-repo
  proof; Cell owns privileged runtime assertions.
- **Authority:** fresh database authority and generated credentials replace
  hidden workstation state.
- **Time:** timeout declarations bound waiting, while result records and
  cleanup distinguish completed work from mere elapsed time.
- **Pressure:** fast checks remain small; long privileged proof is explicit and
  cannot become the first ordinary detector.
- **False success:** dirty privileged source, stale rootfs, incompatible
  protocol, authority bootstrap failure, runtime mismatch, and cleanup residue
  all fail or request review explicitly.

The remaining concern is cost: the privileged proof currently takes about
fourteen minutes and recompiles some Rust targets across custody boundaries.
That is accepted because optimizing it without weakening source, process, or
identity isolation requires its own evidence.

## Limits And Next Gate

- host root and the Linux substrate remain trusted;
- gVisor is measured containment, not hardware attestation;
- the scenarios are representative, not combinatorially exhaustive;
- the performance budget applies only to its named maintainer runtime.

Sprint 10D is next. Its parent scope is approved, but the exact bounded failure
matrix, security-review ownership, and stop conditions require a focused
execution design before implementation.
