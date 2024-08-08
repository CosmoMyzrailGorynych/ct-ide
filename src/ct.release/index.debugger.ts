// This file gets injected when a game is run through the built-in ct.js debugger.
// It implements custom debug commands and reports errors to the console.
(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!location.search.includes('NL_TOKEN')) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-destructuring
    (window as any).NL_TOKEN = sessionStorage.NL_TOKEN = location.search.split('=')[1];
    Neutralino.init();
    const {broadcast} = Neutralino.app;
    const {on} = Neutralino.events;
    await broadcast('ctjsDebugClient', {
        hello: 'World'
    });
    on('ctjsDebugServer', (event: CustomEvent) => {
        const request: {
            command: string,
            payload?: any
        } = event.detail;
        switch (request.command) {
        case 'execJs': {
            // eslint-disable-next-line no-eval
            const result = eval(request.payload);
            broadcast('ctjsDebugClient', {
                command: 'execJsResult',
                payload: result
            });
        } break;
        case 'reload':
            window.location.reload();
            break;
        default:
        }
    });
})();
