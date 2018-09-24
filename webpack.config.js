const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

module.exports = (env) => {
    console.log(env);
    if (env.client)
        return clientConfig(env);
    if (env.server)
        return serverConfig;
};