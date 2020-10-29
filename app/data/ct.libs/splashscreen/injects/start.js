(function ctSplashscreen() {
    ct.splashscreen = {
        slides: [/*%slides%*/][0]
    };
    const {slides} = ct.splashscreen,
          [slideDuration] = [/*%slideDuration%*/],
          [transitionDuration] = [/*%transitionDuration%*/],
          backgroundColor = '/*%backgroundColor%*/',
          transitionColor = ct.u.hexToPixi('/*%transitionColor%*/'),
          [skippable] = [/*%skippable%*/];

    const oldStartingName = ct.rooms.starting;
    const oldRoom = ct.rooms.templates[oldStartingName];

    let currentIndex = 0,
        currentLogo = null;

    const advance = function advance() {
        currentLogo = null;
        currentIndex++;
        if (currentIndex === slides.length) {
            ct.rooms.starting = oldStartingName;
            ct.rooms.switch(oldStartingName);
            return;
        }
        ct.rooms.switch('CTSPLASHSCREEN');
    };
    const createSlide = function createSlide() {
        const ind = currentIndex;
        const slide = slides[ind];
        currentLogo = new PIXI.Sprite(ct.res.getTexture(slide.texture, 0));
        currentLogo.x = ct.camera.width / 2;
        currentLogo.y = ct.camera.height / 2;
        currentLogo.anchor.x = currentLogo.anchor.y = 0.5;
        currentLogo.scale.x = currentLogo.scale.y =
            Math.min(ct.camera.width / currentLogo.width, ct.camera.height / currentLogo.height);
        if (!slide.fill) {
            currentLogo.scale.x *= 0.5;
            currentLogo.scale.y *= 0.5;
        }
        if (slide.effect === 'zoomIn') {
            const targetScale = currentLogo.scale.x;
            currentLogo.scale.x = currentLogo.scale.y = targetScale * 0.9;
            ct.tween.add({
                obj: currentLogo.scale,
                fields: {
                    x: targetScale,
                    y: targetScale
                },
                duration: slideDuration,
                silent: true
            });
        } else if (slide.effect === 'zoomOut') {
            ct.tween.add({
                obj: currentLogo.scale,
                fields: {
                    x: currentLogo.scale.x * 0.9,
                    y: currentLogo.scale.x * 0.9
                },
                duration: slideDuration,
                silent: true
            });
        }
        ct.room.addChild(currentLogo);
        ct.transition.fadeIn(transitionDuration, transitionColor);
        ct.u.wait(slideDuration - transitionDuration)
        .then(() => ct.transition.fadeOut(transitionDuration, transitionColor))
        .then(() => {
            advance();
        })
        .catch(() => void 0);
    };

    ct.inputs.addAction('CTSPLASHSCREENAnyInput', [{
        code: 'gamepad.Any',
        multiplier: 1
    }, {
        code: 'mouse.Left',
        multiplier: 1
    }, {
        code: 'touch.Any',
        multiplier: 1
    }, {
        code: 'keyboard.Escape',
        multiplier: 1
    }, {
        code: 'keyboard.Space',
        multiplier: 1
    }]);

    ct.rooms.templates.CTSPLASHSCREEN = {
        name: 'CTSPLASHSCREEN',
        backgroundColor: backgroundColor,
        width: oldRoom.width,
        height: oldRoom.height,
        objects: [],
        bgs: [],
        tiles: [],
        onCreate: function onCreate() {
            createSlide();
        },
        onDraw: function onDraw() {
            void 0;
        },
        onLeave: function onLeave() {
            void 0;
        },
        onStep: function onStep() {
            if (skippable && ct.actions.CTSPLASHSCREENAnyInput.pressed) {
                advance();
            }
        }
    };

    ct.rooms.starting = 'CTSPLASHSCREEN';
})();
