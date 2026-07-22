# Defer Evidence Batch Compaction

Date: 2026-07-15

## Context

Sprint 6D.4 originally allowed a cell to delete an acknowledged sealed evidence
batch after persisting a matching ledger commit receipt. Implementation showed
that the sealed segment is also the cell's only durable source for sequence
recovery, custody-chain continuity, equal-replay receipts, and detection of an
old evidence key reused with different content.

Deleting that segment before an external authority can resolve those facts
would weaken the approved recovery and replay guarantees. A bounded local
checkpoint cannot preserve an unbounded evidence-key replay history.

## Decision

- Sprint 6D.4 persists bounded claim leases and canonical acknowledgement
  sidecars but retains acknowledged signed segments.
- Acknowledged batches are no longer claimable, but remain part of local
  recovery and replay authority.
- Normal and terminal capacity continue to fail closed; acknowledgement does
  not falsely claim that local capacity was reclaimed.
- Sprint 6D.5 owns physical compaction and deletion together with the
  authoritative ledger contract for historical continuity and replay
  resolution.

## Consequences

- Sprint 6D.4 can prove claim, acknowledgement, crash recovery, and conflict
  handling without inventing continuity.
- A cell can reach capacity even when all local batches are acknowledged. This
  is an explicit fail-closed V0 condition until the 6D.5 processor establishes
  safe compaction.
- Deletion crash points move from the 6D.4 closure matrix to the 6D.5
  compaction matrix.

## Alternatives

- A finite replay window was rejected because it weakens deterministic equal
  replay without an authority-backed expiry rule.
- An unbounded local replay index was rejected because it merely moves the
  capacity problem and duplicates the future ledger.
- Immediate deletion with only a chain checkpoint was rejected because it
  cannot reproduce old receipts or detect conflicting replay.

## Links

- [Cell custody and distribution identity](2026-07-15-cell-custody-distribution-identity.md)
- [Approved 6D.4 design](../agent-harness/exec-plans/completed/2026-07-15-cell-custody-distribution-identity-design.md)
