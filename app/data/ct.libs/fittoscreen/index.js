(function (ct) {
    var width,
        height;
    var canv = ct.pixiApp.view;
    var resize = function() {
        const {mode} = ct.fittoscreen;
        width = window.innerWidth;
        height = window.innerHeight;
        var kw = width / ct.roomWidth,
            kh = height / ct.roomHeight;
        var k = Math.min(kw, kh);
        if (mode === 'fastScale') {
            canv.style.transform = 'scale(' + k + ')';
            canv.style.position = 'absolute';
            canv.style.left = (width - ct.width) / 2 + 'px';
            canv.style.top = (height - ct.height) / 2 + 'px';
        } else {
            if (mode === 'expandViewport' || mode === 'expand') {
                ct.camera.width = width;
                ct.camera.height = height;
            }
            if (mode !== 'scaleFit') {
                ct.pixiApp.renderer.resize(width, height);
                if (mode === 'scaleFill') {
                    ct.camera.width = Math.ceil(width / k);
                    ct.camera.height = Math.ceil(height / k);
                }
            } else {
                ct.pixiApp.renderer.resize(Math.floor(ct.camera.width * k), Math.floor(ct.camera.height * k));
                canv.style.position = 'absolute';
                canv.style.left = (width - ct.width) / 2 + 'px';
                canv.style.top = (height - ct.height) / 2 + 'px';
            }
            if (mode === 'scaleFill' || mode === 'scaleFit') {
                ct.pixiApp.stage.scale.x = k;
                ct.pixiApp.stage.scale.y = k;
            }
        }
    };
    var toggleFullscreen = function () {
        var element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement,
            requester = document.getElementById('ct'),
            request = requester.requestFullscreen || requester.webkitRequestFullscreen || requester.mozRequestFullScreen || requester.msRequestFullscreen,
            exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (!element) {
            var promise = request.call(requester);
            if (promise) {
                promise
                .catch(function (err) {
                    console.error('[ct.fittoscreen]', err);
                });
            }
        } else if (exit) {
            exit.call(document);
        }
    };
    var queuedFullscreen = function () {
        toggleFullscreen();
        document.removeEventListener('mouseup', queuedFullscreen);
        document.removeEventListener('keyup', queuedFullscreen);
        document.removeEventListener('click', queuedFullscreen);
    };
    var queueFullscreen = function() {
        document.addEventListener('mouseup', queuedFullscreen);
        document.addEventListener('keyup', queuedFullscreen);
        document.addEventListener('click', queuedFullscreen);
    };
    width = window.innerWidth;
    height = window.innerHeight;
    window.addEventListener('resize', resize);
    ct.fittoscreen = resize;
    ct.fittoscreen.toggleFullscreen = queueFullscreen;
    var $mode = '/*%mode%*/';
    Object.defineProperty(ct.fittoscreen, 'mode', {
        configurable: false,
        enumerable: true,
        set(value) {
            if ($mode === 'fastScale' && value !== 'fastScale') {
                canv.style.transform = '';
            }
            $mode = value;
        },
        get() {
            return $mode;
        }
    });
    ct.fittoscreen.mode = $mode;
    ct.fittoscreen.getIsFullscreen = function () {
        return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen;
    };
})(ct);
