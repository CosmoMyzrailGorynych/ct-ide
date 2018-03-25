/* global ct */

ct.random = function (x) {
    return Math.random()*x;
};
ct.u.ext(ct.random,{
    dice() {
        return arguments[Math.floor(Math.random() * arguments.length)];
    },
    range(x1, x2) {
        return x1 + Math.random() * (x2-x1);
    },
    deg() {
        return Math.random()*360;
    },
    coord() {
        return [Math.floor(Math.random()*ct.width),Math.floor(Math.random()*ct.height)];
    },
    chance(x, y) {
        if (y) {
            return (Math.random()*y < x);
        }
        return (Math.random()*100 < x);
    },
    from(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
});
