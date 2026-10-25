# Fix verification loop
Applies to every bug fix and behavior change. A fix is not done until all steps pass.

1. **Root cause, not symptom.** State the mechanism behind the bug in one sentence (e.g. "server runs in UTC, dates saved as local midnight, formatted without `.tz()`"). If you can't state it, keep investigating before editing.
2. **Hunt the pattern across the codebase.** Before calling the fix done, ask: "Where else does this same mechanism, or a close variant of it, exist?" Then search for it:
   - The exact pattern, plus variants: other call shapes, multi-line chains, wrappers or helpers that hide it, and inverted or wrong ordering (e.g. `.startOf()` before `.tz()`).
   - Every runtime context the code runs in: client vs server, server components, cron jobs, workers, shared packages, validation schemas.
   - Use a scripted scan for anything non-trivial rather than eyeballing grep output. Sanity-check the scan itself: an empty result or a path-parsing error is a scan failure, not proof of zero issues.
   - Classify each hit as **fix**, **safe (why)**, or **false positive (why)**. Don't drop hits silently.
3. **Write check cases before declaring success.** For each fixed site, create concrete cases that expose the bug:
   - Reproduce the **old** behavior failing and the **new** behavior passing, with the same inputs and side by side.
   - Include edge cases: boundaries (midnight, month end, Feb 28/29, year change), empty or null input, and the environment that triggers the bug (e.g. `TZ=UTC`).
   - Put throwaway repro scripts in the scratchpad, never in the repo, and delete any temporary files.
4. **Agentic verification loop.** Repeat until a full pass is clean:
   - Run the check cases, typecheck, lint, and the relevant existing tests.
   - Re-run the pattern scan from step 2.
   - Any failure, new hit, or unexplained result means fix it and start the loop again from the top.
   - Don't stop at "probably fine". Stop only when every check passes and every scan hit is classified.
5. **Review the diff before reporting.** Read `git diff` (and `git diff -w` if formatting changed). Confirm every change is intended and nothing unrelated slipped in, and explain any large formatter churn.
6. **Report honestly.** List what was fixed, what was checked and how, what was classified as safe, and anything you could not verify, with the reason (e.g. a broken local dependency). Never claim verification you didn't run.

## Verified recovery

- When asked to fix a failure, restore the failed operation itself, not just its code-level cause. Carry the fix through the necessary authorized steps, rerun or retry the affected operation, and verify the actual result before calling it fixed.
- For a failed GitHub CI workflow, this includes committing and pushing the relevant fix, triggering the workflow against the fixed commit, monitoring it, and addressing further failures until it succeeds or a concrete external blocker requires user input. Local passing tests alone do not establish that GitHub CI is fixed.
- Treat these recovery steps as part of the original fix request; do not require the user to remind you to apply or retrigger the fix. Respect explicit scope limits, required approvals, and destructive-action safeguards, and report any remaining blocker clearly.

## Constructing the feedback loop

For a hard-to-reproduce defect, use the smallest safe signal that reaches the actual
symptom: a failing test, HTTP/CLI fixture, trace replay, isolated harness, differential
comparison, property/fuzz case, or a known-good/bad revision comparison. Minimize inputs
one at a time while retaining the failure. Pin time/randomness and environment where
possible; for intermittent failures, measure the reproduction rate rather than claiming
determinism. A human observation is evidence when an unattended loop is unavailable.

Form competing falsifiable hypotheses where the cause is uncertain; test discriminating
predictions and change one factor at a time. Tag temporary instrumentation for reliable
cleanup. For performance, measure a baseline and compare under equivalent conditions.

During a live incident, prioritize authorized mitigation and preventing harm; a local
reproduction is not a prerequisite to restoring service. Use logs/telemetry and preserve
evidence when reproducing on live systems would be unsafe. Do not claim a verified fix
until the actual affected operation and applicable regression checks are established.

Selectively adapted from Matt Pocock's diagnosing-bugs at
`5beb35b040e3de97e54fa9e386d7e42d15c295c2`; original MIT notice:
[license](practices/MATTPOCOCK-LICENSE.txt). See also
[Google SRE troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).
