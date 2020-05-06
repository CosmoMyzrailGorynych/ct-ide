This module allows you to create on-screen buttons and joysticks that will trigger actions you assign to them.

**Example of a virtual button:**

```js
var keyUp = ct.vkeys.button({
    key: 'Vk1',
    texNormal: 'Button_Normal',
    texHover: 'Button_Hover',
    texActive: 'Button_Active',
    x: 50,
    y: 50,
    depth: 100,
    container: myUiLayer
});
```

This will create a button in the top-left corner of the screen that will be binded to `vkeys.Vk1` input method. Textures will change on hover and press (you should add actual textures for that).

**Example of a virtual joystick:**

```js
ct.vkeys.joystick({
    key: 'Vjoy1',
    tex: 'TrackPad',
    trackballTex: 'TrackBall',
    depth: 100,
    x: 128,
    y: 128,
    container: myUiLayer
});
```

This joystick will be binded to input methods `vkeys.Vjoy1X` and `vkeys.Vjoy1Y`.

Each methods' options has a field `container`, that can be set to any parent, but defaults to `ct.room`. Still, virtual keys are supposed to be added to UI layers only. Also, if you set `x` and/or `y` as functions, the created control won't be affected by `ct.camera.realign`.