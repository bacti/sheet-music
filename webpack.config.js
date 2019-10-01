const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Defines = require('./src/Defines.js')

let options =
{
    mode: 'none',
    entry: './src/main.js',
    output:
    {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        publicPath: process.env.NODE_ENV == 'production' ? './' : '/',
    },
    module:
    {
        rules:
        [
            {
                test: /\.(js|jsx)(\?\S*)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:
                {
                    presets: ['@babel/preset-env'],
                    plugins:
                    [
                        ['@babel/plugin-transform-react-jsx', { 'pragma': 'h' }],
                        ['transform-define', Defines],
                    ]
                }
            },
            {
                test: /\.(ts|tsx)(\?\S*)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            // {
            //     test: /\.glsl$/,
            //     loader: 'webpack-glsl-loader'
            // },
            // {
            //     test: /\.(vert|frag)$/,
            //     loader: 'raw-loader',
            // },
            // {
            //     test: /\.html$/,
            //     loader: 'html-loader'
            // },
            {
                test: /\.(css|scss)(\?\S*)?$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
            // {
            //     test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            //     loader: 'file-loader'
            // },
        ]
    },
    devServer: {
        compress: true,
        disableHostCheck: true,
    },
    plugins:
    [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
        {
            template: 'index.html',
            inject: 'body',
        }),
    ],
    resolveLoader:
    {
        modules: [path.resolve('./node_modules'), process.env.NODE_PATH],
    },
    resolve:
    {
        modules: [path.resolve('./node_modules'), process.env.NODE_PATH],
        extensions: ['.tsx', '.ts', '.js'],
    },
}
if (process.env.NODE_ENV == 'production')
{
    options.plugins.push(new TerserPlugin(
    {
        parallel: true,
        terserOptions: { ecma: 5 },
    }))
}
module.exports = options
