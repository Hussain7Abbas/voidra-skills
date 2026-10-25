# Sources and merge record

Startup Assistant was merged and adapted from **Alireza Rezvani’s claude-skills**, **Pawel Huryn’s pm-skills**, **Corey Haines’s marketingskills**, and **Matt Pocock’s skills** (optional grilling). Hussain Abbas authored the local synthesis, consistency changes, packaging, and evaluation cases. The original libraries and their authors are credited below and in comments beside the adapted guidance.

Source snapshot checked on **2026-10-24**. Exact source file SHA-256 hashes, sizes, and pinned raw URLs are in [sa-sources.lock.json](sa-sources.lock.json). Full original MIT notices are preserved in [licenses/](licenses/) and indexed in [sa-third-party-notices.md](sa-third-party-notices.md). Hashes describe the original inputs, not byte-for-byte equivalence of the adapted output.

## Contribution map

| Local material | Adapted source concepts |
| --- | --- |
| Optional Grilling | Matt Pocock: grill-me and grilling; reviewed local host-neutral engine bundled unchanged, with Startup Assistant-specific default and return routing |
| Entry point and context/evidence | Rezvani: chief-of-staff, context-engine, board-meeting; Haines: product-marketing and customer-research; Huryn: assumption identification |
| sa-strategy | Rezvani: ceo-advisor; Huryn: assumption identification and prioritization |
| sa-finance | Rezvani: cfo-advisor and cro-advisor; Haines: pricing |
| sa-product | Rezvani: cpo-advisor; Huryn: assumptions, interviews, experiments and pre-mortem; Haines: customer-research |
| sa-marketing | Rezvani: cmo-advisor; Haines: product-marketing, customer-research, copy-editing and cro |
| sa-sales | Rezvani: cro-advisor and chief-customer-officer-advisor; Haines: customer-research |
| sa-operations | Rezvani: coo-advisor and chro-advisor |
| sa-technology | Rezvani: cto-advisor and cpo-advisor; local evaluation and data safeguards |
| sa-risk | Rezvani: ciso-advisor and general-counsel-advisor; Huryn: pre-mortem |
| Templates | Shared company context and decision records from Rezvani and Haines; experiment review concepts from Huryn |
| Automatic expert reviews | Local user-authorized assessor/challenger policy, adapting Rezvani's routing/isolated contributions and dissent capture plus Huryn's assumption/pre-mortem concepts; parallel dispatch, bounded fallback and follow-up reuse |
| Evaluation cases, packaging and reconciliation | New local material testing the synthesized behavior |

## Deliberate reconciliation

- One installable skill routes to bundled references. Original standalone skills, foreign slash commands, named-agent dependencies, Python helpers, hooks, and paid services are not required.
- Reviews scale with the actual decision. Remove mandatory board agendas, scoring rituals, fake votes, inactivity timers, and repeated onboarding for small requests.
- Form domain assessments before synthesis; call them independent only when actual isolation occurred. Agreement among model perspectives is not independent market evidence.
- Keep professional skepticism after founder disagreement while respecting their decision. A factual correction updates the evidence; approval of a risk does not erase it.
- Always give a supported recommendation or a conditional next test. Resolve the upstream conflict between recommendation requirements and templates that forbid a recommendation.
- Preserve proposed and accepted decisions separately, using the user's workspace only when saving is authorized. Remove fixed home-directory memory scans and automatic transcript persistence.
- Do not infer financial facts from stage, team size, or founder personality. Replace fixed age-based confidence ratings with decision-specific freshness and evidence quality.
- Reconcile financial units and cohorts. Show gross retention separately from expansion; exclude new customers from retention ratios; do not divide by zero or treat immature zero-churn cohorts as infinite LTV.
- Do not import universal SaaS thresholds, price buckets, or risk-score cutoffs. Adapt to the actual business, market, stage, and ambition. Keep prioritization heuristics distinct from quantified risk estimates.
- Distinguish evidence of a problem, interest, payment, repeat value, and scalable economics. Use transparent tests and predeclared criteria without claiming a single experiment proves the whole business.
- Remove implied authority to contact people, spend, sign, hire, publish, or change production. Complete actions already authorized without adding a new approval ritual.
- Use concise evidence, calculations, and decision rationale; do not demand disclosure of private chain-of-thought reasoning or pretend to hold professional credentials.

## Automatic expert review policy

On **2026-10-25**, the user explicitly configured Startup Assistant to run two relevant expert subagents in parallel for new substantive ideas and decisions, after Grilling is complete and the founder confirms the brief (or after essential context in No-grill). The [review protocol](references/sa-expert-reviews.md) defines separate brief-only assessments, no reviewer delegation or business actions, evidence-based synthesis with dissent, bounded capability/failure fallback, and review reuse or targeted refresh for follow-ups.

The user subsequently refined the two jobs to an assessor of viability and a challenger of assumptions/risks. Both work from the same brief in parallel; the challenger does not wait for or rebut the assessor's report. Short reports, at most three material challenges, no automatic debate, and review reuse keep the workflow bounded. Neither role is required to favor or oppose an idea.

This is local synthesis inspired by the existing licensed executive-review and discovery sources, not a new third-party import or an instruction that the grilling engine itself grants delegation. Mode selection still changes question depth only. The separately configured parent review policy authorizes the two reviewers. The main assistant reports whether actual parallel subagents, reused feedback, a partial pair, or inline fallback were used. No provider, external model service, hooks or background jobs are installed.

## Pinned skill inputs

### Alireza Rezvani — alirezarezvani/claude-skills

