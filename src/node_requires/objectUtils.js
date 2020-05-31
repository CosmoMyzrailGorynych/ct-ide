/**
 * Describes handy functions for manipulating basic JS Objects
 * @module
 */

const extend = function (destination, source) {
    for (var property in source) {
        if (destination[property] &&
            typeof destination[property] === 'object' &&
            destination[property].toString() === '[object Object]' &&
            source[property]
        ) {
            extend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};

/**
 * Similar to regular `extend`, but skips empty strings
 * @param {Object|Array} destination The object to which to copy new properties
 * @param {Object|Array} source The object from which to copy new properties
 * @returns {Object|Array} The extended destination object
 */
const extendValid = function (destination, source) {
    /* Considering JSON-valid objects */
    for (const key in source) {
        // it is either a generic object or an array
        if (typeof source[key] === 'object' &&
            source[key] !== null
        ) {
            if (!(key in destination)) {
                if (Array.isArray(source[key])) {
                    destination[key] = [];
                } else {
                    destination[key] = {};
                }
            }
            extendValid(destination[key], source[key]);
        } else if (source[key] !== '') { // Skip empty lines
            destination[key] = source[key]; // it is a primitive, copy it as is
        }
    }
    return destination;
};

const equal = function (one, two) {
    for (const property in one) {
        if (one[property] !== two[property]) {
            return false;
        }
    }
    for (const property in two) {
        if (two[property] !== one[property]) {
            return false;
        }
    }
    return true;
};

module.exports = {
    extend,
    extendValid,
    equal
};
