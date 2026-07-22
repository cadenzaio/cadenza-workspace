# Local Orchestration V0 Closure Review

Date: 2026-07-14

## Verdict

Sprint 5 is coherent and ready to close. One cell can activate, project to,
route between, replace, drain, and stop multiple contained chambers without
putting topology or host capabilities into authored business logic. No
critical or high-severity security finding remains in the approved scope.

The review found one final fragmentation: `active_executions: 0` claimed state
that the serialized chamber server did not observe. The field and dependent
guards were removed, protocol `0.5.0` now expresses serialized quiescence, and
concurrency is explicitly deferred until after the first environment.

## 1. Intended Whole

Cadenza absorbs local topology, containment, lifecycle, transport, and
replacement complexity so creators continue to author intended function as
ordinary primitive flow. False success would be a working multi-process system
that leaks chamber placement, retries, lifecycle, or host authority into
business definitions.

## 2. Participating Identities

The implementation names environment, cell generation, chamber generation,
lane, immutable image, source slice/object/version, authority proof, projection,
route group/epoch, correlation, subject, runtime principal, capability,
artifact, adapter, and containment plan. No host provider, credential, socket,
or database client becomes a chamber or callable identity.

## 3. State

Host authority owns `starting`, `ready`, `draining`, `failed`, and `stopped`.
Execution eligibility requires a ready current image and exact acknowledged
projection. Successor publication precedes predecessor drain. V0 drain means
that earlier serialized commands returned, new ingress is closed, and the
chamber acknowledged `draining`; it does not mean concurrent work was counted.

## 4. Affect

Business callables affect sibling chambers only through generated descriptors,
applied projections, source-selected candidates, and validated local transport.
Signals detach and acknowledge ingress. Delegation preserves started/completed
boundaries and graph-conclusion outcomes. Authority operations remain a fixed,
separately brokered surface.

## 5. Security Boundaries

Operational activation requires a short-lived environment-root signature over
the exact source, chamber, runtime support, policy, capability, nonce, and
authority identity. The cell separately attests containment. Canonical bounded
frames reject duplicate keys; immutable artifacts and all runtime components
are digest bound. `source_isolated_v0` provides no network, ambient host port,
credential, arbitrary mount, or generic operation.

## 6. Relationships

The environment authorizes execution, the cell owns local truth and routing,
the chamber materializes and executes one immutable image, and the core owns
primitive and graph-conclusion meaning. These paths are explicit and do not
collapse containment custody into semantic authority.

## 7. Interpretation

Full projections interpret host truth downward. Exact acknowledgements,
normalized outcomes, lifecycle messages, and evidence interpret chamber state
upward. Composition conflicts remain explicit started execution failures rather
than ambiguous terminal-context selection.

## 8. Horizontal Interpretability

Business, meta-support, and trusted-control chambers share neutral projection,
route, outcome, and evidence contracts while retaining strict lane boundaries.
The cell validates the source's exact selection and cannot silently substitute
another sibling.

## 9. Shared Fields

The workspace contract stewards canonical JSON, route identity, projection
identity, lifecycle meaning, protocol versions, and proof identifiers.
`cadenza-cell` is authority for local orchestration; `cadenza-chamber` is
authority for runtime execution; `cadenza` remains authority for primitives.

## 10. Temporal Stewardship

Monotonic host and projection revisions, image epochs, route epochs, immutable
proof digests, compensating revisions, decision records, exact test fixtures,
and measured Linux artifacts preserve inheritance. The protocol advance records
the deliberate breaking correction rather than silently reinterpreting V0.

## 11. Fragmentation Test

Repaired fragmentation:

- bootstrap authority is not reused as ordinary source authority.
- source artifact identity is preserved through image and adapter boundaries.
- source callables are materialized only inside the contained language adapter.
- chamber topology and host transport stay outside authored business context.
- the constant active-execution field and its non-consequential checks are gone.

Remaining bounded risks:

- production root-signer custody and delegated activation issuers need a later
  authority design.
- only the TypeScript chamber adapter exists.
- orchestration is in-memory and single-cell; persistence, recovery, placement,
  scale, and inter-cell distribution are later contracts.
- concurrency and in-flight drain coordination are deferred optimization work.
- hardware attestation and production deployment certification are not claimed.
- the PostgreSQL integration test remains opt-in and was not part of this local
  full-suite run.

None of these contradicts the approved Sprint 5 scope.

## 12. Repair And Regeneration

The repaired system now tells the truth at every scale: serialized execution is
the current mechanism, quiescence is its lifecycle consequence, and concurrency
is a future design rather than a dead placeholder. The next environment work
can depend on a narrow foundation without inheriting false performance or
lifecycle semantics.

## Security Validation

- strict Rust formatting and Clippy passed in `cadenza-chamber` and
  `cadenza-cell`.
- both complete Rust test suites passed; the cell suite has one intentionally
  ignored PostgreSQL integration test.
- RustSec scanned both lockfiles without a vulnerability finding.
- the TypeScript adapter production dependency audit reported zero
  vulnerabilities.
- the ARM64 Linux proof passed with four gVisor-contained source chambers,
  exact cgroup limits, serialized replacement drain, and no remaining runsc
  container or test-specific bundle/cgroup.

## Evidence

- [Intended whole](../../cadenza-intended-whole.md)
- [Local orchestration contract](v0.md)
- [Conformance contract](conformance-v0.md)
- [Serialized quiescence decision](../../decisions/2026-07-14-serialized-chamber-quiescence-v0.md)
- [Linux gVisor evidence](../../../cadenza-cell/docs/linux-gvisor-evidence-2026-07-13.md)
- [Sprint 5 execution plan](../../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md)