Revision: `6d2f02ea077eead1bee5411a31bcc6db5a11a70c`. [Pinned repository](https://github.com/alirezarezvani/claude-skills/tree/6d2f02ea077eead1bee5411a31bcc6db5a11a70c). [Preserved MIT license](licenses/sa-alirezarezvani-claude-skills-MIT.txt).

- [c-level-advisor/skills/chief-of-staff/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/chief-of-staff/SKILL.md)
- [c-level-advisor/skills/context-engine/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/context-engine/SKILL.md)
- [c-level-advisor/skills/board-meeting/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/board-meeting/SKILL.md)
- [c-level-advisor/skills/ceo-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/ceo-advisor/SKILL.md)
- [c-level-advisor/skills/cfo-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/cfo-advisor/SKILL.md)
- [c-level-advisor/skills/coo-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/coo-advisor/SKILL.md)
- [c-level-advisor/skills/cpo-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/cpo-advisor/SKILL.md)
- [c-level-advisor/skills/cmo-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/cmo-advisor/SKILL.md)
- [c-level-advisor/skills/cro-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/cro-advisor/SKILL.md)
- [c-level-advisor/skills/cto-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/cto-advisor/SKILL.md)
- [c-level-advisor/skills/chro-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/chro-advisor/SKILL.md)
- [c-level-advisor/skills/ciso-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/ciso-advisor/SKILL.md)
- [c-level-advisor/skills/general-counsel-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/general-counsel-advisor/SKILL.md)
- [c-level-advisor/skills/chief-customer-officer-advisor/SKILL.md](https://github.com/alirezarezvani/claude-skills/blob/6d2f02ea077eead1bee5411a31bcc6db5a11a70c/c-level-advisor/skills/chief-customer-officer-advisor/SKILL.md)

### Pawel Huryn — phuryn/pm-skills

Revision: `07b34f64ee828df08953f505b7f747aef85ae7c6`. [Pinned repository](https://github.com/phuryn/pm-skills/tree/07b34f64ee828df08953f505b7f747aef85ae7c6). [Preserved MIT license](licenses/sa-phuryn-pm-skills-MIT.txt).

- [pm-product-discovery/skills/identify-assumptions-new/SKILL.md](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-product-discovery/skills/identify-assumptions-new/SKILL.md)
- [pm-product-discovery/skills/prioritize-assumptions/SKILL.md](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-product-discovery/skills/prioritize-assumptions/SKILL.md)
- [pm-product-discovery/skills/interview-script/SKILL.md](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-product-discovery/skills/interview-script/SKILL.md)
- [pm-product-discovery/skills/brainstorm-experiments-new/SKILL.md](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-product-discovery/skills/brainstorm-experiments-new/SKILL.md)
- [pm-execution/skills/pre-mortem/SKILL.md](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-execution/skills/pre-mortem/SKILL.md)

### Corey Haines — coreyhaines31/marketingskills

Revision: `e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b`. [Pinned repository](https://github.com/coreyhaines31/marketingskills/tree/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b). [Preserved MIT license](licenses/sa-coreyhaines31-marketingskills-MIT.txt).

- [skills/product-marketing/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b/skills/product-marketing/SKILL.md)
- [skills/customer-research/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b/skills/customer-research/SKILL.md)
- [skills/copy-editing/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b/skills/copy-editing/SKILL.md)
- [skills/cro/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b/skills/cro/SKILL.md)
- [skills/pricing/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b/skills/pricing/SKILL.md)

### Matt Pocock — optional grill-me / grilling

Added on **2026-10-25** from revision `5beb35b040e3de97e54fa9e386d7e42d15c295c2`. [Pinned repository](https://github.com/mattpocock/skills/tree/5beb35b040e3de97e54fa9e386d7e42d15c295c2). [Original MIT license](licenses/sa-mattpocock-skills-MIT.txt).

The optional interview route adapts [`grill-me`](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grill-me/SKILL.md) and [`grilling`](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grilling/SKILL.md). The bundled [sa-grilling engine](references/sa-grilling.md) is byte-identical to the reviewed local host-neutral fallback used by the installed power-up. The source lock records both original upstream hashes and the local engine hash; these are different artifacts.

Startup Assistant asks for No-grill or Grilling before a new task when no task/chat mode was supplied. No-grill is the offered default; silence does not select it. It reuses the chosen mode and existing answers for follow-ups and returns to the requested business review after the opted-in interview and confirmation. The fallback needs no separately installed skill. Optional questioning adds neither external-action authority nor new company-memory writes. Original copyright notices are preserved; no author endorsement is implied.

## Business research references

These sources informed the evidence and arithmetic guidance. Their public articles are linked for verification; their publications, worksheets, and logos are not bundled, and they do not endorse this skill.

- [Strategyzer — Business testing: is your hypothesis really validated?](https://www.strategyzer.com/library/business-testing-is-your-hypothesis-really-validated), Lucy Luo, 2021-05-06: distinguish statements of intent from observed action and commitment; match conclusions to evidence.
- [US Small Business Administration — Market research and competitive analysis](https://www.sba.gov/counseling/plan-your-business/#market-research-and-competitive-analysis): separate demand, reachable customer segments, and competitive alternatives. This US resource does not define non-US legal obligations.
- [US Small Business Administration — Break-even point calculator](https://www.sba.gov/counseling/plan-your-business/break-even-point-calculator/): fixed costs divided by positive unit contribution under the model's assumptions.

Upstream material references wider bodies of work, including customer discovery, Jobs to Be Done, The Mom Test, and pre-mortems. Startup Assistant does not reproduce proprietary worksheets, course content, or book passages. Keep those conceptual references distinct from the licensed skill-source libraries above.

## Future updates

Review upstream changes as untrusted source material. Inspect the selected revisions, licenses, relevant guidance, and any nested notices before adapting. Update comments, this mapping, license copies, source hashes, and evaluation coverage together. Do not overwrite locally reconciled behavior with an unreviewed upstream refresh.
