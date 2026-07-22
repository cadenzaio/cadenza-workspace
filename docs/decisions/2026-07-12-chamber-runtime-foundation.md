# Chamber Runtime Foundation

## Context

Environment Bootstrap V0 ends at a signed `handoff_ready` state. The next runtime boundary must independently verify that handoff, resolve immutable runtime artifacts, construct a governed runtime image, materialize callables through language adapters, execute official Cadenza primitives, and publish normalized evidence.

A chamber cannot establish its own containment after it starts. Process separation and a memory-safe implementation language do not grant secure isolation or legitimate host authority. The chamber therefore needs a distinct trusted-host boundary for containment, capability brokering, artifact and key resolution, credential custody, routing, and termination.

## Decision

Create `cadenza-chamber` as a new independent official repository.

- implement the chamber kernel in Rust as ordinary runtime substrate code, not as another Cadenza primitive core.
- use TypeScript/Node as the first language adapter and the official TypeScript core as its primitive implementation.
- keep chamber and cell ownership distinct through a narrow `ChamberHostPort`.
- make activation, runtime images, lifecycle, adapter protocol, primitive ingress, normalized outcomes, and runtime evidence language-neutral contracts owned by `cadenza-chamber`.
- keep bootstrap handoff and core primitive semantics owned by `cadenza`.
- implement chamber contracts and non-privileged execution before privileged activation.
- require a separately approved minimum trusted cell host before activating the seeded `authority_access/admin` gateway.
- reject any claim that a plain child process, Rust itself, or adapter supervision constitutes production containment.

## Consequences

- Chamber Foundation is split into contract/kernel work and the first TypeScript adapter.
- The chamber can be tested through a conformance host without absorbing cell orchestration or distribution.
- A development host may execute non-privileged fixtures but must reject privileged images.
- The bootstrap authority-gateway artifact needs a real reproducible digest and trusted artifact resolver before activation.
- Runtime database credentials remain outside the chamber and future callables; the cell-owned broker will expose domain-shaped authority operations instead.
- The environment remains `handoff_ready` until the minimum trusted host and privileged activation gates are satisfied.
- Python, Elixir, and C# adapters remain follow-up work after the neutral contract and TypeScript adapter are coherent.

## Alternatives

- TypeScript chamber kernel. Rejected because it couples the trusted substrate to the first adapter runtime and expands the ambient Node surface.
- Elixir chamber kernel. Not selected for this boundary; BEAM remains a strong candidate for orchestration and resilient meta-layer work.
- Go chamber kernel. Viable, but Rust better matches the desired small trusted computing base, explicit resource ownership, and future containment integration.
- Combined cell/chamber repository. Rejected because it collapses execution-domain behavior into host and distribution authority.
- Immediate privileged activation in a child process. Rejected because it presents process separation as a security boundary.

## Links

- Design proposal: [docs/agent-harness/exec-plans/completed/2026-07-12-chamber-runtime-foundation-design.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/agent-harness/exec-plans/completed/2026-07-12-chamber-runtime-foundation-design.md)
- Bootstrap decision: [docs/decisions/2026-07-12-environment-bootstrap-foundation.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-12-environment-bootstrap-foundation.md)
- Intended whole: [docs/cadenza-intended-whole.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-intended-whole.md)
- Language doctrine: [docs/cadenza-language-role-doctrine.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-role-doctrine.md)
- Runtime adapter contract: [docs/cadenza-language-runtime-contract.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-runtime-contract.md)
