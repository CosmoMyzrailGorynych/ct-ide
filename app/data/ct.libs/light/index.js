const light = (function addCtLight() {
    const lightLayer = new PIXI.Container(),
          {renderer} = pixiApp,
          renderTexture = PIXI.RenderTexture.create({
              width: 1024,
              height: 1024
          }),
          lightSprite = new PIXI.Sprite(renderTexture);
    let bg, ambientColor;
    lightSprite.isUi = true;
    lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    const light = {
        /**
         * @param {PIXI.Texture} texture
         * @param {number} x
         * @param {number} y
         * @returns {PIXI.Sprite}
         */
        add(texture, x, y, options) {
            const l = new PIXI.Sprite(texture);
            l.blendMode = PIXI.BLEND_MODES.ADD;
            l.x = x;
            l.y = y;
            if (options) {
                Object.assign(l, options);
            }
            lightLayer.addChild(l);
            light.lights.push(l);
            return l;
        },
        /**
         * @param {PIXI.Texture | PIXI.Sprite} copyOrLight
         * @returns {void}
         */
        remove(copyOrLight) {
            copyOrLight = copyOrLight.light || copyOrLight;
            if (copyOrLight.owner) {
                delete copyOrLight.owner.light;
            }
            copyOrLight.destroy({
                children: true
            });
            const arr = light.lights;
            arr.splice(arr.indexOf(copyOrLight), 1);
        },
        lights: [],
        render() {
            const pixelScaleModifier = settings.highDensity ? (window.devicePixelRatio || 1) : 1;
            if (renderTexture.resolution !== pixelScaleModifier) {
                renderTexture.setResolution(pixelScaleModifier);
            }
            if (renderTexture.width !== pixiApp.screen.width ||
                renderTexture.height !== pixiApp.screen.height
            ) {
                renderTexture.resize(pixiApp.screen.width, pixiApp.screen.height);
                bg.width = pixiApp.screen.width;
                bg.height = pixiApp.screen.height;
                lightSprite.width = Math.ceil(camera.width);
                lightSprite.height = Math.ceil(camera.height);
            }
            renderer.render(lightLayer, {
                renderTexture: renderTexture
            });
        },
        updateOne(l) {
            if (l.owner) {
                if (!templates.valid(l.owner)) {
                    l.remove(l);
                    return;
                }
                l.transform.setFromMatrix(l.owner.worldTransform);
                l.scale.x *= l.scaleFactor || 1;
                l.scale.y *= l.scaleFactor || 1;
                l.angle -= l.rotationFactor || 0;
                if (l.copyOpacity) {
                    l.alpha = l.owner.alpha;
                }
            }
        },
        update() {
            rooms.current.updateTransform();
            for (const l of light.lights) {
                light.updateOne(l);
            }
        },
        clear() {
            lightLayer.removeChildren();
        },
        get ambientColor() {
            return ambientColor;
        },
        set ambientColor(color) {
            ambientColor = color;
            if (bg) {
                bg.tint = ambientColor;
            }
            return ambientColor;
        },
        get opacity() {
            return lightSprite.alpha;
        },
        set opacity(opacity) {
            lightSprite.alpha = opacity;
            return opacity;
        },
        install() {
            bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.width = pixiApp.screen.width;
            bg.height = pixiApp.screen.height;
            bg.tint = ambientColor;
            lightLayer.addChildAt(bg, 0);
            pixiApp.stage.addChildAt(
                lightSprite,
                pixiApp.stage.children.indexOf(rooms.current) + 1
            );
            light.render();
        }
    };
    return light;
})();
window.light = light;
