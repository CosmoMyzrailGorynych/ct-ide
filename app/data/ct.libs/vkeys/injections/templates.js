(function vkeysTemplates() {
    const commonProps = {
        depth: 0,
        blendMode: PIXI.BLEND_MODES.NORMAL,
        visible: true,
        behaviors: [],
        extends: {},
        baseClass: 'AnimatedSprite',
        animationFPS: 30,
        playAnimationOnStart: false,
        loopAnimation: true,
        texture: -1
    };
    templates.templates.VKEY = {
        name: 'VKEY',
        ...commonProps,
        onStep: function () {
            var down = false,
                hover = false;
            if (pointer.hoversUi(this)) {
                hover = true;
                if (pointer.collidesUi(this)) {
                    down = true;
                }
            }
            if (down) {
                this.tex = this.opts.texActive || this.opts.texNormal;
                inputs.registry['vkeys.' + this.opts.key] = 1;
            } else {
                inputs.registry['vkeys.' + this.opts.key] = 0;
                if (hover) {
                    this.tex = this.opts.texHover || this.opts.texNormal;
                } else {
                    this.tex = this.opts.texNormal;
                }
            }
        },
        onDraw: function () {
            this.x = (typeof this.opts.x === 'function') ? this.opts.x() : this.opts.x;
            this.y = (typeof this.opts.y === 'function') ? this.opts.y() : this.opts.y;
        },
        onDestroy: function () {
            void 0;
        },
        onCreate: function () {
            this.tex = this.opts.texNormal;
            this.zIndex = this.opts.depth;
            this.alpha = this.opts.alpha;
        }
    };

    templates.templates.VJOYSTICK = {
        name: 'VJOYSTICK',
        ...commonProps,
        onCreate: function () {
            this.tex = this.opts.tex;
            this.zIndex = this.opts.depth;
            this.alpha = this.opts.alpha;
            this.down = false;
            this.trackball = new PIXI.Sprite(res.getTexture(this.opts.trackballTex, 0));
            this.addChild(this.trackball);
        },
        // eslint-disable-next-line complexity
        onStep: function () {
            var dx = 0,
                dy = 0;
            if (this.trackedPointer && !pointer.down.includes(this.trackedPointer)) {
                this.trackedPointer = void 0;
            }
            if (!this.trackedPointer) {
                const p = pointer.collidesUi(this);
                if (pointer) {
                    this.down = true;
                    this.trackedPointer = p;
                }
            }
            if (this.trackedPointer) {
                dx = this.trackedPointer.xui - this.x;
                dy = this.trackedPointer.yui - this.y;
            } else {
                this.touchId = false;
                this.down = false;
            }
            var r = this.shape.r || this.shape.right || 64;
            if (this.down) {
                dx /= r;
                dy /= r;
                var length = Math.hypot(dx, dy);
                if (length > 1) {
                    dx /= length;
                    dy /= length;
                }
                inputs.registry['vkeys.' + this.opts.key + 'X'] = dx;
                inputs.registry['vkeys.' + this.opts.key + 'Y'] = dy;
            } else {
                inputs.registry['vkeys.' + this.opts.key + 'X'] = 0;
                inputs.registry['vkeys.' + this.opts.key + 'Y'] = 0;
            }
            this.trackball.x = dx * r;
            this.trackball.y = dy * r;
        },
        onDraw: function () {
            this.x = (typeof this.opts.x === 'function') ? this.opts.x() : this.opts.x;
            this.y = (typeof this.opts.y === 'function') ? this.opts.y() : this.opts.y;
        },
        onDestroy: function () {
            void 0;
        }
    };
})();
