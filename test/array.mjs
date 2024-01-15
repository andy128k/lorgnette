import test from "ava";
import { lens, just, nothing } from "../src/index.mjs";

test(`array 'at' lens gets values`, (t) => {
  t.is(lens.at(0).get([]), nothing);

  t.deepEqual(lens.at(0).get(["a", "b", "c"]), just("a"));
  t.deepEqual(lens.at(1).get(["a", "b", "c"]), just("b"));
  t.deepEqual(lens.at(2).get(["a", "b", "c"]), just("c"));

  t.is(lens.at(3).get(["a", "b", "c"]), nothing);
  t.deepEqual(lens.at(-1).get(["a", "b", "c"]), just("c"));
  t.deepEqual(lens.at(-2).get(["a", "b", "c"]), just("b"));
  t.deepEqual(lens.at(-3).get(["a", "b", "c"]), just("a"));
  t.is(lens.at(-4).get(["a", "b", "c"]), nothing);
});

test(`array 'at' lens does not get value from non-array`, (t) => {
  const at1 = lens.at(1);
  const ats = lens.at("key");

  t.is(ats.get(null), nothing);
  t.is(at1.get("text"), nothing);
  t.is(at1.get(33.1), nothing);
  t.is(ats.get({}), nothing);
  t.is(ats.get({ key: 3 }), nothing);
});

test(`array 'at' lens sets values`, (t) => {
  t.deepEqual(lens.at("key").set([], "!"), []);
  t.deepEqual(lens.at(0).set([], "!"), ["!"]);
  t.deepEqual(lens.at(3).set([1, 2, 3], "!"), [1, 2, 3, "!"]);
  t.deepEqual(lens.at(0).set(["a", "b", "c"], "!"), ["!", "b", "c"]);
  t.deepEqual(lens.at(0).set(["a", "b", "c"], "a"), ["a", "b", "c"]);
  t.deepEqual(lens.at(-1).set(["a", "b", "c"], "!"), ["a", "b", "!"]);
});

test(`array 'at' lens does not set value for non-array`, (t) => {
  const at1 = lens.at(1);
  const ats = lens.at("key");

  t.is(ats.set(null, "!"), null);
  t.is(at1.set("text", "!"), "text");
  t.is(at1.set(33.1, "!"), 33.1);
  t.deepEqual(ats.set({}, "!"), {});
  t.deepEqual(ats.set({ key: 3 }, "!"), { key: 3 });
});

test("array.first lens does not get value for non-array", (t) => {
  const first = lens.first();
  t.is(first.get("test"), nothing);
});

test("array.first lens gets value", (t) => {
  const first = lens.first();
  t.is(first.get([]), nothing);
  t.deepEqual(first.get(["a", "b", "c"]), just("a"));
});

test("array.first lens does not push value into non-array", (t) => {
  const first = lens.first();
  t.is(first.set(null, "!"), null);
  t.is(first.set("text", "!"), "text");
  t.is(first.set(33.1, "!"), 33.1);
  t.deepEqual(first.set({}, "!"), {});
  t.deepEqual(first.set({ key: 3 }, "!"), { key: 3 });
});

test("array.first lens pushes value", (t) => {
  const first = lens.first();
  t.deepEqual(first.set([], "!"), ["!"]);
  t.deepEqual(first.set([1, 2, 3], "!"), ["!", 1, 2, 3]);
  t.deepEqual(first.set(["a", "b", "c"], "a"), ["a", "a", "b", "c"]);
});

test("array.last lens does not get value for non-array", (t) => {
  const last = lens.last();
  t.is(last.get("test"), nothing);
});

test("array.last lens gets value", (t) => {
  const last = lens.last();
  t.is(last.get([]), nothing);
  t.deepEqual(last.get(["a", "b", "c"]), just("c"));
});

test("array.last lens does not push value into non-array", (t) => {
  const last = lens.last();
  t.is(last.set(null, "!"), null);
  t.is(last.set("text", "!"), "text");
  t.is(last.set(33.1, "!"), 33.1);
  t.deepEqual(last.set({}, "!"), {});
  t.deepEqual(last.set({ key: 3 }, "!"), { key: 3 });
});

test("array.last lens pushes value", (t) => {
  const last = lens.last();
  t.deepEqual(last.set([], "!"), ["!"]);
  t.deepEqual(last.set([1, 2, 3], "!"), [1, 2, 3, "!"]);
  t.deepEqual(last.set(["a", "b", "c"], "a"), ["a", "b", "c", "a"]);
});

const arr = ["a", "b", "c", "a", "b", "c"];

test("array predicate lens gets first matching value", (t) => {
  const l = lens.firstOf((e) => e === "b");
  t.is(l.get(null), nothing);
  t.is(l.get({}), nothing);
  t.is(l.get([]), nothing);
  t.deepEqual(l.get(arr), just("b"));
});

test("array predicate lens sets first matching slot", (t) => {
  const l = lens.firstOf((e) => e === "b");
  const f = lens.firstOf(() => false);
  t.is(l.set(null, "!"), null);
  t.deepEqual(l.set(arr, "!"), ["a", "!", "c", "a", "b", "c"]);
  t.is(l.set(arr, "b"), arr);
  t.is(f.set(arr, "b"), arr);
});

test("array predicate lens gets last mathing value", (t) => {
  const l = lens.lastOf((e) => e === "b");
  t.is(l.get(null), nothing);
  t.is(l.get({}), nothing);
  t.is(l.get([]), nothing);
  t.deepEqual(l.get(arr), just("b"));
});

test("array predicate lens sets last matching slot", (t) => {
  const l = lens.lastOf((e) => e === "b");
  t.is(l.set(null, "!"), null);
  t.deepEqual(l.set(arr, "!"), ["a", "b", "c", "a", "!", "c"]);
  t.is(l.set(arr, "b"), arr);
});
