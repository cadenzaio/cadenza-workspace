# Sprint 10F Python Deterministic Proof Amendment

Date: 2026-07-28

## Context

The first Sprint 10F complete proof failed Python’s throttled-task test after
`62.66ms` against a `60ms` wall-clock ceiling. The same test’s semantic claims
are:

- executions with the same throttle tag do not overlap;
- an execution with a different tag can make progress independently.

Wall-clock duration is not authority for either claim. The failure reproduced
the machine-sensitive performance-test concern that Sprint 10C was intended to
remove.

The approved Sprint 10F design permits narrow finding-driven repairs and
requires a repository to receive an RC2 identity when its source or artifacts
change.

## Decision

Replace the upper timing assertion with deterministic event ordering:

- the first `a` execution waits for the `b` execution to start;
- the second `a` execution remains behind the same-tag semaphore;
- the test asserts that `b` starts before the second `a`;
- the existing maximum active count proves same-tag serialization.

The Python core advances to `0.1.0rc2` and becomes an assembled RC2 repository.
Its package-smoke script reads the version from `pyproject.toml` instead of
hard-coding RC1.

No Python runtime behavior, shared contract, public API, dependency, or
language semantics change.

## Consequences

- The complete proof no longer depends on a workstation-speed ceiling for
  throttle semantics.
- Python is no longer an unchanged RC1 identity in the aggregate candidate.
- Elixir and C# remain the only reused RC1 repository identities.
- Python 3.13.14 and 3.14.6 must produce the same RC2 wheel bytes.

## Alternatives

1. Increase the timing ceiling. Rejected because a wider machine-sensitive
   bound preserves the defect.
2. Retry until the test passes. Rejected because it hides unreliable proof.
3. Remove the cross-tag concurrency claim. Rejected because the behavior has a
   current purpose and can be proven deterministically.
4. Keep Python at RC1 after changing tests. Rejected because release identity
   must describe actual source.

## Links

- [Approved Sprint 10F design](../agent-harness/exec-plans/active/2026-07-28-sprint-10f-closure-optional-rc2-candidate.md)
- [Sprint 10F source inventory](../publication/sprint-10f-source-candidate-inventory-v1.md)
