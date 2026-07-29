# Sprint 10F RC2 Publication

Date: 2026-07-28

## Context

Sprint 10F produced a locally frozen, reproducible mixed RC1/RC2 candidate with
clean fast, complete, privileged, security, coherence, package, SBOM, and
manifest evidence. The user approved closure and publication on 2026-07-28.

## Decision

Publish the exact manifest-bound candidate through protected pull requests,
required checks, merge commits, signed affected-only tags, and GitHub
prereleases.

Candidate commits must not be rewritten. Tags point to the frozen commits even
when protected branches advance through merge commits. Elixir and C# retain
their existing RC1 identities. Package registries remain excluded.

## Consequences

- Seven affected repositories receive new RC2 tags and prereleases.
- The workspace release carries the aggregate manifest and cross-repository
  verification assets.
- RC1 remains immutable.
- Publication stops on identity drift, substantive CI failure, signature
  failure, or public checksum mismatch.
- A post-publication record must preserve exact public evidence.

## Alternatives

1. Publish with squash or rebase merges. Rejected because it would rewrite
   manifest-bound candidate commits.
2. Tag every repository as RC2. Rejected because Elixir and C# are unchanged.
3. Publish package registries simultaneously. Rejected because registry
   publication was excluded from the reviewed candidate.
4. Tag merge commits instead of frozen commits. Rejected because release assets
   and source-tree digests bind the frozen candidate commits.

## Links

- [Publication decision package](../publication/sprint-10f-rc2-publication-decision-v1.md)
- [Definitive proof closure](../publication/sprint-10f-definitive-proof-closure-v1.md)
- [Security and coherence review](../security/sprint-10f-security-coherence-review-v1.md)
- [Publication execution plan](../agent-harness/exec-plans/active/2026-07-28-sprint-10f-rc2-publication.md)
