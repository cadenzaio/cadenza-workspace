# Cadenza Distributed Foundation RC1 Release Notes

Date: 2026-07-22
Status: candidate notes; not published

## What This Candidate Is

This is the first release candidate of the new-major Cadenza distributed
foundation. It lets application authors express workflow and business-task
logic through Cadenza primitives while governed runtime layers own controlled
materialization, authority, containment, distribution, scale, execution
evidence, recovery, and distributed actor state.

The candidate includes four core-language repositories, Environment, Chamber,
Cell, the curated architecture workspace, and a realistic reference business
system. Exact compatibility is defined by the release manifest, not matching
version numbers.

## Important Limitations

- This is release-candidate software with no production support SLA.
- TypeScript is the only Chamber adapter.
- Chamber execution is serialized; concurrency is deferred.
- Deployment requires the documented Linux/gVisor, PostgreSQL, credential
  custody, host hardening, and operational assumptions.
- The complete reference business suite runs locally; the distributed proof
  executes representative governed slices and failure/recovery paths rather
  than every business branch through every substrate boundary.
- CLI, Memory, read-only observer UI, managed UI/agents, cloud control, and
  multi-environment management are not included.
- No backward compatibility with legacy Cadenza implementations is promised.

## Publication Boundary

The first approval publishes source repositories, signed GitHub prereleases,
release assets, and the exact distributed-foundation manifest. npm, PyPI, Hex,
NuGet, and crates.io publication remain separately gated. The existing npm
`latest` line remains legacy 3.x; a future approved v4 prerelease must not use
the `latest` tag.

Cell is distributed as exact manifest-bound GitHub source in this candidate.
It is not presented as an independently resolvable crates.io package before
the Chamber dependency has an approved registry publication path.
