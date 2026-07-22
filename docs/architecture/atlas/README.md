# Cadenza Visual Architecture Atlas

The atlas explains Cadenza from its intended whole down to critical runtime,
authority, security, evidence, failure, and recovery paths. Canonical Mermaid
sources are technical documentation; rendered SVGs are reviewable projections
of those sources.

## Reading Paths

### Orientation

Start with the [intended whole](./rendered/01-intended-whole.svg), then read the
[system planes](./rendered/03-system-planes.svg) and
[runtime topology](./rendered/06-runtime-topology.svg). These explain why
application code stays centered on workflow and business logic while governed
substrate layers absorb operational complexity.

### Application Author

Read [graph behavior](./rendered/07-graph-behavior.svg), the
[definition-to-execution path](./rendered/04-definition-to-execution.svg), and
the [reference order journey](./rendered/13-reference-business-journey.svg).
The application-author guide links these views back to working code.
Continue with the [local run and detached trace](./rendered/14-local-run-detached-trace.svg)
and the [application-author guide](../../guides/application-author.md).

### Runtime And Security Contributor

Read [repository ownership](./rendered/02-repository-contract-ownership.svg),
[distribution](./rendered/08-distribution-path.svg),
[execution evidence](./rendered/09-execution-evidence.svg),
[scale and reconciliation](./rendered/10-scale-reconciliation.svg),
[actor lifecycle](./rendered/11-actor-lifecycle.svg), and
[security boundaries](./rendered/12-security-capability-boundaries.svg).
Operational detail continues through the [Cell lifecycle](./rendered/15-cell-lifecycle.svg),
[Chamber lifecycle](./rendered/16-chamber-lifecycle.svg),
[reconciliation action lifecycle](./rendered/17-reconciliation-action-lifecycle.svg),
[evidence custody](./rendered/18-evidence-custody-lifecycle.svg),
[stem succession](./rendered/19-scale-change-stem-succession.svg), and
[actor recovery](./rendered/20-actor-write-failure-recovery.svg).

Repository-local `docs/module-ownership.svg` views show stable package and
module responsibilities for every official repository and the reference
consumer.

## Governance

[`manifest.json`](./manifest.json) declares the audience, question, scope,
omissions, identities, states, affects, boundaries, semantic roles, evidence,
owner, source, rendered projection, and validation date for every visual.
[`visual-grammar.md`](./visual-grammar.md) defines shared meaning.
The generated [catalog](./catalog.md) presents every contract in a reader-facing
form and links directly to its source, projection, and evidence.

Validate metadata and evidence links:

```bash
node scripts/validate-architecture-atlas.mjs
```

Render with the digest-pinned Mermaid CLI and validate generated outputs:

```bash
./scripts/render-architecture-atlas.sh
```

Rendered assets never replace their canonical source or cited evidence.
