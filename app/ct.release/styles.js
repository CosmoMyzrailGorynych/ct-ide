/***************************************
         [ styles cotomod ]
***************************************/

ct.styles = {
    'types': { },
    'new': function (name,fill,stroke,text,shadow) {
        // style constructor. Returns Style
        var style = {};
        if (fill) {
            if (fill.type == 'solid') {
                style.fillStyle = fill.color;
            } else if (fill.type == 'radgrad') {
                var grad = ct.x.createRadialGradient(fill.r,fill.r,0,0,0,fill.r);
                for (k in fill.colors) {
                    grad.addColorStop(fill.colors[k].pos,fill.colors[k].color);
                };
                style.fillStyle = grad;
            } else if (fill.type == 'grad') {
                var grad = ct.x.createLinearGradient(fill.x1,fill.y1,fill.x2,fill.y2);
                for (k in fill.colors) {
                    grad.addColorStop(fill.colors[k].pos,fill.colors[k].color);
                };
                style.fillStyle = grad;
            } else if (fill.type == 'pattern') {
                style.fillStyle = ct.background.types[name];
            }
        }
        if (stroke) {
            style.strokeStyle = stroke.color;
            style.lineWidth = stroke.width;
        }
        if (text) {
            style.font = text.size + 'px ' + text.family;
            if (text.valign) style.textBaseline = text.valign;
            if (text.halign) style.textAlign = text.halign;
        }
        if (shadow) {
            style.shadowColor = shadow.color;
            style.shadowOffsetX = shadow.x;
            style.shadowOffsetY = shadow.y;
            style.shadowBlur = shadow.blur;
        }
        ct.styles.types[name] = style;
        return style;
    },
    'set': function (name) {
        // sets style
        for (k in ct.styles.types[name]) {
            ct.x[k] = ct.styles.types[name][k];
        }
    },
    'reset': function () {
        // sets canvas settings to default
        ct.x.strokeStyle = '#000000';
        ct.x.globalAlpha = 1;
        ct.x.font = '12px sans-serif';
        ct.x.fillStyle = '#000000';
        ct.x.shadowBlur = 0;
        ct.x.shadowColor = 'none';
        ct.x.shadowOffsetX = 0;
        ct.x.shadowOffsetY = 0;
        ct.x.lineWidth = 0;
        ct.x.textBaseline = 'alphabet';
        ct.x.textAlign = 'left'; 
    }
};
@styles@
%styles%

ct.libs += " styles";