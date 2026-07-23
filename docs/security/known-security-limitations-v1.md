# Known Security Limitations V1

Date: 2026-07-23

1. **Release-candidate maturity.** The distributed foundation has no production
   support SLA. Exact frozen clean-commit, archive-only, PostgreSQL, Linux,
   gVisor, distributed, reference-system, package-consumer, regeneration, and
   cleanup proofs passed. The unauthenticated remote-clone repetition can only
   occur after separately approved GitHub publication.
2. **Node VM is not a sandbox.** VM contexts narrow accidental access and nested
   code generation, but containment depends on the entire Chamber running in
   the measured Cell/gVisor profile.
3. **gVisor is not a complete security architecture.** It does not prevent
   hardware side channels, protect deliberately exposed sandbox resources, or
   replace host hardening, cgroups, network policy, or separate sandboxes for
   mutually hostile tenants.
4. **Root and authority compromise.** Compromise of the active host root,
   root-owned launcher, PostgreSQL superuser, active signing key, or enrolled
   peer private key is outside subordinate protections. Revocation limits later
   use but cannot reverse prior authorized affect.
5. **Local database transport only.** Cell currently permits NoTLS PostgreSQL
   only through explicit local Unix sockets or loopback. A secure remote
   PostgreSQL transport contract is not implemented.
6. **No automated key rotation service.** Keys and credentials have explicit
   identities and revocation/fencing behavior, but generation, storage,
   monitoring, and rotation automation remain deployment responsibilities.
7. **Availability can fail closed.** Authority outage, ledger outage, evidence
   pressure, stale generations, full journal reserve, uncertain actor commit,
   or unavailable containment may stop work. The system does not trade
   authority or evidence integrity for availability.
8. **Aggregate admission control is external.** Per-Chamber and internal-store
   bounds exist; whole-host and fleet capacity planning, noisy-neighbor control,
   and denial-of-service absorption remain operator responsibilities.
9. **Evidence proves structure and integrity, not business truth.** Commitments
   can prove that a hidden value is unchanged; they do not prove that authored
   business logic was correct or that external provider claims were honest.
10. **One language adapter.** TypeScript is the only implemented Chamber
    adapter. Python, Elixir, and C# cores prove portable primitive meaning but
    are not yet executable distributed adapters.
11. **Serialized Chamber execution.** Chamber execution is intentionally
    serialized for correctness. This is a performance limitation, not an
    isolation guarantee.
12. **Detectors are incomplete.** Dependency, license, secret, and source scans
    reduce risk but cannot prove absence of every vulnerability or secret.
    Publication repeats automated and human review on exact candidate histories
    and artifacts.
13. **Personal-owner and single-maintainer custody.** RC1 is published under
    the personal `cadenzaio` GitHub owner with one maintainer. Organization
    custody and independent review are not claimed. The branch rule must ratchet
    to one independent approval before a second identity receives write
    authority or the project claims multi-maintainer governance.
14. **Release-signing custody is a publication preflight.** No RC1 tag,
    manifest, or release asset may be published until a dedicated
    passphrase-protected Ed25519 SSH signing identity is provisioned, registered
    with GitHub, and kept outside source, artifacts, logs, and inherited runtime
    configuration. Compromise or loss of that key requires withdrawal and
    supersession; automated rotation is not yet provided.
