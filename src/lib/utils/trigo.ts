/** lengthdir_x */
export var ldx = function ldx(l: number, d: number): number {
    return l * Math.cos(d);
};
/** lengthdir_y */
export var ldy = function ldy(l: number, d: number): number {
    return l * Math.sin(d);
};
/** Point-point DirectioN */
export var pdn = function pdn(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
};
/** Point-point DistanCe */
export var pdc = function pdc(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};
export var degToRad = function degToRad(deg: number): number {
    return deg * Math.PI / -180;
};
export var radToDeg = function radToDeg(rad: number): number {
    return rad / Math.PI * -180;
};
/**
 * Rotates a vector (x; y) by rad around (0; 0)
 * @param {number} x The x component
 * @param {number} y The y component
 * @param {number} rad The radian value to rotate by
 * @returns {Array<number>} A pair of new `x` and `y` parameters.
 */
export var rotateRad = function rotateRad(x: number, y: number, rad: number): [number, number] {
    const sin = Math.sin(rad),
          cos = Math.cos(rad);
    return [
        cos * x - sin * y,
        cos * y + sin * x
    ];
};
export var deltaDirRad = function deltaDirRad(dir1: number, dir2: number): number {
    dir1 = ((dir1 % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    dir2 = ((dir2 % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    var t = dir1,
        h = dir2,
        ta = h - t;
    if (ta > Math.PI) {
        ta -= Math.PI * 2;
    }
    if (ta < -Math.PI) {
        ta += Math.PI * 2;
    }
    return ta;
};
