(function () {
    const shakeOptions = {
        frequencyX: 3.3,
        frequencyY: 4.57,
        power: 32,
        decaySpeed: 1,
        maxPower: 2
    };
    var dirTo8Map = [5, 2, 1, 0, 3, 6, 7, 8];
    ct.victoria = {
        shakePower: 0,
        shake(power) {
            this.shakePower += power;
        },
        setShakeOptions(options) {
            for (const i in options) {
                if (i in shakeOptions) {
                    shakeOptions[i] = Number(options[i]);
                }
            }
        },
        dirTo8: dir => dirTo8Map[((Math.floor((dir + 22.5) / 45) % 8) + 8) % 8],
        smoothFollow(power) {
            if (!ct.room.follow || ct.room.follow.kill) {
                return;
            }
            ct.room.x = ct.room.x * (1-power) + (ct.room.follow.x - ct.room.width/2)*power;
            ct.room.y = ct.room.y * (1-power) + (ct.room.follow.y - ct.room.height/2)*power;
        },
        move8(me, x, y, speed) {
            speed = speed || 1;
            if (me.x < x) {
                me.x += Math.min(speed, x - me.x);
            } else if (me.x > x) {
                me.x -= Math.min(speed, me.x - x);
            }
            if (me.y < y) {
                me.y += Math.min(speed, y - me.y);
            } else if (me.y > y) {
                me.y -= Math.min(speed, me.y - y);
            }
        }
    };

})();
