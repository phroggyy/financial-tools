const path = require('path');

module.exports = function (postcssPlugins, includeSourceMaps = false) {
    return {
        "exclude": [
            path.join(process.cwd(), "src/styles.css")
        ],
        "test": /\.styl$/,
        "use": [
            {
                "loader": "raw-loader"
            },
            {
                "loader": "postcss-loader",
                "options": {
                    "ident": "embedded",
                    "plugins": postcssPlugins,
                    "sourceMap": includeSourceMaps
                }
            },
            {
                "loader": "stylus-loader",
                "options": {
                    "sourceMap": includeSourceMaps,
                    "paths": []
                }
            }
        ]
    }
}