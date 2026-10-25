# Toolchain setup (macOS)

Verified with Godot 4.7.2 on Apple Silicon. Adjust versions to whatever the Godot build expects —
read `config.gradle` inside the export template's `android_source.zip` to see the exact
`compileSdk`, `buildTools` and `ndkVersion` the engine wants.

## 1. Godot + export templates

Install Godot 4.x and its export templates (Editor → Manage Export Templates). Templates live in
`~/Library/Application Support/Godot/export_templates/<version>/`. The Android Gradle source is
`android_source.zip` in that folder.

## 2. JDK 17

```bash
brew install openjdk@17      # keg-only, not symlinked
# JAVA_HOME: /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

## 3. Android SDK (command-line tools, no Android Studio needed)

```bash
SDK="$HOME/Library/Android/sdk"; mkdir -p "$SDK/cmdline-tools"
# Find the current zip name in https://dl.google.com/android/repository/repository2-3.xml
curl -sfL -o clt.zip https://dl.google.com/android/repository/commandlinetools-mac-<build>_latest.zip
unzip -q clt.zip -d clt && mv clt/cmdline-tools "$SDK/cmdline-tools/latest"
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" --licenses
"$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" \
  "platform-tools" "build-tools;36.1.0" "platforms;android-36" \
  "ndk;29.0.14206865" "cmake;3.10.2.4988404"
```

## 4. Godot editor settings

`~/Library/Application Support/Godot/editor_settings-<ver>.tres`:

```
export/android/java_sdk_path = "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export/android/android_sdk_path = "/Users/<you>/Library/Android/sdk"
```

## 5. Debug keystore

Godot creates it on first editor run; otherwise create it yourself (exporting fails without it):

```bash
KS="$HOME/Library/Application Support/Godot/keystores/debug.keystore"; mkdir -p "$(dirname "$KS")"
"$JAVA_HOME/bin/keytool" -genkeypair -keystore "$KS" -storepass android \
  -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"
```

## 6. Android build template (required by the vendors plugin)

Editor: **Project → Install Android Build Template**. Headless equivalent:

```bash
version="4.7.2.stable"      # match the Godot build; mono builds use e.g. 4.7.2.stable.mono
zip="$HOME/Library/Application Support/Godot/export_templates/$version/android_source.zip"
rm -rf android && mkdir -p android/build
unzip -q "$zip" -d android/build
printf '%s' "$version" > android/.build_version
touch android/build/.gdignore
```

`android/` is generated: git-ignore it and regenerate after a Godot upgrade.

## 7. Addons

- **Godot XR Tools** (MIT): player rig, staging, movement, pointer, `Viewport2Din3D`, hands.
  Copy `addons/godot-xr-tools` from the release zip. Enable the plugin in Project Settings.
- **Godot OpenXR Vendors** (MIT): required for Meta/Pico/Android XR loaders and manifest entries.
  Copy `asset/addons/godotopenxrvendors`. Needs the Gradle build. Check `compatibility_minimum`
  in `plugin.gdextension` against your Godot version (vendors 5.x ↔ Godot 4.7).

Vendor addons are third-party: don't edit them. If a compatibility patch is unavoidable, keep it
minimal and record it in the addon's `VERSIONS.md` so it survives upgrades.
