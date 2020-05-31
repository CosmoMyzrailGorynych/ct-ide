(function userScriptsNotice() {
    try {
        // Is it a ct.js in a dev folder?
        require('gulp');
        // Do nothing
    } catch (e) {
        /* eslint no-console: off */
        console.log('%cNo, wait!', 'font-size: 3rem; color: #446adb; text-shadow: -2px 2px 0 #fff;');
        console.log('%cDon\'t paste here anything if you don\'t exactly know what you are doing.', 'font-size: 1rem;');
        console.log('%cAny snippets from strangers may steal your data or even ruin your project.', 'font-weight: 800; color: #f00; font-size: 1rem;');
        console.log('%cIn other cases, happy coding!', 'font-style: italic; line-height: 1.25rem');
        console.log('%cYour CoMiGo :*', 'color: transparent; font-size: 1.5rem;');
        void e;
    }
})();
