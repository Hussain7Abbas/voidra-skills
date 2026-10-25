---
name: grilling
description: Optional deep-questioning engine. Use only when explicitly invoked or the user chooses Grilling for an approved supported workflow; never suggest it separately by default.
disable-model-invocation: true
license: MIT
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
  source: https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grilling
  upstream-revision: 5beb35b040e3de97e54fa9e386d7e42d15c295c2
  local-adaptation: optional-grilling-power-up
---

# Grilling engine

This is an opt-in questioning power-up adapted from Matt Pocock’s `grilling`. Use it only after explicit invocation or the user’s selection of **Grilling** for a supported parent skill. Mere relevance, silence and a preselected option are not consent. The selection authorizes local loading of `grill-me` and `grilling` for this task, without a second skill-approval prompt.

## Interview and return

1. Carry in the parent skill, requested outcome, existing answers, task-local mode and authorized scope. If invoked directly without a parent, clarify the idea in chat. Do not ask the workflow-choice question again after the user has already selected Grilling or directly invoked a grilling skill.
2. Map unresolved decisions and their prerequisites. Research discoverable facts with available read-only tools; ask the user for choices, priorities and business constraints. Work inline unless native delegation is already authorized and available. Do not launch another assistant or install anything.
3. Ask a round containing the independent decisions whose prerequisites are settled. Number questions; give each a short title and a separate recommended answer. Word yes/no questions so “yes” agrees with the recommendation. A decision depending on an unanswered question belongs in a later round. Use the available question tool or ordinary chat; do not assume a tool literally named Skill or a host-specific question API. Use one question at a time if the user requests that format.
4. Wait for answers. Recommendations are proposals, not decisions. Recompute the unresolved branches from the answers; reuse settled decisions and reopen only branches affected by new information. Probe assumptions and relevant edge cases deeply without expanding the requested scope or asking for sensitive information unnecessarily.
5. If an answer needs a prototype, experiment or unavailable evidence, mark it unresolved and propose the smallest next step; do not keep rephrasing an unanswerable question. Respect “wrap up”, “skip” or a switch to No-grill. Never invent agreement to finish the tree.
6. When the relevant decisions are settled, or the user asks to wrap up, summarize agreed choices, assumptions and remaining unknowns. Ask whether the understanding is shared and whether to return to the parent workflow. Wait for confirmation; “continue” after that summary is sufficient. If the user switches to No-grill mid-interview, summarize the current answers and return without another grilling gate; material blockers still apply.
7. Return the confirmed answers to the parent skill and continue its originally requested work without a second interview or a fresh skill-approval loop. The power-up changes question depth, not the deliverable or authorization: a planning request remains planning. Standalone grilling ends with the conversation summary. This engine writes no files, creates no tracker, and authorizes no implementation, external action or additional skill. The parent’s already-authorized storage and action rules still apply after return.

Only retain the mode and decisions for this task and its follow-ups. Ask again for a new task unless the user explicitly chose a broader chat-level mode. No-grill remains the default for future tasks. Never activate Voidra through this power-up.
