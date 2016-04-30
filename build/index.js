// Initialize storage
var storage = require('node-persist')
storage.initSync();

require('./bot.js')
require('./server.js')
