# Sprint 9E Required Checks V1

Date: 2026-07-23
Status: amended release-candidate input

## Authority

[`release/required-checks.json`](../../release/required-checks.json) is the
machine-readable branch-protection input. GitHub settings are an external
enforcement projection and must match it after repository bootstrap.

Every repository requires its declared `CI / ...` check and the GitHub DCO
check. The Python matrix requires both supported interpreter jobs. `main`
requires pull requests, dismissal of stale review state, resolved
conversations, and linear history. Force pushes, branch deletion, and
administrator bypass are prohibited.

The single-maintainer RC1 requires zero mandatory approving reviews. Before a
second identity receives write authority or the project claims
multi-maintainer governance, this setting must ratchet to one independent
approval. This ratchet is a governance requirement even though GitHub cannot
infer it from the current collaborator count.

## Bootstrap Order

The first source publication cannot use the final protected-branch flow because
several CI workflows consume exact upstream release tags. Bootstrap therefore
uses this one-time dependency order:

1. Install the GitHub DCO check for the `cadenzaio` owner.
2. Publish `cadenza`; create `v4.0.0-rc.1` after its source CI and DCO checks
   pass.
3. Publish and tag Python, Elixir, C#, and Environment. They do not require
   unpublished Cadenza runtime tags in their ordinary CI.
4. Publish and tag Chamber after the Cadenza and Environment tags exist.
5. Publish and tag Cell and the reference system after their upstream tags
   exist.
6. Preserve the existing private workspace as
   `cadenza-workspace-private-archive`, create a fresh public
   `cadenza-workspace` from the curated history, and create
   `distributed-foundation-rc.1` after every referenced tag exists.
7. Apply branch protection using the exact observed CI and DCO check names,
   then verify settings and public history independently.

Initial bootstrap commits must be the locally reviewed, DCO-signed candidate
commits. No replacement content may be introduced between local freeze and
remote tag creation. After bootstrap, all changes use protected `main`, pull
requests, and the declared checks.

The zero-review setting is not permission to push routine changes directly to
`main`. It exists only because one maintainer cannot supply an independent
approval. Pull requests, checks, conversation resolution, and all other
declared restrictions remain mandatory.

## Supply-Chain Boundary

Ordinary repository CI proves source quality and installable package shape with
read-only permissions. The system release gate additionally binds dependency
audits, license review, SBOMs, generated artifacts, and package digests in the
frozen distributed manifest. A passing repository check is necessary but does
not independently authorize a distributed release.
