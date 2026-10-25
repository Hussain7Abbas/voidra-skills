# On-device debugging playbook

The desktop preview does not exercise the XR render path. These techniques give real data from the
headset instead of guesses.

## Capture what the headset actually shows

```bash
adb exec-out screencap -p > shot.png
```

On Quest this captures the **immersive view, both eyes** (e.g. 4128x2208 on Quest 3), including
system dialogs composited over the app. Interpretation:

| Observation | Meaning |
| --- | --- |
| Several captures seconds apart are **byte-identical** | The frame is frozen: app paused (doffed) or tracking lost. Not a rendering bug |
| Frames differ but the view is one flat color | The app is drawing, but its output is broken (suspect MSAA) |
| Passthrough / system panels visible | Your app isn't in the foreground |
| The scene, correctly | Rendering is fine — look elsewhere |

## Is the app rendering at all?

Log per-frame counters from inside the app:

```gdscript
print(" objects=", RenderingServer.get_rendering_info(RenderingServer.RENDERING_INFO_TOTAL_OBJECTS_IN_FRAME),
	" draw_calls=", RenderingServer.get_rendering_info(RenderingServer.RENDERING_INFO_TOTAL_DRAW_CALLS_IN_FRAME),
	" fps=", Engine.get_frames_per_second(),
	" use_xr=", get_viewport().use_xr,
	" cam=", get_viewport().get_camera_3d())
```

Healthy output is non-zero draw calls, a current `XRCamera3D`, and fps at the refresh rate. If draw
calls are healthy but the headset shows a flat color, the scene renders and the **XR output path**
is at fault.

## Probe render: see the scene without the XR path

Render the world through a plain `Camera3D` into a `SubViewport` and save it to `user://`:

```gdscript
var sub := SubViewport.new()
sub.size = Vector2i(900, 700)
sub.world_3d = get_world_3d()          # share the running world
sub.own_world_3d = false
sub.render_target_update_mode = SubViewport.UPDATE_ALWAYS
add_child(sub)
var probe := Camera3D.new()
sub.add_child(probe)
probe.global_transform = xr_camera.global_transform
probe.current = true
await RenderingServer.frame_post_draw
await RenderingServer.frame_post_draw
sub.get_texture().get_image().save_png("user://probe.png")
```

Pull it (debug builds are debuggable, so `run-as` works):

```bash
adb shell run-as com.yourcompany.yourapp cat files/probe.png > probe.png
```

A correct probe + a broken headset view isolates the fault to the XR swapchain/compositor path.
Note that reading `get_viewport().get_texture()` in XR mode is unreliable — it often returns black.

## Logs worth grepping

```bash
adb logcat -s godot                      # engine + your print() output
adb logcat -d | grep -i <package>        # launch, focus, system dialogs
```

- `OpenXR: Session begun` / `XR started (focused_state)` — the app is live in VR
- `OpenXR: XR ended (visible_state)` — headset doffed or app backgrounded
- `Launch is blocked because: a Reprojected OS dialog is currently showing` — a system dialog is
  blocking your launch; the user must dismiss it in the headset
- `StartXR: Setting refresh rate to ...` — XR Tools adapting the physics rate

## Developer properties (restore them afterwards)

```bash
adb shell am broadcast -a com.oculus.vrpowermanager.prox_close   # ignore the proximity sensor
adb shell am broadcast -a com.oculus.vrpowermanager.prox_open    # restore
adb shell setprop debug.oculus.guardian_pause 1                  # pause guardian; 0 to restore
```

Useful for capturing frames while the headset is on a desk. Always restore what you changed, and
tell the user what you touched on their device.

## Etiquette while the user is testing

`adb install` + launch **force-stops the running app**, which yanks the user out of VR. Batch your
changes, and say when you're about to redeploy.
