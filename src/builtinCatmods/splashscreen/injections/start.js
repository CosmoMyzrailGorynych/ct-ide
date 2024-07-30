(function ctSplashscreen() {
    const splashscreen = {
        slides: [/*%slides%*/][0]
    };
    const {slides} = splashscreen,
          [slideDuration] = [/*%slideDuration%*/],
          [transitionDuration] = [/*%transitionDuration%*/],
          backgroundColor = '/*%backgroundColor%*/',
          transitionColor = u.hexToPixi('/*%transitionColor%*/'),
          [skippable] = [/*%skippable%*/];

    const oldStartingName = rooms.starting;
    const oldRoom = rooms.templates[oldStartingName];

    let currentIndex = 0,
        currentLogo = null;

    const advance = function advance() {
        currentLogo = null;
        currentIndex++;
        if (currentIndex === slides.length) {
            rooms.starting = oldStartingName;
            rooms.switch(oldStartingName);
            return;
        }
        rooms.switch('CTSPLASHSCREEN');
    };
    const createSlide = function createSlide() {
        const ind = currentIndex;
        const slide = slides[ind];
        currentLogo = new PIXI.Sprite(res.getTexture(slide.texture, 0));
        currentLogo.x = camera.width / 2;
        currentLogo.y = camera.height / 2;
        currentLogo.anchor.x = currentLogo.anchor.y = 0.5;
        currentLogo.scale.x = currentLogo.scale.y =
            Math.min(camera.width / currentLogo.width, camera.height / currentLogo.height);
        if (!slide.fill) {
            currentLogo.scale.x *= 0.5;
            currentLogo.scale.y *= 0.5;
        }
        if (slide.effect === 'zoomIn') {
            const targetScale = currentLogo.scale.x;
            currentLogo.scale.x = currentLogo.scale.y = targetScale * 0.9;
            tween.add({
                obj: currentLogo.scale,
                fields: {
                    x: targetScale,
                    y: targetScale
                },
                duration: slideDuration,
                silent: true
            });
        } else if (slide.effect === 'zoomOut') {
            tween.add({
                obj: currentLogo.scale,
                fields: {
                    x: currentLogo.scale.x * 0.9,
                    y: currentLogo.scale.x * 0.9
                },
                duration: slideDuration,
                silent: true
            });
        }
        rooms.current.addChild(currentLogo);
        transition.fadeIn(transitionDuration, transitionColor);
        u.wait(slideDuration - transitionDuration)
        .then(() => transition.fadeOut(transitionDuration, transitionColor))
        .then(() => {
            advance();
        })
        .catch(() => void 0);
    };

    inputs.addAction('CTSPLASHSCREENAnyInput', [{
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

    rooms.templates.CTSPLASHSCREEN = {
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
            if (skippable && actions.CTSPLASHSCREENAnyInput.pressed) {
                advance();
            }
        }
    };

    rooms.starting = 'CTSPLASHSCREEN';
})();
