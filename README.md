# lorgnette

[![Build Status](https://travis-ci.org/andy128k/lorgnette.svg?branch=master)](https://travis-ci.org/andy128k/lorgnette)
[![Coverage Status](https://coveralls.io/repos/andy128k/lorgnette/badge.svg?branch=master&service=github)](https://coveralls.io/github/andy128k/lorgnette?branch=master)

> A set of lenses

Lenses are helper objects to retrieve or update data in immutable collections.

## Basics

Lens is an object which allows to access object properties. Any lens has to
implement next three methods:
```js
get(obj)                // returns extracted property

set(obj, value)         // clones object and returns it with altered property

update(obj, callback)   // same as set but callback is called to get new value
```

Methods `get` and `update` return new object instead of modifying given one.

## Predefined lenses

### prop

Lens `prop` allows access to object properties by name.

```js
import { lens } from 'lorgnette';

let age = lens.prop('age'); // create lens to access property age

age.get({name: 'John'}) // returns Nothing

age.get({name: 'John', age: 42}) // returns Just(42)

age.set({name: 'John', age: 42}, 24) // returns {name: 'John', age: 24}

age.update({name: 'John', age: 42}, x => x + 1) // returns {name: 'John', age: 43}
```

This lens can also be configured to return default value instead of `Nothing`
when property does not exist.

```js
import { lens } from 'lorgnette';

let age = lens.prop('age', 18); // create lens to access property age

age.get({name: 'John'}) // returns Just(18)

age.get({name: 'John', age: 42}) // returns Just(42)
```


### at

Lens `at` allows access to array elements by given index.

```js
import { lens } from 'lorgnette';

let second = lens.at(1);

second.get([]) // returns Nothing

second.get([1, 2, 3, 4, 5]) // returns Just(2)

second.set([1, 2, 3, 4, 5], 7) // returns [1, 7, 3, 4, 5]

second.update([1, 2, 3, 4, 5], x => x + 7) // returns [1, 9, 3, 4, 5]


// negative index is also accepted
let last = lens.at(-1);

last.get([1, 2, 3, 4, 5]) // returns Just(5)

last.set([1, 2, 3, 4, 5], 7) // returns [1, 2, 3, 4, 7]
```

### first

Lens `first` is similar to `at(0)` but it prepends new value when `set` or
`update` is called.

```js
import { lens } from 'lorgnette';

let first = lens.first();

first.get([]) // returns Nothing

first.get([1, 2, 3, 4, 5]) // returns Just(1)

first.set([1, 2, 3, 4, 5], 7) // returns [7, 1, 2, 3, 4, 5]

first.update([1, 2, 3, 4, 5], x => '' + x) // returns ['undefined', 1, 9, 3, 4, 5]
```

### last

Lens `last` is similar to `at(-1)` but it appends new value when `set` or
`update` is called.

```js
import { lens } from 'lorgnette';

let last = lens.last();

last.get([]) // returns Nothing

last.get([1, 2, 3, 4, 5]) // returns Just(5)

last.set([1, 2, 3, 4, 5], 7) // returns [1, 2, 3, 4, 5, 7]

last.update([1, 2, 3, 4, 5], x => '' + x) // returns [1, 9, 3, 4, 5, 'undefined']
```

## Chaining

Lenses can be chained so access to nested properties is possible.

```js
import { lens } from 'lorgnette';

let lastCartItem = lens.prop('items', []).last();

let cart = {
  items: [
    'potato',
    'cheese'
  ]
};

lastCartItem.get(cart) // returns Just('cheese')
lastCartItem.set(cart, 'carrot') // returns { items: ['potato', 'cheese', 'carrot'] }
```

## Multilens

Sometimes it is usefull to access multiple properties at once. Multilens allows
to do this.

```js
import { lens, multi } from 'lorgnette';

let lastCartItem = lens.prop('items', []).last();
let totalCount = lens.prop('total');
let cartLens = multi(lastCartItem, totalCount);

let cart = {
  total: 2,
  items: [
    'potato',
    'cheese'
  ]
};

cartLens.get(cart) // returns [Just('cheese'), Just(2)]

cartLens.set(cart, 'carrot', 3)
// returns
// {
//   total: 3,
//   items: ['potato', 'cheese', 'carrot']
// }

cartLens.update(cart, () => 'carrot', x => x + 1)
// returns
// {
//   total: 3,
//   items: ['potato', 'cheese', 'carrot']
// }
```

