# Working with Viewport

## Variables Defining the Viewport

The position and the size of the viewport are defined by these variables:

* `ct.room.x`;
* `ct.room.y`;
* `ct.viewWidth` (read-only);
* `ct.viewHeight` (read-only).

There are two other variables:

* `ct.roomWidth` (read-only);
* `ct.roomHeight` (read-only).

They define how the room was designed in ct.IDE. These variables may be different depending on different viewport scaling methods.

## Moving camera around

To move the camera around, you can either modify `ct.room.x` and `ct.room.y` by yourself, or use the built-in variables for following things on the screen. The latter approach requires the `ct.room.follow` variable to be set. A simple line `ct.room.follow = this;` inside the On Create code of your main character will be enough.

You can alter the camera's behaviour by these variables:

* `ct.room.borderX` and `ct.room.borderY` define the area at which the camera shifts if the followed copy enters these borders. These values are represented in pixels, relative to a room's designed size;
* `ct.room.center` may be set to `true` to automatially set borders so that the followed copy always stays at the center of the screen. It has a higher priority over `ct.room.borderX` and `ct.room.borderY`;
* `ct.room.followShiftX` and `ct.room.followShiftY` allow to place the camera higher/lower/etc than the target copy's axis;
* `ct.room.followDrift` is a value between [0; 1] that defines how fast the camera reacts to a copy's movement. The default is `0` (no drift). For casual games and puzzles, settings `ct.room.followDrift` to `0.9` may be a good choice to create a smooth camera.

## Making an adaptive UI

Contemporary devices all have various resolutions, and thus your app should adapt to them and still give the maximum quality.

The first step you need to do is to enable the `ct.fittoscreen` catmod. Then, select the "Settings" tab and select a scaling mode that suits your game project more:

* Fast scaling with letterboxing is suitable for purely **pixelart games**, or when performance is vital;
* Expansion works good when the more player sees on the screen, the better (e.g. RTS or games like Factorio);
* Expansion + viewport management is usually *preferable* over regular expansion as it helps you with keeping important things in focus;
* Scaling with letterboxing works for **any types of projects**, and can also give nice transforms to your pixelart games. This will remain your designed aspect ratio.
* Scaling without letterboxing ensures both best quality and use of full screen. It is often prerable over scaling with letterboxing.

If you are making a pixelart game, make sure you disable image smoothing at the "Settings" tab.

In general, you should follow these rules:

* use `ct.viewWidth` and `ct.viewHeight` to position things relative to a screen;
* update position of UI elements regularly, as it will be required on resolution change, resizing a windowed version, at random unplug of external monitor, etc;
* when using "Scaling with/without letterboxing", start designing your rooms, graphic assets and UI at a relatively big view size at rooms' settings, e.g. at 1920x1080px, so it will scale down on other resolutions nicely.

Don't forget to test your UI on different screen sizes and devices!