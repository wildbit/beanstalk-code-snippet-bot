var crc = require("easy-crc32")

function getLocCrc(filepath, line) {
    var sanitazedPath = filepath.replace(/\/(.+)\/$/, '$1')
    return crc.calculate(sanitazedPath) + crc.calculate(line)
}
