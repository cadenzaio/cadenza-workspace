# Canonical Authority Flows V0

Date: 2026-07-12

## Purpose

This catalog consolidates the eight Sprint 2 authority flows into one choreography-oriented reference.

The flows are semantic contracts and evidence shapes. They do not implement persistence, policy enforcement, callable materialization, cells, chambers, placement, or distribution.

## Shared Choreography Rules

- A canonical flow begins with one explicit request envelope and ends with one explicit result envelope.
- Required request/response collaboration is modeled through intents when these contracts later become executable graphs.
- Detached post-commit or convergent work is modeled through signals.
- Strict flows succeed or fail as one semantic boundary.
- Bounded flows protect their immediate authority mutation while allowing named consequences to converge later.
- Loose flows project authority from stronger source records and must never become authority over those sources.
- Rejection and denial are evidence outcomes, not core runtime enforcement.
- Every caller, subject, resource, target object, tag, version, assignment, removal, rule, and decision remains an explicit identity.
- Every creation request proposes each authority identity it may establish.
  Providers validate or reject those identities and never substitute hidden,
  provider-generated identities.
- Object-creation requests carry the complete logical-object authority state;
  providers do not infer authority flags from object type.

## Flow Matrix

| Flow | Shape | Strictness | Immediate authority | Deferred work |
| --- | --- | --- | --- | --- |
| `Version.CreateInitialObject` | orchestrated | strict | object, first version, current pointer, candidate mark | audits, projections, notifications |
| `Version.CreateNextVersion` | orchestrated | bounded | stale-base decision and resolved immutable version | audits, comparisons, projections |
| `Version.SetCurrent` | orchestrated | strict | optimistic current-pointer decision | audits, materialization reconciliation, projections |
| `Tag.Assign` | orchestrated | bounded | direct assignment | effective-tag recomputation, provenance, caches |
| `Tag.Remove` | orchestrated | bounded | immutable removal evidence | effective-tag recomputation, provenance, caches |
| `Tag.RecomputeEffectiveForObject` | reactive | loose | normalized effective-tag projection | caches and downstream derivation |
| `Policy.EvaluateResourceAction` | orchestrated | strict | explainable resource decision | decision audit export |
| `Policy.EvaluateTagAction` | orchestrated | strict | explainable tag-management decision | decision audit export |

## `Version.CreateInitialObject`

### Semantic Boundary

Establish one logical object with its first immutable version, current pointer, and initial primary candidate mark as one valid semantic identity.

### Choreography

1. Receive object identity, authority flags, proposed version and mark
   identities, initial lifecycle state, semantic payload, initial mark, and
   caller.
2. Validate caller identity, object-key uniqueness, object type, lifecycle state, and payload naming.
3. Prepare the logical object, immutable version, current pointer, and candidate mark together.
4. Commit or reject the invariant as one strict operation.
5. Return `created` using the proposed identities and every created authority
   key, or `rejected` without pretending records committed.
6. Emit detached audit, projection, and notification consequences after success or rejection evidence exists.

### Invariant Boundary

- object identity
- first immutable version
- current pointer to that version
- initial candidate mark

## `Version.CreateNextVersion`

### Semantic Boundary

Resolve the next semantic version for an existing object without overwriting immutable history or accepting a stale base.

### Choreography

1. Receive object, base version, proposed version and mark identities, semantic
   payload, candidate mark, and caller.
2. Resolve the object's observed current pointer and validate the base version belongs to the object.
3. Reject with `rejected_stale_base` when the base is no longer current.
4. Canonicalize the semantic payload and resolve its content identity.
5. Return `no_change_current` when it matches current, `reused_existing` when it
   matches another version, or atomically create the proposed version and mark
   identities for `created`.
6. Never move the current pointer in this flow.
7. Emit audit, comparison, and projection consequences after the resolution is known.

### Invariant Boundary

- stale-base protection
- semantic payload identity
- duplicate-version resolution
- immutable version plus candidate mark when created

## `Version.SetCurrent`

### Semantic Boundary

Move one object's current pointer to an existing version under optimistic stale-pointer protection.

### Choreography

1. Receive object, expected current version, target version, reason, and caller.
2. Validate expected and target versions belong to the object.
3. Compare the expected version with the observed pointer.
4. Return `rejected_stale_pointer` without mutation when they differ.
5. Return `no_change` when target is already current.
6. Otherwise move the pointer once and return `updated` with previous and resulting version keys.
7. Emit pointer audit, materialization reconciliation, and projection consequences after the strict pointer decision.

