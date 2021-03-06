var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist'),
    ENTRY = path.resolve(__dirname + '/index.js'),
    OUTPUT_FILE = 'editor.js';

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('editor.css');

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
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ExtractTextPlugin.extract({
                        use: "css-loader"
                    })
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [extractCSS],
        // uncomment following lines for debugging
        // mode: 'development',
        // devtool: 'eval-source-map'
    };
}