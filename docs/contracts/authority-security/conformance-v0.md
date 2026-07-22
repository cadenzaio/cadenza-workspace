# Authority Security Conformance V0

Date: 2026-07-12

## Purpose

This note defines the minimum conformance expectations for implementations of the Sprint 2 authority/security contract.

The authority source is still:

- [v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/v0.md)
- [fixtures/v0-authority-foundation.json](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/fixtures/v0-authority-foundation.json)

## Fixture Manifest

Every authority/security fixture should include a root `conformance` object.

Minimum fields:

- `manifest_version`
- `required_case_names`
- `coverage`

Each coverage entry includes:

- `case_name`
- `proves`

Invariants:

- every required case name must exist in `cases`.
- every coverage case name must exist in `cases`.
- every coverage entry must prove at least one named concern.
- coverage names are lowercase dot-separated authority keys.
- the aggregate coverage set must include every concern listed under Required V0 Coverage.

## Required V0 Coverage

The current foundation fixture proves:

- `logical-object.identity`
- `object-version.immutable-payload`
- `version-pointer.current`
- `version-mark.candidate`
- `tag.direct-assignment`
- `tag.direct-removal`
- `tag.effective-provenance`
- `policy.resource-allow`
- `policy.resource-deny`
- `flow.version-create-initial.created`
- `flow.version-create-initial.rejected`
- `flow.tag-assign.assigned`
- `flow.tag-assign.rejected`
- `flow.policy-evaluate-resource.allow`
- `flow.policy-evaluate-resource.deny`
- `flow.version-create-next.created`
- `flow.version-create-next.reused-existing`
- `flow.version-create-next.no-change-current`
- `flow.version-create-next.rejected-stale-base`
- `flow.version-set-current.updated`
- `flow.version-set-current.no-change`
- `flow.version-set-current.rejected-stale-pointer`
- `flow.tag-remove.removed`
- `flow.tag-remove.rejected`
- `flow.tag-recompute-effective.recomputed`
- `flow.tag-recompute-effective.no-change`
- `flow.policy-evaluate-tag.allow`
- `flow.policy-evaluate-tag.deny`

## Naming Rules

- Object keys use lowercase dot-separated segments beginning with letters.
- General authority keys use lowercase dot-separated segments with optional hyphens.
- Intent names in semantic payloads use lowercase hyphen-separated names.
- Authored identity strings must stay strings in every language implementation.

## Validation Rules

Implementations must validate:

- fixture contract name and version
- conformance manifest references
- uniqueness of stable identity keys
- uniqueness of `(object_key, content_hash)` version identity
- at most one primary version mark per version under the V0 mark model
- object/version/pointer boundaries
- tag category consistency
- active object/tag uniqueness and active `single`-category cardinality
- effective tag provenance references
- effective-tag source assignment agreement with the projected object and tag
- policy subject/resource/target references
- matched policy-rule agreement with decision family and action
- allow decisions have at least one matched rule
- all decisions have reasons
- canonical flow declaration strictness
- complete, unique declarations for all eight V0 canonical flows
- flow request/result agreement
- rejected flow results do not pretend that committed records exist
- version creation distinguishes creation, reuse, no-change, and stale-base rejection
- pointer mutation distinguishes updates, no-change, and stale-pointer rejection
- tag removals retain assignment history through separate immutable removal evidence
- effective-tag recomputation agrees with normalized effective-tag provenance

## Rejection And Denial

Rejection and denial are not runtime enforcement in core. They are evidence states that prove the contract can represent negative authority outcomes.

- `Policy.EvaluateResourceAction` denial references a persisted or emitted deny decision.
- `Version.CreateInitialObject` rejection must not include created keys.
- `Tag.Assign` rejection may name the requested object, tag, copied category, and rejected assignment key without requiring a committed direct assignment record.

## Translation Gate

Official language cores should not translate this layer until they can pass the shared fixture, including denied and rejected outcomes.
