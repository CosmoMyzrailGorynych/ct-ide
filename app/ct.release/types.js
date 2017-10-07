/***************************************
            [ types cotomod ]
***************************************/

ct.types = {
    Copy: function (type) {
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
                type: type,
                depth: ct.types[type].depth, 
                graph: ct.types[type].graph,
                onStep: ct.types[type].onStep,
                onDraw: ct.types[type].onDraw,
                onCreate: ct.types[type].onCreate,
                onDestroy: ct.types[type].onDestroy,
                shape: ct.types[type].graph ? ct.graphs[ct.types[type].graph].shape : {}
            })
        }
        ct.rooms.current.uid++;
        return obj;
    },
    list: { },
    make: function (type, x, y) {
        //advanced constructor. Returns Copy
        obj = ct.types.Copy(type);
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
            %oncreate%
        }).apply(obj);
        return obj;
    },
    move: function (o) {
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
    addSpeed: function(o, spd, dir) {
        var hspd, vspd;
        hspd = o.spd * Math.cos(o.dir*Math.PI/-180) + spd * Math.cos(dir*Math.PI/-180);
        vspd = o.spd * Math.sin(o.dir*Math.PI/-180) + spd * Math.sin(dir*Math.PI/-180);
        o.spd = Math.sqrt(hspd*hspd + vspd*vspd);
        if (o.spd > 0) {
            o.dir = ct.u.pdn(xprev, yprev, o.x, o.y);
        }
    },
    each: function (func) {
        var other = this;
        for (i in ct.stack) {
            func.apply(ct.stack[i], other);
        }
    },
    'with': function (obj, func) {
        var other = this;
        func.apply(obj, other);
    }
};
ct.types.copy = ct.types.make;
/******************* типы *************/

@types@
%types%
ct.types.BACKGROUND = {
    onStep: function () { },
    onDraw: function () {
        var m = ct.x.fillStyle;
        ct.x.fillStyle = this.pattern;
        ct.x.save();
        ct.x.translate(-ct.rooms.current.x, -ct.rooms.current.y)
        ct.x.fillRect(ct.rooms.current.x, ct.rooms.current.y, ct.width, ct.height);
        ct.x.restore();
        ct.x.fillStyle = m;
    },
    onCreate: function () {
        this.uid *= -1;
    },
    onDestroy: function () { }
}
