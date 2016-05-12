// Initialize storage
const storage = require('node-persist')
storage.initSync()

require('./src/bot')
require('./src/server')
