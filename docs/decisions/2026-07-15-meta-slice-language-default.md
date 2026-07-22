# Meta-Slice Language Default

Date: 2026-07-15

## Context

Cadenza feature-extending meta slices may use any eligible official language,
but unmanaged language diversity would add adapters, runtimes, dependencies,
deployment images, diagnostics, operational knowledge, and maintenance paths.
C# offers a useful efficient, statically typed, general-purpose baseline, but
no language is most beneficial for every slice.

The user accepted the governing principle after the Sprint 6D.1 closure: the
meta layer needs a default language to constrain complexity, while exceptions
must remain possible when they better serve the intended whole.

## Decision

C# is the default comparison baseline for new general-purpose meta slices.

This is a selection default, not a mandate or a presumption of superiority. A
slice may use another language only when the language demonstrates a material
net benefit over C# for that slice after semantic fit, security, controlled
materialization, measured performance, ecosystem advantage, available chamber
support, and the full operational cost of language diversity are considered.

Each slice has one authoritative language implementation by default. Duplicate
implementations require a separate purpose and governed contract.

The V0 execution-evidence processor remains TypeScript because chamber support
already exists, its workload is primarily custody and database I/O bound, and
adding a C# adapter during the evidence-security pass would expand the trusted
surface without demonstrated benefit.

## Consequences

- C# reduces repeated language-selection debate for ordinary meta slices.
- Efficiency claims must be measured against the real slice workload.
- Elixir, Python, TypeScript, or another eligible language remain valid when a
  slice-specific advantage exceeds added polyglot complexity.
- A language choice does not become precedent outside the slice that justified
  it.
- Runtime substrate selection remains a separate doctrine and is unaffected.

## Alternatives

- Require C# for every meta slice: rejected because semantic, ecosystem,
  concurrency, UI, and runtime fit can make another language materially better.
- Select every slice language from scratch with no default: rejected because it
  externalizes cumulative polyglot complexity into operations and stewardship.
- Keep TypeScript as the universal meta default: rejected because its current
  adapter availability is a bootstrap condition, not proof of universal fit.

## Links

- [`../cadenza-language-role-doctrine.md`](../cadenza-language-role-doctrine.md)
- [`../contracts/execution-evidence/typescript-core-closure-v0.md`](../contracts/execution-evidence/typescript-core-closure-v0.md)
- [`../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md`](../agent-harness/exec-plans/completed/2026-07-15-execution-evidence-implementation-design.md)
