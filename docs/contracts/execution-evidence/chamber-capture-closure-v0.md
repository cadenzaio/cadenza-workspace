# Chamber Capture Closure V0

Date: 2026-07-15

Status: Sprint 6D.3 accepted by the user on 2026-07-15.

## Target

- Change: carry official TypeScript core reports across the adapter boundary,
  validate and normalize them in the chamber, and prove a role-separated
  chamber-to-cell custody transport without claiming durability prematurely.
- Scope: `cadenza`, the TypeScript chamber adapter, Rust chamber capture, and
  the minimal dual-descriptor launcher/cell responder prerequisite.
- Excluded: durable journal custody, evidence signing, crash recovery, sealed
  batches, distribution identity migration, PostgreSQL processing, and
  concurrent chamber execution.

## Intended Whole

Business authors still express intended function and logical flow only. The
core reports primitive meaning, the adapter preserves the active invocation,
the chamber interprets the report under one immutable runtime image, and the
cell boundary decides whether custody is trustworthy. No business callable
receives trace plumbing, a persistence API, a cell handle, or evidence work.

False success would be treating a runtime claim as chamber observation,
allowing a report or receipt to escape its image/request/trace/sequence,
returning success without the final checkpoint, accepting `test_only` custody
inside trusted containment, or representing post-start custody loss as safely
retryable.

## Coherence Findings

- **Identity:** runtime report sequence, trace, image, adapter request, chamber,
  cell generation, and custody request remain distinct identities with exact
  bindings. The chamber derives deterministic capture keys from canonical
  report digests.
- **Affect and security:** the core waits at mandatory barriers; the adapter
  cannot settle them without a matching chamber receipt; the trusted chamber
  cannot accept anything below `cell_durable`. Protocol drift terminates the
  adapter and fails the chamber.
- **Relationships:** report traffic is separated from general host callbacks
  and from the serialized chamber control descriptor. The launcher accepts
  exactly the two role-fixed descriptors and maps them to contained descriptors
  3 and 4.
- **Interpretation:** chamber captures explicitly say `runtime_reported` and
  bind the reporting runtime/image. Commitments cross the boundary; raw
  context, callable source, credentials, endpoints, stacks, and authored
  observation claims do not.
- **Horizontal coherence:** the adapter protocol and Rust structs implement the
  TypeScript authority contract without introducing a chamber-specific
  business API. The cell scaffolding understands only canonical capture and
  receipt envelopes.
- **Temporal stewardship:** monotonically increasing report sequence,
  checkpoint equality, canonical report digest, request-bound receipt, and the
  pre-start/post-start failure distinction preserve what can safely happen
  next. Cell custody order and digest chains remain correctly reserved for
  Sprint 6D.4.
- **Fragmentation repair:** raw `GraphRun.export()` results are gone; ephemeral
  task cleanup retains the active execution scope; cross-realm VM contexts are
  committed as plain JSON; report and host callbacks are grouped under one
  explicit adapter handler boundary.

## Implemented Boundary

The adapter installs one bounded reporter only after materialization runners
are quiescent. It binds each delegation or signal to the request, image, trace,
profile, processing eligibility, and lane; emits ordered `execution_report`
frames; accepts receipts that may arrive before a barrier; coalesces duplicate
barriers; and returns its final `through_report_sequence` checkpoint.

The chamber strictly validates reports and converts them into commitment-only
`cadenza.execution-evidence-capture` values. Its custody sink may be explicit
test-only conformance custody or a bounded canonical descriptor. Trusted
descriptor mode rejects non-durable receipts. Custody loss before a receipted
`task.started` yields `evidence_custody_unavailable` with
`execution_started: false`; loss afterward yields
`evidence_integrity_failed` with `execution_started: true`.

The launcher and containment plans now carry exactly two descriptors. The cell
responder is intentionally `test_only`, so it proves transport and role
separation but cannot authorize trusted affect-bearing execution. Sprint 6D.4
must replace it with the cell journal before that execution can succeed.

## Validation Evidence

- TypeScript core: package build passed; 18 functional test files and 157 tests
  passed with the explicitly deferred machine-sensitive performance file
  excluded.
- TypeScript adapter: typecheck and reproducible artifact build passed with
  digest
  `sha256:8741e8c93db925711b0f93d154a4c62a48ad1ce585c935cb18b2a947c7dbe319`.
- Rust chamber: format and warning-denying clippy passed; 62 tests passed.
  This includes real adapter execution, monotonic captures, durable/test
  receipt discrimination, pre-callable loss, post-start indeterminacy, report
  sequence/image/trace drift, forbidden raw context, authored observation
  basis, and missing checkpoint rejection.
- Rust cell on macOS: format and warning-denying clippy passed; 55 tests passed
  and one PostgreSQL-dependent test remained explicitly ignored.
- Rust cell in Linux `rust:1.97` with Node 20: warning-denying clippy passed;
  64 portable tests passed. Eight tests remained explicitly ignored because
  they require the separately provisioned root-owned gVisor/systemd or
  PostgreSQL proof environment.
- Repository whitespace checks passed. The two large heap snapshots generated
  by the attempted performance run were removed; earlier user/workspace
  snapshots were left untouched.

The first bare Rust Linux image test failed only because that image omitted the
`node` executable required by an existing real-gateway test. Repeating the same
suite after installing Node 20 passed. This is an environment prerequisite, not
a product failure.

## Honest Limits

- This pass does not provide durable custody. `cell_durable` is a required
  trusted receipt class whose real implementation belongs to Sprint 6D.4.
- The dedicated descriptor is presently serviced synchronously while one
  adapter request is active. Signal execution waits for business and
  meta-support runner quiescence. A concurrent detached pump is deferred with
  the already approved concurrency optimization pass.
- Receipt validation allows the authority schema's optional digest. The local
  inherited channel and exact request/sequence binding establish transport
  authority in this pass; the journal receipt and digest-chain requirements
  must be fixed and tested in Sprint 6D.4.
- Machine-dependent legacy performance thresholds remain deferred by prior
  user direction. The attempted run also demonstrated that the benchmark must
  await evidence barriers or provision a suitable reporter before it can
  measure this runtime path coherently.

## Decision

Coherence judgment: `fits for Sprint 6D.3`.

The implementation preserves the intended whole, distinguishes claim from
observation, secures the new affect boundary, and leaves an explicit inheritance
path to durable custody. No principle-level repair remains before Sprint 6D.4.
The user accepted this closure on 2026-07-15. The next gate is the segmented
cell-journal and distribution-identity design review.
