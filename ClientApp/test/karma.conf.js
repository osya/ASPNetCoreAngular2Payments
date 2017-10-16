// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: ".",
        frameworks: ["jasmine"],
        files: [
            "../../wwwroot/dist/vendor.js",
            "./boot-tests.ts"
        ],
        preprocessors: {
            './boot-tests.ts': ["webpack"]
        },
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["PhantomJS", "Chrome"],
        mime: { 'application/javascript': ["ts","tsx"] },
        singleRun: false,
        webpack: require("../../webpack.config.js")().filter(cfg => cfg.target !== "node"), // Test against client bundle, because tests run in a browser
        webpackMiddleware: { stats: "errors-only" }
    });
};
