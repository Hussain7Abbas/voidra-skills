# New-task mode-choice validation

Date: **2026-10-25**. This intentionally replaces the earlier integration's silent No-grill default: Startup Assistant now asks **No-grill (default) or Grilling** before a new task without a supplied task/chat mode. It waits for an answer and reuses the chosen mode on follow-ups. No-grill remains the offered default; silence is not a choice.

This report records the mode-choice snapshot before automatic expert reviews were added. The mode-choice policy is unchanged; the later [expert-review validation](sa-expert-review-validation.md) covers the new reviewer workflow and its content identity.

## Observed behavioral check

One answering agent, separate from the authoring session, read a copied skill package and returned actual next responses for six supplied synthetic contexts. Expected responses and evaluation files were withheld. The author reviewed the frozen answers afterward.

| Context | Actual response | Assessment |
| --- | --- | --- |
| New headline task, no selected mode | Asked “Use Startup Assistant with No-grill (default, fewer questions) or Grilling (deeper questioning)?” and did not perform the edit | Pass |
| Same headline task, user says “Go ahead” after that prompt | “Schedule dental appointments.” | Pass: default No-grill selected |
| Same-task follow-up asking for two words | “Dental scheduling.” | Pass: no repeated mode question |
| New unrelated task after a prior Grilling task, no chat-level mode | Asked the mode question before reviewing the new plan | Pass: task-only mode not carried over |
| New task explicitly requesting No-grill | “Schedule dental appointments.” | Pass: no redundant choice gate |
| New task with an earlier explicit chat-level No-grill choice | “Schedule dental appointments.” | Pass: chat-level choice reused |

The answering agent read only `SKILL.md` and `references/sa-marketing.md`; it did not read or run the interview engine, use external sources, or perform business actions. Synthetic responses and read records were saved outside the distributable package.

## Scope and limits

This is a grouped six-context check in one answering-agent session, reviewed by the author. It is not six independent fresh sessions, a live multi-turn UI trial, human expert validation, or a reliability estimate. Task history was supplied as raw synthetic context. The existing fallback engine and license were unchanged; the earlier fallback interview and mode-switch observations remain historical evidence, not a full replay of this version. The prior business case fixtures now explicitly request No-grill to isolate their business assertions from the new mode question; all twenty-two fixtures were not replayed as model tests.

## Content identity

- Entry-point SHA-256: `dffbe475db2386b9b347f36c5ef07724c743316f4268216f53e52c56c5caac1c`.
- Instruction/fixture aggregate SHA-256: `fbb3b4fe1f03dcd979127c04ad6f8996b9adf85061b1170e3779968e29e4e73a`.

The aggregate uses lexicographically sorted relative POSIX paths for `SKILL.md`, `agents/openai.yaml`, all reference Markdown, asset templates, and `evals/sa-scenarios.json`. Feed each UTF-8 path, NUL, original bytes and NUL into SHA-256. Guides, notices and validation reports are excluded.

## Structural checks

Repository and skill-creator validation passed. The full parent-repository check passed type checking, skill-definition validation and 20 repository tests. Compatibility checks reported no findings across 311 EAI skills. An isolated copy was discovered as one skill; all 51 relative file links resolved inside the package. Original license hashes and bundled engine bytes were unchanged, the recorded instruction digest matched, and both local host links resolved to the canonical folder.
