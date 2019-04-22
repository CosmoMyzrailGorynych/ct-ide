ct.types.templates.VKEY = {
    onStep: function () {
        var down = false,
            hover = false;
        if (ct.mouse) {
            if (ct.mouse.hovers(this)) {
                hover = true;
                if (ct.mouse.down) {
                    down = true;
                }
            }
        }
        if (ct.touch) {
            for (const touch of ct.touch.events) {
                if (ct.touch.collide(this, touch.id)) {
                    down = hover = true;
                    break;
                }
            }
        }

        if (down) {
            this.tex = this.opts.texActive || this.opts.texNormal;
            ct.inputs.registry['vkeys.' + this.opts.key] = 1;
        } else {
            ct.inputs.registry['vkeys.' + this.opts.key] = 0;
            if (hover) {
                this.tex = this.opts.texHover || this.opts.texNormal;
            } else {
                this.tex = this.opts.texNormal;
            }
        }
    },
    onDraw: function () {
        this.x = (typeof this.opts.x === 'function')? this.opts.x() : this.opts.x;
        this.y = (typeof this.opts.y === 'function')? this.opts.y() : this.opts.y;
    },
    onDestroy: function () {void 0;},
    onCreate: function () {
        this.tex = this.opts.texNormal;
        this.depth = this.opts.depth;
    }
};

