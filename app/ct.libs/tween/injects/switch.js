/* global ct */

for (var tween of ct.tween.tweens) {
    tween.reject({
        info: 'Room switch',
        code: 1,
        from: 'ct.tween'
    });
}
ct.tween.tweens = [];
