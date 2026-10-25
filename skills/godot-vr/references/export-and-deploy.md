# Export & deploy (Meta Quest)

## Export preset essentials

Create an Android preset and set these (names from Godot 4.7's `export_presets.cfg`):

```ini
gradle_build/use_gradle_build=true          ; required by the vendors plugin
architectures/arm64-v8a=true                ; and only this one
package/unique_name="com.yourcompany.yourapp"
xr_features/xr_mode=1                       ; 1 = OpenXR
xr_features/enable_meta_plugin=true         ; exactly ONE vendor per preset
meta_xr_features/quest_3_support=true
meta_xr_features/quest_2_support=true
meta_xr_features/hand_tracking=1            ; 0 none, 1 optional, 2 required
permissions/internet=true                   ; only if the app fetches anything
screen/immersive_mode=true
```

Never enable two vendor plugins in one preset — make separate presets instead.

## Commands

```bash
# Export (headless). --xr-mode off is unnecessary here, harmless elsewhere
godot --headless --path . --export-debug "Meta Quest 3" build/quest/App.apk
godot --headless --path . --export-release "Meta Quest 3" build/quest/App-release.apk

adb install -r build/quest/App.apk
adb shell monkey -p com.yourcompany.yourapp -c android.intent.category.LAUNCHER 1
adb logcat -s godot
adb uninstall com.yourcompany.yourapp      # needed when the signing key changed
```

Prefer Makefile targets (`make export`, `make deploy`, `make logcat`) — see `makefile-standards`.

## Verifying the APK

```bash
aapt2 dump xmltree --file AndroidManifest.xml App.apk | grep -iE "category|permission|oculus"
```

Expect `com.oculus.intent.category.VR`, `org.khronos.openxr.intent.category.IMMERSIVE_HMD`,
`com.oculus.supportedDevices`, and `lib/arm64-v8a/libgodotopenxrvendors.so` +
`libopenxr_loader.so` inside the APK. If the app opens as a flat window, one of these is missing.

## Expected noise from a *successful* headless export

- `ERROR: EditorSettings not instantiated yet ... "export/android/shutdown_adb_on_exit"` (engine bug, at shutdown)
- `WARNING: Property not found: 'xr/openxr/extensions/hand_tracking'` (vendors GDExtension, see SKILL.md)

Filter these in tooling, and gate success on the exit code plus the APK existing — not on empty output.

## Release builds

Create a release keystore, set `keystore/release*` in the preset (or `GODOT_ANDROID_KEYSTORE_RELEASE_*`
env vars), bump `version/code` every upload, and keep the key safe: updates must use the same one.
