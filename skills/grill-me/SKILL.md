---
name: grill-me
description: Optional interview power-up for an approved workflow, or an explicitly requested standalone idea interview. Load only after the user chooses Grilling or invokes this skill; do not suggest it separately.
disable-model-invocation: true
license: MIT
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
  source: https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grill-me
  upstream-revision: 5beb35b040e3de97e54fa9e386d7e42d15c295c2
  local-adaptation: optional-grilling-power-up
---

# Grill Me

Provide deep questioning without taking over the parent workflow. Explicit invocation starts the interview; choosing Grilling alongside an approved parent skill is equivalent authorization and needs no further approval prompt.

Load the locally installed `grilling` SKILL.md through an available skill mechanism or by reading its actual file from the current host’s skill installation roots. Do not assume a tool named Skill exists. If `grilling` is unavailable, use the self-contained [bundled grilling engine](references/grilling.md) instead; never install or fetch a dependency during a task. Pass the parent, requested deliverable and already-settled answers into the engine, then resume that parent after the user confirms shared understanding.

Supported parents are `eai-intent-driven-development`, `eai-product-lens`, `eai-council`, `eai-story-lifecycle`, `eai-blueprint`, `eai-brand-discovery` and `startup-assistant`. Standalone use needs no repository and ends in chat; it does not create project instructions, a glossary, ADRs or implementation tasks. Other parent skills require an explicit user request to add this power-up. Do not suggest either power-up as an additional standalone skill when recommending a supported parent.
