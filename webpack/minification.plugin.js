const HtmlWebpackPlugin = require('html-webpack-plugin');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];

module.exports = function (minificationConfig) {
    return new HtmlWebpackPlugin({
        "template": "./src/index.html",
        "filename": "./index.html",
        "hash": false,
        "inject": true,
        "compile": true,
        "favicon": false,
        "minify": minificationConfig,
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        "title": "Webpack App",
        "xhtml": true,
        "chunksSortMode": function sort(left, right) {
            let leftIndex = entryPoints.indexOf(left.names[0]);
            let rightIndex = entryPoints.indexOf(right.names[0]);
            if (leftIndex > rightIndex) {
                return 1;
            }
            else if (leftIndex < rightIndex) {
                return -1;
            }
            else {
                return 0;
            }
        }
    });
}