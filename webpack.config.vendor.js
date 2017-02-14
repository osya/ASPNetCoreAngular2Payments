var IsDevBuild = process.argv.indexOf("--env.prod") < 0;
var Path = require("path");
var Webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Merge = require("webpack-merge");
var ExtractCss = new ExtractTextPlugin("vendor.css");

(function(webpack1) {
    (function(webpack, optimize) {
        const sharedConfig = {
            resolve: { extensions: ["", ".js"] },
            module: {
                loaders: [
                    { test: /\.json$/, loader: require.resolve("json-loader") },
                    { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, loader: "url-loader?limit=100000" }
                ]
            },
            entry: {
                vendor: [
                    "@angular/common",
                    "@angular/compiler",
                    "@angular/core",
                    "@angular/http",
                    "@angular/platform-browser",
                    "@angular/platform-browser-dynamic",
                    "@angular/router",
                    "@angular/platform-server",
                    "angular2-universal",
                    "angular2-universal-polyfills",
                    "bootstrap",
                    "bootstrap/dist/css/bootstrap.css",
                    "es6-shim",
                    "es6-promise",
                    "event-source-polyfill",
                    "jquery",
                    "zone.js"
                ]
            },
            output: {
                publicPath: "/dist/",
                filename: "[name].js",
                library: "[name]_[hash]"
            },
            plugins: [
                new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
                new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/,
                    Path.join(__dirname, "./ClientApp")), // Workaround for https://github.com/angular/angular/issues/11580
                new webpack.IgnorePlugin(/^vertx$/), // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
                new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve("node-noop")), // Workaround for https://github.com/andris9/encoding/issues/16
            ]
        };

        const clientBundleConfig = Merge(sharedConfig,
        {
            output: { path: Path.join(__dirname, "wwwroot", "dist") },
            module: {
                loaders: [
                    { test: /\.css(\?|$)/, loader: ExtractCss.extract(["css-loader"]) }
                ]
            },
            plugins: [
                ExtractCss,
                new webpack.DllPlugin({
                    path: Path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
                    name: "[name]_[hash]"
                })
            ].concat(IsDevBuild
                ? []
                : [
                    new optimize.OccurenceOrderPlugin(),
                    new optimize.UglifyJsPlugin({ compress: { warnings: false } })
                ])
        });

        const serverBundleConfig = Merge(sharedConfig,
        {
            target: "node",
            resolve: { packageMains: ["main"] },
            output: {
                path: Path.join(__dirname, "ClientApp", "dist"),
                libraryTarget: "commonjs2"
            },
            module: {
                loaders: [{ test: /\.css(\?|$)/, loader: "to-string-loader!css-loader" }]
            },
            entry: { vendor: ["aspnet-prerendering"] },
            plugins: [
                new webpack.DllPlugin({
                    path: Path.join(__dirname, "ClientApp", "dist", "[name]-manifest.json"),
                    name: "[name]_[hash]"
                })
            ]
        });

        module.exports = [clientBundleConfig, serverBundleConfig];
    })(webpack1, webpack1.optimize);
})(Webpack);