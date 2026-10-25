# Startup Assistant

One startup advisory skill that selects the right business perspectives and gives candid, evidence-based feedback. Its identifier is **`startup-assistant`**; its display name is **Startup Assistant**. The main skill is unprefixed. Custom supporting files and future subsidiary skills use `sa-`, the initials of Startup Assistant; conventional filenames such as `SKILL.md`, `README.md`, `LICENSE`, and `agents/openai.yaml` keep their standard names.

## Use

Invoke `$startup-assistant` in a host that supports named skills, or ask your agent to use Startup Assistant. Normal automatic selection remains enabled; host and user settings determine when it is selected.

Examples:

- “Use $startup-assistant to review this pricing change. Challenge my assumptions and recommend a rollout.”
- “Use $startup-assistant to improve this landing page. Give me the three most useful changes and revised copy.”
- “Use $startup-assistant to compare hiring a salesperson with founder-led selling for the next quarter.”
- “Use $startup-assistant to assess this delivery business. We want reliable profit rather than venture funding.”

Share the relevant business context and artifact. You do not need a complete onboarding interview for every question. The skill asks only for missing information that can materially change the recommendation.

The skill contains strategy, finance/pricing, product/discovery, marketing/brand, sales/retention, operations/people, technology/data, and risk/governance guidance. It reads only the needed modules. New substantive ideas, plans and decisions receive two relevant expert reviews in parallel, followed by one honest recommendation. Factual questions, tiny edits and ordinary follow-ups stay inline when no new evaluation is needed.

Expert subagents are separate model-based reviewers, not human professionals. Their independent passes can still share blind spots; agreement is not customer evidence or a guaranteed outcome. Specific legal, tax, accounting, and regulated issues receive issue spotting and a targeted referral when needed.

## Optional grilling

Before a new task, Startup Assistant asks **“No-grill (default, fewer questions) or Grilling (deeper questioning)?”** and waits for your answer, unless you already supplied a mode for that task or the chat. No-grill is the offered default; a bare approval after the choice prompt selects it, while silence does not. Follow-ups reuse your choice without asking again. A new task asks again unless you selected a broader chat-level mode. You can also explicitly say “Use $startup-assistant with No-grill,” “Use $startup-assistant with Grilling,” or “Power this review up with grill-me,” or switch modes mid-task.

Grilling reuses your existing context, asks unresolved questions in rounds, and confirms what was settled. Only after the interview is complete and you confirm the brief do the expert reviewers start. Grilling does not repeat the interview, save company context, or authorize business actions. “Be honest” or “challenge my assumptions” alone still requests ordinary candid feedback rather than a deep interview.

The integration can load installed `grill-me` and `grilling` skills after you opt in. If either is absent, it uses the bundled [sa-grilling.md](references/sa-grilling.md) engine directly. No separate installation or download is needed. The engine is adapted from Matt Pocock's MIT-licensed skills; [attribution](sa-sources.md) and the [original license](licenses/sa-mattpocock-skills-MIT.txt) travel with the package.

## Automatic expert reviews

The configured workflow is: choose the mode → gather essential context or finish Grilling → launch an assessor and a challenger together → combine their independent feedback into one recommendation. The assessor evaluates whether the idea works and compares alternatives. The challenger tests its most consequential assumptions and risks, proposing evidence, tests or controls that would resolve them. Each gets relevant expertise and the same facts, without the other's conclusions. The challenger can agree with a sound idea; it does not invent objections to appear different. You do not need to approve their creation again. They cannot start their own subagents, contact anyone, spend money, change business files, or implement their recommendations.

Follow-ups reuse the completed reviews in the conversation. Formatting and clarification stay inline; material new facts refresh only affected reviews, preferably through the existing reviewer handles. A different idea or business gets a fresh brief and pair. There is no automatic company-memory file or background process.

Each role normally returns at most 250 words; the challenger prioritizes at most three material concerns. There are no automatic debate rounds. Two short parallel reviews limit waiting, but add overhead compared with an inline answer; no fixed response time is promised. If the host cannot run two isolated subagents in parallel, the assistant reports the limit and gives a bounded inline or partial review, without pretending it was independent. No external agent service, separate assistant CLI, or provider installation is required. Details live in [sa-expert-reviews.md](references/sa-expert-reviews.md).

## Portable package

The entire folder is the installable unit:

```text
startup-assistant/
  SKILL.md                   Entry point and routing
  agents/openai.yaml         Display metadata
  references/sa-*.md         Expert guidance and optional interview engine
  assets/sa-*.md             Blank company and decision templates
  evals/                     Regression prompts and evaluation rubric
  README.md                  Usage and extraction instructions
  sa-sources.md              Attribution and merge decisions
  sa-sources.lock.json       Exact upstream revisions and source hashes
  sa-third-party-notices.md  Original copyright/license mapping
  LICENSE                    License for the synthesis and new material
  licenses/sa-*.txt          Unmodified upstream MIT licenses
```

No scripts, API keys, paid services, external skills, preconfigured agent profiles, hooks, slash-command handlers, or package dependencies are required for ordinary use. Browsing, files, isolated reviews, and implementation use the capabilities actually available in the host; unavailable capabilities must be disclosed rather than simulated.

## Move into a public repository later

Copy this complete folder into `skills/startup-assistant/` in the new repository. Keep its internal paths, license files, notices, source lock, and evaluation cases together. Add a public repository-level README that links to this guide. If you split out additional skills, give each an `sa-` name and bundle its required references and applicable notices so it can stand alone.

For local installation with the Skills CLI, from the root of a repository containing this folder:

```sh
bunx skills add . --skill startup-assistant
```

Choose the desired host and installation scope when prompted. After a public repository exists, use its actual repository URL in place of `.`. No future repository name or public URL is assumed here. Existing canonical installation links should be updated when moving the source folder.

Keep real company briefs, decisions, transcripts, credentials, and test inputs containing private information outside this package. Templates and evaluation fixtures are blank or synthetic. Publishing the skill does not require publishing business data.

This package is a manually reconciled adaptation of four MIT-licensed libraries; it does not auto-update from upstream. See [sources and adaptation choices](sa-sources.md) and [notices](sa-third-party-notices.md). Preserve those records when extracting or publishing it.

## Validate changes

Use an Agent Skills frontmatter validator and the host's discovery check. Verify that every relative file link resolves inside the copied folder, all four upstream licenses match their hashes in [the source lock](sa-sources.lock.json), and the display metadata matches the entry point. In the current parent repository, run `make validate SKILL=startup-assistant` and `make discover`.

For behavioral validation, use [the evaluation procedure](evals/README.md) and [synthetic cases](evals/sa-scenarios.json). Structural checks cannot establish that the agent gives sound business advice. Record the host/model, cases attempted, actual outputs, failures, and limitations of any real evaluation; do not report expected answers as observed passes.

See the [initial validation record](evals/sa-validation.md) for observed checks, the experiment-design correction, regression results, and evaluation limitations. See the [optional grilling validation](evals/sa-grilling-validation.md) for the default, standalone fallback, confirmation/return, mode-switch and new-task checks.

The [new-task mode-choice validation](evals/sa-mode-choice-validation.md) records the current ask-before-starting policy, default selection, follow-up reuse, task reset, and explicit task/chat choice checks.

The [expert-review validation](evals/sa-expert-review-validation.md) records the original parallel-review checks and the later assessor/challenger role check, including short reports, complementary findings and follow-up reuse, with test limits.
