const path = require('path');
const fs = require("fs");
const webpack = require("webpack");
const Visualizer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// werbpack plugin
const { PowerBICustomVisualsWebpackPlugin } = require('powerbi-visuals-webpack-plugin');

// api configuration
const powerbiApi = require("powerbi-visuals-api");

// visual configuration json path
const pbivizFile = require(path.join(__dirname, "./pbiviz.json"));

// the visual capabilities content
const capabilitiesFile = require(path.join(__dirname, "./capabilities.json"));

// string resources
const resourcesFolder = path.join(".", "stringResources");
const localizationFolders = fs.existsSync(resourcesFolder) && fs.readdirSync(resourcesFolder);

const { merge } = require('webpack-merge');
const base = require('./base-webpack.config.js');

const GUID = 'charticulatorVisualCommunity_EDITOR' || pbivizFile.visual.guid;
const NAME = 'CharticulatorCommunityVersionEditor' || pbivizFile.visual.name;
const DISPLAY_NAME = 'Charticulator Community Version (Editor)' || pbivizFile.visual.displayName;

const pluginLocation = './src/visualPluginEditor.ts';
const statsLocation = "../../editor.webpack.statistics.html";

module.exports = merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, '.tmp', 'drop'),
            publicPath: '/assets'
        }
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
                icon: "assets/editor_icon.png"
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
            dropPath: path.join(__dirname, "/.tmp", "drop")
        })
    ]
});