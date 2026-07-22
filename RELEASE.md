# Release Policy

Releases are explicit, reviewed operations. Merging to `main` does not publish source, packages, tags, or release assets.

## Release Candidate Posture

- Versions are repository-local and do not imply cross-repository compatibility.
- The distributed-foundation manifest binds exact commits, versions, toolchains, protocol versions, contract digests, and generated artifacts.
- GitHub source and prerelease assets are gated separately from npm, PyPI, Hex, NuGet, and crates.io publication.
- Package-registry publication requires a later explicit approval.
- Known limitations and deployment assumptions are release artifacts, not informal notes.

## Required Evidence

A release must pass repository validation, contract snapshot checks where applicable, clean package construction, and the approved cross-repository release checks. Release automation must not possess ambient publication authority during ordinary CI.
