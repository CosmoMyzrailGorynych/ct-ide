title: ct.styles Object
---

# ct.styles

This object allows to create, store and use predefined styles for drawing text and basic shapes.

---

## Using styles

### `ct.styles.set(name: String)`

Sets current drawing settings to ones specified in used style. If a provided style doesn't have settings for specific parts (e.g. has no shadow info), they are mixed with old ones.

### `ct.styles.reset()` 

Sets drawing settings to defaults: 12px sans-serif font, black fill, 1px black outlines, no shadow.

---

## Creating styles programmatically

### `ct.styles.new(name, fill, stroke, text, shadow)`

Creates a new style with a given name. Each other arguments are JavaScript objects. You can set them to `false` if you don't need some of the arguments.

#### Fill style

Fill style must have a `type` field, which may be one of the following:

- 'solid' – a simple diffuse fill;
- 'radgrad' – radial gradient;
- 'grad' – linear gradient;
- 'pattern' – an image texture.

'solid' styles are defined by `color` property, while gradients are defined by an array of colors and size.

```js Example: Creating a simple solid fill
ct.styles.new('Red', {
    type: 'solid',
    color: '#ff0000'
}, false, false, false);
```

```js Example: Creating a simple radial gradient
ct.styles.new('RedAndYellow', {
    type: 'radgrad',
    colors: [{
        color: '#ff0000',
        pos: 0 // this is a color of the center
    }, {
        color: '#ffff00',
        pos: 1 // this is a color of the borders
    }],
    r: 64 // gradient's radius
}, false, false, false);
```

```js Example: Creating a simple linear gradient
ct.styles.new('RedAndYellow', {
    type: 'grad',
    colors: [{
        color: '#ff0000',
        pos: 0 // this is a color of the center
    }, {
        color: '#ffff00',
        pos: 1 // this is a color of the borders
    }],
    x1: 0,
    y1: 0,
    x2: 128,
    y2: 128 // this will be a diagonal gradient
}, false, false, false);
```

```js Example: Creating a simple pattern fill
ct.styles.new('Flowery', {
    type: 'pattern',
    name: 'Flowers' // here we define a graphic asset's name
}, false, false, false);
```

#### Strokes

Stroke style is defined by a third argument. It has two settings: `width` and `color`.

```js Example: Creating a style with a strong border
ct.styles.new('Danger', {
    type: solid,
    color: 'rgba(255, 0, 0, 0.27);'
}, {
    color: '#ff0000',
    width: 4
}, false, false);
```

#### Text styles

Text is defined by these properties:

- `size`, in pixels;
- `family` is a so called font family, a comma separated list of typefaces you want to use, starting with the most wanted. Font names with spaces in them must also be quoted. E.g. `'Roboto Slab', Georgia, serif`
- `valign` defines how the text should be drawn in vertical space. Valid values are `'top', 'bottom', 'alphabet', 'middle'`.
- `halign` describes how the text should be aligned in horizontal space. Valid values are `'left', 'right', 'center'`.
- `weight` is a number from 100 to 900, representing how bold or how thin the font should be rendered. Usually you will use numbers like 100 (extra light, hairline fonts), 200, 300, 400 (normal font), 500, 600 (semibold), 700, 800, 900 (extra bold, 'black' fonts). Note that not all fonts include all the variants, though some of them may include even more than listed.
- `italic` may be either `true` or `false` and tells if an oblique font should be used. Again, not all fonts have a special variant for italic text.

```js Example: creating an oblique, book-like font style
ct.styles.new('Georgia16', {
    type: solid,
    color: '#000'
}, false, {
    family: 'Georgia, Merriweather, serif',
    size: 16,
    italic: true,
    weight: 400
}, false);
```

#### Adding shadows

Shadows are defined by 4 parameters:

- `color`;
- `x` and `y` that set shadow's shift;
- `blur` sets how feathered a shadow should be.

```js Example: creating a simple style with a dark shadow
ct.styles.new('Shadow', false, false, false, {
    color: 'rgba(0, 0, 0, 0.35)',
    x: -5,
    y: 5,
    blur: 5
});
```