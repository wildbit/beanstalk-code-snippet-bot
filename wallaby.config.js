module.exports = function () {
    return {
        files: [
            'testSetup.js',
            'src/*.js'
        ],

        tests: ['test/*.js'],

        env: {
            type: 'node'
        },

        testFramework: 'mocha'
    }
}
