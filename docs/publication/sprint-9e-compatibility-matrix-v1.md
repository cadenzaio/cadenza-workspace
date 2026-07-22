# Sprint 9E Compatibility Matrix V1

Date: 2026-07-22
Status: release-candidate input

## Compatibility Authority

Repository version numbers are independent. Compatibility exists only when an
exact set of source commits, artifacts, contract fixtures, migrations,
protocols, and toolchains appears together in the distributed-foundation
manifest generated from `release/candidate.json`.

## Repository Set

| Repository | Candidate | Compatibility role |
| --- | --- | --- |
| `cadenza` | `4.0.0-rc.1` | TypeScript primitive and local-execution authority |
| `cadenza-python` | `0.1.0rc1` | Python expression of portable core meaning |
| `cadenza-elixir` | `0.1.0-rc.1` | Elixir/BEAM expression of portable core meaning |
| `cadenza-csharp` | `0.1.0-rc.1` | C#/.NET expression of portable core meaning |
| `cadenza-environment` | `0.1.0-rc.1` | Durable authority, schema, reconciliation, evidence, and actor authority |
| `cadenza-chamber` | `0.1.0-rc.1` | Chamber runtime and TypeScript adapter custody |
| `cadenza-cell` | `0.1.0-rc.1` | Trusted Cell host, containment, transport, and local custody |
| `cadenza-workspace` | `2026.07-rc.1` | Architecture, contract map, release metadata, and system validation |
| `cadenza-reference-system` | `0.1.0-rc.1` | Outside-in proof consumer; owns no framework contract |

## Contract And Protocol Set

- Primitive core `v0`, actor core `v1`, graph conclusion `v0`, and execution
  evidence `v0` define portable core meaning.
- Authority/security, bootstrap, distribution, and local orchestration use
  their `v0` contracts; distributed actors use `v1`.
- Chamber-to-Cell protocol is `0.10.0`; the Chamber TypeScript adapter artifact
  is `0.1.0`.
- Cell peer protocol is `0.2.0` over `cadenza-cell-tls-v0`.
- Launcher protocol is `0.1.0`; activation issuer protocol is `0.2.0`.
- Environment authority gateway contracts use `0.1.0`.
- The PostgreSQL authority schema is migrations `001` through `015`, applied in
  order from an empty PostgreSQL `16.14` database.

## Supported Combinations

- TypeScript is the only Chamber execution adapter in this candidate.
- Python, Elixir, and C# are supported portable core implementations, not
  Chamber adapters.
- Cell `0.1.0-rc.1` requires Chamber `0.1.0-rc.1` source/artifact identity from
  the same release manifest.
- Chamber forms a standalone Rust crate artifact. Cell is a GitHub source
  release in RC1 because its exact Chamber dependency is not published to
  crates.io; forcing registry resolution would violate the GitHub-first gate.
- Chamber and Cell require exact Environment fixtures and generated authority
  artifacts from the same manifest.
- The reference system requires the exact packed TypeScript core candidate.

No compatibility is promised with Cadenza 3.x, legacy services/databases,
other prerelease combinations, unpublished local modifications, or future
protocol versions.
