# Sprint 9B Recursive Review Execution Plan

Date: 2026-07-21

## Status

- State: `done`.
- Parent design:
  [Sprint 9 Distributed Foundation Stabilization And Publication](2026-07-21-distributed-foundation-stabilization-publication-design.md).
- Entry gate:
  [Sprint 9A Final Publication Boundary Gate V2](../../../publication/sprint-9a-final-publication-boundary-gate-v2.md).
- Active WIP: one cross-repository stabilization stream.
- External GitHub mutation: prohibited.

## Scope

Recursively review and repair the seven implementation repositories and the
candidate public workspace surface. Every retained production file, public API,
contract, dependency edge, generated artifact, and test must serve a named
purpose in the intended whole.

## Execution Order

1. `done` - capture the post-Sprint-9A workspace snapshot; establish
   artifact exclusions and local branch/publication safety.
2. `done` - establish one neutral fixture authority, repository-local
   snapshots, digest synchronization, and honest standalone versus release-
   workspace validation.
3. `done` - close approved C# primitive parity gaps or record justified
   language-local divergence.
4. `done` - review public APIs, dead code, stale compatibility, dependency
   direction, state machines, errors, generated/manual ownership, and current
   documentation claims repo by repo.
5. `done` - prepare bounded packaging and governance surfaces required by the
   approved publication posture without publishing.
6. `done` - run complete cross-repository validation and produce the Sprint
   9B coherence closure review.

## Closure Gate

- [Sprint 9B Recursive Review Findings V1](../../../publication/sprint-9b-recursive-review-findings-v1.md)
- [Sprint 9B Code, Contract, And Coherence Closure V1](../../../publication/sprint-9b-coherence-closure-v1.md)
- Required approval phrase: `Sprint 9B closure approved. Proceed.`
- Approved by the user on 2026-07-22.

## Finding Disposition

Every finding is classified as `must_fix`, `accepted_limit`,
`post_publication`, or `not_a_defect`. Out-of-scope follow-ups are captured in
the backlog; no finding is silently dropped.

## Assumptions

- Existing dirty changes are the approved Sprint 0-9 foundation and may be
  edited; unrelated user work is preserved.
- No backwards compatibility with pre-v4 repositories is required.
- The TypeScript implementation remains working authority while neutral specs,
  fixtures, and invariants own cross-language meaning.
- Performance budgets, runtime concurrency optimization, Memory, observer UI,
  CLI, and managed-product work remain outside Sprint 9B.

The user approved the parent design and Sprint 9A entry gate. These assumptions
apply only within those approved boundaries.