### Invariant Boundary

- expected current version
- target version ownership
- one pointer transition
- before/after pointer evidence

## `Tag.Assign`

### Semantic Boundary

Create one governed direct tag assignment while preserving tag-management policy, category cardinality, and copied category context.

### Choreography

1. Receive object, tag, proposed assignment identity, revision-bound
   authorization decision identity, reason, and caller.
2. Resolve object, tag, category, caller, and current effective authority context.
3. Resolve a preceding `Policy.EvaluateTagAction` decision for `assign_tag` and
   require it to match the current authority revision and request identities.
4. Enforce category management and cardinality constraints.
5. Create the immutable direct assignment or return `rejected` without committed assignment evidence.
6. Signal effective-tag and provenance recomputation after the bounded assignment commits.

### Invariant Boundary

- object and tag identity
- copied category identity
- assignment reason and caller
- active category cardinality

## `Tag.Remove`

### Semantic Boundary

End one direct assignment's current authority effect without deleting its historical evidence.

### Choreography

1. Receive object, tag, assignment, proposed removal identity, revision-bound
   authorization decision identity, reason, and caller.
2. Resolve and bind the assignment to the same object, tag, and category.
3. Resolve a preceding `Policy.EvaluateTagAction` decision for `remove_tag` and
   require it to match the current authority revision and request identities.
4. Create immutable direct-removal evidence or return `rejected` without pretending removal committed.
5. Preserve the original assignment for audit and historical interpretation.
6. Signal effective-tag and provenance recomputation after the bounded removal commits.

### Invariant Boundary

- referenced assignment identity
- immutable removal identity
- object, tag, and copied category agreement
- reason and removing caller

## `Tag.RecomputeEffectiveForObject`

### Semantic Boundary

Project one object's current effective tags and provenance from governed assignments, removals, and later derivation sources.

### Choreography

1. Receive object and caller.
2. Read active source evidence without mutating it.
3. Exclude removed assignments and resolve each effective object/tag pair.
4. Preserve every provenance path that explains why the tag is effective.
5. Return `recomputed`, `no_change`, or `rejected` with no invented projection state.
6. Signal cache refresh and downstream derivation after normalized projection state is known.

### Invariant Boundary

- effective object/tag set
- source-to-object/tag agreement
- removal exclusion
- complete provenance source set

## `Policy.EvaluateResourceAction`

### Semantic Boundary

Explain whether one subject may perform one resource action against one resource under current authority context.

### Choreography

1. Receive subject, resource, action, proposed decision identity, and caller.
2. Resolve subject and resource identity, lifecycle, type, and effective tags.
3. Match allow-only resource rules for the same family and action.
4. Return `allow` only with at least one matching rule.
5. Return `deny` by default with explicit reasons when no allow rule matches.
6. Preserve decision identity, matched rule keys, and reasons as evidence.
7. Export high-value decision audits as detached consequences.

### Invariant Boundary

- subject and resource identity
- action and policy-family agreement
- matched-rule agreement
- explainable allow or deny outcome

## `Policy.EvaluateTagAction`

### Semantic Boundary

Explain whether one subject may assign, remove, or create a governed tag for a target object and tag context.

### Choreography

1. Receive subject, target object, target tag, action, proposed decision
   identity, and caller.
2. Resolve subject, target object, target tag/category, lifecycle, and effective tags.
3. Apply category/system guards and match allow-only tag-management rules for the same action.
4. Return `allow` only with at least one matching rule.
5. Return `deny` by default with explicit reasons when no allow rule matches.
6. Preserve target object, target tag, matched rules, and reasons in decision evidence.
7. Do not mutate tags inside the evaluation flow.

### Invariant Boundary

- subject, target object, and target tag identity
- tag-management action and policy-family agreement
- category/system guard context
- matched-rule agreement
- explainable allow or deny outcome

## Non-Goals

- database transactions or table layouts
- source-to-callable materialization
- runtime policy enforcement
- cell or chamber placement
- transport or distribution
- cache authority
- implicit direct task-to-task calls inside task logic

## Authority Sources

- Semantic vocabulary: [v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/v0.md)
- Shared evidence: [fixtures/v0-authority-foundation.json](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/fixtures/v0-authority-foundation.json)
- Conformance expectations: [conformance-v0.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/conformance-v0.md)
