const substituteCssVars = (str, project, injects) => {
    const Color = global.brehautColor;
    let color1 = project.settings.branding.accent,
        // eslint-disable-next-line new-cap
        color2 = (Color(project.settings.branding.accent).getLuminance() < 0.5) ? '#ffffff' : '#000000';
    if (project.settings.branding.invertPreloaderScheme) {
        [color1, color2] = [color2, color1];
    }
    return str
        .replace('/*@pixelatedrender@*/', project.settings.pixelatedrender ? 'canvas,img{image-rendering:optimizeSpeed;image-rendering:-moz-crisp-edges;image-rendering:-webkit-optimize-contrast;image-rendering:optimize-contrast;image-rendering:pixelated;ms-interpolation-mode:nearest-neighbor}' : '')
        .replace(/\/\*@preloaderforeground@\*\//g, color1)
        .replace(/\/\*@preloaderbackground@\*\//g, color2)
        .replace('/*%css%*/', injects.css);
};
module.exports = {
    substituteCssVars
};
