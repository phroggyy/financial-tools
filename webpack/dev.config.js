const fs = require('fs');
const path = require('path');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin, PostcssCliResources } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const postcssPlugins = require('./postcss');


module.exports = {
    "output": {
        "path": path.join(process.cwd(), "dist"),
        "filename": "[name].bundle.js",
        "chunkFilename": "[id].chunk.js",
        "crossOriginLoading": false
    },
    "module": {
        "rules": [
            require('./raw-loader')(postcssPlugins, true),
            require('./sass-loader')(postcssPlugins, true),
            require('./less-loader')(postcssPlugins, true),
            require('./stylus-loader')(postcssPlugins, true),
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.css$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "raw-loader"
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "embedded",
                            "plugins": postcssPlugins,
                            "sourceMap": true
                        }
                    }
                ]
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.scss$|\.sass$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "raw-loader"
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "embedded",
                            "plugins": postcssPlugins,
                            "sourceMap": true
                        }
                    },
                    {
                        "loader": "sass-loader",
                        "options": {
                            "sourceMap": true,
                            "precision": 8,
                            "includePaths": []
                        }
                    }
                ]
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.less$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "raw-loader"
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "embedded",
                            "plugins": postcssPlugins,
                            "sourceMap": true
                        }
                    },
                    {
                        "loader": "less-loader",
                        "options": {
                            "sourceMap": true
                        }
                    }
                ]
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.styl$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "raw-loader"
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "embedded",
                            "plugins": postcssPlugins,
                            "sourceMap": true
                        }
                    },
                    {
                        "loader": "stylus-loader",
                        "options": {
                            "sourceMap": true,
                            "paths": []
                        }
                    }
                ]
            },
            {
                "test": /\.ts$/,
                "loader": "@ngtools/webpack"
            }
        ]
    },
    "plugins": [
        new NamedLazyChunksWebpackPlugin(),
        require('./minification.plugin')(false),
        new CommonsChunkPlugin({
            "name": [
                "vendor"
            ],
            "minChunks": (module) => {
                return module.resource
                    && (module.resource.startsWith(nodeModules)
                        || module.resource.startsWith(genDirNodeModules)
                        || module.resource.startsWith(realNodeModules));
            },
            "chunks": [
                "main"
            ]
        }),
        new SourceMapDevToolPlugin({
            "filename": "[file].map[query]",
            "moduleFilenameTemplate": "[resource-path]",
            "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
            "sourceRoot": "webpack:///"
        }),
        new CommonsChunkPlugin({
            "name": [
                "main"
            ],
            "minChunks": 2,
            "async": "common"
        }),
        new NamedModulesPlugin({}),
        new AngularCompilerPlugin({
            "mainPath": "main.ts",
            "platform": 0,
            "hostReplacementPaths": {
                "environments/environment.ts": "environments/environment.ts"
            },
            "sourceMap": true,
            "tsConfigPath": "src/tsconfig.app.json",
            "skipCodeGeneration": true,
            "compilerOptions": {}
        })
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
