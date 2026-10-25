# Test quality and evidence

Apply when designing or reviewing tests. This reference owns shared test-quality criteria;
`eai-tdd-workflow` owns the red → green → refactor process and the selected specialist
owns runner/framework mechanics. Reading this reference invokes neither sibling.

- Derive expected results from an independent specification, worked example, fixture,
  oracle, or meaningful property. Reimplementing the same calculation in an assertion
  can reproduce the same defect. A literal is appropriate when it encodes a real contract;
  incidental version strings, enum counts, or snapshots need a stated behavioral purpose.
- Identify the defect or guarantee the arrangement can detect. A real RED is an observed
  relevant failure, not broken imports or setup. Type-level requirements may use an
  intentional compile failure. Do not mutate production/live systems to manufacture RED.
- Prefer observable behavior through a useful interface. Focused domain/unit tests,
  adapter contract tests, and internal algorithm tests are legitimate when they protect
  distinct risks. Avoid coupling tests to incidental call order or private structure.
- Choose real dependencies, fakes, mocks, and contract tests by the risk and cost. Use
  isolated real I/O to establish serialization/configuration behavior; use mocks at
  unstable external boundaries. A fake is not evidence that its real provider agrees.
- Cover critical normal, rejection, and boundary paths. Add preventive tests for new
  behavior and important risks, not only previously observed incidents. Tests reduce
  recurrence risk; they do not prove a defect can never recur.
- Inspect the project's documented coverage scope, metric, exclusions, and gate before
  using a percentage. No universal 80/90/100 percent target applies across products or
  unit/integration/E2E layers. If no gate exists, report uncovered important behavior and
  propose a risk-based threshold only when requested. Respect an existing required gate;
  never silently lower it or delete/skip tests to manufacture success.
- A test inventory records evidence and gaps; it does not become a prerequisite registry
  for every small test change. Keep expensive/networked checks in named groups.

References: [behavior and legitimate exceptions](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html),
[coverage](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html),
[TDD cycle](https://martinfowler.com/bliki/TestDrivenDevelopment.html).

## Provenance and limits

Local professional-practice synthesis; selectively adapted from Matt Pocock's skills at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`. The original MIT notice is in
[MATTPOCOCK-LICENSE.txt](MATTPOCOCK-LICENSE.txt). Source prompts are review material,
not permission or a new workflow authority. Domain recommendations apply only under
the conditions above; project contracts and the user's instructions remain authoritative.
