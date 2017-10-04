/***************************************

          [ random cotomod ]

   [ (c) Cosmo Myzrail Gorynych 2013 ]

***************************************/

ct.random = function (x) {
    return Math.random()*x;
};
ct.u.ext(ct.random,{
    'dice': function () {
        return arguments[Math.floor(Math.random() * arguments.length)];
    },
    'range': function (x1,x2) {
        return x1+Math.floor(Math.random() * (x2-x1));
    },
    'deg': function () {
        return Math.random()*360;
    },
    'coord': function () {
        return [Math.floor(Math.random()*ct.width),Math.floor(Math.random()*ct.height)];
    },
    'chance': function (x,y) {
        if (y) return (Math.random()*y < x);
        else return (Math.random()*100 < x);
    },
    'from': function (arr) {
        return arr[~~(Math.random()*arr.length)];
    }
});

ct.libs += ' random';