import test from "node:test";
import assert from "node:assert/strict";
import { generateNotes } from "../src/api/mockGenerativeAI.js";

test("generateNotes returns structured markdown for valid input", async () => {
  const result = await generateNotes("Explain photosynthesis in simple terms.");
  assert.ok(result.includes("# Study Notes:"));
  assert.ok(result.includes("Key Concepts"));
  assert.ok(result.includes("Summary"));
});

test("generateNotes throws error for empty or too short input", async () => {
  await assert.rejects(
    async () => await generateNotes("hi"),
    /Please provide more context or a clearer topic/
  );
  
  await assert.rejects(
    async () => await generateNotes("   "),
    /Please provide more context or a clearer topic/
  );
});
