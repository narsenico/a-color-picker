const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        // acolorpicker: './src/main.js',
        docs: './src/docs/docs.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].js',
        // // il valore di ritorno dell'entry point viene assegnato all'oggetto window
        // libraryTarget: 'window',
        // library: 'AColorPicker'
    },
    plugins: [
        // pulisce le cartelle specificate in caso di successo nella compilazione
        new CleanWebpackPlugin(['docs']),
        // // crea un file html (default index.html) con gli <script> per servire i bundle
        // new HtmlWebpackPlugin({
        //     title: 'a-color-picker'
        // }),
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
            test: /main\.css$/,
            use: ['to-string-loader', 'css-loader']
        }, {
            test: /[^main]\.css$/,
            use: [
                'style-loader',
                'css-loader'
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
        }]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: './docs' // equivalente a webpack-dev-server --content-base ./docs
    },
}