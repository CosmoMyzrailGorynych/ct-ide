ct.types.templates.VKEY = {
    onStep: function () {
        if (ct.mouse.hovers(this)) {
            this.tex = this.opts.texHover || this.opts.texNormal;
            if (ct.mouse.down) {
                this.tex = this.opts.texActive || this.opts.texNormal;
                ct.inputs.registry[this.opts.key] = 1;
            } else {
                ct.inputs.registry[this.opts.key] = 0;
            }
        } else {
            this.tex = this.opts.texNormal;
            ct.inputs.registry[this.opts.key] = 0;
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

