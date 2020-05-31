const jelloEnded = Symbol('jelloEnded');

/**
 * A function that performs a jelly-like animation on an element,
 * mainly for requesting attention of a user.
 *
 * @param {HTMLElement} element The element that should be animated
 * @returns {void}
*/
module.exports = function jellify(htmlTag) {
    if (jelloEnded in htmlTag) {
        return;
    }
    htmlTag[jelloEnded] = false;
    htmlTag.classList.add('jello');
    setTimeout(() => {
        htmlTag.classList.remove('jello');
        delete htmlTag[jelloEnded];
    }, 1000);
};
