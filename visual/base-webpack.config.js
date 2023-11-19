const path = require('path');

// werbpack plugin
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

// visual configuration json path
const pbivizPath = "./pbiviz.json";
const pbivizFile = require(path.join(__dirname, pbivizPath));

// the visual capabilities content
const capabilitiesPath = "./capabilities.json";

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

const resolve = {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css','.json'],
    alias: {
        charticulator: path.resolve(__dirname, "./../charticulator/"),
        visual: path.resolve(__dirname, './src'),
        src: path.resolve(__dirname, "../charticulator/src"),
        assets: path.resolve(__dirname, './assets'),
        resources: path.resolve(__dirname, "../charticulator/resources"),
    },
};

const moduleRules = {
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
                        // presets: ['@babel/react', '@babel/env'],
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
};

const externals = {
    "powerbi-visuals-api": 'null',
    "fakeDefine": 'false',
    "corePowerbiObject": "Function('return this.powerbi')()",
    "realWindow": "Function('return this')()",
    "CHARTICULATOR_PACKAGE": `{version:${version}}`
};
const performance = {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
};

const plugins = [
    new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
      }),
    new webpack.DefinePlugin({
        CHARTICULATOR_PACKAGE: JSON.stringify({
          version,
          buildTimestamp: new Date().getTime()
        })
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
    })
];

const devServer = {
    static: false,
    compress: true,
    port: 8080, // dev server port
    hot: false,
    liveReload: false,
    webSocketServer: false,
    https: {
    },
    headers: {
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=0"
    },
    devMiddleware: {
        writeToDisk: true
    },
};

const optimization = {
    concatenateModules: true,
    minimize: false // enable minimization for create *.pbiviz file less than 2 Mb, can be disabled for dev mode
};

module.exports = {
    optimization,
    devtool: 'source-map',
    mode: "development",
    module: moduleRules,
    resolve,
    externals,
    performance,
    devServer,
    output: {
        publicPath: '/assets',
        path: path.join(__dirname, "/.tmp", "drop"),
        library: pbivizFile.visual.guid,
        libraryTarget: 'var',
    },
    plugins: [
        ...plugins,
    ]
};