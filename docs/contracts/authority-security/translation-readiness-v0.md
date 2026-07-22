# Authority Security Translation Readiness V0

Date: 2026-07-12

## Purpose

This note records how the Sprint 2 authority/security contract should translate from the TypeScript proving implementation into the official Python, Elixir, and C# cores.

The semantic authority remains the neutral contract and fixture set:

- [v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/v0.md)
- [fixtures/v0-authority-foundation.json](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/fixtures/v0-authority-foundation.json)
- [conformance-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/conformance-v0.md)

## Current Proving State

- TypeScript has the first implementation in `cadenza/src/authority/contracts.ts`.
- TypeScript validates the shared fixture through `cadenza/tests/unit/authority-contract.test.ts`.
- Python has the first cross-language translation in `cadenza-python/src/cadenza/authority.py`.
- Python consumes the same workspace fixture directly through `cadenza-python/tests/test_authority_contract.py`.
- Python expresses normalized evidence as frozen dataclasses with tuple-backed collections while preserving JSON field names, authored identity strings, and open semantic payload mappings.
- Elixir has the second cross-language translation in `cadenza-elixir/lib/cadenza/authority.ex` and `cadenza-elixir/lib/cadenza/authority/contracts.ex`.
- Elixir consumes the same workspace fixture directly through `cadenza-elixir/test/authority_contract_test.exs`.
- Elixir expresses normalized evidence as immutable structs, dispatches flow envelopes by binary `flow_key`, and proves that authored identities are not converted into atoms.
- C# has the third cross-language translation in `cadenza-csharp/src/Cadenza/AuthorityContract.cs` and `cadenza-csharp/src/Cadenza/AuthorityContracts.cs`.
- C# consumes the same workspace fixture directly through `cadenza-csharp/tests/Cadenza.Tests/AuthorityContractTests.cs`.
- C# expresses normalized evidence as immutable records, uses a sealed flow-envelope hierarchy, and proves exact snake_case serialization for the complete fixture.
- The fixture currently proves:
  - logical objects
  - immutable object versions
  - current version pointers
  - version marks
  - tag categories
  - tags
  - direct tag assignments
  - immutable direct tag removal evidence
  - effective tags with provenance
  - policy rules
  - policy decisions
  - canonical flow declarations
  - request/result envelopes for all eight canonical authority flows
  - next-version creation, existing-version reuse, current-version no-change, and stale-base rejection
  - current-pointer updates, no-change, and stale-pointer rejection
  - tag removal and effective-tag recomputation
  - resource-access and tag-management policy evaluation
  - denied policy evidence
  - rejected version and tag flow evidence
  - conformance manifest coverage

## Translation Rules

- Preserve JSON field names exactly.
- Preserve authored identity strings as strings, not atoms, enums, symbols, or language-native identifiers.
- Represent canonical enum values with language-native types only when they serialize back to the same JSON strings.
- Treat flow envelopes as discriminated unions keyed by `flow_key`.
- Keep callable materialization out of all core translations.
- Keep persistence, chamber placement, cell execution, and runtime enforcement out of all core translations.
- Validate semantic cross-references, not just field shapes.

## Python Notes

- Implemented expression: frozen dataclasses, tuple-backed collections, and explicit standard-library validators with plain mappings for authored payloads.
- Keep `semantic_payload` and `initial_version_payload` as `dict[str, Any]`.
- Use `Literal[...]` or enums only if JSON serialization remains string-stable.
- Prefer explicit validator functions over clever metaprogramming; this layer is authority evidence, not execution logic.

## Elixir Notes

- Implemented expression: structs for local contract clarity, maps for fixture ingestion and authored payloads, and binary strings for all authored identities.
- Do not convert authored keys such as `task.orders.validate` or `module.payments` into atoms.
- Pattern matching is useful for flow-envelope dispatch by `flow_key`, but external data must remain string-centered.
- BEAM strengths should be reserved for later runtime/chamber work; the core translation should stay boring and semantically exact.

## C# Notes

- Implemented expression: immutable records, a sealed record hierarchy for flow envelopes, explicit `JsonElement` normalization, and `System.Text.Json` field-name attributes.
- Preserve snake_case JSON field names in serialized fixtures.
- Use discriminated modeling through sealed records or explicit envelope parsing by `flow_key`.
- Keep payload fields as `Dictionary<string, object?>` or equivalent JSON element types until stronger payload contracts exist.

## Remaining Tooling Gaps

These gaps do not block the completed core propagation, but should be reconsidered before external or generated conformance tooling depends on this contract:

- no JSON Schema or generated conformance package yet
- no separate fixture file for each negative case yet
- signal naming rules are not exercised by this authority fixture because signal definitions are not part of the current contract
- rejected flow results use stable result fields for cross-language shape stability; later revisions may split success and rejection result records if concrete consumers benefit

## Recommendation

The V0 authority/security contract is now proven in TypeScript, Python, Elixir, and C#. Keep the neutral contract, fixture, and manifest as semantic authority and treat all four implementations as conformance evidence.

Recommended next step:

1. Run a cross-language coherence closure review.
2. Decide whether JSON Schema or generated conformance tooling is needed before environment bootstrap implementation begins.
3. Keep negative examples in the current shared fixture unless readability or independent tool consumption creates a concrete reason to split them.
