const substituteHtmlVars = (str, project, injects) =>
    str.replace('<!-- %htmltop% -->', () => injects.htmltop)
        .replace('<!-- %htmlbottom% -->', () => injects.htmlbottom)
        .replace(/<!-- %gametitle% -->/g, () => project.settings.authoring.title || 'ct.js game')
        .replace(/<!-- %accent% -->/g, () => project.settings.branding.accent || '#446adb')
        .replace('<!-- %particleEmitters% -->', () => ((project.emitterTandems && project.emitterTandems.length) ?
            '<script src="pixi-particles.min.js"></script>' :
            ''))
        .replace('<!-- %dragonbones% -->', () => (
            project.skeletons.some(s => s.from === 'dragonbones') ?
                '<script src="DragonBones.min.js"></script>' :
                ''));

module.exports = {
    substituteHtmlVars
};
