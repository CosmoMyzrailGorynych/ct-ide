(function () {
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.matches('a')) {
            if (e.target.href) {
                nw.Shell.openExternal(e.target.href);
                e.stopPropagation();
            }
            e.preventDefault();
        }
    });
})();
