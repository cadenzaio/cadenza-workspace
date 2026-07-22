# Trusted Facade And Cell Provider Closure V0

Date: 2026-07-16

Status: Sprint 6D.5B accepted by the user on 2026-07-17.

## Target

- Change: make source-slice evidence processing possible through generated,
  image-bound capability tasks backed by typed cell providers and a separately
  credentialed immutable ledger append surface.
- Scope: runtime-image evidence policy, chamber and TypeScript adapter facade
  mediation, cell journal claims and processing attempts, PostgreSQL append
  mediation, host credential separation, and hostile boundary tests.
- Excluded: the canonical processor graph, authority registration and placement,
  live batch-ready signaling, acknowledged-prefix compaction, and the final
  multi-cell gVisor/security closure.

## Intended Whole

Business and meta authors continue to express logical flow through Cadenza
tasks and inquiries. A source task can inquire into one generated hidden task;
it never receives a host provider, credential, SQL surface, mutable descriptor,
or generic capability callback. The chamber reconstructs ambient execution
authority, and the cell performs only the exact trusted effect bound into the
active image.

False success would be accepting descriptor drift, treating provider outage as
authority denial, acknowledging a forged or unequal receipt, losing an
unknown-commit attempt, returning an old receipt for malformed replay bytes, or
making PostgreSQL availability part of ordinary business execution.

## Implemented Boundary

- runtime requirements bind `structural`, `boundary`, or `debug` evidence
  policy plus processing eligibility; the chamber passes the immutable policy
  into each invocation.
- source-only facade descriptors bind one hidden task, intent, capability,
  mode, and allowlisted operation. Activation rejects prebuilt use, missing
  mounts, collisions, duplicates, and operation drift.
- the TypeScript adapter generates private tasks whose callbacks are not
  available to authored callables, helpers, globals, or business context.
- chamber protocol `0.7.0` carries only an exact image-derived facade
  invocation. The chamber and cell independently revalidate image, slice,
  descriptor, mount, subject, principal, trace, graph, idempotency, deadline,
  payload, and result bounds.
- the cell provider exposes only claim, renew, release, append, and acknowledge.
  PostgreSQL access is one literal function call through descriptor 14 and a
  credential that must differ from the authority credential.
- processing attempts form a bounded durable chain that survives restart and
  unknown commit state. A retry submits the complete chain.
- equal-root ledger replay now verifies immutable manifest and custody bytes,
  requires an exact stored attempt prefix, and may append only a valid chained
  suffix before returning the original receipt.
- transport and availability failures remain retryable unknown commit states.
  Authoritative SQL rejection and receipt drift are integrity failures, not
  transient outages.

## Coherence Review

- **Intent and whole:** deployment, persistence, retry custody, and credential
  work remain outside authored business logic; meta logic still composes
  ordinary Cadenza primitives.
- **Identity and authority:** image, slice, generated task, intent, mount,
  operation, claim, attempt, batch root, and receipt identities have distinct
  owners and exact equality checks.
- **Affect and security:** authored code can request only a declared operation;
  the chamber supplies ambient authority and the cell owns all journal and
  database affect. No generic SQL or host call was introduced.
- **Relationships and interpretation:** generated tasks are the only bridge
  from primitive flow to substrate effect. Runtime reports, cell custody,
  processing attempts, and ledger completion remain separate evidence classes.
- **Temporal stewardship:** claims lease the oldest batch; attempts are
  append-only; unknown commit preserves local authority; replay may extend but
  never rewrite the attempt chain; only an exact receipt clears the sidecar.
- **Pressure and failure:** ordinary images do not connect to the ledger. A
  processor provider outage retains bounded local backlog, while integrity
  rejection fails closed for quarantine rather than looping as transient.
- **Fragmentation repair:** the pass reused the chamber host-handler boundary,
  cell journal, canonical JSON domain, and single ledger function. It did not
  add a second provider protocol, persistence abstraction, or sub-meta layer.
- **Spotless review:** warning-denying Clippy passes on macOS and Linux; no
  production TODO, FIXME, unimplemented, or panic path was introduced.

## Validation Evidence

- environment bootstrap: typecheck and build passed; all 37 tests passed,
  including 10 PostgreSQL ledger tests for canonical authority, roles,
  concurrent/equal replay, hostile replay bytes, attempt suffixes,
  immutability, and projection rebuild.
- TypeScript chamber adapter: reproducible build passed with artifact digest
  `sha256:eedd3e2a5be19c9c3acb5e26fdfbd8259186dbd0547dc03feaf7b724d0f705ef`.
- Rust chamber: warning-denying Clippy passed; the complete 61-test suite passed
  in serial mode, including real generated-facade execution and hostile source
  activation.
- Rust cell on macOS: warning-denying Clippy passed; the complete 72-test suite
  passed with one explicitly ignored PostgreSQL transition proof.
- Rust cell on Linux `rust:1.97`: all targets compiled, warning-denying Clippy
  passed, the separate-credential test passed, and both fixed host-process
  descriptor/root-boundary tests passed.
- chamber JSON schemas parse successfully, and the workspace agent-harness
  check passed.

## Honest Limits

- This pass proves the effect boundary, not the processor workflow. Sprint
  6D.5C must define, register, place, activate, and recover the TypeScript
  processor graph against the real providers.
- Provider-to-PostgreSQL behavior is covered on each side of the typed boundary;
  the complete contained processor-to-ledger path remains a 6D.5C conformance
  requirement.
- The host requires a separate ledger credential descriptor but connects it
  only for images declaring facades. Automatic credential rotation and
  processor reconciliation remain later orchestration work.
- Physical segment deletion, historical lookup, pressure proofs, and signed
  compaction checkpoints remain Sprint 6D.5D.
- Full multi-cell gVisor and security closure remains Sprint 6D.6. The current
  Linux run is a compile, lint, credential, and fixed-process-boundary proof.
- Machine-sensitive core performance tests remain deferred by prior user
  direction.

## Decision

Coherence judgment: `fits for Sprint 6D.5B`.

The implementation meets the 6D.5B gate: authored source can use only the exact
approved facade and cannot reach general host authority or forge completion.
The user accepted this closure on 2026-07-17 and authorized Sprint 6D.5C
processor-slice implementation and activation.
