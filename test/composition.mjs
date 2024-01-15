import test from "ava";
import { lens, just, nothing } from "../src/index.mjs";

function x3(n) {
  return n * 3;
}

test("composition gets", (t) => {
  t.is(lens.prop("a").prop("b").get({}), nothing);
});

test("composition sets nested arrays", (t) => {
  const o = [
    [1, 2],
    [3, 4, 5],
    [6, 7],
  ];
  const i1j2 = lens.at(1).at(2);

  t.deepEqual(i1j2.get(o), just(5));
  t.deepEqual(i1j2.set(o, "!"), [
    [1, 2],
    [3, 4, "!"],
    [6, 7],
  ]);
  t.deepEqual(i1j2.update(o, x3), [
    [1, 2],
    [3, 4, 15],
    [6, 7],
  ]);
});

test("composition sets deeply", (t) => {
  const o = [{ n: 1 }, { n: 2 }, { n: 3 }];

  t.deepEqual(lens.at(1).set(o, "!"), [{ n: 1 }, "!", { n: 3 }]);
  t.deepEqual(lens.at(1).prop("n").set(o, "!"), [
    { n: 1 },
    { n: "!" },
    { n: 3 },
  ]);
  t.deepEqual(lens.at(1).prop("n").prop("m").set(o, "!"), [
    { n: 1 },
    { n: 2 },
    { n: 3 },
  ]);

  t.deepEqual(lens.prop("a", {}).prop("b").set({}, "c"), { a: { b: "c" } });
});

test("composition updates counters", (t) => {
  const counts = [
    ["a", "b", 1],
    ["a", "c", 2],
    ["b", "b", 3],
  ].reduce(
    (agg, source) => {
      return lens.prop(source[0], {}).prop(source[1]).set(agg, source[2]);
    },
    { c: 4 },
  );

  t.deepEqual(counts, {
    a: { b: 1, c: 2 },
    b: { b: 3 },
    c: 4,
  });
});

test("composition recipe pushes deeply", (t) => {
  const appender = lens.prop("ingredients", []).last();

  t.deepEqual(appender.set({}, { name: "onion", amount: 0.5 }), {
    ingredients: [{ name: "onion", amount: 0.5 }],
  });

  t.deepEqual(
    appender.set({ name: "salad" }, { name: "mayo", amount: "a lot" }),
    {
      name: "salad",
      ingredients: [{ name: "mayo", amount: "a lot" }],
    },
  );
});

test("pushes deeply", (t) => {
  const categories = [
    {
      id: 1,
      name: "first",
      subcategories: [
        {
          id: 1,
          name: "first in first",
        },
        {
          id: 2,
          name: "second in first",
        },
      ],
    },
    {
      id: 2,
      name: "second",
      subcategories: [
        {
          id: 1,
          name: "first in second",
        },
        {
          id: 2,
          name: "second in second",
        },
      ],
    },
  ];

  const itemAppender = lens
    .firstOf((c) => c.id === 2)
    .prop("subcategories")
    .firstOf((s) => s.id === 1)
    .prop("items", [])
    .last();

  t.deepEqual(itemAppender.set(categories, "new item"), [
    {
      id: 1,
      name: "first",
      subcategories: [
        {
          id: 1,
          name: "first in first",
        },
        {
          id: 2,
          name: "second in first",
        },
      ],
    },
    {
      id: 2,
      name: "second",
      subcategories: [
        {
          id: 1,
          name: "first in second",
          items: ["new item"],
        },
        {
          id: 2,
          name: "second in second",
        },
      ],
    },
  ]);
});
