# Sprint 9C Performance Baseline V1

Date: 2026-07-22

## Posture

This is a diagnostic baseline, not a correctness gate or a machine-independent
performance promise. Each scenario ran in a fresh Node process after the Linux
gVisor VM was stopped. The container was bounded to four CPUs and 4 GiB of
memory.

Runtime: Node `24.18.0`, V8 `13.6.233.17-node.50`, LinuxKit
`6.12.76-linuxkit`, ARM64. Git was intentionally absent from the measurement
container, so the structured reports record source identity as `unavailable`.
The measured tree was the current dirty Sprint 9C candidate; Sprint 9E must
repeat this against a clean commit.

## Timing Observations

| Scenario | Evidence profile | Operations/second | Median ms/op | p95 ms/op |
| --- | --- | ---: | ---: | ---: |
| one task | structural | 9,964.2 | 0.103 | 0.129 |
| one task | boundary | 11,877.1 | 0.083 | 0.118 |
| ten tasks | structural | 1,935.6 | 0.509 | 0.598 |
| ten tasks | boundary | 4,251.0 | 0.218 | 0.346 |
| signal | structural | 7,349.1 | 0.137 | 0.173 |
| signal | boundary | 9,641.1 | 0.104 | 0.140 |
| retry lifecycle | structural | 167.6 | 5.937 | 6.365 |
| retry lifecycle | boundary | 162.3 | 6.244 | 6.350 |

The retry scenarios deliberately include the configured retry delay. Relative
profile ordering is not interpreted as a general rule from one run.

## Heap Observations

| Scenario | Completed operations | Retained delta | Later slope | Peak heap |
| --- | ---: | ---: | ---: | ---: |
| graph | 1,600 | 0.12 MiB | 22.8 B/op | 18.95 MiB |
| signal | 1,600 | 0.16 MiB | -9.5 B/op | 15.51 MiB |
| retry | 1,600 | 0.14 MiB | -17.7 B/op | 17.62 MiB |

This bounded run does not establish or disprove a memory leak. It does show no
runaway retained growth in the measured workload and provides a named point
for clean-commit comparison.

## Evidence

- `evidence/sprint-9c-core-benchmark.json`, SHA-256
  `634fd5487fa11837e50b05471988b6f386588fa78a0c9b2b3d5ec310cedb3c0d`.
- `evidence/sprint-9c-memory-benchmark.json`, SHA-256
  `033788ff8828e55bc8e4e49c165c0607513558dc9183f06136e2cae1048afe2e`.

The full samples, evidence counts, workload sizes, runtime metadata, RSS, and
external-memory observations live in those structured reports.
