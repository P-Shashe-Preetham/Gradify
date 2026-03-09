import test from "node:test";
import assert from "node:assert/strict";
import { hashForScreen, Screen, screenFromHash } from "../src/ui/router.js";

test("screenFromHash resolves feed and dashboard routes", () => {
  assert.equal(screenFromHash("#feed"), Screen.FEED);
  assert.equal(screenFromHash(""), Screen.DASHBOARD);
  assert.equal(screenFromHash("#unknown"), Screen.DASHBOARD);
});

test("hashForScreen maps screens to expected hash", () => {
  assert.equal(hashForScreen(Screen.FEED), "#feed");
  assert.equal(hashForScreen(Screen.DASHBOARD), "");
});

