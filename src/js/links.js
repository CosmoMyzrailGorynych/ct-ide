(function catchExternalLinks() {
    const {os} = require('@neutralinojs/lib');
    document.body.addEventListener('click', function externalLinkslistener(e) {
        if (e.target && e.target.matches('a')) {
            if (e.target.href) {
                os.open(e.target.href);
                e.stopPropagation();
            }
            e.preventDefault();
        }
    });
})();
