# Review a concrete change

Apply to a requested change review or implementation closeout. Pin the actual review
surface first: merge-base for branch work; include staged/unstaged changes when requested,
and inspect relevant untracked files explicitly. A committed three-dot diff alone does
not cover work in progress. Resolve the actual integration branch; never assume main.

Use two lenses over the same scope:
1. Requirement fidelity: missing/partial acceptance criteria, unintended behavior,
   compatibility requirements and scope expansion. If the spec is absent, state the
   evidence available; do not invent a spec or block an otherwise useful defect review.
2. Engineering quality: demonstrated correctness, security, performance and maintainability
   issues, applicable project conventions, and meaningful test gaps. Repository standards
   and data outrank personal style. Code smells are prompts for investigation, not defects
   without a concrete affected scenario. Do not demand a new architecture for polish.

Keep findings traceable to the requirement or actual call path and changed location.
Report all actionable findings ordered by severity, retaining their lens labels so a
style pass cannot conceal a requirement failure. Separate optional suggestions from
blocking defects. Do not truncate findings to a fixed count or word cap.

When authorized native reviewers are available, give separate briefs with the same base,
scope and raw requirements. Otherwise do distinct inline passes and disclose the lack of
independent review. A reference does not authorize delegation, posting reviews, or merging.

References: [review standard](https://google.github.io/eng-practices/review/reviewer/standard.html),
[review content](https://google.github.io/eng-practices/review/reviewer/looking-for.html),
[diff scopes](https://git-scm.com/docs/git-diff).

## Provenance and limits

Local professional-practice synthesis; selectively adapted from Matt Pocock's skills at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`. The original MIT notice is in
[MATTPOCOCK-LICENSE.txt](MATTPOCOCK-LICENSE.txt). Source prompts are review material,
not permission or a new workflow authority. Domain recommendations apply only under
the conditions above; project contracts and the user's instructions remain authoritative.
