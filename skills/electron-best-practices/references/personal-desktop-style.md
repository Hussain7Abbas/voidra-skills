# Hussain's desktop style

These are personal Electron interface defaults requested on 2026-10-15 and extended on 2026-10-16. Apply them to new apps and the interfaces being changed. A current explicit user request takes precedence. Keep unrelated app features and established design choices in scope.

## Main actions always have hotkeys

- Give each primary user action a discoverable keyboard shortcut, in addition to its visible control. Identify the app's main actions from the actual workflows; do not create actions or extra UI just to fill a shortcut table.
- Use one action/command definition for menu, shortcut and button paths, including enabled state, busy state, permissions and confirmation. A shortcut must never bypass a disabled control, review gate or destructive-action confirmation.
- Prefer app-local Electron Menu accelerators (`CommandOrControl` / `CmdOrCtrl`). OS-wide `globalShortcut` is for an explicitly requested background hotkey, not ordinary main actions. Route commands to the focused applicable window and respect the active modal.
- Preserve native text editing, OS/accessibility shortcuts and input-method composition. Single-letter shortcuts must not fire while typing. Distinguish project undo from text-field undo. Register listeners once and remove them when their owner closes.
- Show platform-appropriate shortcut labels in menus/tooltips or the app's existing help surface; icon-only actions still need accessible names.

Useful defaults, only when the corresponding action exists:

| Action | Default accelerator |
| --- | --- |
| Open Settings | `CmdOrCtrl+,` |
| Open project/file | `CmdOrCtrl+O` |
| New item/document | `CmdOrCtrl+N` |
| Save explicit edits | `CmdOrCtrl+S` |
| Find in the current view | `CmdOrCtrl+F` |
| Existing command palette | `CmdOrCtrl+K` |
| Close window | `CmdOrCtrl+W` |
| Undo / redo | Platform-native menu roles or `CmdOrCtrl+Z` / `CmdOrCtrl+Shift+Z` |

Choose and document nonconflicting shortcuts for other main actions. Context-sensitive commands must preserve form/editor behavior and only execute when that workflow is eligible.

## Always provide the custom titlebar

- New windows use a styled custom titlebar with visible close, minimize and maximize/restore buttons and a main Settings icon at the opposite end from that button group. When settings are needed, this icon opens the same Settings surface as the menu and shortcut. A static viewer with no configurable behavior does not need an invented settings feature.
- Respect platform ordering: close/minimize/maximize on the left on macOS with Settings at the right; Settings at the left and minimize/maximize/close at the right on Windows/Linux, unless the user chooses otherwise. Keep DOM and keyboard order consistent with the visible order.
- Group existing Undo/Redo and panel toggle buttons together beside Settings, at the opposite end from the window controls. Keep these controls in the titlebar rather than adding a separate workspace top bar or a redundant local-project label.
- Center the title against the full window width, independently of the widths of either button group. At narrow widths, layer the buttons above the title and clip or truncate the title beneath them; do not shift the title or let it intercept button clicks. Reserve real layout space and non-draggable regions for both button groups.
- Panel toggles use the same icon in both states, filling the represented pane when open. Do not use a selected background color as the active-state treatment; ordinary hover and focus feedback still applies. Provide an accessible name, `aria-expanded` and `aria-controls` for each toggle.
- Match the app's existing tokens, typography and icon family. Titlebar buttons need names, tooltips, visible focus and pointer targets of at least 24×24 CSS pixels; use comfortably larger targets where space allows. Use actual native window operations, not simulated CSS changes.
- Use Electron's supported frameless or hidden-titlebar configuration for the pinned version. Ensure native traffic lights and custom controls are not duplicated. The titlebar background is draggable (`app-region: drag`); interactive controls are `app-region: no-drag`. Preserve resize edges, native menus and OS window behavior.
- Main owns the operations through a fixed validated action set targeting only the trusted sender's window. Update maximize/restore state on native maximize, unmaximize and fullscreen transitions; support leaving fullscreen through the restore path where applicable.
- Custom titlebar is the default. If the user or existing app explicitly offers a native-titlebar option, preserve that preference and default custom mode to true for fresh/legacy settings. Do not add a native-mode switch to every app without a reason. When frame changes require creating a new window, explain when they apply and preserve unfinished edits; never silently reload or close an editing window to restyle it.
- In an existing native-titlebar mode, retain access to Settings/history/panel controls in a compact accessory opposite the native window controls without duplicating those window controls.

