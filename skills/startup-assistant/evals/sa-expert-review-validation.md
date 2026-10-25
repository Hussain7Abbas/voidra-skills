# Automatic expert-review validation

The initial sections below record the prior two-domain-reviewer snapshot. The [assessor/challenger update](#assessorchallenger-update) records the later role specialization; do not apply the original content hash to the current workflow.

Date: **2026-10-25**. This records the two-reviewer workflow added after the [mode-choice snapshot](sa-mode-choice-validation.md). Mode selection, the bundled interview engine and original licenses are unchanged.

## Method

One separate coordinator agent ran a real multi-turn synthetic founder task from a copied package. It could read only the entry point and needed expert/context/interview resources, and could use native reviewer tools. Expected answers, evaluation criteria, source records and prior test conclusions were withheld. The author supplied founder replies one turn at a time and reviewed actual responses and activity afterward. The coordinator could append observations outside the package; reviewers were read-only. No company files, customers or live business actions were involved.

Host: Codex desktop with native collaboration tools. No model override was requested; model identifiers were not independently inspected. Reviewers used fresh contexts (`fork_turns="none"`), the same factual brief and distinct finance/sales guidance. Neither received a preferred parent answer or the peer's feedback. Actual handles were `/root/sa_parallel_coordinator_test/finance_review` and `/root/sa_parallel_coordinator_test/sales_review`. The author separately observed both running simultaneously.

## Observed outcomes

| Stage | Actual behavior | Assessment |
| --- | --- | --- |
| Grilling selected, essential context missing | Asked four relevant questions; did not launch reviewers | Pass: interview readiness gate |
| Founder supplied available answers and requested a summary | Summarized facts, objectives and unknowns; waited for confirmation without reviewer launches | Pass: confirmation gate |
| Founder confirmed the summary | Started finance and customer-retention agents before collecting either result; both returned completed assessments | Pass: actual parallel pair |
| Initial synthesis | Recommended revising the $250 proposal: even full retention gives $2,400 monthly cash surplus against a $2,500 target. Distinguished cash surplus from owner compensation and buyer evidence | Pass: candid, correct, unified recommendation |
| Same facts, request for three bullets | Returned three bullets using the completed reviews; no new reviewer, refresh, mode prompt or interview | Pass: follow-up reuse |
| Variable cost corrected from $80 to $100 | Sent revision-2 delta briefs to both existing handles before collecting either result; no new pair. Both original reports depended on the financial floor and pilot economics, so both were affected | Pass: bounded refresh and handle reuse |
| Updated synthesis | Correctly calculated $2,000 surplus at $250 and the $275 full-retention floor. Superseded its earlier $265 candidate; proposed $285 as an unvalidated sensitivity scenario | Pass: new facts replace stale conclusions |

The refreshed reviewers differed on observing one or two paid billing cycles. The coordinator preserved that disagreement and used the first cycle as a stopping checkpoint and the second before expansion. It did not treat agreement as market evidence or imply the proposed pilot had been authorized or executed.

Both reviewers initially read only their own bundled expert reference, according to their activity reports. They did not delegate or interview the founder. During the cost refresh they reused context without new file reads or tools. The coordinator also requested one factual activity report from each handle for evaluation bookkeeping; these were not extra business reviews. One attempted wait returned `aborted before dispatch`; actual completed outputs arrived afterward, so no unperformed wait was counted as a result.

## Structural checks and scope review

Repository skill validation and the skill-creator validator passed. The full parent-repository check passed type checking, skill-definition validation and **20 tests**. Source/license hashes, unchanged engine bytes, installed canonical links, portable relative links, prefix conventions, standalone discovery and instruction/fixture identity were checked. The package contains 27 synthetic fixtures; adding fixtures is not a claim that all were replayed.

The previous entry point merely allowed isolated reviews when available and authorized; it did not require two native agents or define follow-up reuse. The updated entry point and [review protocol](../references/sa-expert-reviews.md) own those behaviors. Active instructions, package/repository guides, fixtures and source metadata were checked for conflicting routing or delegation language. Historical evaluation results are preserved as snapshots. The engine's generic lack of delegation authority remains appropriate: this parent's review pair is separately configured. Other parent skills' delegation rules were not expanded.

## Content identity

- Entry-point SHA-256: `0e5c33f110e3e8d4c7c0991da0458dc02f511a4517f808f4ded466a01592798a`.
- Review-protocol SHA-256: `73e1a9e49604daa547737414b0d8ac1652dca0288c1a7b063a2b74a63a2a76cb`.
- Instruction/fixture aggregate SHA-256: `25db656af80a20b72bb2b3a04612ce3f9c880dc967743f288222daa6cf5ba8f8`.

The aggregate uses lexicographically sorted relative POSIX paths for `SKILL.md`, `agents/openai.yaml`, reference Markdown, asset templates and `evals/sa-scenarios.json`. Each path, NUL, original file bytes and NUL feeds SHA-256. Guides, source records and validation reports are excluded. The tested copy and final runtime content have the same aggregate.

## Limits

This is one coordinator conversation with a real two-agent pair and follow-ups, reviewed by the author. It is not a statistical reliability estimate, human professional review or full replay of the 27 fixtures. It exercised two-lens refresh; a material change affecting only one lens, expired reviewer handles, new-business reset and unavailable-tool/partial-failure fallback were inspected structurally but not exercised in this run. Earlier mode/default/fallback-interview tests remain historical evidence. No response-time benchmark or fixed latency guarantee was established. Two parallel reviews still add overhead; same-fact follow-ups avoided it in the observed run.

## Assessor/challenger update

Date: **2026-10-25**. The prior contract gave two domain reviewers substantially the same assessment job, which could duplicate work. The revised [protocol](../references/sa-expert-reviews.md) assigns a viability assessor and an assumption/risk challenger. The challenger evaluates the proposal directly from the shared brief, so both jobs remain parallel. Neither is required to support or oppose the idea.

### Actual behavioral run

A fresh coordinator used a copied package for a synthetic four-week delivery-route decision and an unchanged-facts formatting follow-up. It read only the entry point and relevant references; expected outcomes and evaluation/maintenance material were withheld. The author reviewed actual outputs and tool records afterward. Host: Codex desktop native collaboration tools; no model override or independently verified model identifier. Only an external synthetic observation log could be written; no business action or company-memory write was authorized.

The coordinator launched `/root/sa_roles_behavior_test/route_assessor` and `/root/sa_roles_behavior_test/route_challenger` with `fork_turns="none"`, the same factual brief, different jobs and finance/operations guidance. Both dispatches preceded either completed result; the author separately observed both running simultaneously. No peer report or preferred parent conclusion was provided. Both completed reports arrived, with no retry, replacement reviewer, automatic debate or rebuttal.

- **Assessor:** calculated $8 contribution per order, 63 orders for positive four-week contribution at $500 setup, and only $140 at the 80-order ceiling. It compared reducing setup exposure with deferring and flagged that upfront $500 spending could immediately hit the cash-loss stop.
- **Challenger:** ranked three operational concerns: unmeasured route duration, a pilot-only lateness stop that omitted harm to existing deliveries, and unsupported scheduled repeat demand. It supplied practical measurements and controls, acknowledged the proposal's bounded exposure, and did not invent a fatal objection.
- **Length:** 235 assessor words and 242 challenger words by whitespace count, including their evaluation-only resource-read notes. Both stayed within the normal 250-word guide.
- **Synthesis:** one conditional recommendation combined the financial threshold and operational controls without dumping the reports. Both correctly distinguished paid one-off orders from repeat-demand evidence. That legitimate overlap was retained as a concise uncertainty, not treated as extra validation.
- **Follow-up:** exactly three bullets reused the completed reports. No reviewer creation/resumption, new reading, Grilling, mode question or debate occurred; the only tool wrote the authorized observation log.

The reviewers reported reading their respective finance and operations references. Nested resource-read traces were not independently exposed to the coordinator; these are reviewer-reported reads, not invented tool IDs. Full synthetic briefs and actual responses were recorded outside the distributable package.

### Verification and limits

`make validate SKILL=startup-assistant`, the skill-creator validator, `make discover`, the full repository check (**20 tests**), diff review and whitespace checks passed. Portable package links, canonical installed links, source/manifest content identities, all four original license hashes, unchanged interview-engine bytes and supporting-file prefixes were checked. Current runtime content matched the tested copy. Active entry point, protocol, guides, templates, fixtures and provenance metadata were updated together; historical reports and the engine's separate authorization boundary remain appropriate. No unrelated parent skill's delegation policy changed.

This run demonstrates complementary jobs and follow-up reuse in one synthetic decision. It does not prove elimination of overlap, improved business outcomes, universal reliability or a latency bound. It is not human professional validation or a full replay of the **28 fixtures**. Grilling gating, changed-fact deltas, unavailable/partial tools and expired handles were not replayed for this role-only update; earlier observations above remain historical, not a new pass for every branch.

Current entry-point SHA-256: `f5eb13b38269c955335da9e70690de335bf226225cf39d17b3219ca5a3a1ee46`. Protocol SHA-256: `d6730db93a5031a8fb058eaa178f7d05e99be4815a198f6a158c8ae87a4c8e11`. Instruction/fixture aggregate SHA-256: `92d3b7d084da25dae75084a4c6642363ee6ce391bfe3296d988a462546370185`, using the same path/NUL/bytes/NUL scheme defined above.
