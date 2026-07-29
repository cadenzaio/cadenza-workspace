# Sprint 10F Closure And Optional RC2 Candidate

Date: 2026-07-28

## Context

Sprint 10A through Sprint 10E established a clean public-lineage baseline,
removed dead purpose, made proof reproducible, challenged failure and security
boundaries, and documented a coherent operational interpretation model.

The remaining work is to validate one exact source and artifact set
recursively and prepare, without publishing, an optional aggregate RC2
candidate.

The user approved the focused design on 2026-07-28 with:
`Design approved. Proceed.`

## Decision

Sprint 10F will:

- validate all official repositories and shared contracts;
- assign RC2 identities only to repositories whose public source or artifacts
  changed after RC1;
- retain the existing signed RC1 identities for unchanged Python, Elixir, and
  C# repositories;
- preserve RC1 release metadata and add an explicit RC2 candidate input;
- build and validate artifacts from clean committed source;
- run fast, complete, and three-scenario privileged hardening proof against
  one measured candidate;
- regenerate affected SBOMs, archives, artifacts, and the aggregate manifest;
- perform a final recursive coherence and security review;
- stop for user judgment before release signing or any GitHub mutation.

The existing release manifest schema can represent mixed RC1 and RC2
repository versions and tags. No release schema change is authorized.

## Consequences

- Workspace, TypeScript core, Environment, Chamber, Cell, and reference system
  may receive affected-only prerelease version commits.
- Python, Elixir, and C# remain validation participants but receive no source
  churn, version bump, or new tag.
- Release tooling may be generalized to accept an explicit candidate input and
  candidate-owned package declarations.
- Any schema, migration, shared contract, runtime protocol, public API,
  architecture, dependency, or substantial product repair returns to a
  focused design amendment.
- A local candidate does not authorize signing, tagging, release creation,
  branch mutation, asset upload, registry publication, or deployment.

## Alternatives

1. Close without RC2. Retained as fallback if candidate assembly exposes
   unjustified risk, but it would leave the post-RC baseline without one
   distributable identity.
2. Retag every repository as RC2. Rejected because unchanged repositories
   should not receive meaningless release identities.
3. Rewrite the RC1 candidate declaration in place. Rejected because it would
   damage RC1 reproducibility.
4. Reuse earlier complete and privileged reports. Rejected because final
   candidate artifacts require an unconditional definitive proof.
5. Publish immediately after proof. Rejected because publication is a separate
   authority decision.

## Links

- [Approved Sprint 10F design](../agent-harness/exec-plans/active/2026-07-28-sprint-10f-closure-optional-rc2-candidate.md)
- [Sprint 10E closure](../publication/sprint-10e-operational-interpretation-stewardship-closure-v1.md)
- [Sprint 10 parent design](../agent-harness/exec-plans/active/2026-07-25-distributed-foundation-consolidation-hardening-design.md)
