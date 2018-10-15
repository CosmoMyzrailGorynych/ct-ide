(function (ct) {
    var width,
        height,
        [scaleOnly] = [/*%scaleOnly%*/],
        [doManageViewport] = [/*%manageViewport%*/];
    var oldWidth, oldHeight;
    var manageViewport = function (room) {
        room = room || ct.room;
        room.x -= (room.width - oldWidth) / 2;
        room.y -= (room.height - oldHeight) / 2;
    };
    var resize = function(exactRoom) {
        width = window.innerWidth;
        height = window.innerHeight;
        if (scaleOnly) {
            var kw = width / ct.width,
                kh = height / ct.height,
                k = Math.min(kw, kh),
                canv = ct.HTMLCanvas;
            canv.style.transform = 'scale(' + k + ')';
            canv.style.position = 'absolute';
            canv.style.left = (width - ct.width) / 2 + 'px';
            canv.style.top = (height - ct.height) / 2 + 'px';
        } else {
            var room;
            if (exactRoom && exactRoom.toString().indexOf('Event') !== -1) {
                room = ct.rooms.current;
            } else {
                room = exactRoom || ct.rooms.current;
            }
            if (!room) {
                return;
            }
            oldWidth = room.width;
            oldHeight = room.height;
            ct.width = room.width = width;
            ct.height = room.height = height;
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
