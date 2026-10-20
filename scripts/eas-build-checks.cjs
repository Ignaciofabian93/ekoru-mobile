#!/usr/bin/env node
/*
 * EAS runs this right after installing dependencies (the `eas-build-post-install`
 * script in package.json, MOB-4). It runs `npm run check`, which covers route
 * types, typecheck, lint errors, tests and every GraphQL operation against the
 * staging API. A failure stops the build before anything is compiled or
 * submitted.
 *
 * Development-client builds skip it, so a staging outage never blocks a dev
 * build. Preview and production builds always run it.
 */
"use strict";

const { execSync } = require("node:child_process");

const profile = process.env.EAS_BUILD_PROFILE || "(local)";
if (profile === "development") {
  console.log("EAS checks skipped for the development profile.");
  process.exit(0);
}

console.log(`EAS checks for the ${profile} profile: npm run check`);
execSync("npm run check", { stdio: "inherit" });
