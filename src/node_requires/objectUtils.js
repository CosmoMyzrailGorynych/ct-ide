/**
 * Describes handy functions for manipulating basic JS Objects
 * @module
 */

const extend = function(destination, source) {
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

const equal = function(one, two) {
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
    equal
};
