# ct.cutscene

A module for showing cutscenes from youtube/vimeo or a direct link to a video.

## `ct.cutscene.show(url)`

Shows the cutscene and returns a reference to it.

It can be a link to youtube or vimeo or a direct link to a video. These values are valid:

* `https://youtu.be/xxxxxxxxxx`
* `https://www.youtube.com/watch?v=xxxxxxxxxx`
* `https://www.youtube.com/embed/xxxxxxxxxx`
* `https://vimeo.com/xxxxxxxxxx`
* `https://player.vimeo.com/video/xxxxxxxxxx`
* `https://awesomegames.rock/trailers/catmintide.mp4`
* `./myVideo.mp4` (if you put it inside your `project/include` folder)

No extra settings or parameters for Vimeo or YouTube are needed, ct.cutscene will try to remove most of the visible controls from the video. **Note:** Vimeo videos will always have controls unless you have a premium account. Vimeo videos will also fail to load in the integrated debugger; please test it in your default browser.

## `ct.cutscene.remove(cutscene)`

Use this to manually remove the player. If the video ends, it will be removed automatically, but you probably want to provide controls to a player, e.g. Escape button to skip the cutscene.

```js
// Say, this is placed in a room's On Create event
this.cutscene = ct.cutscene.show('https://www.youtube.com/watch?v=F8VzZe1FqEM');
cutscene.then(() => {
    this.cutscene = void 0;
}).catch(error => {
    console.error(error);
});

// In its Step event
if (ct.actions.Exit.pressed && this.cutscene) {
    ct.cutscene.remove(this.cutscene);
}
```