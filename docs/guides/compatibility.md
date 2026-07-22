# Cadenza Compatibility Guide

## Compatibility Authority

The distributed-foundation release manifest, created in Sprint 9E, binds exact
repository commits, package versions, protocol versions, migrations, contract
fixtures, toolchains, and artifact digests. Matching repository version numbers
do not imply compatibility.

## Core Languages

TypeScript is the working implementation authority. Shared versioned contracts
and fixtures own portable meaning across TypeScript, Python, Elixir, and C#.
Idiomatic APIs may differ where language expression serves the intended whole;
semantic outcomes, naming, conclusion, evidence, and authority boundaries may
not drift silently.

## Runtime Compatibility

Environment authority approves exact runtime image, adapter artifact, source
slice, policy, and capability identities. Chamber validates its neutral adapter
protocol. Cell validates current assignment, generation, containment, route,
and peer authority. Any mismatch fails closed rather than falling back to a
nearby version.

## Legacy Boundary

Version 4 is a new major direction with no backward-compatibility requirement
for legacy service, database, CLI, demo, or runtime-host repositories. Legacy
systems remain on earlier core versions. Registry publication is separately
gated from source publication.
