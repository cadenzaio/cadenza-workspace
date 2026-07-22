# Cell-Owned Current-Authority Enrichment

## Context

An immutable chamber image records the authority revision verified during
activation. Authority operations and the operational transition advance the
environment authority revision, so reusing the image's source revision would
make every later invocation stale. Replacing the image after each authority
mutation would conflate executable-image identity with changing authority
history.

## Decision

The contained chamber emits a revision-free authority-access request containing
only its immutable image, mount, primitive, ingress, subject, deadline, bound,
and payload identities.

The trusted cell validates that request against an independently verified
artifact catalog and its active chamber/image binding. For every operation, the
cell revalidates current authority through the separate activation-reader
credential and constructs the exact provider invocation with the returned
revision. It then invokes one fixed gateway function through the separate
gateway-broker credential. PostgreSQL performs the final compare-and-set check.

The image's `source_authority_revision` remains immutable activation provenance.
It is never treated as the current revision after authority advances.

## Consequences

- callable source and a compromised contained chamber cannot choose current
  authority revision.
- activation-reader and gateway-broker credentials remain distinct.
- current trust, cell, slice, policy, runtime, artifact, and revocation state is
  rechecked before every provider invocation.
- runtime images do not churn after unrelated authority mutations.
- the cell-chamber protocol must carry a revision-free authority request, while
  the cell-provider contract retains the complete revision-bearing invocation.

## Alternatives

- Let the chamber fetch and supply current revision. Rejected because it assigns
  current-authority interpretation to the contained runtime.
- Reuse `source_authority_revision`. Rejected because it becomes stale after the
  first authority mutation.
- Replace the immutable image after every authority mutation. Rejected because
  it creates continuous image churn without executable-content change.

## Links

- [Runtime Authority Gateway V0](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/contracts/authority-security/runtime-gateway-v0.md)
- [Trusted Cell And First Activation](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/active/2026-07-13-trusted-cell-first-activation-design.md)
