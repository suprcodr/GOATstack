var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var chalk = require('chalk');

const helpers = require('../helpers');

const cmd = require('../scripts').cmd;

const generalConfig = {

  // Specify descriptions for all webpack environments
  devtool: {
    dev: 'cheap-module-eval-source-map',
    prod: 'source-map',
    test: 'cheap-module-eval-source-map'
  },

  output: {
    dev: {
      path: helpers.root('dist/client'),
      publicPath: 'http://localhost:1701/',
      filename: '[name].js',
      // chunkFilename: '[id].chunk.js'
    },
    prod: {
      path: helpers.root('dist/client'),
      filename: '[name].js',
      chunkFilename: '[id].chunk.js'
    },
    test: {
      path: helpers.root('dist/client'),
      publicPath: 'http://localhost:7001/',
      filename: '[name].js',
      chunkFilename: '[id].chunk.js'
    }
  },

  devServer: {
    dev: {
      port: 1701,
      historyApiFallback: {
        index: 'http://localhost:1701/index.html/'
      },
      proxy: {
        '*': 'http://localhost:5000/'
      },
      stats: {
        warnings: false,
        chunks: false
      }
    },
    prod: {},
    test: {}
  },

  stats: {
    dev: {
      warnings: false
    },
    prod: {
      warnings: false
    },
    test: 'none'
  }
};

module.exports = function(options) {


  return webpackMerge(commonConfig(options), {
    devtool: generalConfig.devtool[options.env],
    output: generalConfig.output[options.env],
    devServer: generalConfig.devServer[options.env],
    stats: generalConfig.stats[options.env],

    plugins: options.env === 'dev' ? [
      new ExtractTextPlugin('styles.css'),
      new WebpackShellPlugin({
        onBuildEnd:[`${cmd.nodemon} dist --watch dist`]
      })
    ] : options.env === 'test' ? [
      new ExtractTextPlugin('styles.css')
    ] : [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: {
          keep_fnames: true
        }
      }),
      new ExtractTextPlugin('styles.css'),
      new WebpackShellPlugin({
        onBuildEnd:[`${cmd.webpack} --hide-modules true --env server:prod${ options.e2e ? ':e2e' : '' }`]
      }),
      new CopyWebpackPlugin([
        { 
          from: helpers.root('package.json'), 
          to: helpers.root('dist'),
          transform: (content, path) => {
            return content.toString().replace(/npm run dev/, 'node index');
          }
        },
        {
          from: helpers.root('public'),
          to: helpers.root('dist/public')
        }
      ])
    ]
  });
}