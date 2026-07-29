# Sprint 10F Security And Coherence Review V1

Date: 2026-07-28

## Decision

The Sprint 10F candidate has no open critical, high, medium, or low security
finding. It is coherent enough to proceed to local RC2 manifest assembly and
explicit user judgment.

This is maintainer technical evidence, not an independent security audit,
penetration test, production certification, or support commitment.

## Intended Whole

Cadenza exists to let authors and agents concentrate on workflow and business
logic while the distributed foundation owns materialization, authority,
containment, routing, scale, evidence, and recovery.

The review rejects local success that would export deployment, distribution,
custody, conflict, or recovery complexity back into authored business logic.

## Reviewed Identities

The review covered:

- the workspace governance, proof, documentation, SBOM, and release boundary;
- TypeScript, Python, Elixir, and C# primitive cores;
- Environment authority, migrations, and PostgreSQL role boundaries;
- Chamber materialization, containment, adapter, and evidence boundaries;
- Cell authority, routing, supply, launcher, peer, journal, and orchestration
  boundaries;
- the exact reference business flow and generated distributed artifact;
- six newly assembled RC2 packages and two reused signed RC1 identities.

The executable proof freeze binds these commits:

| Repository | Commit | Candidate identity |
| --- | --- | --- |
| TypeScript Core | `4798fd1103e85618955eeda07017c4b051e30fd7` | `4.0.0-rc.2` |
| Python Core | `b15a306dbddf6168e0171f5fe5b468a050464375` | `0.1.0-rc.2` |
| Elixir Core | `d1dd15f1802d108023384cab39d234aaf259f114` | reused `0.1.0-rc.1` |
| C# Core | `d294e535aa0dfad91123c9d14ad6e3aa8c5b4cb2` | reused `0.1.0-rc.1` |
| Environment | `96054f583e41df9341a219955c7e1c19acb63c13` | `0.1.0-rc.2` |
| Chamber | `02fd231e9680ee50014e2919cd0863abe5ddff79` | `0.1.0-rc.2` |
| Cell | `bbbbf2bfe8b77ec924d1f4d133214e0411197797` | `0.1.0-rc.2` |
| Reference system | `62fb08715fa4fa9908398cc42a7655ddb142c310` | `0.1.0-rc.2` |

## State, Affect, And Authority

- Desired, authorized, materialized, observed, custodied, and safe-next-action
  state remain distinct.
- Sender-side route selection chooses one exact current replica; Cell validates
  that selection and never substitutes another target after dispatch.
- Chamber cannot materialize serialized callable authority. It receives
  already controlled callables and materializes only Cadenza primitives.
- Execution evidence distinguishes rejection before affect, execution start,
  uncertain outcome, superseded authority, custody block, and completion.
- Actor mutation uncertainty must resolve before reassignment; stale owners are
  fenced by assignment epoch, Cell generation, image, and endpoint authority.
- Replica supply, withdrawal, restart, and stem recovery retain exact
  generation and directive custody.

No protocol, contract, schema, migration, or public runtime API changed during
candidate versioning.

## Boundary Review

The privileged hardening proof passed with clean archived source inputs in the
approved `cadenza-gvisor` Lima environment:

1. two real Cells converged through database authority without lifecycle
   commands;
2. desired replica state supplied and released pre-enrolled Cells;
3. orchestration survived stem loss and authority unavailability, then
   resupplied fresh capacity.

The scenarios proved immutable measured runtime inputs, descriptor-only
contained Chamber communication, fail-closed provider outage behavior, bounded
launcher rejection, and exact final cleanup.

PostgreSQL retains 139 `SECURITY DEFINER` functions. There is no migration diff
after RC1. The complete test suite passed the schema-qualified,
`pg_catalog`-bound function checks and hostile role-boundary scenarios.

## Automated Security Evidence

### Dependencies

- Core and all three Environment npm audits report zero vulnerabilities.
- Chamber and Cell RustSec audits report zero vulnerabilities.
- Elixir reports no retired Hex package.
- The pinned .NET SDK reports no vulnerable or deprecated package.
- Python has no third-party runtime dependency and pins its build requirement.

No third-party dependency or license inventory changed in Sprint 10F.

### Reachable-History Secret Scan

Checksum-verified Gitleaks `8.30.1` scanned every official reachable `HEAD`
history:

