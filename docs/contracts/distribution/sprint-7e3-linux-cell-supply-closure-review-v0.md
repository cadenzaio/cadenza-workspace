# Sprint 7E.3 Linux Cell Supply Closure Review V0

Date: 2026-07-19

## Status

- Implementation state: closed.
- Scope: pinned local profile custody, Linux supply supervision, provider
  generation custody, Cell lifecycle authority, outage and restart behavior.
- Next pass: Sprint 7E.4 autonomous desired-state system proof and recursive
  Sprint 7E closure review.

## Delivered Boundary

`cadenza-cell-supply` is a dedicated unprivileged Rust supervisor. It accepts
four fixed inherited descriptors, verifies one closed local catalog against
current registered PostgreSQL authority, and launches only the pinned
`cadenza-cell` executable with its fixed descriptors. It has no generic
process, SQL, command, environment, mount, endpoint, enrollment, placement, or
desired-state interface.

The local profile contract has exactly 17 named members. Catalog equality,
manifest digest, owner, type, mode, size, and file digest are checked before
launch using beneath-root, no-symlink Linux opens. Child descriptors are first
isolated above descriptor 63 before fixed remapping, preventing descriptor
collision from changing launch meaning.

## Authority Separation

PostgreSQL desired disposition, provider process realization, and Cell runtime
generation remain different identities:

- `Reconciliation.ExecuteAction` commits a directive and does not claim
  process success.
- the supply provider signs bounded process observations and cannot publish
  Cell generation state.
- the Cell signs `starting`, `ready`, `draining`, and `stopped` observations and
  cannot publish provider state or choose a profile.
- a separate Cell lifecycle reader can read one exact current directive but
  cannot read tables or perform any mutation.

The provider projection now includes the current unexpired Cell generation so
a restarted provider waits rather than adopts or overlaps it. The projection
read is deliberately non-mutating because its five-second safety cadence must
not create immutable evidence pressure merely by observing equal authority.

## Scenario Evidence

The implementation and tests account for:

- exact profile launch and executable, mode, digest, or catalog drift.
- source/target descriptor collision during fixed descriptor construction.
- child readiness and bounded cleanup after provider custody loss.
- provider death before and after child spawn through parent-death termination.
- generation restart without child adoption or overlapping Cell generations.
- Cell startup publication of separate `starting` and `ready` authority.
- drain rejection unless directive and empty local inventory agree.
- post-drain rejection of new delegation, peer serving, and materialization.
- stop rejection unless the exact stopped directive follows draining.
- idempotent duplicate drain and recovery after a lost stop response.
- transient provider-database outage bounded by conservative lease expiry.
- immediate custody termination on semantic authority conflict.
- exact signed-observation retry after unknown commit.
- graceful provider `SIGTERM`/`SIGINT` draining and stopped publication.
- hostile provider, lifecycle-reader, convergence, and public role boundaries.
- normalized provider failure output without path, endpoint, SQL, or profile
  disclosure.

## Coherence Review

The implementation serves the intended whole by making runtime capacity an
effect of replica intent while keeping infrastructure detail outside business
graphs. It does not duplicate placement policy: the stem chooses required
supply, PostgreSQL serializes its disposition, the provider owns only process
custody, and each Cell converges its own Chambers.

Recursive review found and repaired four issues before closure:

1. Direct descriptor remapping could overwrite a source descriptor whose
   number was also a later target. All sources are now isolated above 63 first.
2. A restarted provider lacked enough projection state to distinguish dormant
   supply from a still-current prior Cell generation. Current bounded Cell
   generation identity and expiry are now projected.
3. Recording immutable operation evidence on every safety read would create
   permanent five-second write pressure. The read remains authorized and
   bounded but non-mutating.
4. Detailed top-level provider errors could disclose deployment structure.
   Runtime output now exposes only the normalized failure code.

No implementation code in this pass is exploratory or disconnected from the
supply contract. Internal profile and process helpers remain private. The
public library surface exposes purpose-specific contracts and entry points,
not lower-level filesystem, descriptor, process, or PostgreSQL primitives.

## Operational Complexity

V1 deliberately serializes profile transitions and uses one five-second safety
cadence. It keeps child custody and at most one pending signed observation in
memory, but no local desired-state database or retry queue. A graceful provider
shutdown ends managed child custody; a crash relies on parent-death and bounded
authority expiry. This is conservative and inspectable, although the complete
7E.4 proof must still measure behavior with multiple profiles, real outages,
and a provider restart.

## Validation

- `cadenza/environment-bootstrap`: typecheck passed; 17 test files and 92 tests
  passed against PostgreSQL.
- `cadenza-cell` macOS: formatting and all-target check passed.
- `cadenza-cell` Linux: strict all-target, all-feature Clippy passed.
- `cadenza-cell` Linux: 68 library tests, 5 fixed-binary process tests, all
  ordinary integration tests, and the 75.68-second real multi-Chamber protocol
  test passed. Only tests explicitly requiring the root-owned gVisor proof
  fixture or an external systemd interruption remained ignored.
- host-relative performance thresholds remain deferred by prior agreement and
  are not used as correctness evidence.

## Remaining Boundary

The components now exist and pass isolated and existing integrated runtime
tests. Sprint 7E.4 must prove the complete authority loop from only a replica
desired-state change: start dormant demand profiles, wait for real ready Cell
authority, place and execute work remotely, withdraw it, drain and stop the
empty Cells, recover across PostgreSQL outage and provider restart, and finish
without leaked custody.
