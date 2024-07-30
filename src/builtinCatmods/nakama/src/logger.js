export default class {
    static log(msg, emoji = '', colour = 'black') {
        if ([/*%debugMode%*/][0]) {
            console.log(`%s %c${msg}`, emoji, `color: ${colour}`);
        }
    }

    static success(msg) {
        if ([/*%debugMode%*/][0]) {
            console.log(`%s ${msg}`, '✔️');
        }
    }

    static warn(msg) {
        if ([/*%debugMode%*/][0]) {
            console.log(`%s ${msg}`, '⚠️');
        }
    }
}
