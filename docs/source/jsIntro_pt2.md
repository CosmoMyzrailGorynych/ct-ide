# Introduction to JavaScript, part II

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
    ct.types.addSpeed(this, 10, 270);
}
```

```js Don't jump off the screen
if (this.x < 0) {
    this.x = 0;
}
if (this.x > ct.room.width) {
    this.x = ct.room.width;
}
if (this.y < 0) {
    this.y = 0;
}
if (this.y > ct.room.height) {
    this.y = ct.room.height;
}
```

Let's optimize the latter one a bit:

```js Don't jump off the screen
if (this.x < 0) {
    this.x = 0;
} else if (this.x > ct.room.width) {
    this.x = ct.room.width;
}
if (this.y < 0) {
    this.y = 0;
} else if (this.y > ct.room.height) {
    this.y = ct.room.height;
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

SOOOOOOON