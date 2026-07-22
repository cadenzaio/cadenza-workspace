# Sprint 9C Operational Lifecycle V1

Date: 2026-07-22

## Scope

This is the supported foundation lifecycle, not a production deployment
installer. Cadenza deliberately does not hide health or recovery behind a
single process-running check. Durable authority and observed convergence are
the source of operational truth.

## Startup

1. Provision PostgreSQL `16.14` as an external substrate and establish the
   narrow bootstrap principal through the deployment secret channel.
2. Apply the ordered checksummed migrations to an empty database. A checksum
   mismatch or discontinuity is terminal.
3. Run genesis and verify the environment reaches `handoff_ready`, the trust
   root and first Cell are enrolled, and the authority handoff is complete.
4. Install root-owned measured `runsc`, immutable rootfs trees, launcher binary,
   configuration, and socket unit on each Linux Cell host.
5. Start the unprivileged Cell generation with credentials and keys supplied
   through role-fixed inherited descriptors, never ambient environment values
   or business definitions.
6. The active stem reads desired authority and converges system processors and
   ordinary Chambers. An operator does not issue ordinary Chamber lifecycle
   commands.

## Health Interpretation

- **Environment:** `bootstrap_state = handoff_ready` and
  `operational_state = operational`.
- **Cell:** current generation observation is unexpired and matches enrolled
  identity, generation, endpoint, and trust profile.
- **Stem:** one current unexpired lease owner and epoch; takeover evidence must
  explain any epoch change.
- **Chamber:** current assignment and ready residency agree on Cell generation,
  Chamber identity, image epoch, source slice, and deadline.
- **Evidence processor:** one stable system-owned replica per active Cell is
  ready before ordinary work is eligible.
- **Supply:** current directive, observation, provider generation, and Cell
  generation agree. A running process alone is insufficient.
- **Actor:** current assignment epoch, ready owner residency, durable state
  version, and mutation outcome agree.

Expired authority, stale generation, missing evidence custody, or an
unavailable required provider is unhealthy even when a process remains alive.

## Drain And Shutdown

1. Reduce or remove desired ordinary replicas through authority.
2. Wait for ordinary members to withdraw and routes to stop advertising them.
3. For actor owners, stop new work, settle or resolve mutation outcomes, and
   end residency only after the accepted-before-release boundary.
4. Seal each Cell's evidence journal, process ready batches, and require durable
   ledger acknowledgement for all remaining custody.
5. Withdraw the per-Cell evidence processor.
6. Advance demand-supplied Cells through `draining`, `stopped`, and `dormant`.
7. Stop retained Cell hosts only after their contained Chambers and launcher
   custody are empty.

Ledger unavailability during graceful drain intentionally retains the Cell. It
must not claim a clean stop while evidence custody is unresolved.

## Failure And Recovery

- PostgreSQL transport or administrator termination causes bounded fail-closed
  deferral and reconnection. Authorization denial, stale revision, conflict,
  and invalid input remain terminal semantic results.
- A lost stem owner can be replaced only after the lease and generation rules
  permit one fenced epoch increment with immutable takeover evidence.
- A lost Chamber is replaced from desired authority; stale generation or image
  ingress is rejected.
- A lost actor owner receives a new assignment epoch. The successor hydrates
  committed state and the prior owner cannot commit under the stale epoch.
- Demand-managed capacity is selected only from pre-enrolled profiles and starts
  a fresh Cell generation. Dormant capacity is not silently resurrected as an
  old generation.
- Permanent machine loss can still lose evidence not transferred from that
  machine. Cross-host replication of local custody is not currently provided.

## Complete Cleanup

Closure requires all of the following, not merely a successful test result:

- `runsc --root=/run/cadenza/runsc list --format=json` is empty.
- `/var/lib/cadenza/bundles` contains no launch bundle.
- no test Cell, Chamber, launcher, activation issuer, or supply process remains.
- temporary listeners, Unix sockets, journals, rootfs staging trees, source
  workspaces, and PostgreSQL clusters are removed.
- temporary roles, credentials, and authority exist only inside the destroyed
  proof cluster.
- root-owned `/etc/cadenza/launcher-v0.json` is restored if a proof temporarily
  replaced it.

Content-addressed release rootfs trees and the root-owned bounded nonce ledger
are durable installation state, not temporary test state. A proof-created
rootfs that is not part of an approved release manifest must be removed.

## Current Operational Limitations

- no production installer, service bundle, backup policy, or PostgreSQL high
  availability automation is claimed yet.
- issuer delegation renewal before expiry remains an operator responsibility.
- abrupt Cell loss can retain unresolved local evidence custody.
- Chamber execution is serialized until the deferred concurrency optimization.
- performance observations are baselines, not correctness or health gates.
