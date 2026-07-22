# Cadenza Distributed Foundation Security Model V1

Date: 2026-07-22

## Purpose

This document states the security contract a Cadenza application author,
runtime contributor, and operator may rely on. The detailed attacker scenarios
and residual risks live in [the threat model](cadenza-threat-model-v1.md).

## Governing Rule

Authority and capability must narrow as execution moves toward authored
business logic. Business logic receives the context and declared Cadenza tools
needed for its function. It must not receive topology, deployment credentials,
provider objects, host APIs, arbitrary persistence, or authority mutation.

## Invariants

1. **Core is not a security boundary.** Core libraries own primitive meaning
   and local graph behavior. They are authority- and persistence-agnostic.
2. **Definition is serialized authority.** A callable is executable only after
   an authorized Chamber path verifies its source and enclosing runtime image.
3. **Primitive materialization and callable materialization are separate.** The
   controlled language adapter materializes callable source; core materializes
   primitives from provided callables.
4. **Chamber is untrusted workload from the host's perspective.** Node VM
   contexts and Rust process supervision add defense in depth but do not replace
   Cell containment.
5. **Cell owns the host boundary.** It owns current authority projection,
   process custody, routing, capability brokerage, evidence custody, and
   termination. It does not own business meaning.
6. **Privilege is role- and operation-specific.** The root launcher, activation
   issuer, gateway, reconciliation, supply, evidence, and actor roles expose
   closed operations rather than generic provider or SQL access.
7. **Current authority is required at affect time.** Signed historical truth is
   insufficient when generation, route, placement, assignment, residency,
   revocation, or deadline can change.
8. **Identity is layered.** Artifact digest, version key, authority revision,
   Cell generation, Chamber image epoch, trace, graph execution, distribution
   execution, transport attempt, actor assignment epoch, and evidence key are
   not interchangeable.
9. **Replay is either exactly equal or rejected.** Reuse of an idempotency,
   launch, transport, mutation, or evidence identity with different authority
   is a conflict, never a new request.
10. **Evidence is not raw observability.** It exports bounded structural claims,
    outcomes, and commitments. Raw business context, callable source, stack,
    credentials, and endpoints are excluded.
11. **Failure does not widen authority.** Missing authority, uncertain commit,
    ledger outage, stale generation, full reserve, or unavailable containment
    may stop work but cannot silently downgrade the contract.
12. **A label is not evidence.** `trusted`, `contained`, `ready`, `durable`, and
    `operational` states require measured inputs and executable proof.

## Capability Path

```text
Environment policy and immutable artifacts
  -> activation grant and runtime image
  -> Cell current-authority projection
  -> signed measured containment plan
  -> Chamber protocol and declared facade
  -> adapter-bound Cadenza tools
  -> authored callable
```

No arrow is reversible. A callable cannot use its execution result to obtain a
broader capability. A Chamber cannot turn a facade into its underlying provider
or credential. A Cell cannot use an ordinary runtime request as generic
authority to mutate the Environment.

## Boundary Ownership

| Boundary                  | Owner                                    | Required proof                                                                       |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Primitive semantics       | Core language repo                       | Shared fixtures and language-native tests                                            |
| Definition authority      | Environment                              | Immutable version, policy, provenance, and canonical digest                          |
| Callable materialization  | Chamber adapter                          | Source/image/artifact/lock identity and supported language contract                  |
| Primitive materialization | Core inside Chamber                      | Definition validation and core conformance                                           |
| Process supervision       | Chamber                                  | Bounded protocol, deadline, crash, stderr, and response handling                     |
| Host containment          | Cell plus root launcher                  | Signed plan, measured `runsc`/rootfs, closed OCI profile, process custody            |
| Durable operation         | Purpose-specific Environment role        | Exact request, current authority, idempotency, immutable evidence                    |
| Cell-to-Cell transport    | Cell                                     | TLS/SPKI identity, signed envelope, current generation/route, replay/deadline checks |
| Actor mutation            | Environment and owner Cell/Chamber       | Assignment epoch, residency, hydrated version, fenced idempotent commit              |
| Execution evidence        | Runtime, Chamber, Cell, ledger processor | Layered report validation, custody receipt, chain, processing outcome                |

## Disclosure Policy

Business context remains in the execution path and may be visible to the
callable that legitimately receives it. It must not be copied into structural
runtime evidence. Evidence may include:

- stable execution and authority identities;
- event type, lane, profile, timing, sequence, outcome, and bounded failure
  classification;
- cryptographic commitments to hidden input or result values;
- Cell/Chamber capture and custody identity.

Evidence must not include raw input/result context, callable source, stack,
credentials, private keys, tokens, provider implementations, or private
transport endpoints.

## Operator Security Responsibilities

Operators must satisfy the supported deployment assumptions, protect and rotate
keys and database principals, keep host/kernel/firmware/gVisor/PostgreSQL
serviced, isolate administrative migration access, monitor evidence pressure,
and treat denied/unavailable outcomes as security-relevant state rather than
errors to bypass.

## Change Rule

A change to a trust role, capability, authority operation, credential,
descriptor, protocol field, containment profile, evidence field, or accepted
deployment assumption requires a threat-model review. Shared contract changes
remain authority-first and must propagate to every affected consumer.
