# Realtime Execution Evidence Protocol V0 Coherence Review

Date: 2026-07-15

Status: protocol approved on 2026-07-15; implementation design remains gated.

## Scope

This review evaluates
[`v0.md`](./v0.md) against the Cadenza intended whole and current official
authority, graph-conclusion, chamber, cell, local-orchestration, and peer-
transport contracts. Legacy `cadenza-service` and `cadenza-db` execution
tracking are treated only as design evidence.

## Intended Whole

The protocol serves the intended whole because business-logic authors do not
need to add tracing tasks, carry deployment identities, or understand chamber,
cell, transport, persistence, and projection mechanics. They continue to author
tasks, signals, intents, and relationships while the runtime establishes one
interpretable execution truth.

It preserves coordination as the graph runner's primary purpose. Evidence
observes graph execution and conclusion; it does not turn the graph into a
result or observability API.

## Identity

Verdict: coherent.

The protocol names identities that would otherwise be dangerously overloaded:

- trace as the overarching causal whole.
- graph execution as one local chamber run.
- task, signal, relationship, composition, inquiry, and inquiry-responder
  executions as primitive-level facts.
- distribution execution as one logical inter-cell call.
- transport attempt as one concrete delivery attempt.
- evidence record and custody receipt as temporal authority.

The inquiry-responder identity is required because current core inquiry
semantics can fan out to multiple responder graphs. The transport-attempt
identity is required because future retry must not create a false new business
call.

## State And Affect

Verdict: coherent with an implementation gate.

Immutable evidence records own historical truth. Mutable status, realtime
views, and relational rows are rebuildable projections. This prevents later
state from rewriting what occurred.

Mandatory custody before affect-bearing success makes interpretation part of
the operational contract rather than best-effort observability. The protocol
also avoids false rollback claims: terminal custody failure after execution has
started becomes an indeterminate integrity failure and quarantine condition.

The unresolved local-journal technology must prove bounded durability,
recovery, and pressure behavior before implementation can claim this invariant.

## Relationships

Verdict: coherent.

Causality is explicit through identities rather than inferred through time or
topology:

- a detached signal causes zero or more new graph executions in the same trace.
- an inquiry names responder obligations and composes their graph conclusions.
- a distribution execution connects source effect, transport attempts, target
  ingress, target graph, and source outcome.
- graph relationship resolution and result-contribution policy remain visible
  without duplicating graph-definition authority.

This preserves semantic differences between coordination, detachment,
request/response, and transport.

## Boundaries And Security

Verdict: coherent.

Trusted runtime capture is separated from feature-level evidence processing.
This is consistent with the language doctrine: substrate may protect and
execute primitives directly, while Cadenza feature extensions should use
Cadenza primitives.

Authored context cannot inject execution identity. Base evidence excludes raw
business values and secrets. Debug material remains a separately governed
disclosure artifact rather than a less secure base envelope.

Cell-generation attestation, source-local sequencing, digest linkage, and
explicit gap state preserve provenance after transport. Exact canonicalization,
signature, and receipt schemas still require shared fixtures.

## Meta Recursion And Pressure

Verdict: coherent.

The protocol preserves the useful legacy pattern of processing evidence with
Cadenza meta graphs while repairing the recursion boundary:

- first capture and custody do not depend on a Cadenza signal.
- the evidence-processing slice receives custody references after acceptance.
- its own production execution uses bounded boundary evidence.
- trusted `processing_eligible: false` state prevents same-pipeline re-enqueue.
- batch acceptance, completion, failure, count, digest, and gaps remain visible.

This is more coherent than either recording every internal meta task or making
the entire layer invisible. Pressure testing must still establish profile and
batch bounds before production use.

## Temporal Stewardship

Verdict: coherent.

Append-only records, replay identity, causal references, sequence gaps, custody
attestation, and rebuildable projections allow later agents to distinguish
completed work, partial knowledge, transport ambiguity, integrity failure, and
projection delay.

Deferring trace closure is correct for V0. A causal trace that crosses detached
signals has no trustworthy global completion boundary until a future trace
steward owns outstanding causal work. Inventing a closing timestamp now would
create false evidence.

## Fragmentation Review

Verdict: repair path defined.

Current official contracts already contain authority evidence, chamber runtime
evidence, cell observations, peer transport evidence, and graph conclusions.
The proposal does not flatten them into one owner. It supplies shared execution
identities and causal links so each layer can retain its legitimate authority
while contributing to one interpretable whole.

The implementation compatibility review resolved the identified ambiguity:

- generic `correlation_key` was removed from official local and peer routing.
- legacy context-carried execution aliases are rejected or stripped at the
  authored-context boundary.
- inquiry, inquiry-responder, and graph-execution identities remain distinct.
- peer evidence carries explicit trace, source effect, distribution, and
  transport-attempt identities.
- chamber and cell evidence validators admit only bounded, named execution
  identity fields and commitments rather than raw context.

## Remaining Design Gates

1. Define canonical schemas, key syntax, digest rules, custody receipts, and
   cross-language fixtures.
2. Select and pressure-test the bounded durable local custody journal.
3. Define authority policy for evidence profiles, diagnostic disclosure,
   retention, and gap repair.
4. Map current chamber, cell, and peer evidence fields without weakening their
   existing fail-closed guarantees.
5. Design the environment evidence meta slice and rebuildable durable ledger
   projection.

## False-Success Check

The design would become locally successful but globally incoherent if
implementation:

- exposes a realtime dashboard before establishing trustworthy custody.
- stores raw context because JSONB is convenient.
- treats mutable status rows as the evidence source of truth.
- uses timestamps to infer distributed causality.
- starts new traces for detached work.
- hides all evidence-processing failures as internal meta activity.
- blocks execution on a remote database after local custody is already secure.
- permits debug mode to bypass containment, redaction, or authority.
- claims trace completion without owning all detached descendants.

## Verdict

The approved V0 protocol is coherent. No principle-level contradiction was
found during semantic review.

Implementation must remain gated because the authority assignment, canonical
schema, local custody mechanism, and cross-repo migration have not yet been
approved or designed in executable detail.
