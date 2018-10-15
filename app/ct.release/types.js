class Copy {
    constructor(type, x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.xprev = this.xstart = this.x;
        this.yprev = this.ystart = this.y;
        this.spd = 0;
        this.dir = 0;
        this.grav = 0;
        this.gravdir = 0;
        this.depth = 0;
        this.frame = 0;
        this.imgspd = 1;
        this.transform = false;
        this.tx = 1;
        this.ty = 1;
        this.tr = 0;
        this.ta = 1;
        this.uid = ct.rooms.current.uid;
        if (type) {
            var t = ct.types.templates[type];
            ct.u.ext(this, {
                type,
                depth: t.depth, 
                graph: t.graph,
                onStep: t.onStep,
                onDraw: t.onDraw,
                onCreate: t.onCreate,
                onDestroy: t.onDestroy,
                shape: t.graph ? ct.res.graphs[t.graph].shape : {}
            });
            if (ct.types.list[type]) {
                ct.types.list[type].push(this);
            } else {
                ct.types.list[type] = [this];
            }
            ct.types.templates[type].onCreate.apply(this);
        }
        ct.rooms.current.uid++;
        return this;
    }
    move() {
        // performs movement step with Copy `o`
        var xprev = this.x,
            yprev = this.y,
            hspd, vspd;
        if (!this.grav) { this.grav = 0; this.gravdir = 0; }
        hspd = this.spd * Math.cos(this.dir*Math.PI/-180) + this.grav * Math.cos(this.gravdir*Math.PI/-180);
        vspd = this.spd * Math.sin(this.dir*Math.PI/-180) + this.grav * Math.sin(this.gravdir*Math.PI/-180);
        this.x += hspd;
        this.y += vspd;
        if (this.grav) {
            this.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        }
        if (this.spd > 0) {
            this.dir = ct.u.pdn(xprev, yprev, this.x, this.y);
        }
    }
    draw(x, y) {
        if (!this.graph) {
            return;
        }
        if (this.transform) {
            ct.draw.imgext(this.graph, Math.floor(this.frame) % ct.res.graphs[this.graph].frames.length, x || this.x, y || this.y, this.tx, this.ty, this.tr, this.ta);
        } else {
            ct.draw.image(this.graph, Math.floor(this.frame) % ct.res.graphs[this.graph].frames.length, x || this.x, y || this.y);
        }
    }
    addSpeed(spd, dir) {
        var hspd, vspd;
        hspd = this.spd * Math.cos(this.dir*Math.PI/-180) + spd * Math.cos(dir*Math.PI/-180);
        vspd = this.spd * Math.sin(this.dir*Math.PI/-180) + spd * Math.sin(dir*Math.PI/-180);
        this.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        if (this.spd > 0) {
            this.dir = ct.u.pdn(this.xprev, this.yprev, this.xprev + hspd, this.yprev + vspd);
        }
    }
}

ct.types = {
    Copy,
    list: { },
    templates: { },
    make(type, x, y) {
        // An advanced constructor. Returns a Copy
        const obj = new Copy(type, x, y);
        
        ct.stack.push(obj);
        (function () {
            /*%oncreate%*/
        }).apply(obj);
        return obj;
    },
    move(o) {
        o.move();
    },
    addSpeed(o, spd, dir) {
        o.addSpeed(spd, dir);
    },
    each(func) {
        for (const i in ct.stack) {
            func.apply(ct.stack[i], this);
        }
    },
    'with'(obj, func) {
        func.apply(obj, this);
    }
};
ct.types.copy = ct.types.make;
ct.types.addSpd = ct.types.addSpeed;

/*@types@*/
/*%types%*/
ct.types.templates.BACKGROUND = {
    onStep() {void 0;},
    onDraw() {
        var m = ct.x.fillStyle;
        ct.x.fillStyle = this.pattern;
        var x = ct.rooms.current.x * this.parallaxX + this.x,
            y = ct.rooms.current.y * this.parallaxY + this.y;
        ct.draw.fix(-x, -y);
        ct.x.fillRect(x, y, ct.width, ct.height);
        ct.draw.unfix();
        ct.x.fillStyle = m;
    },
    onCreate() {
        this.uid = -1;
        this.parallaxX = this.parallaxY = 1;
    },
    onDestroy() {void 0;}
};
ct.types.templates.TILELAYER = {
    onStep() {void 0;},
    onDraw() {
        for (const t of this.tiles) {
            if (t.x <= ct.room.x + ct.room.width &&
                t.y <= ct.room.y + ct.room.height &&
                t.x + t.width >= ct.room.x &&
                t.y + t.height >= ct.room.y
            ) {
                ct.draw.image(t.graph, t.frame, t.x, t.y);
            }
        }
    },
    onCreate() {
        this.uid = -1;
    },
    onDestroy() {void 0;}
};
