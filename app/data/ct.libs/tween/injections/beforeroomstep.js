{
    let i = 0;
    while (i < tween.tweens.length) {
        const twoon = tween.tweens[i];
        if (twoon.obj.kill) {
            twoon.reject({
                code: 2,
                info: 'Copy is killed'
            });
            tween.tweens.splice(i, 1);
            continue;
        }
        let a = twoon.timer.time / twoon.duration;
        if (a > 1) {
            a = 1;
        }
        for (const field in twoon.fields) {
            const s = twoon.starting[field],
                  d = twoon.fields[field] - twoon.starting[field];
            twoon.obj[field] = twoon.curve(s, d, a);
        }
        if (a === 1) {
            twoon.resolve(twoon.fields);
            tween.tweens.splice(i, 1);
            continue;
        }
        i++;
    }
}
