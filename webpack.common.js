const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        // utils: './src/utils.js',
        acolorpicker: './src/main.js',
        demo: './src/demo/demo.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // il valore di ritorno dell'entry point viene assegnato all'oggetto window => provato umd
        libraryTarget: 'umd', // TODO: testare bene con <script> e require()/import
        library: 'AColorPicker'
    },
    plugins: [
        // pulisce le cartelle specificate in caso di successo nella compilazione
        new CleanWebpackPlugin(['dist']),
        // crea un file html (default index.html) con gli <script> per servire i bundle
        new HtmlWebpackPlugin({
            title: 'a-color-picker'
        }),
        // usa un file come template
        new HtmlWebpackPlugin({
            filename: 'demo.html',
            template: './src/demo/demo.html'
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
    }
}