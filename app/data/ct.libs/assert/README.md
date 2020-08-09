# assert

`assert` is a tiny module that provides a method `ct.assert(condition, message)` to help making readable tests in ct.js projects.

The `condition` may be either boolean or a function — other values (numbers, strings) will fail. Functions are executed first and then tested against their returned result.

There is also a `ct.assert.summary();` call, that shows counted amount of passed and failed tests.

## Usage example

```js
ct.assert(
    ct.inherit.isParent('AbstractMonster', 'Monster_Red_Squished'),
    'ct.inherit.isParent works with two types (two strings)'
);
ct.assert(
    ct.inherit.isChild('Monster_Green', 'AbstractMonster'),
    'ct.inherit.isChild works with two types (two strings)'
);
ct.assert(
    ct.inherit.list('AbstractMonster').length === 2,
    'ct.inherit.list gets all the monsters'
);
ct.assert(
    ct.inherit.isChild(ct.types.list['Monster_Green'][0], 'AbstractMonster'),
    'ct.inherit.isChild works against a copy and a type'
);
ct.assert(
    ct.inherit.isChild(ct.types.list['Monster_Red_Squished'][0], ct.types.list['Monster_Red'][0]),
    'ct.inherit.isChild works against two copies'
);
ct.assert.summary();
```

This will yield:

![](./data/ct.libs/assert/AssertYield.png)

## Grouping results and measuring time

You still have all the powers of browser's asserting and logging tools.

If you want to group test results, use `console.group('Label');` and `console.groupEnd();`.

If you want to measure the amount of time somethign takes to compute, use `console.time('Label')`; and `console.timeEnd('Label');`.