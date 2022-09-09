(function addCtLight() {
    const lightLayer = new PIXI.Container(),
          {renderer} = ct.pixiApp,
          renderTexture = PIXI.RenderTexture.create({
              width: 1024,
              height: 1024
          }),
          lightSprite = new PIXI.Sprite(renderTexture);
    let bg, ambientColor;
    lightSprite.isUi = true;
    lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    ct.light = {
        /**
         * @param {PIXI.Texture} texture
         * @param {number} x
         * @param {number} y
         * @returns {PIXI.Sprite}
         */
        add(texture, x, y, options) {
            const light = new PIXI.Sprite(texture);
            light.blendMode = PIXI.BLEND_MODES.ADD;
            light.x = x;
            light.y = y;
            if (options) {
                Object.assign(light, options);
            }
            lightLayer.addChild(light);
            ct.light.lights.push(light);
            return light;
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
            const arr = ct.light.lights;
            arr.splice(arr.indexOf(copyOrLight), 1);
        },
        lights: [],
        render() {
            const pixelScaleModifier = ct.highDensity ? (window.devicePixelRatio || 1) : 1;
            if (renderTexture.resolution !== pixelScaleModifier) {
                renderTexture.setResolution(pixelScaleModifier);
            }
            if (renderTexture.width !== ct.pixiApp.screen.width ||
                renderTexture.height !== ct.pixiApp.screen.height
            ) {
                renderTexture.resize(ct.pixiApp.screen.width, ct.pixiApp.screen.height);
                bg.width = ct.pixiApp.screen.width;
                bg.height = ct.pixiApp.screen.height;
                lightSprite.width = Math.ceil(ct.camera.width);
                lightSprite.height = Math.ceil(ct.camera.height);
            }
            renderer.render(lightLayer, renderTexture);
        },
        updateOne(light) {
            if (light.owner) {
                if (!ct.templates.valid(light.owner)) {
                    ct.light.remove(light);
                    return;
                }
                light.transform.setFromMatrix(light.owner.worldTransform);
                light.scale.x *= light.scaleFactor || 1;
                light.scale.y *= light.scaleFactor || 1;
                light.angle -= light.rotationFactor || 0;
                if (light.copyOpacity) {
                    light.alpha = light.owner.alpha;
                }
            }
        },
        update() {
            ct.room.updateTransform();
            for (const light of ct.light.lights) {
                ct.light.updateOne(light);
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
            bg.width = ct.pixiApp.screen.width;
            bg.height = ct.pixiApp.screen.height;
            bg.tint = ambientColor;
            lightLayer.addChildAt(bg, 0);
            ct.pixiApp.stage.addChildAt(
                lightSprite,
                ct.pixiApp.stage.children.indexOf(ct.room) + 1
            );
            ct.light.render();
        }
    };
})();
