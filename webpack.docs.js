const webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        docs: './src/docs/docs.js'
    },
    output: {
        path: __dirname + '/docs',
        filename: '[name].js'
    },
    mode: 'production',
    plugins: [
        // pulisce le cartelle specificate in caso di successo nella compilazione
        new CleanWebpackPlugin(['docs']),
        // usa un file come template
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/docs/index.html'
        }),
        // new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    module: {
        rules: [{
            test: /acolorpicker\.css$/,
            use: ['to-string-loader', 'css-loader']
        }, {
            test: /[^acolorpicker]\.css$/,
            use: [
                {
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }
            ]
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }, {
            test: /\.svg$/,
            use: {
                loader: 'svg-url-loader',
                options: {
                    stripdeclarations: true
                }
            }
        }, {
            test: /\.(html)$/,
            use: {
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }
        }]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: 'docs/' // equivalente a webpack-dev-server --content-base ./docs
    },
}