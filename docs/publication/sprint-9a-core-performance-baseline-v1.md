# Sprint 9A Core Performance Baseline V1

Date: 2026-07-21

## Status

- Baseline: complete.
- Purpose: characterize completed core-runtime work after replacing the invalid
  default-suite performance tests.
- Performance promise: none. This is machine-specific evidence, not a release
  budget or CI gate.
- Heap snapshots: disabled for every run.

## Method

Each scenario ran in a fresh Node process with a non-retaining reporter that
validated monotonically exact execution-report sequences and immediate custody
receipts. Timing began only after warmup. Every operation awaited graph or
observer completion and runner cleanup.

Timing scenarios used seven samples. One-task, signal, and retry samples each
contained 100 completed operations; ten-task samples contained 50. Reported
latency is elapsed batch time divided by completed operations, so it is a
batch-normalized per-operation measure rather than intrusive timing around each
operation.

Memory scenarios used 50 warmup operations followed by eight batches of 200
completed operations. Two forced garbage collections preceded every retained-
heap sample. The later slope is a linear regression over the final four
batches.

## Environment

| Property | Value |
| --- | --- |
| Node | `v24.14.1` |
| V8 | `13.6.233.17-node.44` |
| Operating system | Darwin `25.5.0` |
| Architecture | `arm64` |
| CPU | Apple M1 Pro, 10 logical CPUs |
| Core revision | `bba46d3bf67a935b5577b690b8e56a4b8e42d87f` plus the documented uncommitted Sprint 9A amendment |

No workload overrides were used. Runs were sequential on the same otherwise
idle development machine.

## Timing Results

Cells show `operations/second; median ms; p95 ms` for runs 1, 2, and 3.

| Scenario | Profile | Run 1 | Run 2 | Run 3 |
| --- | --- | ---: | ---: | ---: |
| One-task graph | structural | `16029; 0.058; 0.088` | `16386; 0.059; 0.079` | `16228; 0.059; 0.084` |
| One-task graph | boundary | `19574; 0.048; 0.076` | `19984; 0.049; 0.070` | `20228; 0.048; 0.065` |
| Ten-task graph | structural | `3033; 0.318; 0.375` | `3055; 0.328; 0.365` | `3042; 0.314; 0.383` |
| Ten-task graph | boundary | `6896; 0.133; 0.228` | `6993; 0.135; 0.215` | `7179; 0.132; 0.190` |
| Observed signal | structural | `9444; 0.105; 0.132` | `9769; 0.100; 0.129` | `9394; 0.107; 0.135` |
| Observed signal | boundary | `11887; 0.086; 0.104` | `11945; 0.083; 0.103` | `11658; 0.086; 0.115` |
| Two-retry graph | structural | `306; 3.373; 3.729` | `302; 3.440; 3.735` | `303; 3.525; 3.698` |
| Two-retry graph | boundary | `303; 3.281; 4.425` | `305; 3.367; 3.487` | `301; 3.450; 3.655` |

Evidence counts were identical across all three runs for each scenario. For
example, the ten-task structural workload produced 16,606 reports and 8,308
custody barriers, while its boundary profile produced 1,981 reports and 808
barriers. Boundary evidence therefore reduces structural graph work as
intended. Retry timing is dominated by the current retry scheduling lifecycle,
so its lower evidence volume does not produce the same timing difference.

## Memory Results

Cells show `retained MiB; peak MiB; later slope bytes/operation`.

| Scenario | Run 1 | Run 2 | Run 3 |
| --- | ---: | ---: | ---: |
| Ten-task graph | `0.103; 18.55; 36.3` | `0.103; 18.54; 36.3` | `0.104; 18.57; 36.3` |
| Observed signal | `0.220; 15.11; -8.2` | `0.168; 15.19; -8.9` | `0.218; 15.09; -8.9` |
| Two-retry graph | `0.148; 16.97; -11.2` | `0.148; 16.98; -12.7` | `0.148; 17.10; -11.2` |

Signals and retries plateau after warmup. The default ten-task graph sample had
a small repeatable positive later slope, so an additional diagnostic ran 200
warmup operations and 16 batches of 1,000 completed graphs. Across 16,000
measured runs, retained heap was 162,128 bytes and the later-eight-batch slope
fell to 3.30 bytes per operation, with post-GC heap samples settling around
11.6 MB. This does not demonstrate workload-linear graph retention. It remains
worth tracking after publication, especially when dedicated performance CI or
long-lived Chamber workloads are introduced.

RSS rose during the extended diagnostic while post-GC V8 heap remained flat.
RSS is allocator/process behavior and is not interchangeable with reachable
JavaScript heap.

## Evaluation

- The old failures did not establish a core performance defect. They measured
  unfinished shared runtime work, retained reports by design, and automatic
  snapshots.
- The replacement workloads complete with exact conclusions, observer effects,
  evidence sequence, custody, and cleanup.
- The three timing runs are sufficiently consistent to serve as a local
  reference, but not as a portable absolute threshold.
- No measured scenario shows an actionable retained-heap leak after extended
  warmup.
- No throughput, latency, or memory budget is adopted in Sprint 9A. A budget
  needs a pinned runner, repeated historical samples, and an agreed tolerance
  for machine and runtime variance.

## Raw Evidence

- [Core run 1](evidence/sprint-9a-performance/core-baseline-1.json)
- [Core run 2](evidence/sprint-9a-performance/core-baseline-2.json)
- [Core run 3](evidence/sprint-9a-performance/core-baseline-3.json)
- [Memory run 1](evidence/sprint-9a-performance/memory-baseline-1.json)
- [Memory run 2](evidence/sprint-9a-performance/memory-baseline-2.json)
- [Memory run 3](evidence/sprint-9a-performance/memory-baseline-3.json)

The JSON files include every sample, operation count, elapsed value, evidence
count, runtime field, and retained-memory batch.
