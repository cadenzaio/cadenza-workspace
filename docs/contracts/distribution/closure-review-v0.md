# Distribution Authority V0 Closure Review

Date: 2026-07-14

## Verdict

Sprint 6A fits Cadenza's intended whole and is ready for its review gate. The
environment can govern ordinary source slices, enroll an additional cell,
validate explicit static placement, accept signed observed residency, and
derive routable members without moving topology or provider authority into
business definitions. No critical or high-severity finding remains in the 6A
scope.

Sprint 6B authenticated transport has not started. This verdict establishes
the authority substrate it must consume; it does not claim multi-cell execution.

## Intended Whole

Cadenza absorbs deployment and distribution mechanics so a creator continues
to express intended function as primitive flow. Sprint 6A preserves this by
making cells and placement environment authority, while the declarative
distribution-control slice expresses management flow through ordinary tasks.
False success would be an implicit scheduler, generic CRUD gateway, self-declared
cell trust, manually injected route map, or topology-bearing business context.

## Identities And State

Environment, trust root, runtime slice, logical object and version, enrollment
grant and proof, control key, transport key, cell enrollment, placement unit and
revision, replica, assignment epoch, cell generation, member chamber and image,
residency observation, route member and route epoch remain distinct.

Durable authority owns source, enrollment, capability, capacity, placement,
assignment, suspension, and revocation. Signed residency is bounded runtime
observation and cannot change assignment authority. Route eligibility is
derived only when active enrollment, current assignment, complete ready
residency, source responsibility, and expiry all agree.

## Affect And Boundaries

The authority gateway exposes 18 named operations and no generic method. Each
invocation is exact, operation/task-bound, revision-bound, idempotent,
transactional, bounded, and evidence-producing. The distribution reader and
activation reader are non-login, execute-only roles; hostile tests prove they
cannot select base tables or cross into mutation functions.

The cell verifies root authorization, candidate transport-key possession, and
transport-signed residency before provider use. PostgreSQL then revalidates the
brokered proof against current authority. Standard cells cannot acquire admin,
`authority_access`, or `cell_control` grants. Private keys, credentials,
provider objects, endpoints, and topology do not enter chamber or callable
payloads.

## Relationships And Interpretation

General source authority connects object/version provenance to runtime,
artifact, policy, capability, and responsibility. Placement units derive their
requirements from those sources. Assignments connect replicas to enrolled cells;
residency interprets observed chamber state upward; route members interpret the
complete current authority downward for routing consumers.

The distribution-control meta slice receives no database credential or
authority capability. Its visible task relationships delegate only to exact
authority task identities, preserving the principle that Cadenza extensions
compose Cadenza primitives while runtime security remains substrate code.

## Findings Repaired

- The generalized activation reader initially lacked function-owner schema
  usage when composing bounded distribution readers. The migration now grants
  only the required schema usage to the security-definer owner.
- The neutral fixture referenced placement members without defining their
  source authorities and omitted signed residency fields. It is now
  self-contained and contract-complete.
- The TypeScript gateway normalizer initially checked only top-level
  distribution fields. Runtime validation now matches nested artifact schema,
  operation/task identity, and result-size bounds before provider execution.
- The cell enrollment endpoint check was permissive and residency signatures
  were not independently verified in Rust. Both boundaries are now strict and
  covered by hostile tests.
- Chamber documentation still described the old nine-method facade. It now
  records the exact 18-operation surface.

## Remaining Bounded Risks

- Sprint 6B must define and prove the unprivileged cell-host process,
  authority-pinned mutual TLS, signed execution envelopes, replay handling,
  generation binding, and opaque route-member projection changes.
- The current fixture signatures are shape-valid neutral examples; executable
  cryptographic proofs are generated in TypeScript and Rust tests.
- Dynamic assignment, reconciliation, healing, durable orchestration, actor
  residency, and cross-environment trust remain explicitly outside V0.
- The core performance file remains deferred for a clean-machine rerun by prior
  agreement. All 143 non-performance core tests pass.
- Realtime business-logic execution evidence remains a mandatory dedicated
  review after Sprint 6 and before automated scale/orchestration. Authority,
  lifecycle, and transport evidence must not be mistaken for that stream.

None of these risks contradicts the approved Sprint 6A scope.

## Validation

- authority gateway: TypeScript build, 25 tests, and reproducible artifact
  verification passed.
- environment bootstrap: typecheck, build, 26 tests, fresh three-migration
  PostgreSQL integration, and hostile role tests passed.
- Cadenza core: 143 non-performance tests and production build passed; the
  separately run performance file reproduced its deferred instability.
- chamber: formatting, strict Clippy, and all targets passed.
- cell: formatting, strict Clippy, and all targets passed; one existing
  PostgreSQL/Node integration test remains intentionally ignored.
- neutral fixture JSON and generated bootstrap artifact digest agree across
  authority and chamber consumers.

## Evidence

- [Distribution contract](v0.md)
- [Conformance contract](conformance-v0.md)
- [Neutral fixture](fixtures/v0-distribution.json)
- [Approved Sprint 6 design](../../agent-harness/exec-plans/active/2026-07-14-multi-cell-static-placement-design.md)
- [Distribution foundation decision](../../decisions/2026-07-14-multi-cell-static-placement-foundation.md)
- [Intended whole](../../cadenza-intended-whole.md)
