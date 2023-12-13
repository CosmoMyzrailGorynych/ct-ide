const ifHTMLMatcher = (varName: string, symbol = '@') => new RegExp(`<!-- ?if +${symbol}${varName}${symbol} ?-->([\\s\\S]*)(?:<!-- ?else +${symbol}${varName}${symbol} ?-->([\\s\\S]*?))?<!-- ?endif +${symbol}${varName}${symbol} ?-->`, 'g');
const varHTMLMatcher = (varName: string, symbol = '@') => new RegExp(`<!-- ?${symbol}${varName}${symbol} ?-->`, 'g');

/**
 * A little home-brewn string templating function for HTML.
 * Example of a variable mark: <!-- @variable@ --> and <!-- %variable% --> for injections.
 *
 * Example of if/else:
 * <!-- if @variable@ -->
 *    (code)
 * <!-- else @variable@ -->
 *    (code)
 * <!-- endif @variable@ -->
 *
 * Injections use %variable% instead of @variable@.
 * In if/else blocks, empty arrays are treated as `false`.
 *
 * @param {string} input The source string with template tags
 * @param {object<string,string|Array|object>} vars The variables to substitute
 * @param {object<string,string|Array|object>} injections Module-provided injections to substitute
 */
const templateHTML = (
    input: string,
    vars: Record<string, any>,
    injections: Record<string, any> = {}
) => {
    let output = input;
    for (const i in vars) {
        output = output.replace(varHTMLMatcher(i), () => (typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : vars[i]));
        output = output.replace(ifHTMLMatcher(i), (Array.isArray(vars[i]) ? vars[i].length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varHTMLMatcher(i, '%'), () => (typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]));
    }
    return output;
};

type Filenames = {
    cssBundle: string;
    jsBundle: string;
    iconRevision: string;
}

export const substituteHtmlVars = (
    str: string,
    project: IProject,
    injections: Record<string, string>,
    filenames: Filenames
): string =>
    templateHTML(str, {
        gametitle: project.settings.authoring.title || 'ct.js game',
        accent: project.settings.branding.accent || 'ct.js game',
        particleEmitters: project.emitterTandems && project.emitterTandems.length,
        includeDragonBones: project.skeletons.some(s => s.from === 'dragonbones'),
        jsbundle: filenames.jsBundle,
        cssbundle: filenames.cssBundle,
        iconrev: filenames.iconRevision
    }, injections);
