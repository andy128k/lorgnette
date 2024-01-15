import test from "ava";
import { lens, just } from "../src/index.mjs";

test("identity lens gives object back", (t) => {
  const o = ["a", "b", "c"];
  t.deepEqual(lens.get(o), just(o));
});

test("identity lens does not set values", (t) => {
  const o = ["a", "b", "c"];
  t.is(lens.set(o, "!"), "!");
});
