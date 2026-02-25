#!/usr/bin/env node

import fs from "fs";
import path from "path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  fail(
    "Usage: node deploy/firebase-env-from-json.mjs <path-to-service-account.json>"
  );
}

const resolved = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(resolved)) {
  fail(`File not found: ${resolved}`);
}

let raw;
try {
  raw = fs.readFileSync(resolved, "utf8");
} catch (e) {
  fail(`Unable to read file: ${e.message}`);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (e) {
  fail(`Invalid JSON: ${e.message}`);
}

const required = ["project_id", "client_email", "private_key"];
for (const key of required) {
  if (!parsed[key] || String(parsed[key]).trim() === "") {
    fail(`Missing required key in service account JSON: ${key}`);
  }
}

const normalizedJson = JSON.stringify(parsed);
const base64 = Buffer.from(normalizedJson, "utf8").toString("base64");
const escapedPrivateKey = String(parsed.private_key).replace(/\n/g, "\\n");

console.log("# Recommended Railway variable (single value)");
console.log(`FIREBASE_SERVICE_ACCOUNT_BASE64=${base64}`);
console.log("");
console.log("# Alternative split variables");
console.log(`FIREBASE_PROJECT_ID=${parsed.project_id}`);
console.log(`FIREBASE_CLIENT_EMAIL=${parsed.client_email}`);
console.log(`FIREBASE_PRIVATE_KEY=${escapedPrivateKey}`);
console.log("");
console.log("# Optional full JSON variable");
console.log(`FIREBASE_SERVICE_ACCOUNT_JSON=${normalizedJson}`);
