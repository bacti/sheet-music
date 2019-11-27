const FS = require('fs-extra')
const PATH = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Defines = require('./src/Defines.js')
const GetFiles = root =>
{
    return FS.readdirSync(PATH.normalize(root)).reduce
    (
        (files, element) =>
        {
            const path = root + '/' + element
            FS.statSync(path).isFile() && files.push(path) || files.push(...GetFiles(path))
            return files
        },
        [],
    )
}

let options =
{
    mode: 'none',
    entry: './src/main.js',
    output:
    {
        path: PATH.resolve(__dirname, 'dist'),
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
        modules: [PATH.resolve('./node_modules'), process.env.NODE_PATH],
    },
    resolve:
    {
        modules: [PATH.resolve('./node_modules'), process.env.NODE_PATH],
        extensions: ['.tsx', '.ts', '.js'],
    },
}

if (process.env.NODE_ENV == 'production')
{
    FS.readFile('service-worker.js', 'utf8', (error, text) =>
    {
        if (error)
            throw 'File service-worker.js doesn\'t exist!!'
        FS.writeFileSync
        (
            'dist/service-worker.js', 
            `
                const files = ${JSON.stringify
                ([
                    './',
                    './index.html?utm=homescreen',
                    './index.js',
                    './favicon.ico',
                    ...GetFiles('./data'),
                ])}
                ${text}
            `
        )
    })

    options.plugins.push(new TerserPlugin(
    {
        parallel: true,
        terserOptions: { ecma: 5 },
    }))
}
module.exports = options
