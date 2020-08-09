(function catchExternalLinks() {
    document.body.addEventListener('click', function externalLinkslistener(e) {
        if (e.target && e.target.matches('a')) {
            if (e.target.href) {
                nw.Shell.openExternal(e.target.href);
                e.stopPropagation();
            }
            e.preventDefault();
        }
    });
})();
