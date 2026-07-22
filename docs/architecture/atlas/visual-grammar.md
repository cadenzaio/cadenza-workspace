# Cadenza Atlas Visual Grammar

The atlas is an interpretive contract. Color, boundary, shape, and arrow
meaning stay stable across abstraction levels; color is always reinforced by a
text label so the diagrams do not depend on color perception.

## Identity Roles

| Role               | Meaning                                                     | Fill      | Border    |
| ------------------ | ----------------------------------------------------------- | --------- | --------- |
| Semantic authority | Primitive meaning and authored desired behavior             | `#dff3e5` | `#2b6f44` |
| Durable authority  | Committed authority, policy, assignment, or outcome         | `#fff2cc` | `#8a6d1d` |
| Trusted host       | Cell-owned host custody or mediated capability              | `#dcecff` | `#285f8f` |
| Isolated runtime   | Chamber, adapter, or contained runtime work                 | `#eee5f7` | `#6c4c8f` |
| Business logic     | Authored application behavior                               | `#ffe4dc` | `#9a4d38` |
| External substrate | Explicit provider or infrastructure outside Cadenza meaning | `#f0f2f4` | `#5d6872` |
| Evidence           | Bounded observation, commitment, custody, or interpretation | `#dff5f2` | `#26756b` |
| Denied             | Forbidden, stale, revoked, or fail-closed affect            | `#fde2e2` | `#a33d3d` |

## Relationship Grammar

- `-->` is a synchronous or causally required path. Its label names the affect.
- `-.->` is observation, evidence, or detached continuation.
- `==>` is committed authority or a required custody barrier.
- `--x` is forbidden or rejected affect.
- A subgraph or sequence box is a process, trust, or custody boundary, never a
  decorative grouping.
- A state is healthy only when authority, current generation, readiness, and
  required custody agree. Process liveness alone is never rendered as health.

## Abstraction Rules

Each diagram answers one declared question. It names what it omits, links to
evidence, and stays readable without importing detail from a lower level. A
reader must be able to move upward to the intended whole and downward to a
contract, code area, test, or proof report.
