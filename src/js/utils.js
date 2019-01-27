/* eslint {
    'no-underscore-dangle': 'off'
} */
(window => {
    window.___extend = function(destination, source) {
        for (var property in source) {
            if (destination[property] &&
                typeof destination[property] === 'object' &&
                destination[property].toString() === '[object Object]' &&
                source[property]
            ) {
                window.___extend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };
    
    const fs = require('fs-extra');
    // better copy
    /*
    window.megacopy = function(sourcePath, destinationPath, callback) {
        var is = fs.createReadStream(sourcePath);
        var os = fs.createWriteStream(destinationPath);
        is.on('end', callback);
        is.pipe(os);
    };
    */
    window.megacopy = fs.copy;

    /* eslint {"no-bitwise": "off"} */
    /**
     * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
     * @returns {String} An RFC4122 version 4 compliant GUID
     */
    window.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    window.styleToTextStyle = s => {
        const o = {
            fontFamily: s.font.family,
            fontSize: s.font.size,
            fontStyle: s.font.italic? 'italic' : 'normal',
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
                o.fill = s.fill.color;
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
    };
})(this);
