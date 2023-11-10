/* eslint-disable max-lines-per-function */
(function ctTransitionTemplates() {
    const devourer = () => {
        void 0;
    };
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
    templates.templates.CTTRANSITION_FADE = {
        ...commonProps,
        name: 'CTTRANSITION_FADE',
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, camera.width + 1, camera.height + 1);
            this.overlay.endFill();
            this.overlay.alpha = this.in ? 1 : 0;
            this.addChild(this.overlay);
            this.promise = tween.add({
                obj: this.overlay,
                fields: {
                    alpha: this.in ? 0 : 1
                },
                duration: this.duration,
                silent: true
            }).then(() => {
                this.kill = true;
            });
        }
    };
    templates.templates.CTTRANSITION_SCALE = {
        ...commonProps,
        name: 'CTTRANSITION_SCALE',
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, camera.width + 1, camera.height + 1);
            this.overlay.endFill();
            this.overlay.alpha = this.in ? 1 : 0;
            this.addChild(this.overlay);
            var sourceX = camera.scale.x,
                sourceY = camera.scale.y,
                endX = this.in ? sourceX : sourceX * this.scaling,
                endY = this.in ? sourceY : sourceY * this.scaling,
                startX = this.in ? sourceX * this.scaling : sourceX,
                startY = this.in ? sourceY * this.scaling : sourceY;
            camera.scale.x = startX;
            camera.scale.y = startY;
            this.promise = tween.add({
                obj: camera.scale,
                fields: {
                    x: endX,
                    y: endY
                },
                duration: this.duration,
                silent: true
            }).then(() => {
                camera.scale.x = sourceX;
                camera.scale.y = sourceY;
                this.kill = true;
            });
            tween.add({
                obj: this.overlay,
                fields: {
                    alpha: this.in ? 0 : 1
                },
                duration: this.duration,
                silent: true
            })
            .catch(devourer);
        }
    };
    templates.templates.CTTRANSITION_SLIDE = {
        ...commonProps,
        name: 'CTTRANSITION_SLIDE',
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, (camera.width + 1), (camera.height + 1));
            this.overlay.endFill();

            if (this.endAt === 'left' || this.endAt === 'right') {
                this.scale.x = this.in ? 1 : 0;
                this.promise = tween.add({
                    obj: this.scale,
                    fields: {
                        x: this.in ? 0 : 1
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                }).then(() => {
                    this.kill = true;
                });
            } else {
                this.scale.y = this.in ? 1 : 0;
                this.promise = tween.add({
                    obj: this.scale,
                    fields: {
                        y: this.in ? 0 : 1
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                }).then(() => {
                    this.kill = true;
                });
            }
            if (!this.in && this.endAt === 'left') {
                this.x = (camera.width + 1);
                tween.add({
                    obj: this,
                    fields: {
                        x: 0
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (!this.in && this.endAt === 'top') {
                this.y = (camera.height + 1);
                tween.add({
                    obj: this,
                    fields: {
                        y: 0
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (this.in && this.endAt === 'right') {
                tween.add({
                    obj: this,
                    fields: {
                        x: (camera.width + 1)
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (this.in && this.endAt === 'bottom') {
                tween.add({
                    obj: this,
                    fields: {
                        y: (camera.height + 1)
                    },
                    duration: this.duration,
                    curve: tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }

            this.addChild(this.overlay);
        }
    };

    templates.templates.CTTRANSITION_CIRCLE = {
        ...commonProps,
        name: 'CTTRANSITION_CIRCLE',
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.x = (camera.width + 1) / 2;
            this.y = (camera.height + 1) / 2;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawCircle(
                0,
                0,
                u.pdc(0, 0, (camera.width + 1) / 2, (camera.height + 1) / 2)
            );
            this.overlay.endFill();
            this.addChild(this.overlay);
            this.scale.x = this.scale.y = this.in ? 0 : 1;
            this.promise = tween.add({
                obj: this.scale,
                fields: {
                    x: this.in ? 1 : 0,
                    y: this.in ? 1 : 0
                },
                duration: this.duration,
                silent: true
            }).then(() => {
                this.kill = true;
            });
        }
    };
})();
