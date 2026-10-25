# Dependency-aware planning

Use for multi-step uncertainty or a wide change. Small clear work needs no new plan,
tracker, decision ticket, or approval ceremony. Synthesize settled conversation and source
artifacts first; reopen only decisions affected by missing or changed information.

Separate questions that require a decision from tasks that deliver behavior. Record the
known question, evidence needed and prerequisites; keep still-vague uncertainty as notes.
Refine only the next useful frontier. Do not require every future question to be settled.

Prefer a demonstrable vertical slice. For a broad mechanical/interface change that cannot
land safely in independent slices, plan expand → migrate consumers → contract. Reuse the
project's existing migration/impact guidance; identify compatibility windows, rollback,
verification and final removal. Never treat a shared integration branch as permission to
skip its final integration checks.

Use actual blocker IDs, authoritative acceptance criteria, owned writable surfaces and
observable exits. Recompute ready work when blockers resolve, considering file/contract
and resource conflicts as well as ticket edges. A dependency graph does not authorize
agents, commits, tracker publication, or deployment. Preserve the configured tracker and
integration/release branch distinction.

References: [progressive refinement](https://scrumguides.org/scrum-guide.html),
[parallel change](https://martinfowler.com/bliki/ParallelChange.html).

## Provenance and limits

Local professional-practice synthesis; selectively adapted from Matt Pocock's skills at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`. The original MIT notice is in
[MATTPOCOCK-LICENSE.txt](MATTPOCOCK-LICENSE.txt). Source prompts are review material,
not permission or a new workflow authority. Domain recommendations apply only under
the conditions above; project contracts and the user's instructions remain authoritative.
