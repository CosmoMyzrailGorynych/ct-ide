const mod = {
    styleToTextStyle: s => {
        const o = {
            fontFamily: s.font.family,
            fontSize: s.font.size,
            fontStyle: s.font.italic ? 'italic' : 'normal',
            fontWeight: s.font.weight,
            align: s.font.halign,
            lineJoin: 'round',
            lineHeight: s.font.lineHeight || s.font.size * 1.35
        };
        if (s.font.wrap) {
            o.wordWrap = true;
            o.wordWrapWidth = s.font.wrapPosition || 100;
        }
        if (s.fill) {
            if (Number(s.fill.type) === 0) {
                o.fill = s.fill.color || '#FFFFFF';
            } else if (Number(s.fill.type) === 1) {
                o.fill = [s.fill.color1 || '#FFFFFF', s.fill.color2 || '#FFFFFF'];
                if (Number(s.fill.gradtype) === 1) {
                    o.fillGradientType = 0;
                } else if (Number(s.fill.gradtype) === 2) {
                    o.fillGradientType = 1;
                }
            }
        }
        if (s.stroke) {
            o.strokeThickness = s.stroke.weight;
            o.stroke = s.stroke.color;
        }
        if (s.shadow) {
            o.dropShadow = true;
            o.dropShadowBlur = s.shadow.blur;
            o.dropShadowColor = s.shadow.color;
            o.dropShadowAngle = Math.atan2(s.shadow.y, s.shadow.x);
            o.dropShadowDistance = Math.hypot(s.shadow.x, s.shadow.y);
        }
        return o;
    }
};

module.exports = mod;
