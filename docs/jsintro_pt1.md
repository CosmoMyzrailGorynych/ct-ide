# Introduction to JavaScript, part I: Variables, Properties, Operations

JavaScript is a great programming language that powers websites, games, apps like ct.js, and even robots! It is easy to learn, though infinitely deep, and is similar to other programming languages like C#, C++ or Java.

Ct.js games are all written in JavaScript. You define logic for your Copies and Rooms and write new extensions with it. Here we will learn basic concepts of this language.

## Variables

Variables are like memory cells. You can store any information in them, e.g. a number of lives, resources or experience, an NPC's name, etc. 

Variables can also contain more complex data, like a list of inventory items or a deck of cards.

You can *declare* new variables with a `var` keyword, and *assign them values* with an equation sign: 

```js
var maxHealth;
maxHealth = 100;
var health;
health = maxHealth; // You can copy a value from one variable (maxHealth) to another (health)

var mana, maxMana; // You can combine a number of declarations in one 'var' keyword
maxMana = mana = 100; // You can assign a value (100) to different values at once

var name;
name = 'ct.js'; // Text values, or Strings, are enclosed in quotation marks

var title = 'The Almighty Cat'; // You can combine both declaration process and assignment

var invincible = true, // These are Boolean values
    stunned = false,
    bleed = false; // You can combine multiple declarations and assignments with comma!
```

*Declaration* process tells ct.js that we want to create a new variable. Without it, ct.js will throw an error, because we can't store information in a place that doesn't exist.

*Assignment* writes a new value to a variable. When *declared*, variables are `undefined`. They will store useful information only after *assignment*. You can assign new variables many times.

## Properties

Variables are great for temporal values, but they disappear after a ct.js event completes (e.g., after 'On Destroy', 'On Step'). This makes variables useful for quick operations but unusable for a long run. We should use *properties* to store information so that we can use it later.

You can use properties in the same way you use variables, but they may only exist inside *Objects*. Objects are very abstract things, and they include all the Copies and Rooms. You will create your own Objects soon, too. But for now, let's look how to create and use properties: 

```js
this.maxHealth = 100;
this.health = this.maxHealth;

this.maxMana = this.mana = 100;

this.name = 'ct.js';
this.title = 'The Almighty Cat';

this.invincible = true;
this.stunned = false;
this.bleed = false;
```

As you can see, the most significant difference is that we don't need to declare properties. We can start writing values to them directly.

There is also a new keyword: `this`. `this` stands for the current object which calls the code. If you write a code for an 'On Step' event of a Copy, then `this` will point to this exact copy. Writing `this.health = 100;` means that we store a property `health` inside the current copy, with a value `100`.

We can use a `this` keyword inside a room's code. In this case, values will be stored in a room.

## Operations with values, properties and variables

Variables and properties are quite useless “as is”. With conditional statements, loops and operations they become a powerful mechanism defining your game's logic. We will talk about loops and conditionals later. For now, let's look at operations.

Operations with numbers are familiar to everyone. They are like arithmetic equations: 

```js
this.level = 10;
this.health = this.level * 4; // 40
this.health = this.health - 5; // 35
this.inventoryCapacity = (5 + 10) * 8; // 120
this.magicPower = 5 + 10 * 8; // 85
this.magicDamage = this.magicPower + this.level * 5; // 135
this.magicResistance = this.magicPower / 10; // 8.5
/* What if we need to get a remainder of division? */
this.remainder = 11 % 4; // 3, because 11 / 4 = 2 and 3 as a remainder;
```

When we need to *change* a variable or property, we can unite assignment and the needed operation:

```js
this.health = 10;
this.health += 5; // health is now 15
this.health /= 5; // 3
this.health *= 10; // 30
this.health -= 20; // 10
```

There are also two fancy operators which modify a variable's value by `1`:

```js
this.counter = 10;
this.counter++; // this.counter is now 11
this.counter++; // 12
this.counter--; // 11 again
```

Strings have their operators too. We will use a plus sign to *concatenate* Strings: 

```js
this.name = 'ct.js';
this.title = 'Almighty Cat';
this.title = 'The ' + this.title; // 'The Almighty Cat'
this.name += ', '; // 'ct.js, '
this.name += this.title; // 'ct.js, The Almighty Cat'
```

We can even add numbers to strings: 

```js
var score = 1000,
    drawText = 'Score: ' + score; // 'Score: 1000'

var power = 42,
    powerInfo = power + ' of power'; // '42 of power'
```

**Warning!** Things get weird when we mix number-like strings and math operators: 

```js
var money = 100,
    price = '5';
var case1 = money - price, // 95
    case2 = money + price; // 1005 (!)
```

So the rule of thumb is to store numerical values as Numbers, not Strings. If you need to convert a String into a Number, use `parseFloat(yourString)`.

## Boolean values and comparisons

Boolean is these variables and properties which values are either 'true' or 'false'. Note that we don't use quotation marks here.

Boolean values can be retrieved by using comparisons, and they also have their own operators. Numbers have comparisons like what we can find in Math, while Strings are either equal or not:

```js
var health = 63,
    maxHealth = 100,
    mana = 100,
    maxMana = 100;

health < maxHealth; // true
mana > maxMana; // false
mana >= maxMana; // true
health <= maxHealth; // true
health == maxHealth; // are they equal? false
health != maxHealth; // they aren't equal, right? true

var cat = 'Albert',
    dog = 'Snowball';
cat == dog; // false
cat != dog; // true

/* There are also strict comparisons, which compare both values and variables' types */

5 == '5'; // true
5 === '5'; // false, because '5' is String, not a Number
5 === parseFloat('5') // true, because parseFloat returns a Number, and so is 5
```

Boolean values have their operators, too. The most basic one is `!`, which negates a value next to it.

```js An '!' operator
!true; // false
!false; // true

var health = 50,
    alive = !(health <= 0); // true
var dead = !alive; // false
```

There are also `&&` and `||`. The first one is referred to as "AND", and the second one is "OR". They are used to combine different Boolean values.

```js Use of '&&' and '||'
this.onGround = true;
var keyUp = ct.keyboard.down['up'], // it will be 'true' if an upper arrow key is held down
    canJump = this.onGround && keyUp;

this.powerFromLeft = false;
this.powerFromRight = true;
this.poweredOn = this.powerFromLeft || this.powerFromRight; // true
```

In the next part we will talk about conditional statements and loops. For now, I recommend you to read about default [properties of Copies](ct.types.html) and [Rooms](ct.rooms.html).