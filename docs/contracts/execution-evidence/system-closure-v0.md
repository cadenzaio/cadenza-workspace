# Sprint 6D Realtime Execution Evidence System Closure V0

Date: 2026-07-17

Status: accepted by the user on 2026-07-17.

## Verdict

Sprint 6D satisfies its approved semantic-reporting, chamber-observation,
cell-custody, distribution-identity, meta-processing, immutable-ledger,
compaction, disclosure, and two-cell system scope.

The graph remains about coordination rather than result storage. Business
authors provide intended function and logical flow; execution identities,
custody, retry, distribution, persistence, compaction, and projection remain
below that surface. PostgreSQL can disappear while admitted work continues
under bounded local custody, then recover without changing business behavior.

Coherence judgment: `pass for Sprint 6D`.

## Measured System Scenario

The final Linux proof launched two real cells and their source, target, audit,
and per-cell evidence-processor chambers in gVisor `systrap` sandboxes. Before
business work began, the dedicated PostgreSQL ledger role was changed to
`NOLOGIN`.

While the ledger was unavailable:

- remote inquiry/delegation, detached signal routing, authority refresh, and a
  second inquiry completed successfully.
- source and target journals durably recorded execution and distribution
  evidence.
- the immutable ledger remained unchanged.
- each processor retained the exact oldest unacknowledged batch and retried
  with bounded exponential delay and a fresh trace, ingress, and idempotency
  identity per delivery attempt.

After ledger login was restored:

- both cells appended their signed batches and processing-attempt chains.
- exact receipts acknowledged the same batch roots.
- every committed batch received a completion boundary.
- each journal published a canonical signed compaction checkpoint before
  deleting its acknowledged prefix.
- no sealed segment or acknowledgement at or before the checkpoint boundary
  remained resident.
- checkpoint size stayed below 2 MiB, segment size below 16 MiB, sidecars below
  64 KiB, and total resident journal state below 32 MiB per cell.

The proof then suspended the target cell. A later delegation failed as
`transport_failed` before target execution, preserving the approved
started-state rule. Both cells and launchers shut down and cleaned up.

## Failure-Authority Repair

The closure scenario found one real cross-layer defect. The PostgreSQL provider
correctly classified a login outage as `HostUnavailable`, but the private
cell-to-chamber protocol decoded every host rejection as
`AdapterProtocolInvalid`. The capability facade consequently reported
`capability_denied`, and the processor quarantined a retryable batch.

The repair establishes one explicit wire mapping for every
`ChamberFailureCode`. Known codes retain their meaning across the trusted host
boundary; unknown codes fail closed as protocol-invalid. A separate regression
proves that a transient capability failure crossing an authored inquiry graph
still returns `transport_failed`. Hostile unknown-code and complete code
round-trip tests protect the boundary.

Retry delivery and ledger authority are now deliberately separate:

- every delivery attempt has fresh execution, ingress, and idempotency
  identities, so a previous transient signal outcome cannot be replayed as the
  new attempt.
- the immutable batch root remains the durable append idempotency authority,
  so an unknown commit can be retried without duplicating ledger truth.

## Security And Disclosure Review

- database credentials remain cell-owned descriptor inputs. They do not enter
  chamber images, callable context, facade payloads, journals, or ledger rows.
- journal files and every stored ledger payload class were recursively checked
  with the database forbidden-field predicate.
- byte-level scans found no runtime or ledger credential, database URL, peer
  endpoint, initiating subject, runtime principal, business `order_id`, or
  callable-source marker in either journal or the aggregated ledger payloads.
- capability operations remain fixed generated facades backed by typed host
  providers and literal PostgreSQL functions. No general SQL, filesystem,
  network, environment, or arbitrary host-operation surface was added.
- unknown host failure codes are rejected rather than interpreted by message
  text. Retry policy consumes the normalized code, not a string heuristic.
