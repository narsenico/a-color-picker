const merge = require('webpack-merge'),
	common = require('./webpack.common.js');

module.exports = merge(common, {
    // da usare solo in sviluppo
    devtool: 'inline-source-map',
    devServer: {
    	contentBase: './dist' // equivalente a webpack-dev-server --content-base ./dist
    }	
})