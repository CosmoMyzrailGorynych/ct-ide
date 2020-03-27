/* eslint-disable no-console */
const {spawn} = require('child_process');

const spawnise = {
    fromLines: (lines, opts) => {
        const commands = lines.split('\n')
            .map(str => str.trim())
            .filter(str => str)
            .map(str => str.split(' '))
            .map(arrs => [arrs[0], [...arrs.slice(1)]]);
        return Promise.all(commands.map(set => spawnise.spawn(set[0], set[1], opts)));
    },
    spawn: (app, attrs, opts) => new Promise((resolve, reject) => {
        var process = spawn(app, attrs, opts);
        process.on('exit', code => {
            if (!code) {
                resolve();
            } else {
                reject(code);
            }
        });
        process.stderr.on('data', data => {
            console.error(data.toString());
        });
        if (spawnise.logs) {
            process.stdout.on('data', data => {
                console.log(data.toString());
            });
        }
    }),
    logs: true
};

module.exports = spawnise;
