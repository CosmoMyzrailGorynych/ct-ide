var i = 0;
while (i < tween.tweens.length) {
    var tween = tween.tweens[i];
    if (tween.obj.kill) {
        tween.reject({
            code: 2,
            info: 'Copy is killed'
        });
        tween.tweens.splice(i, 1);
        continue;
    }
    var a = tween.timer.time / tween.duration;
    if (a > 1) {
        a = 1;
    }
    for (var field in tween.fields) {
        var s = tween.starting[field],
            d = tween.fields[field] - tween.starting[field];
        tween.obj[field] = tween.curve(s, d, a);
    }
    if (a === 1) {
        tween.resolve(tween.fields);
        tween.tweens.splice(i, 1);
        continue;
    }
    i++;
}
