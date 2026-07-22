# Sprint 9E Required Checks V1

Date: 2026-07-22
Status: release-candidate input

## Authority

[`release/required-checks.json`](../../release/required-checks.json) is the
machine-readable branch-protection input. GitHub settings are an external
enforcement projection and must match it after repository bootstrap.

Every repository requires its declared `CI / ...` check and the GitHub DCO
check. The Python matrix requires both supported interpreter jobs. `main`
requires one approving review, dismissal of stale approval, resolved
conversations, and linear history. Force pushes, branch deletion, and
administrator bypass are prohibited.

## Bootstrap Order

The first source publication cannot use the final protected-branch flow because
several CI workflows consume exact upstream release tags. Bootstrap therefore
uses this one-time dependency order:

1. Publish `cadenza`; create `v4.0.0-rc.1` after its source CI passes.
2. Publish and tag Python, Elixir, C#, and Environment. They do not require
   unpublished Cadenza runtime tags in their ordinary CI.
3. Publish and tag Chamber after the Cadenza and Environment tags exist.
4. Publish and tag Cell and the reference system after their upstream tags
   exist.
5. Publish the curated workspace repository and create
   `distributed-foundation-rc.1` after every referenced tag exists.
6. Apply the declared branch protection and DCO requirements to all nine
   repositories, then verify the settings independently.

Initial bootstrap commits must be the locally reviewed, DCO-signed candidate
commits. No replacement content may be introduced between local freeze and
remote tag creation. After bootstrap, all changes use protected `main`, pull
requests, and the declared checks.

## Supply-Chain Boundary

Ordinary repository CI proves source quality and installable package shape with
read-only permissions. The system release gate additionally binds dependency
audits, license review, SBOMs, generated artifacts, and package digests in the
frozen distributed manifest. A passing repository check is necessary but does
not independently authorize a distributed release.
