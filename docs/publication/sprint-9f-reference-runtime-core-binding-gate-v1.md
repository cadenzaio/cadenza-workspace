# Sprint 9F Reference Runtime Core Binding Gate V1

Date: 2026-07-22
Status: repair approved; affected-scope freeze pending

## Context

The definitive Linux/gVisor proof started from the exact approved SBOM-refrozen
candidate. Real containment, inherited-descriptor communication, and the
PostgreSQL authority proof had already passed. The first autonomous two-Cell
scenario then stopped before business execution at this fail-closed check:

```text
reference artifact core digest drifted
left:  sha256:5cf06ac31f859e64c2fb85a4faf22dda75d50b8b5a49d8f2883a7b714e0207dc
right: sha256:ecdda04fc00ceb6aeb7c39ce58cce32277617422c526c27a29ae6e33ac05ae2a
```

The left value is the SHA-256 digest of the complete npm tarball. The right
value is the SHA-256 digest of `dist/index.mjs`, the executable core module in
the measured runtime rootfs.

This is a semantic binding defect in the frozen reference artifact. Chamber,
its TypeScript adapter, and their activation tests consistently require a
slice's `core_artifact_digest` to equal the executable core module selected by
the runtime image. The package tarball remains valid release provenance, but
it is not the executable component digest used by runtime activation.

The reference release validator did not detect this distinction. It packed and
installed the candidate core, but regenerated the distributed artifact using
the same hardcoded tarball digest already present in the artifact. That proved
byte reproducibility without proving runtime-component identity.

The failed proof cleaned up its PostgreSQL cluster and runtime resources. No
clean-room source or frozen artifact was patched.

## Decision Proposal

Repair the reference system so runtime identity is derived from executable
bytes rather than repeated configuration:

- bind `core_artifact_digest` in the canonical distributed pricing slice to
  the SHA-256 digest of the installed `@cadenza.io/core/dist/index.mjs` module;
- preserve the npm tarball digest separately in the distributed release
  manifest as package provenance;
- make `validate:release` independently hash the core module installed from the
  freshly packed candidate and pass that value into artifact generation;
- strengthen the reference tests so a package digest cannot be substituted for
  the runtime module digest while still passing the release-consumer proof;
- update the reference documentation to state the distinction explicitly;
- regenerate the canonical reference artifact from the unchanged approved core
  package and TypeScript-adapter lock.

The expected runtime core digest is:

`sha256:ecdda04fc00ceb6aeb7c39ce58cce32277617422c526c27a29ae6e33ac05ae2a`.

## Impacted Scope

- Source repair: `cadenza-reference-system` only.
- Generated artifact replacement:
  `generated/reference-distributed-order-pricing-v1.json`.
- Required dependent validation: complete reference-system release-consumer
  validation followed by all three autonomous Cell Linux/gVisor scenarios.
- Required source replacement: reference-system commit, source-tree digest,
  and source archive.
- Required public-index replacement: this gate and resulting closure evidence,
  so the curated workspace commit and source archive must be regenerated.
- Required aggregate replacement: generated reference digest, affected
  repository records, release-artifact records, and distributed manifest.
- Expected unchanged inputs: candidate metadata, all other implementation
  commits and source trees, the core tarball and module bytes, Chamber and Cell
  sources, TypeScript adapter and lock, every package artifact, authority
  contracts, protocols, migrations, diagrams, SBOMs, and toolchains.

No external publication is authorized.

## Alternatives

1. Change the autonomous proof to accept the package tarball digest. Rejected
   because Chamber activates the executable module, not the archive that once
   contained it; this would weaken runtime-image identity.
2. Copy the tarball digest into the measured rootfs component record. Rejected
   because that record would no longer describe the measured file bytes.
3. Patch only the generated JSON during the proof. Rejected because the source
   generator and release validation would remain capable of reproducing the
   defect.

## Approval Gate

Approval authorizes the narrow reference-system source repair, deterministic
artifact regeneration, complete reference and dependent Linux/gVisor
revalidation, replacement artifact assembly, and a new affected-scope freeze
request. It does not authorize publication or unrelated source changes.

The user approved the design on 2026-07-22.

## Repair Result

- `core_artifact_digest` now binds the installed executable
  `@cadenza.io/core/dist/index.mjs` bytes.
- The npm tarball remains separate package provenance in the release manifest.
- The release validator independently hashes the freshly installed module and
  rejects both drift and substitution of the package digest.
- Exact Node `24.18.0` release-consumer validation passes: type checking, nine
  business tests, build, canonical artifact regeneration, and binding checks.
- The regenerated canonical artifact digest is
  `sha256:9b9f1118e5313ac9867cec4bba9162296df5b2d2515ae6b1085dc9a51538b3a1`.
- The repaired artifact passes the 418.54-second autonomous two-Cell gVisor
  scenario and its complete cleanup assertions.

Reference-system replacement commit:
`fbefa9aaad5d3e4511e19a1c5f5e965c30bb9fc6`.

The remaining dependent Linux proof is paused at the separate
[Sprint 9F Linux Proof Timing Bound Gate V1](sprint-9f-linux-proof-timing-bound-gate-v1.md).
