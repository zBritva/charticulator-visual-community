const path = require('path');
const fs = require("fs");
const webpack = require("webpack");
const Visualizer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

// werbpack plugin
const { PowerBICustomVisualsWebpackPlugin } = require('powerbi-visuals-webpack-plugin');

// api configuration
const powerbiApi = require("powerbi-visuals-api");

// visual configuration json path
const pbivizPath = "./pbiviz.json";
const pbivizFile = require(path.join(__dirname, "./pbiviz.json"));

// the visual capabilities content
const capabilitiesPath = "./capabilities-view.json";
const capabilitiesFile = require(path.join(__dirname, capabilitiesPath));

// string resources
const resourcesFolder = path.join(".", "stringResources");
const localizationFolders = fs.existsSync(resourcesFolder) && fs.readdirSync(resourcesFolder);

const { merge } = require('webpack-merge');
const base = require('./base-webpack.config.js');

const GUID = 'charticulatorVisualCommunity_VIEW' || pbivizFile.visual.guid;
const NAME = 'CharticulatorCommunityVersionView' || pbivizFile.visual.name;
const DISPLAY_NAME = 'Charticulator Community Version (View)' || pbivizFile.visual.displayName;

const pluginLocation = './src/visualPluginView.ts';
const statsLocation = "../../view.webpack.statistics.html";

module.exports = merge(base, {
    resolve: {
        alias: {
            './Editor': './EditorViewMode',
            [path.resolve(__dirname, './charticulator/src/core/common/fetch')]: false,
            [path.resolve(__dirname, './charticulator/src/core/dataset/loader')]: false,
            [path.resolve(__dirname, './charticulator/src/app/components')]: false,
            [path.resolve(__dirname, './charticulator/src/app/views')]: false,
            [path.resolve(__dirname, './charticulator/src/app/globals')]: false,
            [path.resolve(__dirname, './charticulator/src/app/application')]: false,
            [path.resolve(__dirname, './charticulator/src/about')]: false,
            [path.resolve(__dirname, './charticulator/src/app/main_view')]: false,
            [path.resolve(__dirname, './charticulator/src/app/controllers')]: false,
            [path.resolve(__dirname, './charticulator/src/app/backend')]: false,
            [path.resolve(__dirname, './charticulator/src/app/stores/action_handlers/document')]: false,
            'lscg-solver': path.resolve(__dirname, './assets/lscg-solver-umd.js'),
        }
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, '.tmp', 'drop'),
            publicPath: '/assets'
        },
        devMiddleware: {
            writeToDisk: true
        },
        hot: false
    },
    entry: {
        "visual": pluginLocation
    },
    output: {
        publicPath: '/assets',
        path: path.join(__dirname, "/.tmp", "drop"),
        library: GUID,
        libraryTarget: 'var',
    },
    plugins: [
        // visual plugin regenerates with the visual source, but it does not require relaunching dev server
        new webpack.WatchIgnorePlugin({
            paths: [
                path.join(__dirname, pluginLocation),
                "./.tmp/**/*.*"
            ]
        }),
        new Visualizer({
            reportFilename: statsLocation,
            openAnalyzer: false,
            analyzerMode: `static`
        }),
        new ExtraWatchWebpackPlugin({
            files: [
                pbivizPath,
                capabilitiesPath
            ]
        }),
        // custom visuals plugin instance with options
        new PowerBICustomVisualsWebpackPlugin({
            ...pbivizFile,
            visual: {
                ...pbivizFile.visual,
                guid: GUID,
                displayName: DISPLAY_NAME,
                name: NAME
            },
            assets: {
                icon: "assets/view_icon.png"
            },
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
            generateResources: false,
            modules: true,
            visualSourceLocation: "../src/visual",
            pluginLocation: pluginLocation,
            packageOutPath: path.join(__dirname, "dist"),
            dropPath: path.join(__dirname, "/.tmp", "drop"),
            certificationFix: true
        })
    ]
});