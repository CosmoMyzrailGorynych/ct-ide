/* eslint-disable max-lines-per-function */
(function ctTransitionTypes() {
    const devourer = () => {
        void 0;
    };
    ct.types.templates.CTTRANSITION_FADE = {
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            ct.rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, ct.camera.width + 1, ct.camera.height + 1);
            this.overlay.endFill();
            this.overlay.alpha = this.in ? 1 : 0;
            this.addChild(this.overlay);
            this.promise = ct.tween.add({
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
    ct.types.templates.CTTRANSITION_SCALE = {
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            ct.rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, ct.camera.width + 1, ct.camera.height + 1);
            this.overlay.endFill();
            this.overlay.alpha = this.in ? 1 : 0;
            this.addChild(this.overlay);
            var sourceX = ct.camera.scale.x,
                sourceY = ct.camera.scale.y,
                endX = this.in ? sourceX : sourceX * this.scaling,
                endY = this.in ? sourceY : sourceY * this.scaling,
                startX = this.in ? sourceX * this.scaling : sourceX,
                startY = this.in ? sourceY * this.scaling : sourceY;
            ct.camera.scale.x = startX;
            ct.camera.scale.y = startY;
            this.promise = ct.tween.add({
                obj: ct.camera.scale,
                fields: {
                    x: endX,
                    y: endY
                },
                duration: this.duration,
                silent: true
            }).then(() => {
                ct.camera.scale.x = sourceX;
                ct.camera.scale.y = sourceY;
                this.kill = true;
            });
            ct.tween.add({
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
    ct.types.templates.CTTRANSITION_SLIDE = {
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            ct.rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawRect(0, 0, (ct.camera.width + 1), (ct.camera.height + 1));
            this.overlay.endFill();

            if (this.endAt === 'left' || this.endAt === 'right') {
                this.scale.x = this.in ? 1 : 0;
                this.promise = ct.tween.add({
                    obj: this.scale,
                    fields: {
                        x: this.in ? 0 : 1
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                }).then(() => {
                    this.kill = true;
                });
            } else {
                this.scale.y = this.in ? 1 : 0;
                this.promise = ct.tween.add({
                    obj: this.scale,
                    fields: {
                        y: this.in ? 0 : 1
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                }).then(() => {
                    this.kill = true;
                });
            }
            if (!this.in && this.endAt === 'left') {
                this.x = (ct.camera.width + 1);
                ct.tween.add({
                    obj: this,
                    fields: {
                        x: 0
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (!this.in && this.endAt === 'top') {
                this.y = (ct.camera.height + 1);
                ct.tween.add({
                    obj: this,
                    fields: {
                        y: 0
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (this.in && this.endAt === 'right') {
                ct.tween.add({
                    obj: this,
                    fields: {
                        x: (ct.camera.width + 1)
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }
            if (this.in && this.endAt === 'bottom') {
                ct.tween.add({
                    obj: this,
                    fields: {
                        y: (ct.camera.height + 1)
                    },
                    duration: this.duration,
                    curve: ct.tween.easeOutQuart,
                    silent: true
                })
                .catch(devourer);
            }

            this.addChild(this.overlay);
        }
    };

    ct.types.templates.CTTRANSITION_CIRCLE = {
        onStep() {
            void 0;
        },
        onDraw() {
            void 0;
        },
        onDestroy() {
            ct.rooms.remove(this.room);
        },
        onCreate() {
            this.tex = -1;
            this.x = (ct.camera.width + 1) / 2;
            this.y = (ct.camera.height + 1) / 2;
            this.overlay = new PIXI.Graphics();
            this.overlay.beginFill(this.color);
            this.overlay.drawCircle(
                0,
                0,
                ct.u.pdc(0, 0, (ct.camera.width + 1) / 2, (ct.camera.height + 1) / 2)
            );
            this.overlay.endFill();
            this.addChild(this.overlay);
            this.scale.x = this.scale.y = this.in ? 0 : 1;
            this.promise = ct.tween.add({
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
