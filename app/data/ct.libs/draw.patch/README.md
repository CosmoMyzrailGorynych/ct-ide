An experimental module that just adds a `ct.draw.patch` call for 9-patch rendering. It is not quite tested and is definitely not the fastest, but is does its job. Will yield terrible results if the resulting image is too small.

Syntax: `ct.draw.patch(graph, frame, options);`

Example:

```js
ct.draw.patch('Panel9Patch', 0, {
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
    marginx: 24,
    marginy: 24
});
```

Margins are symmetrical, and depict a portion of image that is not stretched.