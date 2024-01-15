import test from "ava";
import { lens, multi, just, nothing } from "../src/index.mjs";

function next(v) {
  return (v | 0) + 1;
}

test("multi lens map gets", (t) => {
  const key = multi(lens.prop("key"), lens.prop("key2"));
  const obj = { key: 3, key2: 2 };
  t.deepEqual(key.get(null), [nothing, nothing]);
  t.deepEqual(key.get("text"), [nothing, nothing]);
  t.deepEqual(key.get({}), [nothing, nothing]);
  t.deepEqual(key.get(obj), [just(3), just(2)]);
  t.deepEqual(key.get({ key2: 7 }), [nothing, just(7)]);
});

test("multi lens map sets", (t) => {
  const key = multi(lens.prop("key"), lens.prop("key2"));
  const obj = { key: 3, key2: 2 };
  t.is(key.set(null, "!", "?"), null);
  t.is(key.set("text", "!", "?"), "text");

  t.deepEqual(key.set({}, "!", "?"), { key: "!", key2: "?" });
  t.deepEqual(key.set(obj, "!", "?"), { key: "!", key2: "?" });
  t.is(key.set(obj, 3, 2), obj);

  t.deepEqual(key.set(obj, "!"), { key: "!", key2: 2 });
});

test("multi lens map updates", (t) => {
  const key = multi(lens.prop("key"), lens.prop("key2"));
  const obj = { key: 3, key2: 2 };
  t.deepEqual(key.update(obj, next, next), { key: 4, key2: 3 });
  t.deepEqual(key.update(obj, next), { key: 4, key2: 2 });
});

test("multi lens array gets", (t) => {
  const key = multi(lens.first(), lens.last());
  t.deepEqual(key.get(null), [nothing, nothing]);
  t.deepEqual(key.get("text"), [nothing, nothing]);
  t.deepEqual(key.get([]), [nothing, nothing]);
  t.deepEqual(key.get([1, 2, 3, 4]), [just(1), just(4)]);
});

test("multi lens array sets", (t) => {
  const key = multi(lens.first(), lens.last());
  t.is(key.set(null, "!", "?"), null);
  t.is(key.set("text", "!", "?"), "text");
  t.deepEqual(key.set({}, "!", "?"), {});
  t.deepEqual(key.set([1, 2, 3, 4], "!", "?"), ["!", 1, 2, 3, 4, "?"]);
});

test("combined multi lens updates tree", (t) => {
  const appender = lens.prop("ingredients", []).last();
  const counter = lens.prop("ingredientsCount");
  const combined = multi(appender, counter);

  const before = { name: "salad", ingredientsCount: 0 };

  const step1 = combined.update(
    before,
    () => ({ name: "mayo", amount: "a lot" }),
    next,
  );

  t.deepEqual(step1, {
    name: "salad",
    ingredientsCount: 1,
    ingredients: [{ name: "mayo", amount: "a lot" }],
  });

  const step2 = combined.update(
    step1,
    () => ({ name: "potato", amount: "four" }),
    next,
  );

  t.deepEqual(step2, {
    name: "salad",
    ingredientsCount: 2,
    ingredients: [
      { name: "mayo", amount: "a lot" },
      { name: "potato", amount: "four" },
    ],
  });
});
