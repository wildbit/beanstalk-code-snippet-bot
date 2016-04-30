require('babel-register')()

// Initialize storage
var storage = require('node-persist')
storage.initSync();

require('./src/bot')
require('./src/server')
