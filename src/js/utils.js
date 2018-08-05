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
})(this);
