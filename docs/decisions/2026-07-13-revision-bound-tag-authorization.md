# Revision-Bound Tag Authorization

## Context

`Tag.Assign` and `Tag.Remove` promise tag-management policy enforcement, but
their requests did not identify authorization evidence. A provider would
otherwise have to skip policy or create an unnamed inline decision.

## Decision

Both requests require `authorization_decision_key`. It references an explicit
`Policy.EvaluateTagAction` decision for the same subject/caller, target object,
target tag, and action.

An authority provider commits a tag mutation only when the referenced decision
is `allow` and its operation evidence produced the authority revision currently
being mutated. Deny, mismatch, missing evidence, or intervening authority change
returns rejection without creating tag authority.

## Consequences

- tag policy remains an explicit composable primitive flow.
- mutation functions create no hidden policy decisions.
- authority-operation evidence supplies the revision binding needed to prevent
  stale authorization.
- callers must evaluate tag policy again after any intervening authority change.

## Alternatives

- Evaluate policy invisibly inside tag mutation. Rejected because the decision
  would have no caller-proposed identity or independent evidence contract.
- Trust the gateway admin capability alone. Rejected because it would bypass
  the canonical tag-management policy boundary.
- Accept any historical allow decision. Rejected because policy and effective
  tag authority may have changed since that decision.

## Links

- [Canonical Authority Flows V0](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/canonical-flows-v0.md)
- [Explicit Authority Creation Identity](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-13-explicit-authority-creation-identity.md)
