const path = require("path"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    fs = require('fs'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir);

const config = {
    target: 'web',
    entry: pages.reduce((config, page) => {
        config[`${page}/index`] = `./src/pages/${page}/index.js`;
        return config;
    }, {}),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        minimize: true,
    },
    mode: 'none',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
        }),
    ].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/pages/${page}/index.html`,
                    filename: `${page}/index.html`,
                    chunks: [`${page}/index`],
                })
        )
    ),
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/images/'
                },
            },
            {
                test: /\.(css)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/css/'
                },
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', 'scss']
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
        config.optimization = {
            runtimeChunk: 'single',
            minimize: false,
        };
        config.devServer = {
            static: './dist',
            hot: true,
            compress: true,
            historyApiFallback: true,
            watchFiles: [path.join(__dirname, 'src')],
        };
    }

    return config;
}
