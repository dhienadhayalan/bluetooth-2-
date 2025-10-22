# React Native BLE Android — Ready ZIP (no node_modules, no android folder)

## What this ZIP contains
- A complete React Native project source (JS) prepared for BLE (react-native-ble-plx).
- Excludes `node_modules/` and `android/` to keep file size small.

## How to use (quick)
1. Extract the ZIP to a folder.
2. Open terminal in the project root.
3. Install npm packages:
   ```
   npm install
   ```
4. If you don't have `android/` (this ZIP excludes it), create native files by running:
   ```
   npx react-native upgrade
   ```
   or initialize a new RN project and copy `android/` from there. (If you created the project originally with React Native CLI, you'll need the android folder.)
5. Connect your Android device and enable USB debugging.
6. Run:
   ```
   npx react-native run-android
   ```

## Notes
- Android permissions required are listed in the earlier project document. Add BLUETOOTH and location permissions to `android/app/src/main/AndroidManifest.xml`.
- If `Buffer` is needed at runtime, `buffer` dependency is included and a polyfill is used in the service.

## Files included
- package.json, index.js, app.json
- src/ with App.js, services/BluetoothService.js, components/DeviceRow.js
- .gitignore
