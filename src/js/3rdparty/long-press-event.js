/*!
 * long-press-event.js
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */

(function (window, document) {
    'use strict';

    var timer = null;
    var moveThreshold = 12;
    var mousePressPosition;

    /**
     * Fires the 'long-press' event on element
     * @param {MouseEvent} startingEvent The original mouse event that iniciated this one
     * @returns {void}
     */
    var fireLongPressEvent = function(startingEvent) {
        var event = new Event('long-press', {
            bubbles: true,
            cancelable: true
        });
        event.clientX = startingEvent.clientX;
        event.clientY = startingEvent.clientY;
        event.screenX = startingEvent.screenX;
        event.screenY = startingEvent.screenY;
        event.pageX = startingEvent.pageX;
        event.pageY = startingEvent.pageY;
        // fire the long-press event
        this.dispatchEvent(event);

        clearTimeout(timer);
    };

    // check if we're using a touch screen
    var isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    var mouseDown = 'pointerdown';
    var mouseOut = 'pointerout';
    var mouseUp = 'pointerup';
    var mouseMove = 'pointermove';

    // wheel/scroll events
    var mouseWheel = 'mousewheel';
    var wheel = 'wheel';
    var scrollEvent = 'scroll';

    // listen to mousedown event on any child element of the body
    document.addEventListener(mouseDown, function(e) {

        var el = e.target;

        // get delay from html attribute if it exists, otherwise default to 1000
        var longPressDelayInMs = parseInt(el.getAttribute('data-long-press-delay') || '1000', 10);

        mousePressPosition = [e.clientX, e.clientY];

        // start the timer
        timer = setTimeout(fireLongPressEvent.bind(el, e), longPressDelayInMs);
    });

    // clear the timeout if the user releases the mouse/touch
    document.addEventListener(mouseUp, function() {
        clearTimeout(timer);
    });

    // clear the timeout if the user leaves the element
    document.addEventListener(mouseOut, function() {
        clearTimeout(timer);
    });

    // clear if the mouse moves
    document.addEventListener(mouseMove, function(e) {
        if (mousePressPosition) {
            if (Math.hypot(mousePressPosition[0] - e.clientX, mousePressPosition[1] - e.clientY) > moveThreshold) {
                clearTimeout(timer);
            }
        }
    });

    // clear if the Wheel event is fired in the element
    document.addEventListener(mouseWheel, function() {
        clearTimeout(timer);
    });

    // clear if the Scroll event is fired in the element
    document.addEventListener(wheel, function(){ 
        clearTimeout(timer);
    });

    // clear if the Scroll event is fired in the element
    document.addEventListener(scrollEvent, function(){ 
        clearTimeout(timer);
    });

}(window, document));
