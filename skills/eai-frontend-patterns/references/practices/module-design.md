# Assess module design

Use for a specific structural pain point or requested architecture survey, not as an
excuse to refactor working code. Start with frequently changed or incident-prone paths,
then check actual callers, invariants, tests and ADRs. Churn alone is not a defect.

Assess the interface a caller must learn: types, ordering, configuration, failure modes,
and hidden coupling. A useful module hides meaningful complexity. Ask where that
complexity would go if the module were removed: disappearing indirection and complexity
pushed onto callers are different outcomes. These are heuristics, not line-count ratios.

For an assessment, provide a short ranked set of candidates with affected paths, observed
friction, user/maintainer impact, alternatives, verification and migration risk. Use a
before/after sketch only when it clarifies the choice. Implement only the authorized scope.

For a selected candidate, preserve external behavior, compare plausible interface shapes,
and define evidence at suitable boundaries before restructuring. Ports/adapters, pure
functions, local seams, and focused algorithm tests can coexist. Do not require exactly
two adapters, replace established domain vocabulary, or delete lower-level tests simply
because a higher-level test was added. Remove tests only when their distinct protection
is shown redundant and project policy permits removal.

References: [ports and adapters](https://alistair.cockburn.us/hexagonal-architecture),
[design studio](https://web.stanford.edu/~ouster/cs190-winter24/).

## Provenance and limits

Local professional-practice synthesis; selectively adapted from Matt Pocock's skills at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`. The original MIT notice is in
[MATTPOCOCK-LICENSE.txt](MATTPOCOCK-LICENSE.txt). Source prompts are review material,
not permission or a new workflow authority. Domain recommendations apply only under
the conditions above; project contracts and the user's instructions remain authoritative.
