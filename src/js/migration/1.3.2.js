window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.3.2',
    process: project => new Promise(resolve => {
        /**
         * Project settings got reorganized, logically and visually
         */
        const s = project.settings;

        s.rendering = s.rendering || {
            maxFPS: s.maxFPS || 60,
            pixelatedrender: s.pixelatedrender || false,
            highDensity: s.highDensity === (void 0) ? true : s.highDensity,
            usePixiLegacy: s.usePixiLegacy === (void 0) ? true : s.usePixiLegacy,
            desktopMode: s.desktopMode || 'maximized'
        };
        delete s.maxFPS;
        delete s.fps; // A legacy config that was relevant prior to v1.
        delete s.pixelatedrender;
        delete s.highDensity;
        delete s.usePixiLegacy;
        delete s.desktopMode;

        s.authoring = s.authoring || {
            title: s.title,
            author: s.author,
            site: s.site,
            version: s.version,
            versionPostfix: s.versionPostfix
        };
        delete s.title;
        delete s.author;
        delete s.site;
        delete s.version;
        delete s.versionPostfix;

        delete s.minifyhtmlcss; // Now doesn't have an option, HTML and CSS are always minified.
        delete s.minifyjs; // This one never worked properly.

        /**
         * Tile layers at rooms can now be extended and have an object `exts`.
         */
        for (const room of project.rooms) {
            for (const layer of room.tiles) {
                layer.extends = layer.extends || {};
                delete layer.exts; // Leftovers from development of v1.3.2
            }
        }

        resolve();
    })
});
