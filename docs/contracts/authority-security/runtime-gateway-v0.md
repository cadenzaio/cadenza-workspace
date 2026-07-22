# Authority Runtime Gateway Contract V0

Date: 2026-07-13

## Purpose

This contract defines the first runtime boundary through which a contained
Cadenza authority-access slice may read or change environment authority.

The gateway exists so authored primitive logic can express the eight canonical
authority flows without receiving a database client, credential, SQL surface,
table vocabulary, provider object, filesystem path, network socket, or generic
host-call capability.

## Intended Whole

The authority gateway absorbs persistence, transaction, authorization context,
idempotency, evidence, and schema mechanics below the primitive workflow. The
gateway serves Cadenza's intended whole only when business and meta logic remain
concerned with domain flow and intended function rather than deployment or
database mechanics.

The gateway is not a second core, a generic administration API, a generated CRUD
surface, or permission to execute arbitrary privileged code.

## Authority Operations

V0 exposes exactly nine operations:

- `Version.CreateInitialObject`
- `Version.CreateNextVersion`
- `Version.SetCurrent`
- `Tag.Assign`
- `Tag.Remove`
- `Tag.RecomputeEffectiveForObject`
- `Policy.EvaluateResourceAction`
- `Policy.EvaluateTagAction`
- `Environment.RequestOperationalTransition`

The first eight preserve the request, result, rejection, strictness, and
invariant meaning in `canonical-flows-v0.md`. The ninth is the sole V0
`bootstrap_admin` operation. Family names such as `graph_command` and
`bootstrap_admin` are grouping metadata and never become dispatch inputs.

There is no generic operation name, dynamic procedure name, SQL text, table
name, predicate, transaction instruction, projection expression, or fallback
handler.

## Request And Invocation Envelopes

The contained chamber emits an `AuthorityAccessRequest` from its verified image,
artifact catalog, ingress, and capability request. It contains the fields below
except `contract`, `version`, and `authority_revision`. The chamber's immutable
`source_authority_revision` remains image provenance and is not presented as
current authority for later operations.

The trusted cell validates that request against its independently verified
artifact catalog and active chamber/image/mount binding. It then reads current
authority through the separate activation-reader role and constructs the exact
provider invocation.

Every cell-authored provider invocation binds:

- `contract`: `cadenza.authority-gateway-invocation`
- `version`: `0.1.0`
- `request_key`
- `idempotency_key`
- `operation`
- `environment_key`
- `capability_mount_key`
- `capability_key`: `authority_access`
- `capability_mode`: `admin`
- `cell_key`
- `chamber_key`
- `image_digest`
- `image_epoch`
- `primitive_definition_key`
- `primitive_version_key`
- `subject_object_key`
- `runtime_principal_object_key`
- `authority_revision`
- `deadline_unix_ms`
- `maximum_result_bytes`
- operation-specific `payload`

Version-creation payloads also carry the canonical SHA-256 digest of their
semantic payload. The broker recomputes and verifies this derived field before
provider invocation; callable source cannot choose an unrelated content
identity.

Creation payloads preserve the caller-proposed identities and object authority
properties defined by the canonical flows. A gateway or provider may reject
them but never silently replaces or infers them.

Tag mutation payloads carry `authorization_decision_key`. The provider accepts
mutation only when authority-operation evidence proves that the matching allow
decision produced the current authority revision.

The chamber supplies immutable runtime fields from the active image, mount, and
verified primitive catalog. The cell independently validates those fields and
supplies the current authority revision. Callable source supplies only the
operation payload allowed by its generated facade. Neither callable source nor
the contained chamber can choose or replace current authority.

Invariants:

- all authored keys follow the authority naming contract.
- image epoch, authority revision, deadline, and result bound are positive.
- the absolute deadline has not expired before database execution starts.
- the cell revalidates current trust-root, cell, slice, policy, runtime,
  artifact, and revocation state for every operation.
- the chamber, image, epoch, and mount still match the cell's active session.
- the provider invocation revision is the revision returned by that current
  authority read, and the database applies the final compare-and-set check.
- the primitive definition/version is part of the activated gateway image.
- payload shape is selected by the exact operation before provider invocation.
- unknown or additional fields fail closed.
- credentials and provider objects are not serializable envelope values.

## Invocation Result

Every result binds:

- `contract`: `cadenza.authority-gateway-result`
- `version`: `0.1.0`
- `request_key`
- `idempotency_key`
- `operation`
- `execution_started`
- `outcome`: `committed`, `rejected`, `denied`, or `failed`
- `authority_revision_before`
- `authority_revision_after`
- `result`
- `evidence_key`
- optional normalized `failure`

The result payload is operation-specific and bounded by
`maximum_result_bytes`. It never contains SQL diagnostics, credentials, provider
configuration, server paths, connection strings, or raw database rows outside
the operation contract.

Exact idempotency replay returns the previously committed semantic result. The
cell-enriched current revision is not caller idempotency identity. On replay,
PostgreSQL substitutes the original evidenced revision and requires the
resulting complete invocation digest to match the original. This permits exact
replay after authority advances without weakening payload, image, primitive,
subject, deadline, bound, or operation identity. Reuse of an idempotency key
with any other canonical invocation difference fails.
An operation that may have started but cannot prove its transaction outcome
reports `execution_started = true` and must not be retried as if it were
pre-start rejection.

## Evidence

The authority store has two append-only evidence surfaces:

- runtime evidence for containment, materialization, readiness,
  bootstrap-owner retirement, transaction-created gateway self-test, and
  operational transition proofs.
- authority-operation evidence for every broker invocation and its exact
  idempotency, authority revision, outcome, and canonical result digest.

