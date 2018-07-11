# ct.mouse

`ct.mouse` handles mouse movement and press events.

There are three states in mouse events:

- `pressed` – a mouse button was just pushed down. Along with that, a `down` event is called;
- `down` – a mouse button is still being held;
- `released` – a mouse button was released.

## Methods and parameters

### `ct.mouse.x`, `ct.mouse.y`

Current cursor position at horisontal and vertical axes. 

```js Example: make a copy follow the cursor
this.x = ct.mouse.x;
this.y = ct.mouse.y;
```
> Note that this is a cursor position relative to the current view (or camera), but not relative to the room.

```js Example: move a copy across a large room
this.x = ct.mouse.x + ct.rooms.current.x;
this.y = ct.mouse.y + ct.rooms.current.y;
```

### `ct.mouse.pressed`

Can be either `true` or `false`. Determines whether a mouse button was pressed.

```js Example: create a bullet on mouse click
if (ct.mouse.pressed) {
    ct.types.make('Bullet',this.x,this.y);
}
```

### `ct.mouse.down`

Can be either `true` or `false`. Determines whether a mouse button is held down.

### `ct.mouse.released`

Can be either `true` or `false`. Determines whether a mouse button was released.

### `ct.mouse.inside`

Can be either `true` or `false`. Determines whether there is a cursor inside the drawing canvas.

### `ct.mouse.button`

The mouse button's index of the last press event. 

- `0` means that a left mouse button was pressed;
- `1` stands for mouse wheel;
- `2` is for right mouse button.

`ct.mouse.clear()`

Clears all the mouse events for the current frame. May be used to consume player's input to prohibit its propagation to other copies.