#!/usr/bin/env node
/*
 * Writes the files `expo start` normally generates, so `tsc` can run without a
 * dev server (MOB-4: EAS builds start from a clean checkout, where both are
 * missing because .gitignore lists them):
 *   - .expo/types/router.d.ts, the typed routes for every file under app/;
 *   - expo-env.d.ts, the reference to Expo's ambient types.
 * It uses expo-router's own generator, the one the Expo CLI calls.
 * Usage: node scripts/generate-route-types.cjs
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const typesDir = path.join(root, ".expo", "types");
const routerTypes = path.join(typesDir, "router.d.ts");

// The generator reads the app folder from this variable when it is loaded.
process.env.EXPO_ROUTER_APP_ROOT = path.join(root, "app");
const { regenerateDeclarations } = require("expo-router/build/typed-routes");

fs.writeFileSync(
  path.join(root, "expo-env.d.ts"),
  '/// <reference types="expo/types" />\n\n// NOTE: This file should not be edited and should be in your git ignore',
);

fs.mkdirSync(typesDir, { recursive: true });
const before = fs.existsSync(routerTypes) ? fs.statSync(routerTypes).mtimeMs : 0;
regenerateDeclarations(typesDir);

// regenerateDeclarations is debounced by a second; wait for the new file.
const deadline = Date.now() + 15000;
(function waitForFile() {
  if (fs.existsSync(routerTypes) && fs.statSync(routerTypes).mtimeMs > before) {
    console.log(`Route types written to ${path.relative(root, routerTypes)}.`);
    return;
  }
  if (Date.now() > deadline) {
    console.error("Route types were not generated within 15 s.");
    process.exit(1);
  }
  setTimeout(waitForFile, 200);
})();
