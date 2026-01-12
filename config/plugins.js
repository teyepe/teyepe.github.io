const webpack = require('webpack');
const env = require('./env');

const MiniCSS = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const Md5Hash = require("webpack-md5-hash");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(env.__DEVELOPMENT__),
    __DEBUG__:       JSON.stringify(env.__DEBUG__),
    __BUILD__:       JSON.stringify(env.__BUILD__),
    __VERSION__:     JSON.stringify(env.__VERSION__),
});

const cleanPluginTmp = new CleanWebpackPlugin({
    dry: true,
    root: process.cwd()
});

const miniPluginCSS = new MiniCSS('assets/css/app.bundle.css');

const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

const providePluginJquery = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
});

const cssLint = new StyleLintPlugin({
    configFile: '.stylelintrc.yml',
    files: '**/*.scss',
    failOnError: false,
    quiet: false,
    syntax: 'scss',
});

let sitePlugins = [
    definePlugin,
    cleanPluginTmp,
    miniPluginCSS,
    occurrenceOrderPlugin,
    providePluginJquery,
    cssLint,
    Md5Hash,
];

if (env.__BUILD__) {

    const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    });

    const compressionPluginGzip = new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|json|ico|svg|eot|otf|ttf|woff)$/,
    });

    sitePlugins = [...sitePlugins, uglifyJsPlugin, compressionPluginGzip];
}

module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    sitePlugins,
};
