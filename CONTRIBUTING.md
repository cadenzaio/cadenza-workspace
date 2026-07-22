# Contributing

Cadenza is accepting contributions to cross-repository architecture, contracts, governance, and release coordination.

## Before You Start

- Read the repository README, AGENTS.md, and applicable versioned contracts.
- Open an issue before changing architecture, shared contracts, security boundaries, or dependencies.
- Keep changes within this repository's stated responsibility.
- Do not add compatibility code for legacy Cadenza repositories unless a current contract explicitly requires it.

## Development

Use the repository's documented validation commands. Add focused tests for behavior changes and update authority fixtures before synchronized snapshots. Generated files must be reproduced by their owning generator rather than edited manually.

## Developer Certificate Of Origin

Every commit must include a Developer Certificate of Origin 1.1 sign-off:

```text
Signed-off-by: Your Name <your.email@example.com>
```

Use `git commit -s` to add it. The sign-off certifies the contribution under the terms at https://developercertificate.org/. Pull requests with unsigned commits are not accepted.

## Pull Requests

- Explain the purpose, boundary, and behavioral effect.
- Identify contract or compatibility impact.
- Include validation results and known limitations.
- Keep unrelated changes out of the pull request.

By participating, you agree to follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
