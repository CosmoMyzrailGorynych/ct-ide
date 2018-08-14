/* eslint {
    'no-underscore-dangle': 'off'
} */
(window => {
    window.___extend = function(destination, source) {
        for (var property in source) {
            if (destination[property] &&
                typeof destination[property] === 'object' &&
                destination[property].toString() === '[object Object]' &&
                source[property]
            ) {
                window.___extend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };
    
    const fs = require('fs-extra');
    // better copy
    /*
    window.megacopy = function(sourcePath, destinationPath, callback) {
        var is = fs.createReadStream(sourcePath);
        var os = fs.createWriteStream(destinationPath);
        is.on('end', callback);
        is.pipe(os);
    };
    */
    window.megacopy = fs.copy;

    /* eslint {"no-bitwise": "off"} */
    /**
     * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#2117523
     * @returns {String} An RFC4122 version 4 compliant GUID
     */
    window.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
})(this);
