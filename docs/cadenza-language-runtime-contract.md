# Cadenza Language Runtime Contract

Date: 2026-07-12

Status: V0 implemented for the Chamber-owned TypeScript adapter. Neutral image,
ingress, outcome, lifecycle, artifact, and evidence contracts are fixture
backed; exact execution-evidence custody and capability brokering are
implemented; privileged activation passes the approved Cell-owned Linux/gVisor
containment profile. Further adapters and production hardening remain future
work.

## Purpose

This document defines the contract a language runtime adapter must satisfy before Cadenza can safely execute database-authored source in that language.

It follows the callable materialization boundary:

- database definitions are serialized authority for primitive shape, identity, schemas, options, wiring, and callable slots
- core repos do not compile, evaluate, or materialize source strings
- cells and chambers materialize source strings into callables under policy
- materialized callables execute inside explicit runtime boundaries with capabilities, evidence, and resource controls

This contract applies to business-logic languages and database-authored meta-feature languages. It does not apply to ordinary low-level implementation languages used to build the cell/chamber substrate.

## Ownership

`cadenza-chamber` owns the neutral adapter protocol, lifecycle, artifact
manifest, acceptance surface, and current adapter integration packages.
Language core repositories own primitive meaning and receive already-
materialized callables; they do not own source materialization or Chamber
behavior. `cadenza-environment` owns durable approval of exact runtime and
adapter artifacts. `cadenza-cell` owns containment, process custody, resource
enforcement, artifact resolution, and mediated host capabilities.

Adapters depend on official cores. Official cores never depend on adapters.
Adapters remain co-located in Chamber by default; a separate repository must
be justified by concrete release, stewardship, toolchain, or security-review
evidence.

Implementation evidence:

- `cadenza-chamber/contracts/`
- `cadenza-chamber/docs/coherence-review-sprint-4b.md`
- `cadenza-chamber/docs/cross-language-pressure-review-sprint-4b.md`

## Core Requirement

Source-to-callable materialization is valid only when three requirements are satisfied together:

1. **Materialization**
   - the source definition is converted into a callable using an approved language runtime, version, dependency set, and materialization method
2. **Containment**
   - the callable executes inside a cell/chamber boundary with explicit capabilities, resource limits, cancellation, and security enforcement
3. **Interpretation**
   - the system records enough evidence to explain what ran, why it was allowed, what it used, what it affected, and what happened

Materialization without containment is unsafe.

Materialization without interpretation is temporally incoherent.

## Contract Language

This document uses:

- `must` for mandatory requirements
- `should` for expected behavior that may have a documented exception
- `may` for optional behavior

No exception may bypass containment, authority approval, or evidence.

## Runtime Adapter Responsibilities

A language runtime adapter must provide these capabilities.

### 1. Runtime Identity

The adapter must declare:

- runtime id
- language id
- language version
- adapter version
- supported source formats
- supported callable shapes
- supported dependency declaration forms
- supported execution modes
- supported isolation mode
- supported resource controls

Example:

```json
{
  "runtimeId": "cadenza.runtime.python",
  "language": "python",
  "languageVersion": "3.12",
  "adapterVersion": "0.1.0",
  "sourceFormats": ["function_body", "module"],
  "callableShapes": ["task_handler", "helper_handler"],
  "isolation": ["chamber_process"],
  "resourceControls": ["timeout", "memory", "stdout_limit"]
}
```

### 2. Materialization Input

The adapter must accept a materialization envelope from the cell/chamber host.

Minimum envelope fields:

- definition identity
- definition version
- primitive kind
- handler slot
- language id
- source text or artifact reference
- source digest
- dependency set id or lock digest
- requested capabilities
- input schema reference
- output schema reference
- approved materialization policy reference
- authority revision
- projection revision

The adapter must reject materialization if required identity, digest, dependency, policy, or authority fields are missing.

### 3. Dependency Handling

Dependencies must be declared and constrained before materialization.

The adapter must not fetch arbitrary dependencies at execution time.

The adapter must support evidence for:

- dependency set id
- dependency lock digest
- resolved package/artifact digests
- dependency resolution source
- dependency policy decision
- dependency materialization failure

### 4. Capability Declaration And Injection

The adapter must not expose ambient host powers.

Capabilities must be injected explicitly by the cell/chamber host according to authority and policy.

The adapter must support:

- declared capability requirements
- denied capability reporting
- scoped capability handles
- secret access through mediated providers only
- evidence for capability use
- revocation or cancellation when a capability becomes invalid

### 5. Input Normalization

The adapter must receive inputs in a normalized shape.

It must preserve:

- context payload
- primitive invocation metadata
- initiating subject
- runtime principal
- chamber identity
- cell identity
- authority/projection revisions
- deadline
- cancellation token or equivalent

The adapter must not reinterpret primitive identity from language-local naming conventions.

### 6. Output Normalization

The adapter must return results in a normalized envelope.

Minimum successful result fields:

- status
- returned context or values
- emitted signals or outbound primitive effects observed during execution
- evidence reference
- runtime metrics

The adapter must validate or allow the host to validate outputs against the primitive output schema.

### 7. Error Normalization

Errors must become structured evidence, not only language-native stack traces.

The adapter must classify:

- source parse/compile/materialization error
- dependency resolution error
- policy denial
- capability denial
- timeout
- cancellation
- resource exhaustion
- runtime crash
- handler exception
- schema violation
- unsupported runtime feature

Error evidence should preserve language-native detail where useful without making language-native shape the public contract.

### 8. Resource Limits And Cancellation

The adapter must support host-controlled execution limits.

Required controls:

- timeout/deadline
- cancellation
- stdout/stderr/log size limits
- maximum returned payload size

