(function (ct) {
    var width,
        height,
        mode = '/*%mode%*/';
    var oldWidth, oldHeight;
    var canv = ct.pixiApp.view;
    var manageViewport = function (room) {
        room = room || ct.room;
        room.x -= (width - oldWidth) / 2;
        room.y -= (height - oldHeight) / 2;
    };
    var resize = function() {
        width = window.innerWidth;
        height = window.innerHeight;
        var kw = width / ct.roomWidth,
            kh = height / ct.roomHeight,
            minorWidth = kw > kh;
        var k = Math.min(kw, kh);
        if (mode === 'fastScale') {
            canv.style.transform = 'scale(' + k + ')';
            canv.style.position = 'absolute';
            canv.style.left = (width - ct.width) / 2 + 'px';
            canv.style.top = (height - ct.height) / 2 + 'px';
        } else {
            var {room} = ct;
            if (!room) {
                return;
            }
            oldWidth = ct.width;
            oldHeight = ct.height;
            if (mode === 'expandViewport' || mode === 'expand') {
                for (const bg of ct.types.list.BACKGROUND) {
                    bg.width = width;
                    bg.height = height;
                }
                ct.viewWidth = width;
                ct.viewHeight = height;
            }
            if (mode !== 'scaleFit') {
                ct.pixiApp.renderer.resize(width, height);
                if (mode === 'scaleFill') {
                    if (minorWidth) {
                        ct.viewWidth = Math.ceil(width / k);
                    } else {
                        ct.viewHeight = Math.ceil(height / k);
                    }
                    for (const bg of ct.types.list.BACKGROUND) {
                        bg.width = ct.viewWidth;
                        bg.height = ct.viewHeight;
                    }
                }
            } else {
                ct.pixiApp.renderer.resize(Math.floor(ct.viewWidth * k), Math.floor(ct.viewHeight * k));
                canv.style.position = 'absolute';
                canv.style.left = (width - ct.width) / 2 + 'px';
                canv.style.top = (height - ct.height) / 2 + 'px';
            }
            if (mode === 'scaleFill' || mode === 'scaleFit') {
                ct.pixiApp.stage.scale.x = k;
                ct.pixiApp.stage.scale.y = k;
            }
            if (mode === 'expandViewport') {
                manageViewport(room);
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
    ct.fittoscreen.manageViewport = manageViewport;
    ct.fittoscreen.toggleFullscreen = queueFullscreen;
    ct.fittoscreen.getIsFullscreen = function () {
        return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen;
    };
})(ct);
