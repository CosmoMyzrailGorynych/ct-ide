/* from https://github.com/rvagg/delayed/blob/master/delayed.js */
(function (window) {
    var slice = function (arr, i) {
        return Array.prototype.slice.call(arr, i);
    };
    
    /*
        Returns a new function that will delay execution
        of the original function for the specified number
        of milliseconds when called. Execution will be further
        delayed for the same number of milliseconds upon each
        subsequent call before execution occurs.

        The best way to explain this is to show its most obvious
        use-case: keyboard events in the browser.
    */
    function cumulativeDelayed (fn, ms, ctx) {
        var args = slice(arguments, 3),
            timeout = null;
        return function cumulativeDelayeder () {
            var _args = slice(arguments),
                f = function cumulativeDelayedCaller () {
                    return fn.apply(ctx || null, args.concat(_args));
                };
            if (timeout != null) {
                clearTimeout(timeout);
            }
            return timeout = setTimeout(f, ms);
        };
    }
    window.debounce = cumulativeDelayed;
})(this);
