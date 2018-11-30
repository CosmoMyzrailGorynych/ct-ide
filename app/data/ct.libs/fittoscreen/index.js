(function (ct) {
    var width,
        height,
        [scaleOnly] = [/*%scaleOnly%*/],
        [doManageViewport] = [/*%manageViewport%*/];
    var oldWidth, oldHeight;
    var manageViewport = function (room) {
        room = room || ct.room;
        room.x -= (width - oldWidth) / 2;
        room.y -= (height - oldHeight) / 2;
    };
    var resize = function() {
        width = window.innerWidth;
        height = window.innerHeight;
        if (scaleOnly) {
            var kw = width / ct.width,
                kh = height / ct.height,
                k = Math.min(kw, kh),
                canv = ct.pixiApp.view;
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
            for (const bg of ct.types.list.BACKGROUND) {
                bg.width = width;
                bg.height = height;
            }
            ct.pixiApp.renderer.resize(width, height);
            if (doManageViewport) {
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
