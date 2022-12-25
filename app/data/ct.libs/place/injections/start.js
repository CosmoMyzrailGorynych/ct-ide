Object.defineProperty(ct.templates.Copy.prototype, 'cgroup', {
    set: function (value) {
        this.$cgroup = value;
    },
    get: function () {
        return this.$cgroup;
    }
});
Object.defineProperty(ct.templates.Copy.prototype, 'moveContinuous', {
    value: function (cgroup, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir * Math.PI / 180);
        }
        return ct.place.moveAlong(this, this.direction, this.speed * ct.delta, cgroup, precision);
    }
});
Object.defineProperty(ct.templates.Copy.prototype, 'moveBullet', {
    value: function (cgroup, precision) {
        return this.moveContinuous(cgroup, precision);
    }
});

Object.defineProperty(ct.templates.Copy.prototype, 'moveContinuousByAxes', {
    value: function (cgroup, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir * Math.PI / 180);
        }
        return ct.place.moveByAxes(
            this,
            this.hspeed * ct.delta,
            this.vspeed * ct.delta,
            cgroup,
            precision
        );
    }
});
Object.defineProperty(ct.templates.Copy.prototype, 'moveSmart', {
    value: function (cgroup, precision) {
        return this.moveContinuousByAxes(cgroup, precision);
    }
});

Object.defineProperty(ct.templates.Tilemap.prototype, 'enableCollisions', {
    value: function (cgroup) {
        ct.place.enableTilemapCollisions(this, cgroup);
    }
});
