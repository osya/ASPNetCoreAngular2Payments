const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const AotPlugin = require("@ngtools/webpack").AotPlugin;
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;

(function (webpack1, path1) {
    (function (webpack2, optimize, path2) {
        module.exports = (env) => {
            // Configuration in common to both client-side and server-side bundles
            const isDevBuild = !(env && env.prod);
            const sharedConfig = {
                stats: { modules: false },
                context: __dirname,
                resolve: { extensions: [ ".js", ".ts" ] },
                output: {
                    filename: "[name].js",
                    publicPath: "dist/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
                },
                module: {
                    rules: [
                        { test: /\.ts$/, include: /ClientApp/, use: isDevBuild ? ["awesome-typescript-loader?silent=true", "angular2-template-loader"] : "@ngtools/webpack" },
                        { test: /\.html$/, use: "html-loader?minimize=false" },
                        { test: /\.css$/, use: ["to-string-loader", isDevBuild ? "css-loader" : "css-loader?minimize", "postcss-loader" ] },
                        { test: /\.(png|jpg|jpeg|gif|svg)$/, use: "url-loader?limit=25000" }
                    ]
                },
                plugins: [new CheckerPlugin()]
            };

            // Configuration for client-side bundle suitable for running in browsers
            const clientBundleOutputDir = "./wwwroot/dist";
            const clientBundleConfig = merge(sharedConfig, {
                entry: { 'main-client': "./ClientApp/boot.browser.ts" },
                output: { path: path2.join(__dirname, clientBundleOutputDir) },
                plugins: [
                    new webpack2.DllReferencePlugin({
                        context: __dirname,
                        manifest: require("./wwwroot/dist/vendor-manifest.json")
                    })
                ].concat(isDevBuild ? [
                    // Plugins that apply in development builds onlyc
                    new webpack2.SourceMapDevToolPlugin({
                        filename: "[file].map", // Remove this line if you prefer inline source maps
                        moduleFilenameTemplate: path2.relative(clientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
                    })
                ] : [
                    // Plugins that apply in production builds only
                    new optimize.UglifyJsPlugin(),
                    new AotPlugin({
                        tsConfigPath: "./tsconfig.json",
                        entryModule: path2.join(__dirname, "ClientApp/app/app.module.browser#AppModule"),
                        exclude: ["./**/*.server.ts"]
                    })
                ])
            });

            // Configuration for server-side (prerendering) bundle suitable for running in Node
            const serverBundleConfig = merge(sharedConfig, {
                resolve: { mainFields: ["main"] },
                entry: { 'main-server': "./ClientApp/boot.server.ts" },
                plugins: [
                    new webpack2.DllReferencePlugin({
                        context: __dirname,
                        manifest: require("./ClientApp/dist/vendor-manifest.json"),
                        sourceType: "commonjs2",
                        name: "./vendor"
                    })
                ].concat(isDevBuild ? [] : [
                    // Plugins that apply in production builds only
                    new AotPlugin({
                        tsConfigPath: "./tsconfig.json",
                        entryModule: path2.join(__dirname, "ClientApp/app/app.module.server#AppModule"),
                        exclude: ["./**/*.browser.ts"]
                    })
                ]),
                output: {
                    libraryTarget: "commonjs",
                    path: path2.join(__dirname, "./ClientApp/dist")
                },
                target: "node",
                devtool: "inline-source-map"
            });

            return [clientBundleConfig, serverBundleConfig];
        };
    })(webpack1, webpack1.optimize, path1);
})(webpack, path);
