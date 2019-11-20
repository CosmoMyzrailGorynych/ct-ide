const jelloEnded = Symbol('jelloEnded');

/**
 * A function that performs a jelly-like animation on an element,
 * mainly for requesting attention of a user.
 *
 * @param {HTMLElement} element The element that should be animated
 * @returns {void}
*/
module.exports = function(element) {
    if (jelloEnded in element) {
        return;
    }
    element[jelloEnded] = false;
    element.classList.add('jello');
    setTimeout(() => {
        element.classList.remove('jello');
        delete element[jelloEnded];
    }, 1000);
};
