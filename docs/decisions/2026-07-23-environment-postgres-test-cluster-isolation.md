# Environment PostgreSQL Test-Cluster Isolation

Date: 2026-07-23
Status: accepted

## Context

The frozen Sprint 9F Environment commit failed its live GitHub `environment`
check twice when a temporary PostgreSQL cluster restarted. The shared helper
released and reclaimed an ephemeral TCP port while other PostgreSQL test files
ran concurrently, and it discarded the process diagnostic needed to classify
the exit.

Production behavior, contracts, and the other 105 tests were unaffected. The
full 111-test suite passed in the existing contained Linux proof image, showing
that the failure depended on test-cluster lifecycle and host scheduling.

## Decision

Environment PostgreSQL integration tests will use a unique Unix-domain socket
directory per temporary cluster instead of the shared host TCP-port namespace.
The helper will preserve its connection-config API, capture PostgreSQL stderr,
report process exit status or signal, and have regression coverage for
concurrent clusters using the same PostgreSQL port across restart.

The affected Environment and curated-workspace release records will be rebuilt,
proved deterministically, and presented for an exact replacement freeze before
publication resumes.

## Consequences

- PostgreSQL integration clusters are isolated by filesystem identity rather
  than timing-dependent port allocation.
- Restart persistence remains tested.
- PostgreSQL exits retain actionable diagnostics.
- Production Environment behavior and public contracts do not change.
- Windows is not added to the RC1 proof matrix; the supported release proof
  remains macOS/Linux with PostgreSQL 16.14.
- Environment source-bound release records and curated-workspace records may
  change and require explicit replacement approval.

## Alternatives

- Repeated reruns were rejected because the check failed identically twice.
- Skipping the restart test was rejected because restart persistence is a
  critical authority property.
- Serializing all Vitest files was rejected because it masks shared-port
  coupling and penalizes the complete suite.
- Longer readiness retries were rejected because an exited process cannot
  recover by waiting.

## Links

- [Sprint 9F Environment PostgreSQL Restart CI Gate V1](../publication/sprint-9f-environment-postgres-restart-ci-gate-v1.md)
- GitHub Actions run `30027984716`
- User approval: `Sprint 9F Environment PostgreSQL restart CI repair design approved. Proceed.`