Evidence contains public identities, digests, revisions, timestamps, and
bounded structured facts. It never contains credentials, private keys, tokens,
provider objects, callable source, arbitrary logs, or raw SQL errors.

Containment, materialization, readiness, and bootstrap-owner-retirement
evidence are independently published before transition and bind the current
authority revision without mutating it. External append rejects
gateway-self-test evidence. The exact operational-transition invocation is the
self-test: its fixed PostgreSQL transaction creates gateway-self-test evidence
after validating invocation and external proofs, then commits operational
transition evidence. The operational transition is the only runtime-evidence
category in V0 whose revision-after is one greater than its revision-before.
Any later transaction failure rolls back the self-test evidence.

Authority mutation and its operation evidence commit in the same database
transaction. Failed or rejected attempts cannot claim committed authority.
Evidence is immutable after insertion.

## Database Roles And API Schemas

V0 uses three deployment authorities:

- bootstrap owner/migrator: schema and static genesis only; absent from the cell
  runtime path after handoff.
- `cadenza_activation_reader`: non-login group role with execute-only access to
  exact read functions in `cadenza_activation`.
- `cadenza_authority_gateway`: non-login group role with execute-only access to
  exact evidence and authority functions in `cadenza_gateway`.

`cadenza_authority_function_owner` is a non-login implementation owner, not a
deployment credential. It owns security-definer functions and receives only the
table privileges those fixed functions require.

Deployment creates login identities separately and grants one group role. The
migration creates no password, token, connection string, or production login.

API rules:

- revoke `PUBLIC` schema and function execution.
- application roles receive no direct table DML, DDL, role, sequence, or
  arbitrary function authority.
- security-definer functions use fixed `search_path`, explicit argument types,
  canonical operation names, and no dynamic SQL.
- the cell broker maps each operation to one statically selected function.
- the activation reader cannot append evidence or mutate authority.
- the gateway role cannot execute bootstrap migration or read arbitrary tables.

## Activation Reads

The activation API exposes exact structured reads for:

- current environment authority revision and operational state.
- active trust root and requested public references.
- current cell enrollment and revocation state.
- current authority-slice version, pinned handler artifact, capabilities, and
  activation policy.
- immutable bootstrap handoff identity and digest.

These functions return domain-shaped JSON records. They do not expose general
query, filtering, ordering, joins, table selection, or raw SQL results.

## Operational Authority

Bootstrap state remains `handoff_ready`. Runtime activation creates a separate
post-bootstrap authority:

- current operational state starts at `pending_activation`.
- immutable transition history records every committed transition.
- V0 permits only `pending_activation -> operational`.

`Environment.RequestOperationalTransition` requires one proof bundle binding:

- environment, handoff, cell, chamber, image digest, and image epoch.
- gateway artifact identity and digest.
- expected authority revision and active trust-root version.
- containment, materialization, readiness, and bootstrap-owner-retirement
  evidence keys and digests.
- request and idempotency identity.

The transaction locks current environment and operational state, revalidates the
active trust root, cell enrollment, authority slice, activation policy, artifact,
handoff, evidence identities, and expected revision. It creates immutable
gateway-self-test evidence for that exact invocation and then commits the
transition, authority-operation evidence, and operational-transition evidence
atomically.

Exact replay returns the existing transition. Conflicting replay, stale
revision, revoked trust/cell, changed artifact, mismatched image/epoch,
unrecognized evidence, missing owner-retirement proof, or non-pending state
fails closed.

The database does not infer deployment credential retirement from a claim. It
accepts only an immutable retirement evidence record appended by the trusted
cell broker from deployment-owned proof. Conformance disables login for the
real bootstrap owner, terminates its sessions, proves zero remaining sessions,
and proves authentication rejection before publishing that evidence.

## Credential Boundary

Database credentials remain in the unprivileged cell's deployment-owned secret
descriptors or later secret provider. They never enter:

- containment plans or OCI configuration.
- launcher requests or receipts.
- cell/chamber or adapter frames.
- runtime images, callable input, generated facades, logs, or evidence payloads.

The contained gateway receives only a generated `authority_access/admin` facade.
The cell broker receives validated typed invocation data and chooses the fixed
provider operation outside containment.

## Non-Goals

- placement, distribution, scaling, actor residency, plugins, agents, UI, CLI,
  memory, or repair administration.
- generic graph queries or generated table CRUD.
- direct database access from chamber, adapter, gateway source, or core.
- callable materialization in the authority store or cell.
- changing bootstrap history to make it look operational.

## Conformance Requirements

Implementations must prove:

- all nine operations are explicit and no generic provider operation exists.
- envelope identity, deadline, authority, mount, payload, and result bounds fail
  closed under mutation.
- direct table access and unauthorized function execution fail for both runtime
  roles.
- each operation preserves its canonical flow semantics and transaction boundary.
- authority mutation and operation evidence are atomic.
- exact idempotency replay converges and conflicting replay fails.
- runtime evidence is immutable, bounded, credential-free, and identity-bound.
- bootstrap state remains `handoff_ready` after operational transition.
- revoked, stale, incomplete, or conflicting transition proof fails.
- synthetic gateway-self-test append fails, and a failed transition leaves no
  self-test evidence behind.
- neither contained code nor the activation reader can obtain credentials or
  mutate authority.

## Authority Sources

- semantic authority: `v0.md` and `canonical-flows-v0.md`.
- static genesis: `../environment-bootstrap/v0.md`.
- containment boundary: `cadenza-cell/contracts/v0.md`.
- chamber activation boundary: `cadenza-chamber/contracts/v0.md`.
- approved implementation plan:
  `docs/agent-harness/exec-plans/completed/2026-07-13-trusted-cell-first-activation-design.md`.
