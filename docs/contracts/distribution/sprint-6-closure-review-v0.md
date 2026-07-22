# Sprint 6 Closure Review

Date: 2026-07-14

Status: `accepted`

## Verdict

Sprint 6 is implementation-complete and ready for user acceptance. The
authority, chamber, cell, transport, and Linux proof now express one static
multi-cell model without exposing deployment topology to authored business
logic. No blocking coherence or security defect remains in the approved V0
scope.

This verdict is bounded to static placement, direct one-hop peers, serialized
chamber execution, and measured same-host process/network conformance. It is
not approval for automatic reconciliation, dynamic scale, actor distribution,
exactly-once execution, independent-host fault claims, or production
attestation.

## Intended Whole

Cadenza continues to reduce operational complexity around the intended
function. The authored source task delegates through a generated proxy and
emits an ordinary signal. Enrollment, assignment, residency, routing, TLS,
replay, containment, and lifecycle remain governed substrate concerns. The
same source definitions require no local-versus-remote branch.

False-success checks passed:

- the proof uses two real unprivileged cell processes, not two in-memory cell
  objects.
- every source chamber runs in a separate signed gVisor containment plan.
- routes derive from current PostgreSQL assignment and complete signed
  residency, not test-injected maps.
- remote chamber, cell, endpoint, certificate, and placement fields do not
  enter authored context or returned business context.
- transport remains a private primitive callback, not a generic RPC surface.

## Identity And State

The implementation keeps these meanings distinct:

- enrollment is durable environment authority.
- generation is one cell-process lifetime.
- assignment is static replica authority.
- member residency is signed observation with bounded validity.
- route member is a derived opaque execution candidate.
- chamber readiness is local runtime state.
- graph conclusion is the target core's composed context.

Multi-member readiness is conjunctive. Publishing the target business member
alone produced no task or signal route; publishing the required meta-support
member completed the replica and derived both routes.

The Linux proof also made temporal ordering explicit: operational activation
grants are revision-bound, while residency publication advances authority.
Therefore the complete grant set must activate before publication begins. A
publication that invalidates a still-needed grant now fails closed rather than
being hidden by orchestration order.

## Affect And Boundaries

- `cadenza` owns source, enrollment, assignment, residency, and route authority.
- `cadenza-chamber` owns materialization, primitive ingress, normalized
  composed-context outcomes, lifecycle, and chamber evidence.
- `cadenza-cell` owns containment-plan construction, launcher custody, local
  host authority, transport keys, exact route interpretation, peer transport,
  replay, and signed residency observation.
- the root launcher can execute only the fixed measured containment shape.
- business and meta-support chambers receive no database credential, peer key,
  endpoint, provider object, launcher handle, or generic host capability.
- persistence remains outside the primitive core and is used here only by the
  environment authority extension.

The result-normalization repair removed an incoherent boundary leak. Adapter
debug envelopes may contain exported graph topology, but fulfilled chamber and
peer outcomes now carry only the core-composed context. This preserves the
graph-conclusion contract and prevents nested transport envelopes across proxy
hops.

## Security Review

The combined Sprint 6A-6C evidence covers:

- root-authorized enrollment and transport-key possession.
- separate control/containment and transport identities.
- active enrollment and exact generation at channel and execution ingress.
- TLS 1.3 mutual authentication pinned to enrolled Ed25519 SPKI.
- signed canonical controls, executions, results, and residencies.
- bounded frames, contexts, results, deadlines, replay state, and evidence.
- exact unit revision, replica, assignment epoch, slice, chamber, image, lane,
  responsibility, route member, and source projection checks.
- suspension, generation drift, assignment drift, signature mutation, replay,
  expiry, oversized input/result, noncanonical fields, and evidence failure.
- conservative execution-started meaning after the proceed boundary.
- root launcher versus unprivileged cell role separation.
- complete drain with no container, bundle, cgroup, listener, or process left.

No chamber-visible generic network, filesystem, SQL, shell, destination,
credential, or transport surface was introduced.

## Coherence Questions

1. **Whole:** authored workflow remains central while distribution is absorbed.
2. **Identities:** durable authority, process generation, replica, residency,
   route member, and chamber stay distinct.
3. **State meaning:** every readiness and lifecycle transition has one owner and
   a fail-closed interpretation.
4. **Affect:** mutation uses fixed gateway operations; execution uses private
   primitive callbacks.
5. **Boundaries:** credentials and placement remain outside chambers.
6. **Relationships:** unit membership, assignment, residency, route ownership,
   and peer selection are explicit and revalidated.
7. **Vertical interpretation:** authority can explain runtime eligibility and
   runtime evidence names the authority-bound identities.
8. **Horizontal interpretation:** peers agree through canonical neutral
   contracts without sharing private implementation objects.
9. **Stewardship:** source, projection, transport, and evidence fields have
   explicit authority repos.
10. **Trace:** decisions, fixtures, hostile tests, exact digests, and this review
    preserve why the model changed.
11. **False success:** same-host limitations and non-goals remain explicit.
12. **Repair:** the two integration mismatches were repaired at their owning
    boundaries, not patched in business definitions.

## Validation Evidence

- `cadenza-chamber`: macOS format, strict all-target/all-feature Clippy, and
  complete tests passed; Linux format and strict Clippy passed.
- `cadenza-cell`: macOS format, strict all-target/all-feature Clippy, and
  complete tests passed; Linux format and strict Clippy passed.
- Linux two-cell gVisor/PostgreSQL proof: passed in 75.8 seconds.
- workspace agent harness: passed.

The machine-sensitive core performance check remains deferred by prior
agreement until after a computer restart.

## Remaining Risks And Next Gate

- residencies expire after 60 seconds and V0 has no reconciliation loop.
- static route refresh is an exact control operation, not automatic convergence.
- launcher enrollment remains one cell control key per launcher service.
- direct peers do not prove independent-host loss or network partition recovery.
- serialized execution avoids unresolved chamber concurrency semantics.
- execution evidence covers boundaries and outcomes but not a complete live
  graph/task/relationship/composition stream.

The last item is the mandatory next design gate. Realtime business-logic
execution evidence must be defined before Sprint 7 scale, placement
reconciliation, or orchestration begins.

## Acceptance

Accepting this review closes Sprint 6 and authorizes design work for the
realtime business-logic execution-evidence protocol. It does not authorize
Sprint 7 implementation.

The user approved the Sprint 6 closure on 2026-07-15 with
`Sprint 6 closure approved.`
