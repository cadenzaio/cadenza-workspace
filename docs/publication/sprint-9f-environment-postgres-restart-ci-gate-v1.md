# Sprint 9F Environment PostgreSQL Restart CI Gate V1

Date: 2026-07-23
Status: approved

## Context

The exact frozen Environment commit
`7005bab6093fe210c2af9ded3dd3f08dc5a8d774` was published to
`cadenzaio/cadenza-environment`. GitHub Actions run `30027984716` failed on its
initial execution and on one explicit rerun.

Both attempts passed installation, audit, type checking, 105 tests, and every
PostgreSQL integration file except
`postgres-authority-gateway.test.ts`. Its first test deliberately restarts its
temporary PostgreSQL process. PostgreSQL then exits before readiness and the
remaining five tests fail because that cluster is unavailable.

The shared test helper:

1. asks the operating system for an unused TCP port;
2. releases the reservation before PostgreSQL binds the port;
3. runs multiple PostgreSQL test files in parallel;
4. releases the selected port again during an intentional restart;
5. attempts to reclaim the same port; and
6. discards PostgreSQL stdout and stderr while trying to read a log file that
   the process never writes.

This creates a time-of-check/time-of-use port race and suppresses the
diagnostic required to classify any PostgreSQL exit. The exact commit passes
all 111 Environment bootstrap tests in the existing contained Linux proof
image, including the restart test, which confirms that the runtime behavior is
not generally broken but does not make the GitHub check reliable.

Publication stopped before any Environment tag, Chamber source, Cell source,
reference source, workspace source, prerelease, release asset, protection,
legacy mutation, or registry package was published. Python, Elixir, and C#
source commits are public and their exact CI runs passed, but they remain
untagged.

## Proposed Decision

Repair only the Environment PostgreSQL test-cluster harness:

1. give every temporary cluster its own Unix-domain socket directory;
2. connect through that directory instead of acquiring a shared ephemeral TCP
   port;
3. preserve the existing cluster and connection-config API;
4. capture PostgreSQL stderr in the declared per-cluster log;
5. report process exit code or signal together with that diagnostic;
6. add a regression test proving that two clusters can use the same
   PostgreSQL port in separate socket directories and survive restart; and
7. run the full Environment validation locally, in contained Linux, and in
   GitHub Actions.

Unix-domain sockets match the supported macOS/Linux development and release
proof environments. They remove the shared host-port namespace from these
process-local integration tests without serializing the entire suite or
weakening coverage.

After repair:

1. create a DCO-signed Environment replacement commit;
2. require the live `environment` check to pass on that exact commit;
3. rebuild and compare the affected package, source, SBOM, and manifest
   records;
4. update the public workspace with this approved gate and resulting
   evidence;
5. assemble twice and run the archive-only clean-room proof;
6. request an exact Environment-and-workspace affected-scope replacement
   freeze; and
7. resume signed tagging and dependency-ordered publication.

## Consequences

- Production Environment behavior and public contracts remain unchanged.
- PostgreSQL integration tests gain deterministic cluster isolation and useful
  failure evidence.
- The Environment commit, source tree, source archive, and source-bound SBOM
  require replacement.
- Any package artifact whose bytes change after rebuilding requires explicit
  replacement; byte-identical packages remain frozen.
- The curated workspace commit, workspace source archive, public documentation
  authority, and aggregate manifest require replacement.
- Chamber, Cell, reference-system, and all four core-language commits remain
  frozen unless deterministic dependency verification proves otherwise.

## Alternatives

1. Rerun until green. Rejected because two identical failures expose an
   uncontrolled race and suppressed diagnostics.
2. Disable or skip the restart test. Rejected because restart persistence is a
   critical authority property.
3. Serialize all Vitest files. Rejected as a broader performance penalty that
   masks rather than removes shared-port coupling.
4. Increase readiness retries. Rejected because a conflicting listener or
   exited PostgreSQL process cannot become ready through waiting.
5. Continue publication with a failing required check. Rejected because it
   violates the approved fail-closed release posture.

## Approval Required

The user approved the Environment PostgreSQL restart CI repair design on
2026-07-23. Implementation may proceed. Any resulting affected-scope
replacement freeze still requires explicit approval.