| Repository | Alerts | Confirmed secrets |
| --- | ---: | ---: |
| Workspace | 6 | 0 |
| TypeScript Core | 0 | 0 |
| Python Core | 0 | 0 |
| Elixir Core | 0 | 0 |
| C# Core | 0 | 0 |
| Environment | 5 | 0 |
| Chamber | 10 | 0 |
| Cell | 27 | 0 |
| Reference system | 0 | 0 |

The previously reviewed alerts remain deterministic test identities, digests,
generation values, or fixture authority. The two new workspace alerts are the
literal RC2 `release_key` in candidate metadata and its execution plan. No
credential, token, private key, payment identifier, or personal contact secret
was found.

### Provenance And Workflows

- Candidate validation requires read-only workflow permissions, rejects
  `pull_request_target`, rejects write permission, and requires every external
  action to use a full commit SHA.
- All affected candidate commits verify with the dedicated Ed25519 key and
  carry DCO sign-off.
- Unchanged Elixir and C# retain DCO-bound RC1 commits and verified signed RC1
  tags.
- RC1 metadata, commits, tags, and artifacts remain unchanged.

## SBOM Review

Checksum-verified Syft `1.49.0` regenerated seven normalized CycloneDX source
SBOMs twice with byte-identical results.

Only Environment, Chamber, and Cell changed. Their semantic deltas are limited
to RC1-to-RC2 first-party component identities and corresponding lockfile
hashes. Core, Python, Elixir, and C# regenerate byte-identically. No hidden
third-party edge appeared.

## Coherence Review

### Vertical Interpretation

The intended whole maps downward into bounded repository responsibilities and
upward into evidence, manifests, operator guidance, and exact runtime state.
No child repository claims authority owned by another layer.

### Horizontal Interpretation

Seven contract snapshot bundles pass across their authority and consumer
repositories. Four core languages preserve shared primitive meaning while
retaining language-native expression. Runtime protocols and artifact digests
remain explicit across Environment, Chamber, Cell, and the reference system.

### Temporal Stewardship

RC1 remains immutable. The aggregate RC2 candidate advances only affected
repositories, reuses signed Elixir and C# RC1 identities, records every
decision and repair, and emits its manifest outside the source commit to avoid
self-reference.

### Fragmentation Test

The post-RC1 diff contains no added TODO, FIXME, XXX, or HACK marker. Compiler,
formatter, type, documentation, package, conformance, and proof checks expose
no orphaned implementation. Every retained addition serves one of:

- deterministic proof and performance interpretation;
- sender-side replica routing;
- supply restart and lifecycle custody;
- actor API purpose repair;
- failure and security hardening;
- operational interpretation;
- candidate identity and reproducible release assembly.

No Memory, CLI, observer UI, generated expansion, managed product, or other
deferred feature entered the candidate.

## Findings

### Repaired

1. Complete proof exposed a machine-sensitive Python throttling ceiling. It was
   replaced by deterministic ordering evidence without changing runtime
   semantics.
2. Raw manual Python wheel staging produced a different archive digest because
   it omitted the repository's fixed build epoch. Release guidance now requires
   `SOURCE_DATE_EPOCH=315532800`; the corrected wheel matches both Python proof
   runtimes exactly.

### Retained Necessary Complexity

- distinct authority, evidence, custody, and lifecycle state;
- measured Linux/gVisor containment and privileged cleanup;
- mixed RC1/RC2 aggregate identity;
- local PostgreSQL proof clusters and explicit failure classification.

### Accepted Limits

There is no newly accepted security finding. Existing product limits remain:

- TypeScript is the only implemented Chamber language adapter;
- Chamber business execution remains serialized;
- Cell PostgreSQL transport remains local-only;
- production key custody, rotation, fleet admission, hostile multi-tenant
  controls, installer, SLA, and independent audit remain outside this release;
- abrupt host loss can lose evidence not yet transferred from local custody;
- execution evidence proves structure and integrity, not business truth.

## Conclusion

The candidate preserves legitimate affect, exact authority, custody,
interpretability, and future inheritance across every reviewed boundary. No
finding requires a product repair or risk-acceptance decision before local
manifest assembly.

Publication, signing, tagging, registry release, and GitHub mutation remain
separate explicit decisions.
