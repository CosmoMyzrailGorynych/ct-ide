const i18nDir = './../../app/data/i18n';
const path = require('path'),
      fs = require('fs-extra');
const referenceLanguage = require(path.join(i18nDir, 'English.json'));

const countRemainingFields = node => {
    if (typeof node === 'string') {
        return 1;
    }
    let counted = 0;
    for (const i in node) {
        counted += countRemainingFields(node[i]);
    }
    return counted;
};

// Recursively counts keys in English.json, translated keys,
// and collects paths to untranslated and excess keys
const recursiveCheck = function recursiveCheck(partial, langNode, referenceNode) {
    const untranslated = [],
          excess = [];
    let counted = 0,
        needed = 0;
    for (const i in referenceNode) {
        if (typeof referenceNode[i] === 'string') {
            needed++;
            if (!(i in langNode) || langNode[i].trim() === '') {
                untranslated.push(partial ? `${partial}.${i}` : i);
            } else {
                counted++;
            }
        } else if (i in langNode) {
            const subresults = recursiveCheck(partial ? `${partial}.${i}` : i, langNode[i], referenceNode[i]);
            if (subresults.untranslated.length) {
                untranslated.push(...subresults.untranslated);
            }
            if (subresults.excess.length) {
                excess.push(...subresults.excess);
            }
            counted += subresults.counted;
            needed += subresults.needed;
        } else {
            untranslated.push(partial ? `${partial}.${i}` : i);
            needed += countRemainingFields(referenceNode[i]);
        }
    }
    // Reverse check to catch excess keys
    // that are not present in English.json but are in another language file
    for (const i in langNode) {
        if (!(i in referenceNode) || (typeof referenceNode[i] === 'string' && referenceNode[i].trim() === '')) {
            excess.push(partial ? `${partial}.${i}` : i);
        }
    }
    return {
        untranslated,
        excess,
        counted,
        needed
    };
};

const breakpoints = [
    [95, '👏  Fabulous!'],
    [85, '✅  Good!'],
    [70, '😕  A decent coverage, but it could be better!'],
    [50, '👎  Meh'],
    [0, '🆘  Someone help, please!']
], shortBreakpoints = [
    [95, '👏'],
    [85, '✅'],
    [70, '😕'],
    [50, '👎'],
    [0, '🆘']
];
const getSuitableBreakpoint = (percent, short) => {
    if (short) {
        for (const point of shortBreakpoints) {
            if (percent >= point[0]) {
                return point[1];
            }
        }
        return 'WTF?';
    }
    for (const point of breakpoints) {
        if (percent >= point[0]) {
            return point[1];
        }
    }
    return 'WTF?';
};

module.exports = async () => {
    const fileNames = (await fs.readdir('./app/data/i18n')).filter(file =>
        path.extname(file) === '.json' &&
        file !== 'Comments.json' &&
        file !== 'English.json' &&
        file !== 'Debug.json');
    const report = {
        untranslated: {},
        excess: {},
        stats: {}
    };
    for (const lang of fileNames) {
        const rootNode = require(path.join(i18nDir, lang));
        const result = recursiveCheck('', rootNode, referenceLanguage);
        report.untranslated[lang] = result.untranslated;
        report.excess[lang] = result.excess;
        report.stats[lang] = Math.floor(result.counted / result.needed * 100);
    }
    let reportText =

`\nTranslation report:
===================\n\n` + fileNames.map(lang =>
    `Translation file ${lang}
-----------------${'-'.repeat(lang.length)}\n` +
// eslint-disable-next-line no-nested-ternary
`Coverage: ${report.stats[lang]}% ${getSuitableBreakpoint(report.stats[lang])}
Not translated: ${report.untranslated[lang].length}` +
(report.untranslated[lang].length > 0 ? '\n' + report.untranslated[lang].map(key => `  ${key}`).join('\n') : '') +
`\nExcess: ${report.excess[lang].length} ${report.excess[lang].length ? '⚠️ '.repeat(Math.min(10, report.excess[lang].length)) : '✅'}\n` +
(report.excess[lang].length > 0 ? report.excess[lang].map(key => `  ${key}`).join('\n') : '')).join('\n\n');

    reportText += '\n\nStats:\n';
    for (const lang in report.stats) {
        reportText += `  ${getSuitableBreakpoint(report.stats[lang], true)} ${report.stats[lang]}% ${lang}\n`;
    }

    reportText += '\n\nProblematic files:\n';

    var hasProblematic = false;
    for (const lang in report.excess) {
        if (report.excess[lang].length) {
            hasProblematic = true;
            reportText += `  ${lang}\n`;
        }
    }
    if (hasProblematic) {
        throw new Error(reportText);
    }
    reportText += '  ✅ None';
    return reportText;
};
