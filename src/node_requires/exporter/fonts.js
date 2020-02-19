const fs = require('fs-extra');

const stringifyFont = font => `
@font-face {
    font-family: '${font.typefaceName}';
    src: url('fonts/${font.origname}.woff') format('woff'),
         url('fonts/${font.origname}') format('truetype');
    font-weight: ${font.weight};
    font-style: ${font.italic? 'italic' : 'normal'};
}`;
const bundleFonts = async function(proj, projdir, writeDir) {
    let css = '',
        js = '';
    const writePromises = [];
    if (proj.fonts) {
        js += 'if (document.fonts) { for (const font of document.fonts) { font.load(); }}';
        await fs.ensureDir(writeDir + '/fonts');
        const ttf2woff = require('ttf2woff');
        await Promise.all(proj.fonts.map(async font => {
            const fontData = await fs.readFile(`${projdir}/fonts/${font.origname}`);
            var ttf = new Uint8Array(fontData);
            var woff = new Buffer(ttf2woff(ttf).buffer);
            writePromises.push(fs.copy(`${projdir}/fonts/${font.origname}` , writeDir + '/fonts/' + font.origname));
            writePromises.push(fs.writeFile(writeDir + '/fonts/' + font.origname + '.woff', woff));
            css += stringifyFont(font);
        }));
    }
    await Promise.all(writePromises);
    return {
        css,
        js
    };
};

module.exports = {
    stringifyFont,
    bundleFonts
};
