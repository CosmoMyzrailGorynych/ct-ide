# Multistyle text for pixi.js

This module allows **creating** *multistyle* labels in your ***game***.

## Example

In the example below, we are defining 4 text styles.
`default` is the default style for the text, and the others matches the tags inside the text.

```js
this.label = new PIXI.MultiStyleText(
    "Let's make some <ml>multiline</ml>\nand <ms>multistyle</ms> text for\n<ct>ct.js!</ct>", {
    "default": ct.styles.get('Text_Regular'),
    "ml": {
        fontStyle: "italic",
        fill: "#ff8888"
    },
    "ms": {
        fontStyle: "italic",
        fill: "#4488ff"
    },
    "ct": {
        fontSize: "64px",
        fill: "#446adb"
    }
});
this.addChild(this.label);
```

You can use ct.js styles as well:

```js
this.label = new PIXI.MultiStyleText(
    'Let\'s make some <comic>fancy</comic> and <red>terrifying</red> text styles', {
    default: ct.styles.get('Text_Regular'),
    comic: ct.styles.get('Text_Comic'),
    red: ct.styles.get('Text_Red')
});
this.addChild(this.label);
```

## License

Original module is distributed under MIT license, and this catmod is released as a part of ct.js, under MIT license.

Here is the original license:

```
The MIT License (MIT)

Copyright (c) 2014 Tommy Leunen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
```
