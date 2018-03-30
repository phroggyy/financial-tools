const path = require('path');

module.exports = function(postcssPlugins, includeSourceMaps) {
    return {
        "exclude": [
            path.join(process.cwd(), "src/styles.css")
        ],
        "test": /\.less$/,
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
                "loader": "less-loader",
                "options": {
                    "sourceMap": includeSourceMaps
                }
            }
        ]
    }
}