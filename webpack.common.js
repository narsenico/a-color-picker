const webpack = require('webpack'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');

const banner = `a-color-picker (https://github.com/narsenico/a-color-picker)

Copyright (c) 2017-2018, Gianfranco Caldi.
Released under the MIT License.`;

module.exports = {
    entry: {
        acolorpicker: './src/acolorpicker.js'
    },
    output: {
        path: __dirname + '/dist',
        libraryTarget: 'umd',
        library: 'AColorPicker',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    plugins: [
        // pulisce le cartelle specificate in caso di successo nella compilazione
        new CleanWebpackPlugin(['dist']),
        // copio i file di definizione di typescript nella cartella di destinazione
        new CopyWebpackPlugin([
            {
                from: 'src/*.d.ts',
                to: '[name].ts',
                toType: 'template'
            }
        ]),
        // aggiunge un banner (con il copyright) in cima al file prodotto
        new webpack.BannerPlugin(banner)
    ],
    module: {
        rules: [{
            test: /acolorpicker\.css$/,
            use: [
                'to-string-loader',
                'css-loader']
        }, {
            test: /[^acolorpicker]\.css$/,
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