// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');
// const JavaScriptObfuscator = require('webpack-obfuscator');
// const Dotenv = require('dotenv-webpack');

// const isProduction = process.env.NODE_ENV === 'production';

// module.exports = {
//     mode: isProduction ? 'production' : 'development',
//     entry: './src/index.js',
//     output: {
//         path: path.resolve(__dirname, isProduction ? 'dist/prod' : 'dist/dev'),
//         filename: 'bundle.js',
//         publicPath: '/',
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.jsx?$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                 },
//             },
//             {
//                 test: /\.css$/,
//                 use: ['style-loader', 'css-loader'],
//             },
//             {
//                 test: /\.(png|jpg|jpeg|gif|svg)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[name].[ext]',
//                             outputPath: 'images',
//                             publicPath: 'images',
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     optimization: {
//         minimize: isProduction,
//         minimizer: isProduction ? [new TerserPlugin()] : [],
//     },
//     plugins: [
//         new Dotenv({
//             path: isProduction ? './.env.production' : './.env.development',
//         }),
//         ...(isProduction ? [new JavaScriptObfuscator({ rotateStringArray: true })] : []),
//     ],
//     resolve: {
//         extensions: ['.js', '.jsx'],
//     },
//     devServer: {
//         static: {
//             directory: path.resolve(__dirname, 'public'),
//         },
//         compress: true,
//         port: 8080,
//         hot: true,
//         open: true,
//     },
// };


const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Ajoutez cette ligne

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, isProduction ? 'dist/prod' : 'dist/dev'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images',
                            publicPath: 'images',
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: isProduction,
        minimizer: isProduction ? [new TerserPlugin()] : [],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Spécifiez le template HTML
        }),
        new Dotenv({
            path: isProduction ? './.env.production' : './.env.development',
        }),
        ...(isProduction ? [new JavaScriptObfuscator({ rotateStringArray: true })] : []),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
    },
};
