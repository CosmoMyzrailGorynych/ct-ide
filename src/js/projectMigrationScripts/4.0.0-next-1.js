window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-1',
    process: project => new Promise(resolve => {
        // Cleanup old catmods
        const {rendering} = project.settings;
        rendering.viewMode ??= project.libs.fittoscreen.mode;
        delete project.libs.fittoscreen;
        delete project.libs.touch;
        delete project.libs['sound.howler'];
        delete project.libs['sound.basic'];

        // `ct.` prefix drop
        const regex = /ct\.(meta|camera|templates|rooms|actions|inputs|content|backgrounds|styles|res|emitters|tilemaps|timer|u|pixiApp|stage|loop|fittoscreen|assert|capture|cutscene|desktop|eqs|filters|flow|fs|gamedistribution|inherit|gamepad|keyboard|mouse|pointer|nakama|noise|nanoid|place|random|sprite|storage|touch|transition|ulid|vgui|vkeys|yarn)/g;
        const regexSound = /ct\.sound/g;
        const regexDelta = /ct\.delta/g;
        const regexRoom = /ct\.room/g;

        const replaceCode = code => code
            .replace(regexDelta, 'u.delta')
            .replace(regex, '$1')
            .replace(regexSound, 'sounds')
            .replace(regexRoom, 'rooms.current');

        for (const type of ['rooms', 'templates']) {
            const collection = project[type];
            for (const asset of collection) {
                for (const event of asset.events) {
                    event.code = replaceCode(event.code);
                }
            }
        }
        for (const script of project.scripts) {
            script.code = replaceCode(script.code);
        }
        resolve();
    })
});
