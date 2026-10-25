---
name: godot-vr
description: "Build, export, deploy and debug Godot 4.x VR apps for standalone headsets (Meta Quest 2/3/Pro, Pico, Android XR) using OpenXR, Godot XR Tools and the Godot OpenXR Vendors plugin. Covers macOS toolchain setup (JDK 17, Android SDK, Gradle build template, keystore), project settings that work on device, runtime loading of downloadable GLB/glTF content, and an on-device debugging playbook (adb screencap of the immersive view, draw-call counters, probe renders). Use whenever the user works on a Godot VR/XR project, mentions Quest, OpenXR, XR Tools, xr-tools, godot_openxr_vendors, sideloading an APK to a headset, or reports a headset-only symptom such as a gray view, a stuck splash screen, or an app that will not launch in VR."
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
---

# Godot VR (Quest / OpenXR)

Everything here was verified on real hardware (Quest 3, Godot 4.7.2, XR Tools 4.5.1,
OpenXR Vendors 5.1.0). Device-only bugs dominate this domain: **the desktop preview passing
proves nothing about the headset.** Always verify on device before declaring success.

## Workflow

1. **Check the toolchain first** (`references/toolchain-macos.md`). Missing JDK, SDK packages,
   keystore or Android build template are the most common blockers, and each has a one-line fix.
2. **Set up the project** with the device-safe settings below.
3. **Wire movement/interaction with XR Tools** rather than hand-rolling: staging (scene switching
   + fades), `XRToolsPlayerBody`, movement providers, `FunctionPointer`, `Viewport2Din3D` menus.
4. **Automate with a Makefile** (`make export`, `make deploy`, `make logcat`, `make check`) —
   see the `makefile-standards` skill. Filter known-harmless engine noise, keep full logs.
5. **Verify on device** with the playbook in `references/device-debugging.md`.

## Project settings that work on device

```ini
[rendering]
renderer/rendering_method="mobile"        ; Mobile renderer is Godot's recommendation for Quest
textures/vram_compression/import_etc2_astc=true

[xr]
openxr/enabled=true
openxr/foveation_level=1                  ; 1-2. High levels shimmer in the periphery
openxr/foveation_dynamic=true
shaders/enabled=true

[physics]
common/physics_ticks_per_second=72        ; XR Tools StartXR raises this to the headset refresh rate
```

**Never enable `rendering/anti_aliasing/quality/msaa_3d`.** See the pitfalls table.

**Anti-aliasing without MSAA:** supersample instead. Set `render_target_size_multiplier` on XR Tools'
`StartXR` (as an inherited-node override in the staging scene, since StartXR applies it in its own `_ready`
before the session starts). 1.2–1.3 is the useful range (1.25 ≈ 1.56× pixels). Log
`XRServer.primary_interface.get_render_target_size()` on `xr_started` to confirm it took effect. The roughness
limiter and 4× anisotropic filtering are already on by default. Avoid FXAA in VR (blurry text).

The default OpenXR action map path is `res://openxr_action_map.tres`. Copy the XR Tools demo's
action map there; it defines `trigger_click`, `grip_click`, `primary`, `ax_button`, `by_button`,
`menu_button` bindings for every controller profile.

## Device pitfalls (each one cost hours)

| Symptom on the headset | Cause | Fix |
| --- | --- | --- |
| Flat gray/blue view, occasional color flashes, scene never appears, yet draw calls are normal | `msaa_3d` enabled. MSAA never resolves into the XR swapchain (Godot 4.7.2 Mobile + OpenXR on Adreno) | Set MSAA 3D to **Disabled**. Re-test before re-enabling on a newer Godot |
| App sits forever on a dark splash | XR Tools staging `prompt_for_continue = true` waits for a 2-second trigger **hold** with no visible instruction | `prompt_for_continue = false` in your staging `_ready()` before `super()` |
| `Invalid call ... 'is_xr_active' in base 'Nil'` from `hold_button.gd` | XR Tools finds `StartXR` via an ancestor whose name matches `*Staging` | Name the staging root node `MainStaging` (or any `*Staging`) |
| `Parse Error: Not all code paths return a value` in `function_teleport.gd` / `viewport_2d_in_3d.gd` | XR Tools ≤ 4.5.1 vs Godot 4.7's stricter parser | Backport upstream's fix: `_property_get_revert` ends with `return null`. Record the patch in `VERSIONS.md` |
| `WARNING: Property not found: 'xr/openxr/extensions/hand_tracking'` at startup | The OpenXR Vendors GDExtension reads the setting before Godot's OpenXR module registers it | Cosmetic. `=false` cannot be stored (Godot strips default-valued settings on re-save); only `=true` silences it, which advertises hand tracking you may not implement. Filter it in tooling |
| `ERROR: EditorSettings not instantiated yet ... "export/android/shutdown_adb_on_exit"` | Godot bug: the Android export platform reads an editor setting while a **finished** headless export shuts down | Ignore. Exit code is 0 and the APK is written. Filter it, and verify the APK exists instead |
| Godot CLI hangs on macOS | OpenXR fails to start and `OS::alert` opens a blocking dialog, even headless | Always pass `--xr-mode off` for CLI runs (not needed for `--export-*`) |
| A project setting you added disappears | Godot strips settings equal to the engine default whenever it re-saves `project.godot` | Only non-default values persist. Don't rely on writing defaults |
| `project.godot` keys get mangled | `#` is **not** a comment in Godot's config format | Use `;` for comments, or no comments |
| `Parse Error: Cannot infer the type of "x"` | `:=` on a value from an untyped `Dictionary` | Write `var x: float = d.value` |
| Geometry invisible / inside-out from `SurfaceTool` | Godot uses **clockwise** winding for front faces | Emit `[a, c, b, a, d, c]` per quad |
| `Identifier not found: <Autoload>` with `--check-only` or `-s script.gd` | Autoloads aren't registered in those modes | False positive. Verify by running the game |
| APK huge, textures use far too much memory on the headset | Godot imports JPG/PNG **lossless** unless the editor has seen them used in 3D; headless imports and code-loaded textures never are | Set `compress/mode=2` + `mipmaps/generate=true` (+ `compress/normal_map=1` for normal maps) in the `.import` files and reimport. Add a check that fails on `compress/mode=0` |
| Mirror / wall reflects the sky instead of the room | `ReflectionProbe.blend_distance` defaults to 1 m and fades reflections near the box edge, exactly where mirrors sit | `blend_distance = 0`, and a large `max_distance` (otherwise geometry beyond the box renders black in the probe) |
| glTF glass (picture frames, windows) renders as a dark pane | Godot ignores `KHR_materials_transmission` | Replace alpha-blended `*glass*` surfaces with a faint transparent material on import/placement |

