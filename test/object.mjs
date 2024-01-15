import test from "ava";
import { lens, just, nothing } from "../src/index.mjs";

const key = lens.prop("key");
const k3 = { key: 3 };

const id = (v) => v;

const next = (v) => (v | 0) + 1;

test("object lens gets", (t) => {
  t.is(key.get(null), nothing);
  t.is(key.get("text"), nothing);
  t.is(key.get({}), nothing);
  t.deepEqual(key.get(k3), just(3));
});

test("object lens sets", (t) => {
  t.is(key.set(null, "!"), null);
  t.is(key.set("text", "!"), "text");

  t.deepEqual(key.set({}, "!"), { key: "!" });
  t.deepEqual(key.set(k3, "!"), { key: "!" });
  t.is(key.set(k3, 3), k3);
});

test("object lens updates", (t) => {
  t.is(key.update(null, next), null);
  t.is(key.update("text", next), "text");

  t.deepEqual(key.update({}, next), { key: 1 });
  t.deepEqual(key.update(k3, next), { key: 4 });
  t.is(key.update(k3, id), k3);
});

test("object lens with default", (t) => {
  const key = lens.prop("key", "default");

  t.deepEqual(key.get(null), just("default"));
  t.deepEqual(key.get("text"), just("default"));
  t.deepEqual(key.get({}), just("default"));
  t.deepEqual(key.get(k3), just(3));
});

test("object lens with falsey default", (t) => {
  const key = lens.prop("key", null);

  t.deepEqual(key.get(null), just(null));
  t.deepEqual(key.get("text"), just(null));
  t.deepEqual(key.get({}), just(null));
  t.deepEqual(key.get(k3), just(3));
});
