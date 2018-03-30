const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const { NoEmitOnErrorsPlugin, EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const { BaseHrefWebpackPlugin, SuppressExtractedTextChunksWebpackPlugin, CleanCssWebpackPlugin, BundleBudgetPlugin, PostcssCliResources } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin, ModuleConcatenationPlugin } = require('webpack').optimize;
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { PurifyPlugin } = require('@angular-devkit/build-optimizer');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
const projectRoot = process.cwd();
const postcssPlugins = require('./postcss');

module.exports = {
    "output": {
        "path": path.join(process.cwd(), "dist"),
        "filename": "[name].[chunkhash:20].bundle.js",
        "chunkFilename": "[id].[chunkhash:20].chunk.js",
        "crossOriginLoading": false
    },
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "use": [
                    {
                        "loader": "cache-loader",
                        "options": {
                            "cacheDirectory": "/Users/leosjoberg/Code/personal/financial-tools/node_modules/@angular-devkit/build-optimizer/src/.cache"
                        }
                    },
                    {
                        "loader": "@angular-devkit/build-optimizer/webpack-loader",
                        "options": {
                            "sourceMap": false
                        }
                    }
                ]
            },
            require('./raw-loader')(postcssPlugins),
            require('./sass-loader')(postcssPlugins),
            require('./less-loader')(postcssPlugins),
            require('./stylus-loader')(postcssPlugins),
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.css$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "raw-loader"
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "extracted",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.scss$|\.sass$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "raw-loader"
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "extracted",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        },
                        {
                            "loader": "sass-loader",
                            "options": {
                                "sourceMap": false,
                                "precision": 8,
                                "includePaths": []
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.less$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "raw-loader"
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "extracted",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        },
                        {
                            "loader": "less-loader",
                            "options": {
                                "sourceMap": false
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
            {
                "include": [
                    path.join(process.cwd(), "src/styles.css")
                ],
                "test": /\.styl$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "raw-loader"
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "extracted",
                                "plugins": postcssPlugins,
                                "sourceMap": false
                            }
                        },
                        {
                            "loader": "stylus-loader",
                            "options": {
                                "sourceMap": false,
                                "paths": []
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
            {
                "test": /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                "use": [
                    {
                        "loader": "@angular-devkit/build-optimizer/webpack-loader",
                        "options": {
                            "sourceMap": false
                        }
                    },
                    "@ngtools/webpack"
                ]
            }
        ]
    },
    "plugins": [
        require('./minification.plugin')({
            "caseSensitive": true,
            "collapseWhitespace": true,
            "keepClosingSlash": true
        }),
        new CommonsChunkPlugin({
            "name": [
                "main"
            ],
            "minChunks": 2,
            "async": "common"
        }),
        new ExtractTextPlugin({
            "filename": "[name].[contenthash:20].bundle.css"
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new CleanCssWebpackPlugin(),
        new EnvironmentPlugin({
            "NODE_ENV": "production"
        }),
        new HashedModuleIdsPlugin({
            "hashFunction": "md5",
            "hashDigest": "base64",
            "hashDigestLength": 4
        }),
        new ModuleConcatenationPlugin({}),
        new BundleBudgetPlugin({}),
        new LicenseWebpackPlugin({
            "licenseFilenames": [
                "LICENSE",
                "LICENSE.md",
                "LICENSE.txt",
                "license",
                "license.md",
                "license.txt"
            ],
            "perChunkOutput": false,
            "outputTemplate": path.join(process.cwd(), "node_modules/license-webpack-plugin/output.template.ejs"),
            "outputFilename": "3rdpartylicenses.txt",
            "suppressErrors": true,
            "includePackagesWithoutLicense": false,
            "abortOnUnacceptableLicense": false,
            "addBanner": false,
            "bannerTemplate": "/*! 3rd party license information is available at <%- filename %> */",
            "includedChunks": [],
            "excludedChunks": [],
            "additionalPackages": [],
            "modulesDirectories": [
                "node_modules"
            ],
            "pattern": /^(MIT|ISC|BSD.*)$/
        }),
        new PurifyPlugin(),
        new UglifyJsPlugin({
            "test": /\.js(\?.*)?$/i,
            "extractComments": false,
            "sourceMap": false,
            "cache": true,
            "parallel": true,
            "uglifyOptions": {
                "output": {
                    "ascii_only": true,
                    "comments": false,
                    "webkit": true
                },
                "ecma": 5,
                "warnings": false,
                "ie8": false,
                "mangle": {
                    "safari10": true
                },
                "compress": {
                    "typeofs": false,
                    "inline": 3,
                    "pure_getters": true,
                    "passes": 3
                }
            }
        }),
        new AngularCompilerPlugin({
            "mainPath": "main.ts",
            "platform": 0,
            "hostReplacementPaths": {
                "environments/environment.ts": "environments/environment.prod.ts"
            },
            "sourceMap": false,
            "tsConfigPath": "src/tsconfig.app.json",
            "compilerOptions": {}
        })
    ],
};
