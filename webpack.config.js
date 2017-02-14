var IsDevBuild = process.argv.indexOf("--env.prod") < 0;
var Path = require("path");
var Webpack = require("webpack");
var Merge = require("webpack-merge");

// Configuration in common to both client-side and server-side bundles
var SharedConfig = {
    context: __dirname,
    resolve: { extensions: [ "", ".js", ".ts" ] },
    output: {
        filename: "[name].js",
        publicPath: "/dist/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
        loaders: [
            { test: /\.ts$/, include: /ClientApp/, loaders: ["ts-loader?silent=true", "angular2-template-loader"] },
            { test: /\.html$/, loader: "html-loader?minimize=false" },
            { test: /\.css$/, loader: "to-string-loader!css-loader" },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader", query: { limit: 25000 } },
            { test: /\.json$/, loader: "json-loader" }
        ]
    }
};

// Configuration for client-side bundle suitable for running in browsers
var ClientBundleOutputDir = "./wwwroot/dist";
(function(webpack1) {
    (function(webpack, optimize) {
        const clientBundleConfig = Merge(SharedConfig,
        {
            entry: { 'main-client': "./ClientApp/boot-client.ts" },
            output: { path: Path.join(__dirname, ClientBundleOutputDir) },
            plugins: [
                new webpack.DllReferencePlugin({
                    context: __dirname,
                    manifest: require("./wwwroot/dist/vendor-manifest.json")
                })
            ].concat(IsDevBuild
                ? [
                    // Plugins that apply in development builds only
                    new webpack.SourceMapDevToolPlugin({
                        filename: "[file].map", // Remove this line if you prefer inline source maps
                        moduleFilenameTemplate: Path
                            .relative(ClientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
                    })
                ]
                : [
                    // Plugins that apply in production builds only
                    new optimize.OccurenceOrderPlugin(),
                    new optimize.UglifyJsPlugin()
                ])
        });

        // Configuration for server-side (prerendering) bundle suitable for running in Node
        const serverBundleConfig = Merge(SharedConfig, {
            resolve: { packageMains: ["main"] },
            entry: { 'main-server': "./ClientApp/boot-server.ts" },
            plugins: [
                new webpack.DllReferencePlugin({
                    context: __dirname,
                    manifest: require("./ClientApp/dist/vendor-manifest.json"),
                    sourceType: "commonjs2",
                    name: "./vendor"
                })
            ],
            output: {
                libraryTarget: "commonjs",
                path: Path.join(__dirname, "./ClientApp/dist")
            },
            target: "node",
            devtool: "inline-source-map"
        });

        module.exports = [clientBundleConfig, serverBundleConfig];
    })(webpack1, webpack1.optimize);
})(Webpack);