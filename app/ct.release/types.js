ct.types = {
    Copy(type) {
    // basic constructor. Returns Copy
        var obj = {
            x: 0,
            y: 0,
            xprev: 0,
            yprev: 0,
            xstart: 0,
            ystart: 0,
            spd: 0,
            dir: 0,
            grav: 0,
            gravdir: 0,
            depth: 0,
            frame: 0,
            imgspd: 1,
            transform: false,
            tx: 1,
            ty: 1,
            tr: 0,
            ta: 1,
            uid: ct.rooms.current.uid
        };
        if (type) {
            ct.u.ext(obj, {
                type,
                depth: ct.types[type].depth, 
                graph: ct.types[type].graph,
                onStep: ct.types[type].onStep,
                onDraw: ct.types[type].onDraw,
                onCreate: ct.types[type].onCreate,
                onDestroy: ct.types[type].onDestroy,
                shape: ct.types[type].graph ? ct.res.graphs[ct.types[type].graph].shape : {}
            });
        }
        ct.rooms.current.uid++;
        return obj;
    },
    list: { },
    make(type, x, y) {
        //advanced constructor. Returns Copy
        const obj = ct.types.Copy(type);
        x = x || 0;
        y = y || 0;
        obj.x = obj.xprev = obj.xstart = x;
        obj.y = obj.yprev = obj.ystart = y;
        
        if (ct.types.list[type]) {
            ct.types.list[type].push(obj);
        } else {
            ct.types.list[type] = [obj];
        }
        ct.stack.push(obj);
        
        ct.types[type].onCreate.apply(obj);
        (function () {
            /*%oncreate%*/
        }).apply(obj);
        return obj;
    },
    move(o) {
        // performs movement step with Copy `o`
        var xprev = o.x,
            yprev = o.y,
            hspd, vspd;
        if (!o.grav) { o.grav = 0; o.gravdir = 0; }
        hspd = o.spd * Math.cos(o.dir*Math.PI/-180) + o.grav * Math.cos(o.gravdir*Math.PI/-180);
        vspd = o.spd * Math.sin(o.dir*Math.PI/-180) + o.grav * Math.sin(o.gravdir*Math.PI/-180);
        o.x += hspd;
        o.y += vspd;
        if (o.grav) {
            o.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        }
        if (o.spd > 0) {
            o.dir = ct.u.pdn(xprev, yprev, o.x, o.y);
        }
    },
    addSpeed(o, spd, dir) {
        var hspd, vspd;
        hspd = o.spd * Math.cos(o.dir*Math.PI/-180) + spd * Math.cos(dir*Math.PI/-180);
        vspd = o.spd * Math.sin(o.dir*Math.PI/-180) + spd * Math.sin(dir*Math.PI/-180);
        o.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        if (o.spd > 0) {
            o.dir = ct.u.pdn(o.xprev, o.yprev, o.xprev + hspd, o.yprev + vspd);
        }
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
ct.types.BACKGROUND = {
    onStep() {void 0;},
    onDraw() {
        var m = ct.x.fillStyle;
        ct.x.fillStyle = this.pattern;
        ct.draw.fix(-ct.rooms.current.x, -ct.rooms.current.y);
        ct.x.fillRect(ct.rooms.current.x, ct.rooms.current.y, ct.width, ct.height);
        ct.draw.unfix();
        ct.x.fillStyle = m;
    },
    onCreate() {
        this.uid = -1;
    },
    onDestroy() {void 0;}
};
ct.types.TILELAYER = {
    onStep() {void 0;},
    onDraw() {
        for (const t of this.tiles) {
            if (t.x <= ct.room.x + ct.room.width &&
                t.y <= ct.room.y + ct.room.height &&
                t.x - ct.res.graphs[t.graph].width >= ct.room.x &&
                t.y - ct.res.graphs[t.graph].height >= ct.room.y
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