Recommended controls where the runtime can enforce them:

- memory limit
- CPU limit
- file/network access denial by default
- subprocess denial by default
- import/package access restriction

If a language runtime cannot enforce a control directly, the chamber substrate must provide it or the adapter must declare the limitation.

### 9. Evidence Emission

The adapter must emit evidence for high-value boundaries:

- materialization attempt
- materialization success/failure
- policy decision reference
- dependency set used
- capability grant/denial/use
- source digest
- runtime/language/adapter version
- execution start/end
- timeout/cancellation/resource failure
- handler exception
- output schema failure

Evidence should be linkable to:

- primitive definition
- definition version
- source digest
- chamber image revision
- chamber image epoch
- cell identity
- authority revision
- initiating subject
- runtime principal

### 10. Determinism And Replay Notes

The adapter should record replay-relevant context even when exact deterministic replay is impossible.

Relevant fields:

- source digest
- dependency lock digest
- runtime version
- adapter version
- environment variables allowed
- capabilities used
- time/random/external effects used
- input digest
- output digest

Cadenza should not pretend dynamic business logic is fully deterministic unless the runtime and capability set prove it.

## Runtime Adapter Lifecycle

A runtime adapter should move through explicit states:

- `candidate`
- `approved`
- `active`
- `suspended`
- `revoked`
- `retired`

An adapter can materialize code only while active and only for language/source/dependency/capability combinations approved by authority.

## Adapter Acceptance Gate

A language runtime adapter is not eligible for use until it passes a review against this gate:

| Gate | Requirement |
| --- | --- |
| Identity | Runtime, language, adapter version, source formats, callable shapes, isolation mode, and resource controls are declared. |
| Authority | Adapter refuses to materialize without definition identity, version, source digest, dependency lock, policy reference, and authority/projection revision. |
| Containment | Adapter runs only inside a cell/chamber boundary with timeout, cancellation, output limits, and denied-by-default host access. |
| Dependencies | Adapter uses only approved dependency sets and does not fetch arbitrary packages during execution. |
| Capabilities | Adapter receives only mediated capability handles and records grant, denial, use, and revocation evidence. |
| Inputs | Adapter receives normalized context, invocation metadata, subject, runtime principal, chamber/cell identity, revisions, and deadline. |
| Outputs | Adapter returns normalized success envelopes and supports output schema validation. |
| Errors | Adapter maps language-native failures to structured Cadenza error classes. |
| Evidence | Adapter emits evidence for materialization, execution, policy, dependency, capability, resource, and failure boundaries. |
| Revocation | Adapter has defined behavior when adapter approval, source, dependency set, capability, or chamber image is revoked. |

If an adapter cannot satisfy one row, it may still be prototyped only as an unsafe research adapter. It must not materialize production or trusted-control definitions.

## Adapter Conformance Tests

Every supported language adapter should have a conformance suite that proves:

- valid source materializes only with complete authority metadata
- source digest mismatch is rejected
- missing or stale dependency lock is rejected
- denied capability access fails through the normalized error envelope
- network/filesystem/subprocess access is denied by default
- timeout and cancellation are enforced
- stdout/stderr/log limits are enforced
- handler exception becomes structured evidence
- output schema violation is reported
- successful execution records source digest, runtime version, adapter version, subject, runtime principal, chamber/cell identity, and evidence reference
- adapter refuses execution when suspended or revoked

Language-specific tests may add local checks for runtime behavior, but the cross-adapter conformance suite should protect the shared materialization contract.

## Security Defaults

Default posture:

- deny network access unless granted
- deny filesystem access unless granted
- deny subprocess creation unless granted
- deny host environment access unless granted
- deny secrets unless granted through a mediated provider
- deny package fetching during execution
- enforce deadlines
- capture evidence for all boundary decisions

Convenient dynamic evaluation is not enough. A language is useful only when materialization can be contained and interpreted.

## Relationship To Existing Docs

This document consolidates requirements that already appear across the workspace:

- `docs/decisions/2026-07-11-callable-materialization-boundary.md`
  - core repos receive already-materialized callables
  - source-to-callable materialization belongs in cell/runtime layers
- `docs/cadenza-environment.md`
  - authority, stem-cell, and cell hosts split supply-chain and materialization trust
  - cells materialize only authority-approved, provenance-checked inputs
  - audit is structured evidence, not ordinary logging
- `docs/cadenza-schema-proposal.md`
  - task materialization envelopes should stay storage-agnostic
  - source/language metadata supports interpretation, not direct execution authority
- `docs/cadenza-language-role-doctrine.md`
  - business-logic and database-authored meta languages must support controlled string-to-callable materialization
  - low-level runtime implementation languages are exempt because they do not implement primitives as official core languages

## Post-V0 Design Questions

The TypeScript V0 resolves the first concrete image, protocol, artifact,
evidence, and containment path. These questions remain for future adapters and
hardening:

- how dependency locks map idiomatically in each additional language
- the minimum accepted containment profile for each additional runtime
- whether WebAssembly is required for some adapters or optional
- how shared adapter conformance fixtures are packaged as adapters multiply
- how capability handles appear inside each supported language
- how adapter revocation affects already-materialized chamber images

## Closure Rule

No language should become a supported execution adapter until it can satisfy this contract or has an explicitly approved exception.

No exception may bypass containment and evidence requirements.

## Next Evolution Step

Use the implemented TypeScript boundary and shared fixtures to evaluate future
adapters. A language may be attractive for meta-slice implementation only if it
can either:

- run as a core/business/meta language under this adapter contract, or
- serve as ordinary cell/chamber implementation code outside the database-authored callable path.
