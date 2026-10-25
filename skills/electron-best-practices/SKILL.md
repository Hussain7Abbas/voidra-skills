---
name: electron-best-practices
description: >-
  Build, modify, debug and review Electron desktop apps with secure process boundaries and Hussain's desktop conventions: main-action shortcuts, centered titlebar titles, grouped Settings/history/panel controls, resizable toggleable panels, tabbed settings and independent scrolling. Use for Electron main/preload/renderer work, window management, IPC, native integration, packaging and desktop testing.
license: MIT
metadata:
  author: agent-skills
  source: https://github.com/jwynia/agent-skills/tree/e02ec7e226a6e4f8419fd3b88a1d8e472d421b32/skills/tech/development/tooling/electron-best-practices
  upstream-revision: e02ec7e226a6e4f8419fd3b88a1d8e472d421b32
  customized-for: Hussain Abbas
  customized-at: "2026-10-16"
  contributors: hussain7abbas <hussain@iscoded.com>
---

# Electron desktop development

This is Hussain's customized global edition of jwynia/agent-skills' MIT-licensed Electron best-practices skill. The original entrypoint is retained in [the upstream guide](references/upstream-skill.md); its example paths are relative to this skill's root. Preserve the upstream attribution and local preferences when updating. Do not replace this customized entrypoint with a downloaded upstream copy.

## Apply the desktop conventions

Read [Hussain's desktop style](references/personal-desktop-style.md) before implementing or reviewing an Electron interface. Main-action hotkeys, a centered titlebar title with Settings/history/panel controls opposite the window controls, resizable toggleable panels, settings tabs and separate scrolling are acceptance requirements for new interfaces. Active panel toggles fill the represented pane in the same icon rather than changing the button background. For a scoped change in an existing app, apply these conventions to the affected interface; do not expand the task into an unsolicited whole-app redesign.

Follow the current user's explicit request and the repository's instructions, stack, design tokens and supported platforms. Existing user-selected settings remain valid; do not reset preferences. These conventions do not authorize publishing, signing-account changes, credential access or unrelated repository changes.

## Implementation boundaries

- Main owns native windows, menus, dialogs, OS integrations and durable app preferences. Preload exposes narrow named operations; renderer owns UI. Preserve established utility/worker boundaries.
- Keep `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false` and `webSecurity: true`. Do not disable these to make a renderer dependency work.
- Validate IPC sender and top-level frame, argument shapes, allowed actions and responses at runtime. Derive the target window from the sender for window controls; never accept arbitrary window IDs or generic channel/method names from the renderer.
- Never expose raw Electron objects, IPC events, filesystem access or unrestricted shell operations. Subscription APIs strip events and return unsubscribe functions.
- Keep CSP strict; restrict navigation, new windows, permissions and external URLs to the app's actual needs. Never copy permissive localhost/network or arbitrary-file examples into production unchanged.
- Keep secrets main-owned using supported OS-backed encryption. Do not initialize credential access just to show a window or read non-secret startup metadata.
- Use asynchronous main-process operations; move heavy work to a utility process or worker. Rebuild native modules for Electron's ABI and target architecture.
- Keep the existing build and packaging tools. The upstream electron-vite/Forge/React/Zustand/electron-store choices are examples, not migration requirements. Do not add tRPC, a state library or a new dependency when existing boundaries suffice.
- Check the project's pinned Electron API behavior against official documentation before adopting changing APIs. Use Playwright's Electron support for real-window tests; do not use deprecated Spectron. Signing, notarization, publishing and automatic installation remain explicit product/release choices.

## Read supporting material as needed

- Security or bridge changes: [context isolation](references/security/context-isolation.md), [CSP/permissions](references/security/csp-and-permissions.md), [typed IPC](references/ipc/typed-ipc.md), [error serialization](references/ipc/error-serialization.md).
- Process architecture or multiple windows: [process separation](references/architecture/process-separation.md), [shared window state](references/architecture/multi-window-state.md).
- React renderer work: [React patterns](references/integration/react-patterns.md), especially subscription cleanup. Other renderer frameworks use the same process/security boundaries with their own UI patterns.
- Distribution: [code signing](references/packaging/code-signing.md), [updates](references/packaging/auto-updates.md), [bundle optimization](references/packaging/bundle-optimization.md), only for the requested release scope.
- Verification: [Playwright Electron tests](references/testing/playwright-e2e.md) and [test structure](references/testing/test-structure.md).

The upstream `scripts/` and `assets/` remain optional reference tooling, not mandatory setup. Their Deno runtime is not required to use this skill. Inspect a helper before running it, use it only for an authorized matching task, and adapt generated examples to the repository and the personal desktop conventions. In particular, upstream scaffolding does not implement Hussain's titlebar, shortcuts or settings; never treat its unmodified output as complete.

## Verify the actual behavior

Choose checks proportional to the change. For new or changed desktop chrome, verify main-action shortcuts, real close/minimize/maximize/restore, Settings access, centered title and button placement at narrow widths, panel toggle icons, pointer/keyboard resizing, saved sizes/visibility, keyboard tabs/switches and independent overflow in the built app. Check resize boundaries have no trailing empty gutter. Test both supported themes when color or layout changes. Check listeners are removed and a second window receives only its own window-control actions. Use real temporary data; substitute only external services or OS choosers where appropriate.

Run the repository's required checks and inspect screenshots of changed UI. Report actual checks and platform coverage, plus any behavior that requires reopening a window. Automated accessibility checks do not establish a manual screen-reader pass.
