(() => {
    window.storage = {
        set(name, value) {
            localStorage[name] = JSON.stringify(value) || value.toString();
        },

        get(name) {
            let value;
            try {
                value = JSON.parse(localStorage[name]);
            } catch (e) {
                value = localStorage[name].toString();
            }
            return value;
        },

        setSession(name, value) {
            sessionStorage[name] = JSON.stringify(value) || value.toString();
        },

        getSession(name) {
            let value;
            try {
                value = JSON.parse(sessionStorage[name]);
            } catch (e) {
                value = sessionStorage[name].toString();
            }
            return value;
        }
    };
})();
