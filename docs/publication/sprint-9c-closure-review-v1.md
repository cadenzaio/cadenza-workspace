# Sprint 9C Security, Reproducibility, And System Proof Closure V1

Date: 2026-07-22
Status: approved on 2026-07-22

## Verdict

Sprint 9C is ready for closure. The distributed foundation has been tested as
source, as independently packaged language cores, as a fresh authority and
contained Linux runtime, as a two-Cell system under failure and recovery, and
as a public business-logic authoring surface. No unresolved critical or high
security finding remains.

This verdict proves the current Sprint 9C candidate. It does not publish a
release or replace Sprint 9E's exact clean-commit binding and Sprint 9F's
public unauthenticated-clone repetition.

## Closure Evidence

| Gate | Result |
| --- | --- |
| [Security](../security/sprint-9c-security-review-v1.md) | Threat model, source/history secret scan, dependency and license audits, workflow integrity, hostile boundaries, and accepted limitations reviewed; all critical/high findings resolved. |
| [Reproducibility](sprint-9c-reproducibility-evidence-v1.md) | Seven official repositories build and test under pinned toolchains; contracts, artifacts, wheels, SBOMs, and rootfs generation are deterministic. |
| Fresh authority | PostgreSQL `16.14` applied all `15` migrations from empty clusters and sustained fail-closed outage/recovery behavior. |
| Containment | Assembled immutable rootfs passed gVisor activation and durable execution-custody proof. |
| Distributed system | Scale/stem/supply recovery passed; a separate two-Cell run executed the exact reference pricing artifact and survived actor-owner loss, reassignment, hydration, and continued mutation. |
| [Realistic business proof](../../cadenza-reference-system/README.md) | The reference system covers valid, invalid, unavailable-provider, declined-payment, stock-conflict, success, replay, reconciliation, and actor-specialized scenarios locally; its pure pricing slice also executed through the measured distributed path. |
| [Authorability](sprint-9c-agent-authoring-trial-v1.md) | A clean-context agent authored an intent-based order quote without infrastructure leakage; exact-runtime typecheck, tests, and build passed, and observed README friction was repaired. |
| [Performance](sprint-9c-performance-baseline-v1.md) | Isolated Node `24.18.0` timing and retained-heap observations are recorded without converting machine variance into correctness thresholds. |
| [Cleanup](sprint-9c-operational-lifecycle-v1.md) | Proof clusters, temporary runtime processes, launch bundles, and gVisor containers were removed and verified absent. |

## Important Boundaries

- The distributed proof executes the reference-owned pure pricing slice. The
  complete local reference suite and the substrate, recovery, evidence, and
  actor proofs are complementary; no claim is made that every reference branch
  traversed every distributed boundary in one run.
- TypeScript is the only Chamber adapter. Other official cores prove portable
  primitive meaning but are not distributed execution adapters yet.
- Chamber execution remains deliberately serialized. Concurrency is deferred
  to a later optimization pass.
- Performance reports measured the current candidate source in a git-less
  container. Sprint 9E must rerun them against a clean named commit.
- The release candidate still depends on the documented Linux/gVisor,
  PostgreSQL, credential-custody, host-hardening, and operator assumptions.

## Coherence Conclusion

The proof supports the intended whole. Business authors expressed an order
workflow with intents, tasks, relationships, schemas, and integer-money logic;
they did not manage deployment, containment, placement, recovery, evidence, or
authority. Those concerns remained explicit in the runtime layers and were
tested independently across their boundaries.

The principal operational concern remains discipline: the distributed model
has several authority, custody, fencing, and lifecycle states that are
necessary for truthful behavior but expensive to operate carelessly. The next
publication phases must improve inspectability and repeatability without
collapsing those distinctions into misleading convenience states.

## Next Gate

Approval closes Sprint 9C and authorizes Sprint 9D diagram and explanatory
documentation work under the approved Sprint 9 design. Sprint 9E then owns
clean histories, exact commit/artifact manifests, and release-candidate
assembly; Sprint 9F owns public-clone verification and publication gates.
