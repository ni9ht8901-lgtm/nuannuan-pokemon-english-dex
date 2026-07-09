import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("src/App.tsx", "utf8");
const styles = readFileSync("src/styles.css", "utf8");
const manifest = readFileSync("public/manifest.webmanifest", "utf8");

assert.match(app, /字母变身局/, "app should render the product name");
assert.match(app, /English Mode/, "app should expose English Mode");
assert.match(app, /拼音模式/, "app should expose pinyin mode");
assert.match(app, /IdentityGame/, "identity game should exist");
assert.match(app, /PinyinTrain/, "pinyin train should exist");
assert.match(app, /ToneCoaster/, "tone coaster should exist");
assert.match(app, /ParentReport/, "parent report should exist");
assert.match(app, /localStorage/, "local progress should persist across refreshes");
assert.match(app, /indexedDB/, "offline progress should use IndexedDB");
assert.match(app, /MediaRecorder/, "recording fallback should be implemented");
assert.match(app, /AudioContext/, "sound effects should use Web Audio");
assert.match(app, /playSoundEffect/, "sound effects should be wired into interactions");
assert.match(styles, /#6CC26C/, "forest green design token should be used");
assert.match(styles, /#FFB25C/, "warm orange design token should be used");
assert.match(manifest, /字母变身局/, "PWA manifest should use product name");

console.log("MVP structure checks passed");
