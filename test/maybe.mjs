import test from "ava";
import { just, nothing } from "../src/index.mjs";

test("maybe wraps values", (t) => {
  t.is(nothing.isNothing(), true);
  t.is(nothing.isJust(), false);
  t.is(just("value").isNothing(), false);
  t.is(just("value").isJust(), true);
  t.deepEqual(just("value"), just("value"));
  t.deepEqual(just(undefined), just(undefined));
});

test("maybe unwrap", (t) => {
  t.is(nothing.getOr("anotherValue"), "anotherValue");
  t.is(just("value").getOr("anotherValue"), "value");
});

test("maybe is chainable", (t) => {
  function appendBang(s) {
    return just(`${s}!`);
  }

  t.is(nothing.then(appendBang), nothing);
  t.deepEqual(just("value").then(appendBang), just("value!"));
  t.is(
    just("value").then(() => nothing),
    nothing,
  );
});

test("maybe recovers", (t) => {
  t.deepEqual(
    nothing.recover(() => "anotherValue"),
    just("anotherValue"),
  );
  t.deepEqual(
    just("value").recover(() => "anotherValue"),
    just("value"),
  );
});
