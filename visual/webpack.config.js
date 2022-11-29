const path = require('path');
const fs = require("fs");

// werbpack plugin
const webpack = require("webpack");
const PowerBICustomVisualsWebpackPlugin = require('powerbi-visuals-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Visualizer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

// api configuration
const powerbiApi = require("powerbi-visuals-api");

// visual configuration json path
const pbivizPath = "./pbiviz.json";
const pbivizFile = require(path.join(__dirname, pbivizPath));

// the visual capabilities content
const capabilitiesPath = "./capabilities.json";
const capabilitiesFile = require(path.join(__dirname, capabilitiesPath));

const pluginLocation = './src/visualPlugin.ts'; // path to visual plugin file, the file generates by the plugin

// string resources
const resourcesFolder = path.join(".", "stringResources");
const localizationFolders = fs.existsSync(resourcesFolder) && fs.readdirSync(resourcesFolder);
const statsLocation = "../../webpack.statistics.html";

const { version } = require("../charticulator/package.json");

// babel options to support IE11
let babelOptions = {
    "presets": [
        [
            require.resolve('@babel/preset-env'),
            {
                useBuiltIns: "entry",
                corejs: 3,
                modules: false
            }
        ],
        [
            require.resolve('@babel/preset-react')
        ],
    ],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['./'],
            },
        ],
    ],
    sourceType: "unambiguous", // tell to babel that the project can contains different module types, not only es2015 modules
    cacheDirectory: path.join(".tmp", "babelCache") // path for chace files
};

module.exports = {
    entry: {
        "visual": pluginLocation
    },
    optimization: {
        concatenateModules: true,
        minimize: true // enable minimization for create *.pbiviz file less than 2 Mb, can be disabled for dev mode
    },
    devtool: 'source-map',
    mode: "development",
    module: {
        rules: [
            {
                parser: {
                    amd: false
                }
            },
            {
                test: /\.pegjs$/,
                loader: require.resolve('pegjs-loader'),
                options: {
                  allowedStartRules: ["start", "start_text"],
                  cache: true,
                  optimize: "size"
                }
            },
            {
                test: /\.tmplt$/,
                loader: require.resolve('raw-loader'),
            },
            {
                test: /(\.ts)x|\.ts$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: ['@babel/react', '@babel/env'],
                            plugins: [
                                [
                                    require.resolve('babel-plugin-module-resolver'),
                                    {
                                        root: ['./'],
                                        alias: {
                                        },
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            transpileOnly: false,
                            experimentalWatchApi: false,
                        }
                    }
                ],
                exclude: [/node_modules/],
                include: /powerbi-visuals-|src|precompile\\visualPlugin.ts/,
            },
            {
                test: /(\.js)x|\.js$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babelOptions
                    }
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.json$/,
                loader: require.resolve('json-loader'),
                type: "javascript/auto"
            },
            {
                test: /\.(css|scss|less)?$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('sass-loader')
                ],
            },
            {
                test: /\.(woff|ttf|ico|woff2|jpg|jpeg|png|webp|svg)$/i,
                use: [
                    {
                        loader: 'base64-inline-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.css','.json'],
        alias: {
            charticulator: path.resolve(__dirname, "./../charticulator/"),
            visual: path.resolve(__dirname, './src'),
            assets: path.resolve(__dirname, './assets'),
            resources: path.resolve(__dirname, "../charticulator/resources"),
        },
    },
    output: {
        publicPath: '/assets',
        path: path.join(__dirname, "/.tmp", "drop"),
        library: pbivizFile.visual.guid,
        libraryTarget: 'var',
    },
    devServer: {
        static: false,
        compress: true,
        port: 8080, // dev server port
        hot: false,
        liveReload: false,
        https: {
        },
        headers: {
            "access-control-allow-origin": "*",
            "cache-control": "public, max-age=0"
        },
    },
    externals: {
        "powerbi-visuals-api": 'null',
        "fakeDefine": 'false',
        "corePowerbiObject": "Function('return this.powerbi')()",
        "realWindow": "Function('return this')()",
        "CHARTICULATOR_PACKAGE": `{version:${version}}`
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    plugins: [
        new webpack.DefinePlugin({
            CHARTICULATOR_PACKAGE: JSON.stringify({
              version,
              buildTimestamp: new Date().getTime()
            })
        }),
        new MiniCssExtractPlugin({
            filename: "visual.css",
            chunkFilename: "[id].css"
        }),
        new Visualizer({
            reportFilename: statsLocation,
            openAnalyzer: false,
            analyzerMode: `static`
        }),
        // visual plugin regenerates with the visual source, but it does not require relaunching dev server
        new webpack.WatchIgnorePlugin({
            paths: [
                path.join(__dirname, pluginLocation),
                "./.tmp/**/*.*"
            ]
        }),
        // custom visuals plugin instance with options
        new PowerBICustomVisualsWebpackPlugin({
            ...pbivizFile,
            compression: 9,
            capabilities: capabilitiesFile,
            stringResources: localizationFolders && localizationFolders.map(localization => path.join(
                resourcesFolder,
                localization,
                "resources.resjson"
            )),
            apiVersion: powerbiApi.version,
            capabilitiesSchema: powerbiApi.schemas.capabilities,
            pbivizSchema: powerbiApi.schemas.pbiviz,
            stringResourcesSchema: powerbiApi.schemas.stringResources,
            dependenciesSchema: powerbiApi.schemas.dependencies,
            devMode: false,
            generatePbiviz: true,
            generateResources: true,
            modules: true,
            visualSourceLocation: "../../src/visual",
            // pluginLocation: pluginLocation,
            packageOutPath: path.join(__dirname, "dist")
        }),
        new ExtraWatchWebpackPlugin({
            files: [
                pbivizPath,
                capabilitiesPath
            ]
        }),
        new webpack.ProvidePlugin({
            window: 'realWindow',
            define: 'fakeDefine',
            powerbi: 'corePowerbiObject'
        }),
    ]
};