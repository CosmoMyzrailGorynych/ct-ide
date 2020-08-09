const fs = require('fs-extra');

const stringifyFont = font => `
@font-face {
    font-family: '${font.typefaceName}';
    src: url('fonts/${font.origname}.woff') format('woff'),
         url('fonts/${font.origname}') format('truetype');
    font-weight: ${font.weight};
    font-style: ${font.italic ? 'italic' : 'normal'};
}`;
const bundleFonts = async function (proj, projdir, writeDir) {
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
            let woff;
            try {
                woff = new Buffer(ttf2woff(ttf).buffer);
            } catch (e) {
                window.alertify.error(`Whoah! A buggy ttf file in the font ${font.typefaceName} ${font.weight} ${font.italic ? 'italic' : 'normal'}. You should either fix it or find a new one.`);
                throw e;
            }
            writePromises.push(fs.copy(`${projdir}/fonts/${font.origname}`, writeDir + '/fonts/' + font.origname));
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

const charSets = {
    punctuation: ' !"#$%&\'()*+,-./0123456789:;<=>?@[\\]^_`{|}~',
    basicLatin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    latinExtended: 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏ',
    cyrillic: '«»ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂о҃о҄о҅о҆о҇о҈о҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯ',
    greekCoptic: 'ͰͱͲͳʹ͵Ͷͷͺͻͼͽ;΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿ',
    custom: ''
};

const specialCharMap = {
    38: '&amp;',
    60: '&lt;',
    32: 'space',
    62: '&gt;',
    34: '&quot;'
};
const charCodeToXMLChar = code => {
    if (code in specialCharMap) {
        return specialCharMap[code];
    }
    return String.fromCharCode(code);
};

const generateXML = function generateXML(fontData, ctFont, typefaceName) {
    let XMLTemplate = `<font>
    <info face="${typefaceName}" size="${ctFont.bitmapFontSize}" bold="0" italic="0" chasrset="" unicode="0" stretchH="100" smooth="1" aa="1" padding="0,0,0,0" spacing="1,1"/>
    <common lineHeight="${ctFont.bitmapFontLineHeight}" base="${ctFont.bitmapFontSize}" scaleW="${fontData.canvas.width}" scaleH="${fontData.canvas.height}" pages="1" packed="0"/>
    <pages>
        <page id="0" file="${ctFont.uid}.png"/>
    </pages>
    <chars count="${Object.keys(fontData.map).length}">`;

    for (const key in fontData.map) {
        const c = fontData.map[key];
        XMLTemplate += `\n        <char id="${key}" x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" xoffset="0" yoffset="0" xadvance="${c.width}" page="0" chnl="0" letter="${charCodeToXMLChar(key)}"/>`;
    }

    XMLTemplate += `
    </chars>
    <kernings count="0"></kerings>
</font>`;

    return XMLTemplate;
};

const bakeBitmapFonts = function bakeBitmapFonts(proj, projdir, writeDir) {
    const generator = require('./../resources/fonts/bitmapFontGenerator');
    const path = require('path');
    return Promise.all(proj.fonts.filter(font => font.bitmapFont)
        .map(async font => {
            const fCharsets = font.charsets || ['basicLatin'];
            let letterList;
            if (fCharsets.length === '1' && fCharsets[0] === 'allInFont') {
                letterList = false;
            } else {
                letterList = fCharsets.reduce((acc, charset) => acc + (charSets[charset] || ''), '');
            }
            if (fCharsets.indexOf('custom') !== -1) {
                letterList += font.customCharset;
            }
            const settings = {
                fill: '#ffffff',
                // stroke: '#000000',
                list: letterList,
                height: font.bitmapFontSize,
                margin: 2
            };
            const typefaceName = `${font.typefaceName}_${font.weight}${font.italic ? '_Italic' : ''}`,
                  xmlPath = `${font.uid}.xml`,
                  pngPath = `${font.uid}.png`;
            const fontPath = path.join(projdir, 'fonts', font.origname);
            const drawData = await generator(fontPath, path.join(writeDir, `${font.uid}.png`), settings);

            const xml = generateXML(drawData, font, typefaceName);

            await fs.writeFile(path.join(writeDir, `${font.uid}.xml`), xml, 'utf8');

            return {
                xmlPath,
                pngPath,
                typefaceName
            };
        }))
        .then(fontsMetadata => {
            const loaderScript = fontsMetadata.reduce((acc, fontMeta) =>
                acc + `\n.add('${fontMeta.typefaceName}', '${fontMeta.xmlPath}')`, 'PIXI.Loader.shared');
            return {
                loaderScript
            };
        });
};

module.exports = {
    stringifyFont,
    bundleFonts,
    bakeBitmapFonts,
    generateXML
};
