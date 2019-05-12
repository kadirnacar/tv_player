const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isDevBuild = true;
const isBundle = false;
const clientBundleOutputDir = './dist';

module.exports = {
    target: 'node',
    devtool: isDevBuild ? 'source-map' : 'hidden-source-map',
    mode: isDevBuild ? 'development' : 'production',
    // externals: [
    //     /^[a-z\-0-9]+$/ // Ignore node_modules folder
    // ],
    node: {
        __dirname: false
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        // modules: [
        //     'node_modules'
        // ]
    },
	externals: {
		canvas: "commonjs canvas" // Important (2)
	},
    entry: {
        'main': ['./server/index.ts'],
        // 'index': ['./src/boot-client.tsx']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            include: [/server/],
            exclude: /node_modules/,
            use: [{
                loader: 'awesome-typescript-loader',
                options: {
                    silent: true,
                    configFileName: './tsconfig.json',
                    useBabel: true,
                    babelOptions: {
                        babelrc: false,
                        presets: [
                            ["env", {
                                "targets": {
                                    "node": "current"
                                }
                            }]
                        ]
                    },
                },
            }]
        }]
    },
    output: {
        // path: path.resolve(".", 'dist'),
        publicPath: "/",
        filename: '[name].js',
        // libraryTarget: "commonjs",
        // devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"',
            'process.env.FLUENTFFMPEG_COV': false
        })
    ]
};