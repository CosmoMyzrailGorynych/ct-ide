interface ICutscene extends Promise<void>{

    /**
     * Indicates whether or not the video was removed,
     * either manually or automatically after the video has ended.
     */
    removed: bool;

    /**
     * The url of a video that is currently playing
     */
    url: string|object;

    /**
     * A reference to the player; its types depends on the vide provider that is used.
     * For local videos, this is an HTML `<video>` tag.
     */
    raw: any;
}

declare namespace cutscene {
    /**
     * Shows the cutscene and returns a reference to it.
     *
     * It can be a link to youtube or vimeo or a direct link to a video. These values are valid:
     *
     * * `https://youtu.be/xxxxxxxxxx`
     * * `https://www.youtube.com/watch?v=xxxxxxxxxx`
     * * `https://www.youtube.com/embed/xxxxxxxxxx`
     * * `https://vimeo.com/xxxxxxxxxx`
     * * `https://player.vimeo.com/video/xxxxxxxxxx`
     * * `https://awesomegames.rock/trailers/catmintide.mp4`
     * * `./myVideo.mp4` (if you put it inside your `project/include` folder)
     */
    function show(url: string|object): ICutscene;

    /**
     * Use this to manually remove the player. If the video ends,
     * it will be removed automatically, but you probably
     * want to provide controls to a player, e.g. Escape button
     * to skip the cutscene.
     *
     * **Example:**
     * ```js
     * // Say, this is placed in a room's On Create event
     * this.cutscene = ct.cutscene.show('https://www.youtube.com/watch?v=F8VzZe1FqEM');
     * cutscene.then(() => {
     *     this.cutscene = void 0;
     * }).catch(error => {
     *     console.error(error);
     * });
     *
     * // In its Step event
     * if (ct.actions.Exit.pressed && this.cutscene) {
     *     ct.cutscene.remove(this.cutscene);
     * }
     * ```
     */
    function remove(cutscene: ICutscene): void;
}
