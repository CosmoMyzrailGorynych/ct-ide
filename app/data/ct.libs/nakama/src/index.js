const NakamaWrapper = require("./nakama").default
const Nakama = new NakamaWrapper("/*%clientHost%*/", "/*%clientPort%*/", [/*%useSSL%*/][0])

Nakama.initiate()

module.exports = Nakama