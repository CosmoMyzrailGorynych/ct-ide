/* eslint-disable no-loop-func */
/* eslint-disable func-names */
// A version of https://github.com/riot/hot-reload/tree/v3
// adapted for browser-ish usage
// Copyright (c) 2016 Riot (Gianluca Guarini) MIT

/* eslint-disable no-underscore-dangle */
(function addRiotHotReload() {
    const nonState = 'isMounted opts'.split(' ');

    const reload = function reload(name) {
        riot.util.styleManager.inject();

        var elems = document.querySelectorAll(`${name}, [data-is=${name}]`);
        const tags = [];

        for (let i = 0; i < elems.length; i++) {
            var el = elems[i],
                oldTag = el._tag,
                v;
            reload.trigger('before-unmount', oldTag);
            oldTag.unmount(true); // detach the old tag

            // reset the innerHTML and attributes to how they were before mount
            el.innerHTML = oldTag.__.innerHTML;
            (oldTag.__.instAttrs || []).forEach(function (attr) {
                el.setAttribute(attr.name, attr.value);
            });

            // copy options for creating the new tag
            var newOpts = {};
            for (const key in oldTag.opts) {
                newOpts[key] = oldTag.opts[key];
            }
            newOpts.parent = oldTag.parent;

            // create the new tag
            reload.trigger('before-mount', newOpts, oldTag);
            const [newTag] = riot.mount(el, newOpts);

            // copy state from the old to new tag
            for (const key in oldTag) {
                v = oldTag[key];
                if (nonState.indexOf(key) !== -1) {
                    continue;
                }
                newTag[key] = v;
            }
            newTag.update();
            tags.push(newTag);
            reload.trigger('after-mount', newTag, oldTag);
        }
        return tags;
    };

    riot.observable(reload);
    riot.reload = reload;
    //if (riot.default) {
    //    riot.default.reload = reload;
    //}
})();
