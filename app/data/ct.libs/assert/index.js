{
    let passed = 0,
        failed = 0;
    ct.assert = function assert(condition, message) {
        let result = condition;
        if (condition instanceof Function) {
            try {
                result = condition();
            } catch (e) {
                console.error(`%c Got an execution error while evaluating%c${message ? ':\n' + message : ''}`, 'font-weigth: bold;', '');
                failed++;
                throw e;
            }
        }
        if (typeof result !== 'boolean') {
            console.error(`%c Not a boolean%c${message ? ':\n' + message : ''}\nGot this value:`, 'font-weigth: bold;', '');
            // eslint-disable-next-line no-console
            console.log(result);
            failed++;
        }
        if (result) {
            // eslint-disable-next-line no-console
            console.log(`%c✅ Passed%c${message ? ':\n' + message : ''}`, 'color: #3c3; font-weight: bold;', '');
            passed++;
        } else {
            console.error(`%c Failed%c${message ? ':\n' + message : ''}`, 'font-weigth: bold;', '');
            failed++;
        }
    };
    ct.assert.summary = function summary() {
        if (failed > 0) {
            console.error(`%c Failed: ${failed}, passed: ${passed}.`, 'font-weight: bold;');
        } else {
            // eslint-disable-next-line no-console
            console.log(`%c✅ Failed: ${failed}, passed: ${passed}.`, 'color: #3c3; font-weight: bold;');
        }
        failed = passed = 0;
    };
}
