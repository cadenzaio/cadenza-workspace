# Sprint 10F Temporary Linear-History Merge Exception

Date: 2026-07-29
Status: complete

## Context

The seven Sprint 10F publication pull requests passed every required check, but
GitHub rejected merge commits while `required_linear_history` was enabled.
Squash and rebase were prohibited because either operation would replace the
manifest-bound candidate commits instead of preserving them in public history.

The user approved the bounded exception with:
`Sprint 10F RC2 temporary linear-history merge exception.`

## Decision

For the seven affected repositories only:

1. snapshot each complete `main` branch-protection document;
2. set only `required_linear_history` to `false`;
3. merge the green pull request with a merge commit;
4. prove the frozen candidate commit is an ancestor of public `main`;
5. restore the complete original protection document; and
6. compare the restored document byte-for-byte with its snapshot.

No required check, DCO rule, review rule, administrator enforcement, force-push
posture, deletion posture, tag, release, registry, RC1 identity, Elixir
identity, or C# identity may change through this exception.

## Consequences

- All seven frozen candidate commits remain visible in public history.
- All seven pull requests retain their review and required-check evidence.
- Linear history is enabled again on every affected `main` branch.
- The before-and-after protection documents are byte-equivalent.
- Future release planning must resolve merge-strategy compatibility before
  freezing commits that must remain exact public identities.

## Alternatives

1. Squash merge. Rejected because it would replace the frozen commits.
2. Rebase merge. Rejected for the same identity-preservation reason.
3. Move the manifest and tags to merge commits. Rejected because artifacts,
   source-tree digests, and reviewed identities bind the frozen commits.
4. Leave linear history disabled. Rejected because the exception was temporary
   and the approved governance posture requires it.

## Links

- [RC2 publication plan](../agent-harness/exec-plans/completed/2026-07-28-sprint-10f-rc2-publication.md)
- [RC2 publication evidence](../publication/sprint-10f-rc2-publication-evidence-v1.md)
- [RC2 publication decision](./2026-07-28-sprint-10f-rc2-publication.md)
