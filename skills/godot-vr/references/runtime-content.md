# Runtime content (downloadable models)

Pattern for VR apps that load 3D content at runtime (property tours, product viewers, catalogs).

## Format choice

| Format | Use |
| --- | --- |
| **`.glb`** | Best default. What Blender/SketchUp/Revit export. Import with `GLTFDocument` at runtime |
| `.gltf` | Only with embedded buffers/textures, or zipped with its sibling files |
| `.zip` | Archive containing a glTF, or a Godot resource pack |
| `.pck` | Godot resource pack; mount with `ProjectSettings.load_resource_pack(path, false)` (`false` = don't override app files) |

Detect the format from **magic bytes**, not the URL extension, so signed/query-string URLs work:
`glTF` → glb, `{` → gltf, `PK\x03\x04` → zip, `GDPC` → pck.

## Loading without freezing the headset

Parse off the main thread and await on frames, so menus stay responsive:

```gdscript
var task := WorkerThreadPool.add_task(func():
	err = doc.append_from_file(path, state, 0, path.get_base_dir())
	if err == OK: scene = doc.generate_scene(state))
while not WorkerThreadPool.is_task_completed(task):
	await tree.process_frame
WorkerThreadPool.wait_for_task_completion(task)
```

Load content **before** switching scenes, so failures surface in the menu instead of dropping the
user into an empty world.

## Collisions, scale, spawn

Runtime-imported models carry no collision, no Godot import hints and no guaranteed units:

- **Collision:** if the model has meshes named `*-col` / `COL_*`, use only those (hidden) as trimesh
  bodies; otherwise generate trimesh collision for every mesh, skipping `*-nocol` subtrees.
- **Scale:** if the model's longest side is > 500 m assume centimeters (×0.01), > 5000 m millimeters
  (×0.001).
- **Spawn:** look for a node named `SpawnPoint` (the visitor faces its −Z; in Blender that's +Y).
  Without one, raycast a grid downward to find floor with ~1.6 m of head room, preferring points
  near the center. Disable the player body until collisions exist (wait two physics frames), then
  place the player. Add a fallback that respawns anyone who falls out of the model.

Publish these naming conventions to whoever authors the models — they are a contract.

## Offline behavior

Bundle at least one sample model so the app is never empty, cache downloads under
`user://<id>/` with a small `manifest.json`, and treat a unit as present only once the manifest
exists (so interrupted downloads are ignored). When the server is unreachable, keep the app usable
with bundled + downloaded content and offer an explicit retry.
