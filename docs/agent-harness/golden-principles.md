# Golden Principles

These principles translate the harness-engineering reference into workspace-specific rules.

1. Optimize for agent legibility, not maximum prose.
2. Keep `AGENTS.md` short enough to read quickly and stable enough to trust.
3. Teach Cadenza usage and long-term direction explicitly instead of assuming agents will infer it from code alone.
4. Put volatile guidance in versioned docs, not in one giant instruction file.
5. Route work to the correct authority repo before discussing implementation.
6. Encode architecture and taste once, then enforce it with templates and checks.
7. Prefer explicit status docs and execution plans over hidden context in chat history.
8. Add recurring cleanup loops for drift, stale docs, and missing entrypoints.
9. Make every cross-repo task answer three questions early: authority, consumers, and exit criteria.
10. Favor small reversible structural changes over big reorganizations.
11. When a rule matters repeatedly, add a file, template, or script so future agents do less guessing.