- evidence processors remain `meta_support` with processing evidence disabled.
  Their boundary consequences are recorded without recursively processing
  their own task-level evidence.

The user-requested mature-system security review remains a later gate after
more runtime and orchestration behavior exists; this closure does not replace
it.

## Operational Complexity Review

The final implementation has one failure vocabulary from provider through
cell host, chamber facade, adapter outcome, and processor policy. The outage
defect demonstrated why failure classification is authority rather than
diagnostic text. No layer may flatten a retryable provider state into a
permanent denial.

Operational state remains bounded and local:

- one processor worker and one oldest-batch claim per cell.
- one retry schedule capped at 30 seconds.
- one signed journal/checkpoint authority before the central ledger.
- one immutable append and one rebuildable projection family in PostgreSQL.
- no environment-wide processor, generic queue, second evidence protocol, or
  business-facing storage concern.

Strict Clippy found no unused implementation. Scans found no temporary debug
output, deferred implementation markers, or generic fallback in the repaired
paths. The additional failure-code mapping serves the host protocol directly
and is protected by boundary tests.

## Coherent Creation Review

- **Intended whole:** evidence lets humans and agents understand real execution
  without asking business authors to model observability infrastructure.
- **Identity:** trace, graph, task, inquiry, signal, distribution attempt,
  custody record, batch, processing attempt, commit, and checkpoint remain
  distinct identities with explicit stewards.
- **Relationship and affect:** runtime reports describe semantic execution;
  chamber and cell observations authorize substrate effects; ledger receipts
  authorize compaction. None substitutes for another.
- **Interpretation:** canonical JSON is the neutral contract while TypeScript,
  Rust, and PostgreSQL retain native internal expression.
- **Temporal stewardship:** local custody survives ledger absence; immutable
  receipts and signed checkpoints preserve truth across retry and deletion.
- **Horizontal coherence:** projections rebuild from immutable authority, and
  the two-cell proof binds local, distributed, and detached execution into one
  trace model without raw context disclosure.
- **Fragmentation test:** no legacy service, CLI, memory layer, generic logging
  path, or parallel persistence authority was introduced.

## Validation Evidence

- `cadenza`: TypeScript typecheck passed. All 161 functional tests passed with
  the explicitly deferred machine-relative performance file excluded.
- `cadenza/environment-bootstrap`: typecheck, build, and all 40 tests passed,
  including PostgreSQL migrations, role boundaries, immutable ledger,
  projection rebuild, and processor asset conformance.
- `cadenza-chamber`: formatting, strict all-target/all-feature Clippy, and the
  complete all-target test suite passed. New tests cover transient inquiry
  classification, known host-code preservation, hostile unknown codes, and
  every declared failure-code round trip.
- `cadenza-cell`: formatting, strict all-target/all-feature Clippy, and the
  complete native all-target suite passed. One PostgreSQL/Node test remains
  explicitly environment-gated.
- Linux: the strengthened two-real-cell gVisor outage, recovery, ledger drain,
  compaction, disclosure, suspension, cleanup, and pressure proof passed in
  122 seconds.

The full TypeScript command also ran the acknowledged machine-sensitive
performance file: 162 functional tests passed, while three performance tests
failed from the deferred latency threshold, timeout, and heap-snapshot disk
pressure. Snapshots created by this run were removed. The benchmark remains
deferred until the agreed clean machine restart and is not treated as a
correctness failure.

Repository-wide Prettier still reports pre-existing drift outside the direct
Sprint 6 evidence files and cannot parse two older large heap snapshots. The
direct execution-evidence schemas, processor source, and affected tests were
formatted and revalidated; unrelated historical files were not rewritten.

## Remaining Gates

- the deferred machine-relative performance rerun after a clean restart.
- a later mature-system security review after orchestration expands the
  operational surface.

No implementation or architecture issue remains that blocks Sprint 7. The
Sprint 6D pre-orchestration gate is satisfied.
