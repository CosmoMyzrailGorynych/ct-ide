// From https://github.com/strawbees/desktop-packager
// Thanks, Strawbees!

const path = require('path');
const {exec, fork} = require('child_process');

const options = {
    cwd: process.cwd(),
    silent: true,
    env: Object.assign(
        {},
        process.env,
        {
            PATH: `${path.resolve('./node_modules/.bin')}:${process.env.PATH}`
        }
    )
};
const run = (script, cmd, opt = {}, promise) => {
    const fn = (resolve, reject) => {
        // eslint-disable-next-line no-console
        console.log(`-> ${cmd}`);
        const child = script(cmd, Object.assign({}, opt, options));
        child.stdout.on('data', data =>
            process.stdout.write(`${data}`)
        );
        child.stderr.on('data', data =>
            process.stdout.write(`stderr: ${data}`)
        );
        child.on('close', code => {
            // eslint-disable-next-line no-console
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
        return child;
    };
    if (!promise) {
        return fn(() => {
            void 0;
        }, () => {
            void 0;
        });
    }
    return new Promise((resolve, reject) => fn(resolve, reject));
};
// eslint-disable-next-line require-await
module.exports = async fn => fn({
    exec: (cmd, opt) => run(exec, cmd, opt, true),
    execAsync: (cmd, opt) => run(exec, cmd, opt),
    fork: (cmd, opt) => run(fork, cmd, opt, true),
    forkAsync: (cmd, opt) => run(fork, cmd, opt)
});