## Headset symptoms that are NOT your app

Before debugging code, rule these out — they mimic rendering bugs:

- **Gray view, colors smear when turning:** lost tracking or a paused (doffed) app. The compositor
  reprojects a frozen frame. Log shows `OpenXR: XR ended (visible_state)`.
- **App won't start:** `Launch is blocked because: a Reprojected OS dialog is currently showing` —
  a Meta system dialog (boundary / "Finding position in room") is in front. The user must dismiss it.
- **Uniform color filling both eyes:** often the headset lying on a desk, looking at one large
  surface (floor, sky, water).

Distinguish them with data, not guesses: take several `adb exec-out screencap -p` shots a few seconds
apart. **Byte-identical frames = frozen/paused headset.** Frames that differ but stay flat-colored =
the app is drawing, but its output is broken (suspect MSAA first).

## Performance budget (standalone headsets)

- Mobile renderer: **max 8 omni + 8 spot lights per mesh**. Keep a scene's omni lights ≤ 8 or split meshes.
- One shadowed `DirectionalLight3D`. No SSAO, SSR, SDFGI or volumetric fog.
- Merge static geometry per material (`SurfaceTool`); prefer box collisions, trimesh only for imported models.
- Textures ≤ 2K, ETC2/ASTC compression on.
- Measured reference: a simple lobby ran **72 fps with ~446 objects / ~41 draw calls** on Quest 3.

## Realistic interiors (verified approach)

- **Assets:** Poly Haven (CC0, real-world scale, PBR, no login). Its API (`api.polyhaven.com`) rejects
  default user agents; send a descriptive `User-Agent`. Use 1K glTF for props and 2K for large floors.
  Khronos glTF Sample Assets add a few photoreal CC-BY pieces (for example Wayfair's GlamVelvetSofa, 4k tris).
- **Recolour scans:** keep a scan's normal and roughness maps with a flat albedo colour (paint, fabrics).
  Tinting a coloured albedo only multiplies it.
- **Window view:** a photographed HDRI (tonemapped JPG, 8K, VRAM-compressed) as a `PanoramaSkyMaterial`,
  shot from a height similar to the unit's. Don't add a ground plane or procedural buildings under it:
  they hide the photo's real city below the horizon and look fake. Rotate with `Environment.sky_rotation`.
- **Where there's no good free model**, build the item procedurally from boxes with good PBR materials
  (beds, kitchens, tables, wardrobes, TVs, rugs, showers). It beats low-poly models.
- **Budget check:** read `RENDERING_INFO_TOTAL_PRIMITIVES_IN_FRAME` / `DRAW_CALLS` at the worst viewpoints.
  A furnished 165 m² apartment measured ≤ 350k triangles / 133 draws per frame including shadows.

## Runtime content

For apps that download or import models at runtime (GLB/glTF/zip/pck), collision generation,
unit-scale fixes and spawn-point conventions: `references/runtime-content.md`.

## Reference files

- `references/toolchain-macos.md` — JDK, Android SDK packages, keystore, Gradle build template, editor settings
- `references/export-and-deploy.md` — export preset options for Quest, export/install/launch commands, Makefile targets
- `references/device-debugging.md` — screencap, logcat, draw-call counters, probe renders, dev props
- `references/runtime-content.md` — runtime GLB loading, collisions, spawn points, model conventions
