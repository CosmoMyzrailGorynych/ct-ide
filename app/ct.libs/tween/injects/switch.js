/* global ct */

for (var tween of ct.tween.tweens) {
    tween.reject({
        info: 'Room switch',
        code: 1
    });
}
ct.tween.tweens = [];
