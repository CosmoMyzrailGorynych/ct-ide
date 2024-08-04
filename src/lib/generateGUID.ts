const alphabet = '123456789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz'; // Should be safe from generating NSFW words accidentally
const generate = require('nanoid').customAlphabet(alphabet, 14);

// ~1 thousand years needed in order to have a 1% probability
// of at least one collision with 1000 IDs per hour.
// Guess I will die before this happens ¯\_(ツ)_/¯
const getUid = (): string => generate();

export = getUid;
