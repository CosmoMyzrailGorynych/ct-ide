# Introduction to JavaScript, part II: Conditions and Loops

Variables are good for storing things, but it isn't enough for making a game. Here we will talk about conditional statements and loops, and how they may define a game's logic.

## "if" statements

Let's start with an "if" structure:

```js
if (/* this statement is true*/) {
    /* do some stuff */
} else {
    /* do another stuff */
}
```

We can omit an "else" part if we don't need it:

```js
if (/* this statement is true */) {
    /* do some stuff */
}
```

To make things work, we need to pass a Boolean value in the parentheses and write some code. We can do lots of things with this simple statement:

```js Destroy a Copy if its health is zero or below
if (this.health <= 0) {
    this.kill = true;
}
```

```js Make a purchase
var price = 500;
this.money = 1230;

if (this.money >= price) {
    this.money -= price;
    this.inventory.push(/* some item */);
}
```

```js Make a jump
this.onGround = true;
var keyUp = ct.keyboard.down['up'];
if (this.onGround && keyUp) {
    this.addSpeed(this, 10, 270);
}
```

```js Don't jump off the screen
if (this.x < 0) {
    this.x = 0;
}
if (this.x > ct.viewWidth) {
    this.x = ct.viewWidth;
}
if (this.y < 0) {
    this.y = 0;
}
if (this.y > ct.viewHeight) {
    this.y = ct.viewHeight;
}
```

Let's optimize the latter one a bit:

```js Don't jump off the screen
if (this.x < 0) {
    this.x = 0;
} else if (this.x > ct.viewWidth) {
    this.x = ct.viewWidth;
}
if (this.y < 0) {
    this.y = 0;
} else if (this.y > ct.viewHeight) {
    this.y = ct.viewHeight;
}
```

## "While" loops

"While" loops execute some code multiple times until some statement becomes false.

```js 
while (/* this statement is true */) {
    /* do something  */
}
```

Imagine that we need to create a number of same Copies, and that this number cannot be hard-coded or is relatively big to write it by hand. In this case, a "while" loop can automate the creation process.

```js
var counter = 20; // We need to create 20 Copies

while (counter > 0) {
    ct.types.copy('Enemy', this.x, this.y);
    counter --;
}
```

## "For" loops

General "for" loops work in the same way as "while" loops do. Let's take the previous "while" example and turn it into a "for" loop:

```js
for (var counter = 20; counter > 0; counter--) {
    ct.types.copy('Enemy', this.x, this.y);
}
```

Looks like we mashed all the loop-related things into one line! And "for" loops are created exactly for this:

```js
for (/*define variables here*/; /*set a condition*/; /*change variables after each iteration*/) {
    /* loop body */
}
```

But there are more "for" loops. For example, we can manipulate *arrays* and *objects* with "for…of" and "for…in" loops.

:::tip
The "for" loops below are optional and are quite an advanced stuff, but they are also powerful instruments while manipulating complex data.
:::

Let's take a look at "for…of" loops. They work with *Arrays*, which are essentially an ordered list of stuff. We can define Arrays in this way:

```js
this.monstersPowers = [1, 2, 3, 5, 8];

console.log(this.monstersPowers[0]); // output the first element to the console
```

Let's output all these values to the console. Here's how we can do it with the "while" statement:

```js
var ind = 0;
while (ind < this.monsterPowers.length) {
    console.log(this.monsterPowers[ind]);
    ind ++;
}
```

:::tip
The `length` property exists on all Arrays, and it defines the number of elements inside. You can both read and change this variable.
:::

That's how we could do the same thing with a generic "for" loop:

```js
for (var ind = 0; ind < this.monsterPowers.length; ind++) {
    console.log(this.monsterPowers[ind]);
}
```

Now behold, the "for…of" loop:

```js
for (var element of this.monsterPowers) {
    console.log(element);
}
```

This one does two things for us automatically:

* it creates its own internal counters and conditions, but doesn't show them, so the code stays clean, and
* it stores each element to the `element` variable (it will have a different value on each iteration).

Note though that "for…of" loops work on Arrays only. But there are also *Objects*.

*Objects* are more abstract things; they may be interpreted as cabinets with named shelfs, each shelf containing one item. By the way, Arrays are Objects, too, but instead of named shelfs they contain numerated ones. The names of these "shelfs" are called *"keys"*, and a pair of a key and a value is a *property* from the previous tutorial part!

```js
var magicWand = {
    name: 'The summoner of winter winds',
    forces: ['wind', 'ice'],
    level: 23,
    minLevel: 12
};

console.log(magicWand.name);
console.log(magicWand['forces']); // Another way to get values from Objects — Array-styled!
```

We can use two kinds of "for" loops to walk over all elements of an Array, but we will need a "for…in" loop to walk over all the properties of an Object:

```js
for (var key in magicWand) {
    console.log(key, magicWand[key]);
}
```

What does happen there? Firstly, we tell that we want to read the keys from the `magicWand` in the `key` variable. This is mostly similar to the way how "for…of" loops work. Then we output two values at a time, at each iteration: a key (it will be `"name"`, then `"forces"`, etc.) and a corresponding value. We can't just write `magicWand.key` here, because `magicWand.key` will look for a static `key` property, but we can use Array-styled notation to get these properties dynamically.

Array-styled notation is a powerful instrument that has many uses, but for now, remember that you should use `someObject[key]` while using "for…in" loops.