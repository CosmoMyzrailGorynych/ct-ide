if (!this.kill) {
    for (const twoon of tween.tweens) {
        twoon.reject({
            info: 'Room switch',
            code: 1,
            from: 'tween'
        });
    }
    tween.tweens = [];
}
