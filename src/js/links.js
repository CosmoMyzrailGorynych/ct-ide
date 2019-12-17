(function () {
    document.body.addEventListener('click', function(e) {
        const {shell} = require('electron');
        if (e.target && e.target.matches('a')) {
            if (e.target.href) {
                shell.openExternal(e.target.href);
                e.stopPropagation();
            }
            e.preventDefault();
        }
    });
})();
