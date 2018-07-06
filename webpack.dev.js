const merge = require('webpack-merge'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
	common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    // da usare solo in sviluppo
    devtool: 'inline-source-map',
    devServer: {
    	contentBase: 'dist/' // equivalente a webpack-dev-server --content-base ./dist
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '[TEST] a-color-picker',
            filename: 'test.html',
            template: 'src/test.html'
        })
    ]
})