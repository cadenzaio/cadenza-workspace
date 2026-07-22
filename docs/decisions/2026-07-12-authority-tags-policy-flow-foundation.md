# Authority, Tags, Policy, And Flow Foundation

## Context

Sprint 1 stabilized the core primitive contract and proved it across TypeScript, Python, Elixir, and C#.

The next Cadenza layer needs governed logical objects, immutable versions, tags, policy decisions, and canonical authority flows before environment bootstrap, cells, chambers, distribution, generated bundles, memory, UI/UX, or agent layers can inherit coherent authority semantics.

The user also approved a governance shift: TypeScript remains the working implementation authority, but new security and authority semantics must be language-neutral from the start.

## Decision

Proceed with Sprint 2 as a contract-only authority, tags, policy, and flow foundation.

The sprint starts with semantic authority governance:

- language-neutral markdown contracts
- JSON conformance fixtures
- explicit invariants
- decision records
- translation impact notes

The TypeScript `cadenza` repo remains the first proving implementation, but it is not the long-term semantic authority by itself.

## Consequences

- New authority/security concepts must be described in neutral contract language before or alongside TypeScript implementation.
- TypeScript tests prove the first implementation against shared fixtures.
- Python, Elixir, and C# should consume the neutral contract rather than reverse-engineering TypeScript API shape.
- Authority contracts are added without database clients, migrations, generated CRUD engines, cells, chambers, or runtime adapters.
- Environment storage and bootstrap remain later design gates.

## Alternatives

- Implement database schema now. Rejected because storage would encode unstable semantics too early.
- Keep TypeScript as sole semantic authority. Rejected because security and authority must govern all official languages and adapters.
- Start with tags only. Rejected because tags need logical objects, versions, and policy context to be authoritative rather than decorative.
- Start with policy only. Rejected because policy requires subject/resource identity and effective tags.

## Links

- Design proposal: [docs/agent-harness/exec-plans/completed/2026-07-12-authority-tags-policy-flow-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-12-authority-tags-policy-flow-design.md)
- Intended whole: [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- Language doctrine: [docs/cadenza-language-role-doctrine.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-role-doctrine.md)
- Runtime contract: [docs/cadenza-language-runtime-contract.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-runtime-contract.md)
