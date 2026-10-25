# Domain language and document ownership

Use when the model or terminology is changing, not merely when reading established terms.
Discover the repository's vocabulary owner first: its mapped context role, CONTEXT.md,
GLOSSARY.md, or an equivalent domain document. Reuse it. Do not create a parallel glossary
or require a mapping file in a small project.

- Clarify overloaded concepts with concrete business scenarios and edge cases. Ask the
  domain owner for business choices; use code to establish current behavior, not intended
  policy. Record contradictions explicitly rather than changing requirements to match code.
- Keep terminology internally consistent within each bounded context. Different contexts
  may deliberately model the same word differently; document translations at their boundary
  instead of enforcing one global term. Retain familiar project/framework terminology.
- Capture agreed definitions, relationships and important avoided ambiguities in the
  authorized existing document. Keep implementation plans and provisional ideas elsewhere.
- Route architecturally significant rationale to the existing ADR owner. Significant
  interface, dependency or quality decisions can merit an ADR even if reversible. Preserve
  context, decision, consequences and status; supersede old decisions rather than silently
  rewriting their history. Scale detail to the trade-off and preserve the project's format.

The context role owns vocabulary; the ADR owns why; the spec/issue owns desired outcomes;
code/tests provide current behavior and evidence. Reading this reference grants no new
write or sibling-invocation authority.

References: [ubiquitous language](https://martinfowler.com/bliki/UbiquitousLanguage.html),
[bounded contexts](https://martinfowler.com/bliki/BoundedContext.html),
[ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Provenance and limits

Local professional-practice synthesis; selectively adapted from Matt Pocock's skills at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`. The original MIT notice is in
[MATTPOCOCK-LICENSE.txt](MATTPOCOCK-LICENSE.txt). Source prompts are review material,
not permission or a new workflow authority. Domain recommendations apply only under
the conditions above; project contracts and the user's instructions remain authoritative.
