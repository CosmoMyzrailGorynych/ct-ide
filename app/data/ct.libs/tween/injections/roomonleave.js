/* global ct */

if (!this.kill) {
    for (var tween of tween.tweens) {
        tween.reject({
            info: 'Room switch',
            code: 1,
            from: 'tween'
        });
    }
    tween.tweens = [];
}
