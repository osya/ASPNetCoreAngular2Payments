const isDevBuild = process.argv.indexOf("--env.prod") < 0;
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");

(function(webpack1) {
    (function(webpack2, optimize) {
        const sharedConfig = {
            resolve: { extensions: [ ".js" ] },
            module: {
                rules: [
                    {
                        test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
                        use: {
                                loader: "url-loader",
                                options: {
                                    limit: 100000
                                }
                            }
                    }
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
                new webpack2.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
                new webpack2.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/,
                    path.join(__dirname, "./ClientApp")), // Workaround for https://github.com/angular/angular/issues/11580
                new webpack2.IgnorePlugin(/^vertx$/), // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
                new webpack2.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve("node-noop")) // Workaround for https://github.com/andris9/encoding/issues/16
            ]
        };

        const clientBundleConfig = merge(sharedConfig,
        {
            output: { path: path.join(__dirname, "wwwroot", "dist") },
            module: {
                rules: [
                    {
                        test: /\.css(\?|$)/,
                        use: ExtractTextPlugin.extract({
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new ExtractTextPlugin({ filename: "vendor.css" }),
                new webpack.DllPlugin({
                    path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
                    name: "[name]_[hash]"
                })
            ].concat(isDevBuild
                ? []
                : [
                    new optimize.UglifyJsPlugin()
                ])
        });

        const serverBundleConfig = merge(sharedConfig,
        {
            target: "node",
            resolve: { mainFields: ["main"] },
            output: {
                path: path.join(__dirname, "ClientApp", "dist"),
                libraryTarget: "commonjs2"
            },
            module: {
                rules: [{
                    test: /\.css(\?|$)/,
                    use: [
                        "to-string-loader",
                        "css-loader"
                    ]
                }]
            },
            entry: { vendor: ["aspnet-prerendering"] },
            plugins: [
                new webpack2.DllPlugin({
                    path: path.join(__dirname, "ClientApp", "dist", "[name]-manifest.json"),
                    name: "[name]_[hash]"
                })
            ]
        });

        module.exports = [clientBundleConfig, serverBundleConfig];
    })(webpack1, webpack1.optimize);
})(webpack);