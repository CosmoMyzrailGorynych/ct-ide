# ct.draw

ct.draw is created for drawing copies, images, text and simple forms on the main canvas.


## Changing color and other drawing settings

`ct.draw` itself doesn't have functions for that, and all the drawing is manipulated with these variables:

```js
ct.x.fillStyle = '#ffffff'; // Fill color
ct.x.strokeStyle = '#000000'; // Outline color
ct.x.lineWidth = 1;
ct.x.globalAlpha = 1; // Opacity. Affects all shapes and images.

ct.x.font = '16px verdana, sans-serif'; // Current font
ct.x.textBaseline = 'middle'; // Use 'top', 'middle', 'bottom' or 'alphabetic'.
ct.x.textAlign = 'center'; // Use 'left', 'center' or 'right'

ct.x.shadowBlur = 8; // Shadow affects all shapes and images.
ct.x.shadowColor = 'rgba(0,0,0,1)';
ct.x.shadowOffsetX = 0; 
ct.x.shadowOffsetY = 0;
```

You can also quickly set color presets with [pre-defined styles](ct.styles.html).


## Drawing Copies and images

### `ct.draw(copy: Copy)`

Draws a `copy` where it is placed. `ct.draw(this);` is a default drawing code for all types.

### `ct.draw.copy(copy: Copy, x, y)`

Draws a `copy` in given coordinates.

### `ct.draw.image(image: String, index: Number, x, y)`

Draws a frame from a graphic asset called `image` with its frame at `index`.

### `ct.draw.imgext(image: String, index: Number, x, y, hs, vs, rotation, alpha)`

Draws a frame from a graphic asset called `image` with its frame at `index`. Applies transformations:

* `hs` – horisontal stretch;
* `vs` – vertical stretch;
* `rotation` – rotation around its center;
* `alpha` – opacity (1 means fully visible, 0 means fully transparent).

## Drawing shapes and text

### `ct.draw.rectangle(x, y, width, height, outline: Boolean)`

Draws a rectangle of a given size. If `outline` is set to `true`, then only an outline is drawn, othervise the rectangle will be filled only.

### `ct.draw.rect(x1, y1, x2, y2, outline: Boolean)`

Draws a rectangle by its two corners. If `outline` is set to `true`, then only an outline is drawn, othervise the rectangle will be filled only.

### `ct.draw.circle(x, y, radius, outline: Boolean)`

Draws a circle with its center in (x;y) and with given radius.

### `ct.draw.text(str: String, x, y, outline: Boolean)`

Draws a given text.

```js
ct.draw.text('Score: ' + ct.rooms.current.score, 20, 20);
ct.draw.text('Health: ' + this.hp, 20, 40);
```


## Drawing polygons

### `ct.draw.polygon(points: Array[Array[Number]], closed: Boolean, outline: Boolean)`

Polygons can be drawn with a single function, like that:

```js
ct.draw.polygon([ // draw a rhombus
    [0, 30], 
    [30, 0],
    [60, 30],
    [30, 60]
], true, false);
```

The first argument is an array of points to draw, the second one tells if the polygon should be closed, and the last one tells whether the shape should be filled (`false`) or drawn as an outline (`true`).

You can also use separate functions for more control. They are listed below.

### `ct.draw.polygon.begin(x, y)`

Starts drawing a new polygon in the given coordinates.

### `ct.draw.polygon.line(x, y)`

Draws a line to the given location.

### `ct.draw.polygon.move(x, y)`

Starts drawing from a new position, without drawing a line.

### `ct.draw.polygon.close()`

Closes current polygon.

### `ct.draw.polygon.fill()`

Fills the current shape.

### `ct.draw.polygon.stroke()`

Makes outline from the current polygon.

---

So, the polygon drawing example above can be also written like this:

```js
var poly = ct.draw.polygon; // Let's shorten our codes a bit
poly.begin(0, 30);
poly.line(30, 0);
poly.line(60, 30);
poly.line(30, 60);
poly.close();
poly.fill();
```

## Fixing issues with gradients and patterns

All the gradients and patterns exist in a world space, and they are not attached to drawn shapes. This results in gradients end much above the drawn shapes, and patterns may appear misaligned. 

To fix this, you can temporarily change the point from which you draw everything with `ct.draw.fix(x, y)`. Here is how it is used:

```js
ct.styles.set('GradientText'); // Select a fancy style with a gradient.
ct.draw.fix(120, 30);          // Move the drawing origin to the place
                               // where you will draw the text.

var score = ct.rooms.current.score;
ct.draw.text('Score: ' + score, 0, 0); // We don't need to set coordinates here
                                       // because we already shifted the point
                                       // from which we draw by using `ct.draw.fix`.

ct.draw.unfix(); // We return to previous drawing settings here. 
                 // Without this line your game will probably break!
ct.styles.reset();
```