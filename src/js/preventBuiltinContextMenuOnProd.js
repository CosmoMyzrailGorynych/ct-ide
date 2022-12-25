(() => {
    let usesGulp = true;
    try {
        require('gulp');
    } catch (oO) {
        usesGulp = false;
        void oO;
    }
    if (!usesGulp) {
        document.addEventListener('contextmenu', e => {
            if (!['input', 'textarea'].includes(e.target.nodeName.toLowerCase())) {
                e.preventDefault();
            }
        });
    }
})();
