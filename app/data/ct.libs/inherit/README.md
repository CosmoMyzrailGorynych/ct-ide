This module implements type inheritance for your types! Firstly, enable the module, then select the parent for one of your types. Then, use one of these functions to call the parent's logic:

* `this.inherit.onCreate();`
* `this.inherit.onStep();`
* `this.inherit.onDraw();`
* `this.inherit.onDestroy();`

And that's it!

## Checking whether a copy is a child of a particular type

There are two methods that are the opposites of each other:

* `ct.inherit.isChild(copy, assertedParent)`, and
* `ct.inherit.isParent(copy, assertedChild)`.

The arguments can be either copies or the names of types, or a mix of both. So you can check `ct.inherit.isChild(this, 'Godwoken')` and get a proper result.

> **Note:** if the two arguments belong to one type, both methods will return `true`.

## Getting an array of all the copies of a particular parent

You can get an array of all the copies of a particular type and its children with `ct.inherit.list('typeName')`;

```js
const monsters = ct.inherit.list('GenericMonster');
for (const monster of monsters) {
    // Let the bloody massacre begin!
    monster.kill = true;
}
```

> **Warning:** contrary to `ct.types.list['typeName']`, the returned array is not updated and will be a source of memory leaks with deleted copies if not handled properly. Do store the returned value in `var`, `let` or `const`.

## Things to watch out

* Events are not inherited by default, so you should explicitly write `this.inherit.onCreate` and other methods where you need them. This is due to the fact that in ct.js v1 each event is still a function, even though an empty one. This behavior will probably be changed in v2.
* Don't make circular references when you form a parenting chain where one child becomes a child of another. They won't work anyways. If you get an error `Maximum call stack size exceeded`, then you do have circular references.