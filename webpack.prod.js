const merge = require('webpack-merge'),
	common = require('./webpack.common.js'),
	webpack = require('webpack'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
    	new UglifyJSPlugin(),
    	new webpack.DefinePlugin({
    		'process.env': {
    			'NODE_ENV': JSON.stringify('production')
    		}
    	})
    ]
})