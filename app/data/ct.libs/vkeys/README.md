This module allows you to create on-screen buttons and joysticks that will trigger actions you assign to them.

**Example of a virtual button:**

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

**Example of a virtual joystick:**

```js
ct.vkeys.joystick({
    key: 'Vjoy1',
    tex: 'TrackPad',
    trackballTex: 'TrackBall',
    depth: 100,
    x: 128,
    y: ct.viewHeight - 128
});
```

This joystick will be binded to input methods `vkeys.Vjoy1X` and `vkeys.Vjoy1Y`.