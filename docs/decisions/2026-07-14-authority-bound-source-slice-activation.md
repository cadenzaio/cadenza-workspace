# Authority-Bound Source Slice Activation

## Context

Production chamber activation could construct only prebuilt-artifact images even though the chamber contract and TypeScript adapter already define digest-locked source-slice materialization. Sprint 5D requires real business and meta-support chambers, so leaving source images accessible only through direct test construction would create a special proof path that bypasses production authority verification.

## Decision

- reserve `cadenza-source-slice-v0` as the exact handler key for source-slice artifacts.
- resolve source authority through the existing immutable `ArtifactResolver` port.
- independently verify the authority-approved artifact identity and digest before decoding.
- accept only bounded canonical JSON that decodes exactly to one strict `RuntimeSlice` value.
- reject duplicate keys, non-canonical bytes, trailing data, unknown fields, source identity drift, dependency drift, and handler confusion.
- construct `MaterializationPlan::SourceSlice` only from the verified source artifact. Every other handler remains a prebuilt artifact.
- do not add a generic definition/database port or duplicate source authority in `ActivationEnvelope`.

## Consequences

- real contained source chambers use the same activation, artifact, image, and evidence path as prebuilt chambers.
- database-authored serialized definitions remain immutable artifact authority until controlled callable materialization inside the chamber adapter.
- source and prebuilt artifact classes are mutually exclusive and explicit.
- the existing cell-chamber protocol does not gain another host capability.

## Alternatives

- include the full source plan in `ActivationEnvelope`: rejected because it duplicates source authority outside artifact resolution and creates disagreement states.
- add a `read_source_slice` host port: rejected because immutable artifact resolution already owns this affect.
- use test-only source-image construction: rejected because it would not prove production activation.

## Links

- [Approved Sprint 5 design amendment](../agent-harness/exec-plans/completed/2026-07-13-single-cell-multi-chamber-orchestration-design.md#sprint-5d-source-activation-amendment)
- [Chamber contract](../../cadenza-chamber/contracts/v0.md)
- [Callable materialization boundary](2026-07-11-callable-materialization-boundary.md)
