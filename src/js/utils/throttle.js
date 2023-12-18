{
    const throttle = function (cb, delay) {
        let wait = false;
        let storedArgs = null;
        const checkStoredArgs = function () {
            if (storedArgs === null) {
                wait = false;
            } else {
                cb(...storedArgs);
                storedArgs = null;
                setTimeout(checkStoredArgs, delay);
            }
        };
        return (...args) => {
            if (wait) {
                storedArgs = args;
                return;
            }

            cb(...args);
            wait = true;
            setTimeout(checkStoredArgs, delay);
        };
    };
    window.throttle = throttle;
}
