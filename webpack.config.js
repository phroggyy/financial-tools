const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const { NoEmitOnErrorsPlugin } = require('webpack');
const { BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const projectRoot = process.cwd();

let config = {
    "resolve": {
        "extensions": [
            ".ts",
            ".js"
        ],
        "symlinks": true,
        "modules": [
            "./src",
            "./node_modules"
        ],
        "alias": rxPaths(),
        "mainFields": [
            "browser",
            "module",
            "main"
        ],
    },
    "resolveLoader": {
        "modules": [
            "./node_modules",
            "./node_modules/@angular/cli/node_modules"
        ],
        "alias": rxPaths()
    },
    "entry": {
        "main": [
            "./src/main.ts"
        ],
        "polyfills": [
            "./src/polyfills.ts"
        ],
        "styles": [
            "./src/styles.css"
        ]
    },
    module: {
        rules: [
            {
                "test": /\.html$/,
                "loader": "raw-loader"
            },
            {
                "test": /\.(eot|svg|cur)$/,
                "loader": "file-loader",
                "options": {
                    "name": "[name].[hash:20].[ext]",
                    "limit": 10000
                }
            },
            {
                "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                "loader": "url-loader",
                "options": {
                    "name": "[name].[hash:20].[ext]",
                    "limit": 10000
                }
            },
        ]
    },
    plugins: [
        new NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                "context": "src",
                "to": "",
                "from": {
                    "glob": "assets/**/*",
                    "dot": true
                }
            },
            {
                "context": "src",
                "to": "",
                "from": {
                    "glob": "favicon.ico",
                    "dot": true
                }
            }
        ], {
            "ignore": [
                ".gitkeep",
                "**/.DS_Store",
                "**/Thumbs.db"
            ],
            "debug": "warning"
        }),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            "exclude": /(\\|\/)node_modules(\\|\/)/,
            "failOnError": false,
            "onDetected": false,
            "cwd": projectRoot
        }),
        new BaseHrefWebpackPlugin({}),
        new CommonsChunkPlugin({
            "name": [
                "inline"
            ],
            "minChunks": null
        }),
    ],
    "node": {
        "fs": "empty",
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    },
    "devServer": {
        "historyApiFallback": true
    }
};

if (process.env.NODE_ENV === 'production') {
    config = merge.smart(config, require('./webpack/prod.config'));
} else {
    config = merge.smart(config, require('./webpack/dev.config'));
}

module.exports = config;