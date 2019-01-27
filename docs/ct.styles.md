# ct.styles

This object allows to create, store and use predefined styles for drawing text. These styles conform to Pixi's [TextStyle class](https://pixijs.download/release/docs/PIXI.TextStyle.html) properties.

## Using styles

### `ct.styles.get(name: String)`

Returns the specified style.

### `ct.styles.get(name: String, true)`

Returns a copy of the specified style. This copy then may be edited and used safely.

```js
var multiline = ct.styles.get('Label', true);
multiline.wordWrap = true;
multiline.wordWrapWidth = 320;
this.details = new PIXI.Text(this.info, multiline);
```

### `ct.styles.get(name: String, opts: Object)`

Creates a copy of the specified style, then extends it with a given object. This copy then may be edited and used safely.

```js
var multiline = ct.styles.get('Label', {
    wordWrap: true,
    wordWrapWidth: 320
});
this.details = new PIXI.Text(this.info, multiline);
```

## Creating styles programmatically

### `ct.styles.new(name, options)`

Creates a new style with a given name. Options are the same as if you were [creating a TextStyle](https://pixijs.download/release/docs/PIXI.TextStyle.html).