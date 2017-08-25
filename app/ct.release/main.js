/***************************************

             [ main cotomod ]

***************************************/
ct = document.createElement("canvas");
document.getElementById('ct').appendChild(ct);
ct.setAttribute('id', 'ctcanvas');
ct.setAttribute('width', @startwidth@);
ct.setAttribute('height', @startheight@);
ct.x = ct.getContext("2d");

ct.libs = '@libs@';

ct.speed = 30;
ct.stack = [];
ct.types = {};
ct.snd = {};
ct.fps = 0;
ct.dt = 0;
ct.version = [2,0,0];
ct.main = {
    fpstick: 0,
    pi: 0
}
if (window.webkitRequestAnimationFrame)
    window.requestAnimFrame = function(callback) {
        window.webkitRequestAnimationFrame(callback, ct);
    };
else {
    window.requestAnimFrame = window.requestAnimationFrame 
                           || window.mozRequestAnimationFrame 
                           || window.msRequestAnimationFrame 
                           || function(callback) {
                                callback();
                              };
};
ct.u = {
    ldx: function(l, d) {
    // lengthdir_x
        return l * Math.cos(d * Math.PI / -180);
    },
    ldy: function(l, d) {
    // lengthdir_y
        return l * Math.sin(d * Math.PI / -180);
    },
    // Point-point DirectioN
    pdn: function(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1) * -180 / Math.PI + 360) % 360;
    },
    pdc: function(x1, y1, x2, y2) {
    // Point-point DistanCe
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    prect: function(x, y, arg) {
    // point-rectangle intersection
        if (arg.splice) {
            return(
                (x >= arg[0] && x <= arg[2] && y >= arg[1] && y <= arg[3])
            ||
                (x <= arg[0] && x >= arg[2] && y <= arg[1] && y >= arg[3])
            );
        } else {
            var graph = ct.graphs[arg.graph];
            return(
                (x >= arg.x - graph.ax && x <= arg.x + graph.width - graph.ax && y >= arg.y - graph.ay && y <= arg.y + graph.width - graph.ay)
            ||
                (x <= arg.x - graph.ax && x >= arg.x + graph.width - graph.ax && y <= arg.y - graph.ay && y >= arg.y + graph.width - graph.ay)
            );
        }
    },
    ext: function (o1, o2, arr) {
        if (arr) {
            for (var i in arr) {
                if (o2[arr[i]]) {
                    o1[arr[i]] = o2[arr[i]];
                }
            }
        } else {
            for (var i in o2) {
                o1[i] = o2[i];
            }
        }
    },
    load: function(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        if (callback)
            script.onload = callback;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};
ct.u.ext(ct.u, { // make aliases
    lengthDirX: ct.u.ldx,
    lengthDirY: ct.u.ldy,
    pointDirection: ct.u.pdn,
    pointDistance: ct.u.pdc,
    pontRectangle: ct.u.prect,
    extend: ct.u.ext
});
ct.loop = function() {
    if (ct.res) {
        if (ct.res.graphsLoaded + ct.res.graphsError + ct.res.soundsLoaded + ct.soundsError < ct.res.graphsTotal + ct.res.soundsTotal) {
            ct.x.clearRect(0, 0, ct.width, ct.height);
            ct.x.strokeStyle = '#ffffff';
            ct.x.globalAlpha = 1;
            ct.x.font = '16px verdana, sans-serif';
            ct.x.fillStyle = '#ffffff';
            ct.x.shadowBlur = 8;
            ct.x.shadowColor = 'rgba(0,0,0,1)';
            ct.x.shadowOffsetX = 0;
            ct.x.shadowOffsetY = 0;
            ct.x.lineWidth = 3;
            ct.x.textBaseline = 'middle';
            ct.x.textAlign = 'center';
            ct.x.beginPath();
            ct.main.pi += 0.15;
            ct.x.arc(ct.width / 2, ct.height / 2, 64, ct.main.pi, 0.5 * Math.PI + ct.main.pi);
            ct.x.stroke();
            ct.x.fillText('Грузимcя!', ct.width / 2, ct.height / 2 - 15);
            ct.x.font = '28px verdana, sans-serif';
            ct.x.fillText(Math.floor((ct.res.graphsLoaded + ct.res.soundsLoaded) / (ct.res.graphsTotal + ct.res.soundsTotal) * 100) + '%', ct.width / 2, ct.height / 2 + 15);
        } else { 
            /*****/
            %start%
            /*****/
            ct.types.beforeStep = function () {
                %beforestep%
            };
            ct.types.afterStep = function () {
                %afterstep%
            };
            ct.types.beforeDraw = function () {
                %beforedraw%
            };
            ct.types.afterDraw = function () {
                %afterdraw%
            };
            ct.types.onDestroy = function () {
                %ondestroy%
            };
            ct.rooms.beforeStep = function () {
                %beforeroomstep%
            };
            ct.rooms.afterStep = function () {
                %afterroomstep%
            };
            ct.rooms.beforeDraw = function () {
                %beforeroomdraw%
            };
            ct.rooms.afterDraw = function () {
                %afterroomdraw%
            };
            ct.rooms.switch(ct.rooms.starting);
            ct.loop = function() {
                for (var i = 0; i < ct.stack.length; i++) {
                    
                    ct.types.beforeStep.apply(ct.stack[i]);
                    
                    ct.stack[i].xprev = ct.stack[i].x;
                    ct.stack[i].yprev = ct.stack[i].y;
                    ct.stack[i].onStep.apply(ct.stack[i]);
                    
                    ct.types.afterStep.apply(ct.stack[i]);
                }

                ct.rooms.beforeStep.apply(ct.room);
                ct.room.onStep.apply(ct.room); 
                ct.rooms.afterStep.apply(ct.room);

                // ct.types.list[type: String]
                for (i in ct.types.list) {
                    for (var k = 0; k < ct.types.list[i].length; k++) {
                        if (ct.types.list[i][k].kill) {
                            ct.types.list[i].splice(k, 1);
                            k--;
                        }
                    }
                }
                // bgs
                for (i in ct.room.backgrounds) {
                    if (ct.room.backgrounds[i].kill) {
                        ct.room.backgrounds.splice(i, 1);
                        i--;
                    }
                }
                // copies
                for (var i = 0; i < ct.stack.length; i++) {
                    if (ct.stack[i].kill) {
                        ct.types.onDestroy.apply(obj);
                        ct.stack[i].onDestroy.apply(ct.stack[i]);
                        ct.stack.splice(i, 1);
                        i--;
                    }
                }

                ct.x.clearRect(0, 0, ct.width, ct.height);
                ct.stack.sort(function(a, b) {
                    if (a.depth !== b.depth) {
                        return a.depth - b.depth;
                    } else {
                        return a.uid - b.uid;
                    }
                });

                if (ct.room.follow) {
                    if (ct.room.follow.kill) {
                        delete ct.room.follow;
                    } else if (ct.room.center) {
                        var cx, cy, i, k;
                        cx = ct.room.follow.x - ct.room.x - ct.width / 2;
                        cy = ct.room.follow.y - ct.room.y - ct.height / 2;
                        ct.room.x += cx;
                        ct.room.y += cy;
                    } else {
                        var cx = cy = i = k = w = h = 0;
                        w = Math.min(ct.room.borderX, ct.width / 2);
                        h = Math.min(ct.room.borderY, ct.height / 2);
                        if (ct.room.follow.x - ct.room.x < w) cx = ct.room.follow.x - ct.room.x - w;
                        if (ct.room.follow.y - ct.room.y < h) cy = ct.room.follow.y - ct.room.y - h;
                        if (ct.room.follow.x - ct.room.x > ct.width - w) cx = ct.room.follow.x - ct.room.x - ct.width + w;
                        if (ct.room.follow.y - ct.room.y > ct.height - h) cy = ct.room.follow.y - ct.room.y - ct.height + h;
                        ct.room.x = Math.floor(ct.room.x + cx);
                        ct.room.y = Math.floor(ct.room.y + cy);
                    }
                }
                for (var i = 0; i < ct.stack.length; i++) {
                    ct.types.beforeDraw.apply(ct.stack[i]);
                    ct.stack[i].onDraw.apply(ct.stack[i]);
                    ct.stack[i].frame += ct.stack[i].imgspd; 
                    ct.types.afterDraw.apply(ct.stack[i]);
                }

                ct.rooms.beforeDraw.apply(ct.room);
                ct.room.onDraw.apply(ct.room); 
                ct.rooms.afterDraw.apply(ct.room);
                
                ct.mouse.pressed = false;
                ct.mouse.released = false;
                ct.mouse.xprev = ct.mouse.x;
                ct.mouse.yprev = ct.mouse.y;
                ct.main.fpstick++;
            }
        }
    }
};

setInterval(function () {
    ct.fps = ct.main.fpstick;
    ct.main.fpstick = 0;
}, 1000);

ct.tick = function() {
    ct.loop.tick = setTimeout(function() {
        requestAnimFrame(ct.loop);
        ct.tick();
    }, 1000 / ct.speed);
}

%load%

ct.tick(); // launch