## Panels are always resizable and toggleable

- Make every persistent panel resizable and toggleable: left navigation, right auxiliary/Actions panes, bottom attention/question panes, directory panes and future split panels. This is the default for new and changed panels unless the user explicitly requests otherwise; do not invent panels in an app that does not need them.
- Put the resize divider exactly at the shared pane boundary. Content ends at that line: no empty strip to the left of a right panel, above a bottom panel, or after a divider. Use one thin visible line and a wider overlaid pointer target rather than a layout gutter or duplicate borders.
- Support pointer dragging and keyboard resizing with an accessible separator, orientation, current size and bounds. Use arrow keys for steps and Home/End for limits. Capture the pointer during dragging; Escape or pointer cancellation restores the prior size. Keep previews responsive and persist the final size after the gesture.
- Persist each panel's preferred size and open/closed state. Clamp displayed sizes to the available viewport while keeping the main content usable; shrinking the window must not overwrite the saved preferred size. Restore the preference when space returns.
- Keep each panel's scrolling independent, including bottom panels. Hiding a panel preserves drafts, selection and relevant view state. If focus was inside the hidden panel, return it to the matching toggle. An attention panel may open automatically for a pending answer, without stealing focus from an active editor.
- Verify dragging and keyboard resizing, toggling, reopening, persistence and window-size changes. Inspect the actual right and bottom edges for unused spacing, and confirm all controls remain usable at the minimum supported window size.

## Settings always uses tabs when settings exists

- Start with **General** and **Appearance**. General contains behavioral and integration settings; Appearance contains visual settings such as theme and any requested titlebar preference. Add further tabs only when actual settings justify them. Do not fabricate settings to populate a tab.
- Use proper tablist/tab/tabpanel relationships, selected state and roving tab focus. Left/Right and Home/End move between horizontal tabs. Hide inactive panels from assistive technology and keyboard navigation while preserving unfinished drafts where needed.
- Settings can be reached by the titlebar icon, the app menu and `CmdOrCtrl+,`. Native modal dialogs handle containment and Escape/focus return; do not add a second JavaScript focus trap to a native modal.
- Give every input a visible associated label. Use a real checkbox with switch semantics for boolean switches, and expose its current checked state. Update the visible value immediately while saving; report failures and restore the saved state. Persist app preferences in main, with backward-compatible defaults and without resetting unrelated fields.
- Preserve the existing theme system. If implementing theme selection, offer System/Light/Dark, apply the effective theme before first paint, and keep titlebar, controls and content in the same palette. Do not claim a theme or preference exists when the app has no implementation for it.

## Main content and panels scroll independently

- Bound the app shell to the usable viewport/window height. Keep the titlebar and main toolbar outside the scroll regions. Give flex/grid children appropriate minimum sizes (`min-height: 0`, `min-width: 0`, or `minmax(0, 1fr)`) so content cannot stretch the whole shell.
- Main content, each sidebar and each bottom panel use their own `overflow: auto` region; each shows its own scrollbar when content overflows, without hiding it through CSS. Respect OS scrollbar visibility preferences. Use stable scrollbar gutters when appropriate and contain overscroll so one pane cannot unexpectedly scroll the other.
- Keep menus, recents and popovers reachable inside or above their scroll region; do not let a new overflow container clip interactive content. Keep focused controls visible when the window is small, content is long or text is enlarged.
- Verify with actual overflowing app content: scroll the sidebar and confirm main scroll position is unchanged, then reverse. Also check content that fits does not produce unnecessary scrolling or a page-level scrollbar.

## Finish with a usable desktop interface

Keep the repository's design system, local assets, clear hierarchy and concise labels. Preserve keyboard operation, visible focus, enabled-state contrast, reduced-motion preferences and named icon buttons. Verify changed UI in the built Electron app, including a small supported window and both existing themes. Review actual screenshots and required tests; report limitations honestly.

## Primary API references

- [Electron keyboard shortcuts](https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts)
- [Electron custom titlebars](https://www.electronjs.org/docs/latest/tutorial/custom-title-bar)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
