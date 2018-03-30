const path = require('path');

module.exports = function (postcssPlugins, includeSourceMap = false) {
    return {
        "exclude": [
            path.join(process.cwd(), "src/styles.css")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
            {
                "loader": "raw-loader"
            },
            {
                "loader": "postcss-loader",
                "options": {
                    "ident": "embedded",
                    "plugins": postcssPlugins,
                    "sourceMap": includeSourceMap
                }
            },
            {
                "loader": "sass-loader",
                "options": {
                    "sourceMap": includeSourceMap,
                    "precision": 8,
                    "includePaths": []
                }
            }
        ]
    }
}