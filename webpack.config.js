const isDevBuild = process.argv.indexOf("--env.prod") < 0;
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

// Configuration in common to both client-side and server-side bundles
var SharedConfig = {
    context: __dirname,
    resolve: { extensions: [".js", ".ts"] },
    output: {
        filename: "[name].js",
        publicPath: "/dist/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /ClientApp/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            silent: true
                        }
                    },
                    "angular2-template-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: false
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "to-string-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: "url-loader",
                    options: { limit: 25000 }
                }
            }
        ]
    }
};

// Configuration for client-side bundle suitable for running in browsers
var ClientBundleOutputDir = "./wwwroot/dist";
(function(webpack1) {
    (function(webpack2, optimize) {
        const clientBundleConfig = merge(SharedConfig,
        {
            entry: { 'main-client': "./ClientApp/boot-client.ts" },
            output: { path: path.join(__dirname, ClientBundleOutputDir) },
            plugins: [
                new webpack2.DllReferencePlugin({
                    context: __dirname,
                    manifest: require("./wwwroot/dist/vendor-manifest.json")
                })
            ].concat(isDevBuild
                ? [
                    // Plugins that apply in development builds only
                    new webpack2.SourceMapDevToolPlugin({
                        filename: "[file].map", // Remove this line if you prefer inline source maps
                        moduleFilenameTemplate: path
                            .relative(ClientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
                    })
                ]
                : [
                    // Plugins that apply in production builds only
                    new optimize.UglifyJsPlugin()
                ])
        });

        // Configuration for server-side (prerendering) bundle suitable for running in Node
        const serverBundleConfig = merge(SharedConfig, {
            resolve: { mainFields: ["main"] },
            entry: { 'main-server': "./ClientApp/boot-server.ts" },
            plugins: [
                new webpack2.DllReferencePlugin({
                    context: __dirname,
                    manifest: require("./ClientApp/dist/vendor-manifest.json"),
                    sourceType: "commonjs2",
                    name: "./vendor"
                })
            ],
            output: {
                libraryTarget: "commonjs",
                path: path.join(__dirname, "./ClientApp/dist")
            },
            target: "node",
            devtool: "inline-source-map"
        });

        module.exports = [clientBundleConfig, serverBundleConfig];
    })(webpack1, webpack1.optimize);
})(webpack);