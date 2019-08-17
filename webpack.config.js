var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist'),
    ENTRY = path.resolve(__dirname + '/index.js'),
    OUTPUT_FILE = 'editor.js';

module.exports = function () {
    return {
        entry: ENTRY,
        output: {
            library: 'Editor',
            libraryTarget: 'umd',
            path: BUILD_DIR,
            filename: OUTPUT_FILE
        },
        resolve: {
            extensions: ['.js', '.json']
        }
    };
}