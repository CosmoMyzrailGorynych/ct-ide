/* eslint-disable func-names */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
/**
 * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
 * @returns {String} An RFC4122 version 4 compliant GUID
 */
const generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

module.exports = generateGUID;
