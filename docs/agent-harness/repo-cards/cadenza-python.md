# cadenza-python

Role: Python translation of the official Cadenza core contract.

Enter this repo when:

- a task implements or validates Python parity with the official `cadenza` core
- a Python-native expression of tasks, signals, intents, helpers, globals, snapshots, or actors is being designed
- shared conformance behavior is being added for Python

Read before editing:

- `docs/cadenza-python-translation-readiness.md`
- `docs/cadenza-intended-whole.md`
- `docs/cadenza-learning-path.md`
- `cadenza-python/AGENTS.md`

First files:

- `cadenza-python/README.md`
- `cadenza-python/pyproject.toml`
- `cadenza-python/src/cadenza/`
- `cadenza-python/tests/`
- `cadenza-python/conformance/core/v0/fixtures/`

Primary commands:

- `cd cadenza-python && python3 -m compileall src tests`
- `cd cadenza-python && PYTHONPATH=src python3 -m unittest discover -s tests`

Contract role:

- Translation target for `core_runtime_primitives`; neutral versioned fixtures in `cadenza` own shared meaning and Python keeps repository-local snapshots.

Routing note:

- Do not import legacy service, DB, CLI, demo, memory, chamber, cells, distribution, or orchestration concepts into this repo unless a later approved design expands the Python scope.
