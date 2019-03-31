**Warning: this module is unfinished and is not well-tested.**

This module allows you to create on-screen buttons that will trigger actions you assign to them. Currently, virtual joysticks are not supported.

Example:

```js
var keyUp = ct.vkeys.button({
    key: 'Vk1',
    texNormal: 'Button_Normal',
    texHover: 'Button_Hover',
    texActive: 'Button_Active',
    x: 50,
    y: ct.viewHeight - 50,
    depth: 100
});
```

This will create a button in the bottom-left corner of the screen that will be binded to `vkeys.Vk1` input method. Textures will change on hover and press (you should add actual textures for that).