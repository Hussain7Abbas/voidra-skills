# Optional grilling integration validation

**Historical behavior:** this run predates the later new-task mode-choice requirement. Its no-prompt default and reset observations are retained as history, not the current expected behavior. See [the mode-choice validation](sa-mode-choice-validation.md) for the replacement policy and checks.

Date: **2026-10-25**. This record supplements the [initial validation](sa-validation.md); it does not replace historical results or claim that all prior business cases were rerun.

## Observed structural checks

- Startup Assistant passed both repository validation and the skill-creator validator. The parent repository check passed strict type checking, all skill definitions, and **20 repository tests**. The Everything AI compatibility check reported no findings across 311 EAI skills.
- A standalone copied package was discovered as exactly one skill. Its relative file links resolved within that folder, all custom filenames retained `sa-`, and no host-specific absolute paths appeared in the package.
- All four original MIT license files matched their recorded hashes. The newly pinned Matt Pocock source hashes were checked against the actual files at the recorded revision. The bundled engine matched the seven other reviewed fallback copies byte-for-byte: eight bundled copies in total.
- Startup Assistant retained its normal automatic-selection metadata. Both power-up skills retained explicit-only controls. Seven supported parents were recorded consistently in the integration manifest and guide. The local discovery links for both hosts still resolve to the canonical folder.

## Observed behavioral checks

Two answering agents, separate from the authoring session, used copied packages without access to installed power-up resources. They were given synthetic founder requests and resource boundaries, not the expected answers or grading criteria. The author inspected their recorded responses and file-access records afterward.

| Behavior | Actual observation | Assessment |
| --- | --- | --- |
| Default No-grill | A request for an honest, under-eight-word headline edit returned “Schedule dental appointments”. The answering agent read the entry point and marketing reference, without reading the interview engine or asking for a mode. | Pass |
| Standalone Grilling fallback | The opted-in interview read `references/sa-grilling.md` from the copied folder, asked a relevant question round, and stopped for founder answers. It read no installed power-up resource and installed nothing. | Pass |
| Confirmation and return | After supplied answers, the session summarized the known facts and asked for confirmation. After “continue”, it returned to a pricing recommendation without restarting the interview or reopening skill approval. Buyer response remained unknown; proposed pilots remained proposals. | Pass |
| Switching to No-grill | A separate interview respected “Switch to No-grill now”, immediately delivered a conditional business review using supplied facts, and did not require another interview confirmation. An essential conversion-baseline question remained permissible in No-grill. | Pass |
| New task resets the mode | After the completed Grilling review, an unrelated headline task without a mode returned a direct three-word headline rather than another interview. No chat-level mode had been selected. | Pass |

No real client was contacted, no price was implemented, and no company context was persisted. Only synthetic test reports were written outside the package. The new evaluation cases cover the mode default, standalone fallback, confirmed return, and mode switching; multi-turn replies must be sent incrementally rather than preloaded.

## Limits

This is a small model-mediated instruction-following sample, not a statistical reliability estimate or human expert validation. The installed-power-up loading route was checked through source/registry and invocation settings, not a separate live interview. Actual interactions exercised the constrained package-only fallback. The two testing agents each reused their session for related checks, so these are not five independent fresh-session experiments. No real customer research, legal conclusion, deployment, or external business action was tested. The prior sixteen business case families were not all replayed for this integration.

## Content identity

- Entry-point SHA-256: `7c705e0661dd24ef09745d7e75e3ef26b35945625911648571736fb17043c9e8`.
- Instruction/fixture aggregate SHA-256: `8d16973f5553a5074b28f850a76cb4fd22b894d44140e19cf5ef8e7ad0de7724`.
- Bundled engine SHA-256: `5b16ea1510cc652e2515dcdbc2df24f57be7ba0aaaf1f2dd9624e00eb7ee782a`.

The aggregate uses the initial validation record's method: lexicographically sorted relative POSIX paths for the entry point, host metadata, reference Markdown, asset templates and scenario JSON; for each file hash its UTF-8 path, NUL, original bytes, NUL. Maintenance guides, source records, and validation reports are excluded from that instruction digest.
