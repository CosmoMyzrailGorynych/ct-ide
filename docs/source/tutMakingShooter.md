# Making Your First Game: Space Shooter

Let's make a small space shooting game with asteroids, lasers and hostile gunships! This tutorial will teach you how to import assets, handle user input, move things around and respond to collisions.

## Importing Graphic Assets 

Open ct.js and create a new project with a name "SpaceShooter".

(picture)

Next, [download an asset pack](http://www.kenney.nl/assets/space-shooter-redux) from Kenney's site. It is free to use and is great for prototyping, learning or just testing things out.

You can also use assets placed inside a `ct.js/docs/SpaceShooterAssets` folder.

These are all the assets we will need today:

(picture)

Now open the "Graphic" tab on the top of the ct.IDE window, and drag & drop these assets inside the ct.IDE window. You can also press an "Input" button to find them manually.

A card for each of the images will appear. Let's open the `PlayerShip` and configure it. We will see a yellow shape that defines its collision shape. For now, it covers too much empty space, especially above wings. To fix it, we should modify this collision shape in the left column.

Firstly, press a button "Image's center", so its axis is placed at the ship's center. Next, modify the four values above the "Fill" button. Each one defines how far should the rectangular shape extend from the image's center. I chose `12` to the top, `50` on sides and `32` to the bottom. 

(picture)

Press "Save" and move to the next graphic asset — "LaserRed". As with the ship, let's set its axis to center by clicking "Image's Center". Then, select a **Circle** collision shape right beneath this button. Now a yellow collision shape is drawn as a circle.

The next graphic asset, `Laser_Blue`, should be centered too, and since the collision shape should cover all the image, we can click the "Fill" button to automate it.

(picture)

The `EnemyShip`'s shape can be treated either as a **Circle** or as a **Rectangle**. Select the one you think is better.

(picture)

Both asteroids are definitely more circular by their shapes. Set their collision shape to **Circle**, and don't forget to set their axis to center.

(picture)

The background image may be left as is, because it won't collide with other things in the game.

## Making First Types and Laying Things Out

**Graphic assets** don't do much on their own, and in order to display them in game, we need to create **Types** with these assets. Types are used to create **Copies**, and the latter are the things that you place inside **Rooms**, that interact with each other and respond to your inputs.

Press the "Types" tab on top of the screen, and create a new Type for the player. After clicking the "Create" button, click on the big ghostly cat in the left column. It will show you all your graphic assets. Press the card with your ship. It should now appear in the left column of the editor.

(picture)

Now, change the Type's name to `PlayerShip` so we won't need to remember these numbers while coding.

(picture)

Create Types for all the other graphic assets but the background image. Background images don't move or interact with anything, and is often tiled, so it is not a Type. We will add it later in a **Room**.

(picture)

Let's place created Types somewhere on the map. To create this map, or Room, press the "Rooms" tab on top of the ct.IDE windows, and click an "Add new" button. Then, open the newly created room by clicking it.

(picture)

Here we will stop a bit to explain how to use the Room editor. Firstly, we can set up a Room's name and its viewport size. 

In ct.js, Rooms are infinite and can pan in any direction. You can place objects inside and outside the viewport.

Then we have Room events. It is a section that defines game logic specifically for this room. You can define UI or level scenario here.

Under this button we have a panel with Copies and Backgrounds. We pick a Copy from the according tab and place it to the map by clicking on a large area on the right. To disable adding new copies, select a ghostly cat on the left. You can pan the editor's view by dragging your mouse on the left side when nothing is selected. You can change zoom level by using buttons on the top, or by mouse wheel.

If you feel lost, press the "To center" button to return to (0, 0) coordinates.

You can set a grid by clicking on the button in the bottom right corner. Clicking it again will disable the grid.

Lastly, you can move all the copies in the room at once by clicking a button with a "move" icon in the top left corner.

For now, let's place a player's ship, a hostile one and a couple of asteroids.

(picture)

Then add a background. Click the "Backgrounds" tab and press "Add", then select our `BG`. It will appear as a tiled texture in the main view.

(picture)

Though backgrounds are always drawn before Copies of the same depth level (`0` by default), it is better to change their Depth level. Click on the zero on the left to the background's icon in the left column and input `-5`. By doing this, we tell the engine that this background is placed lower than other Copies and backgrounds. Depth represents a third coordinate axis that goes upwards, when X and Y go to the sides.

(picture)

After that, save the project and click an export button. At this point, you will have a game project with immovable ships and asteroids.

(picture)

## Adding Player's Movement

Handling user's input is the most important task. In this section we will make the blue ship move when a player presses arrow keys.

In order to handle keyboard inputs, we need to enable keyboard module. Press the "Catmods" tab, find a `keyboard` module on the left, select it, and then push the big red button to enable it. Then add `random` and `place` modules, as we will need them later too.

(picture)

Open the "Types" tab on the top, next move to "Step" event.

> `Step` event occurs every frame before drawing, `Draw` happens after all the `Step` events in the room while drawing a new frame. `On create` happens when you spawn a new Copy, and  `On Destroy` occurs before the `Draw` event if a Copy is killed.

Write the following code:

```js
/**
 * Move the ship
 */

if (ct.keyboard.down['left']) { // Is the left arrow key pressed?
    this.x -= 8; // Move to the left by X axis
}
if (ct.keyboard.down['right']) { // Is the right arrow key pressed?
    this.x += 8; // Move to the right by X axis
}

/**
 * Check whether the shif fell off the viewport
 */
if (this.x < 0) { // Have the ship crossed the left border?
    this.x = 0; // Go back to the left border
}
if (this.x > ct.width) { // Have the ship crossed the right border?
    this.x = ct.width; // Go back to the right border
}

ct.types.move(this);
```

First, we move the ship if arrow keys were pressed, then we check whether its X coordinate fell off the viewport. Here `0` means the left side of the room and `ct.width` means the horizontal size of the viewport, which forms the right side.

All the methods starting with `ct.keyboard` come from the enabled module. You can read its documentation on the "Catmods" tab, "Reference" section.

> **On your own:** add a vertical movement to the player. Then, try to limit its movement so the ship can't fly above the middle of the viewport.

## Moving Hostiles and Asteroids

Enemies should move, too. For this tutorial, our hostile ship will move from top to bottom, and asteroids will fly in a random direction.

### Enemy ships

Open the "Types" tab, then click on the `EnemyShip`. Navigate to the `On Create` event and add this code:

```js
this.spd = 3;
this.dir = 270;
```

Here, we use built-in variables for moving. Manually editing coordinates is good for handling player's input, but for most tasks it is better to use these vars as they automate most of the things. Here, `this.spd` means the speed of the Copy, and `this.dir` refers to its direction.

> In ct.js, direction is measured in degrees, moving from the left side counter-clockwise. 0° means left, 90° means up, 180° is for right, and 270° points to the bottom.
>
> (picture)

If we navigate to the `Step` event, we will see this little code:

```js
ct.types.move(this);
```

This line reads built-in variables and moves the Copy according to them. Without it, `this.spd` and `this.dir` will be meaningless.

There are more built-in variables, which you can find on the [`ct.types` page](ct.types.html).

We will modify the `Step` code so enemies will destroy themselves if they fall off the screen.

```js
ct.types.move(this);

if (this.y > ct.height + 80) {
    this.kill = true;
}
```

### Asteroids

Asteroids will contain the same `Step` code, but their `dir` variable will be set at random.

Open the `Asteroid_Medium` in the "Types" tab, then write the code below in the `On Create` event. 

```js On Create event
this.spd = ct.random.range(1, 3);
this.dir = ct.random.range(270 - 30, 270 + 30);
```

The `Step` event will be the same as in `EnemyShip`.

```js Step event
ct.types.move(this);

if (this.y > ct.height + 80) {
    this.kill = true;
}
```

Do the same for another asteroid.

Save the project and click the "Play" button at the top. The hostile ship will slowly move to the bottom, while asteroids will move more chaotically. If you refresh the page, asteroids will move to a new direction.

(picture)

## Projectiles & Collision

Now it is time to bring the guns.

Open the `PlayerShip`'s `Step` event, and add this code:

```js
if (ct.keyboard.pressed['space']) {
    ct.types.copy('Laser_Blue', this.x, this.y);
}
```

This is the first time we add new copies programmatically. Hooray!

> `ct.types.copy` is a very important function that spawns a new Copy in the current room. Firstly, we write an enquoted Type's name to copy. Then, we write coordinates where should we create it by horizontal and vertical axes accordingly. `this.x` means a horizontal location of current copy, and `this.y` means a vertical one.

With all the data combined, we make a laser bullet right under our ship. Bullets will spawn when the Space key is pressed.

Now let's move to the `Laser_Blue` itself. We will define its movement with default variables.

```js On Create code
this.spd = 18;
this.dir = 90;
```

Next, let's make that these laser bullets will disappear after they flew out the view. As they always fly to top, we may write the condition for the upper border only.

```js Step code
if (this.y < -40) {
    this.kill = true;
}

ct.types.move(this);
```

The next thing is handling collisions. It is better to write all the collision logic in enemy ships' and asteroids' code, because they will respond differently 