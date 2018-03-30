const path = require('path');

module.exports = function (postcssPlugins, includeSourceMaps = false) {
    return {
        "exclude": [
            path.join(process.cwd(), "src/styles.css")
        ],
        "test": /\.css$/,
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
            }
        ]
    }
}