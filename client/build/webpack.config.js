'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

var project_path = path.resolve(__dirname,'../../project/' + process.env.project);
var root_path = path.resolve(project_path, './_build');

var webpack_config = {
  watch:process.env.watch === 'true',
  devtool: process.env.mode === 'development' ? 'eval-source-map' : 'cheap-module-source-map',
  output: {
    path: root_path,
    publicPath: './',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js'
  },
  plugins: [
    new UglifyJsPlugin({
      minimize:process.env.mode === 'development' ? true : false,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: process.env.mode === 'development' ? true : false,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true, map: { inline: false } }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../src/libs'),
      to: path.resolve(root_path, './libs')
    },{
      from: path.resolve(__dirname, '../src/vendor'),
      to: path.resolve(root_path, './vendor')
    }]),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname,'../index.ejs'),
        inject: true,
        minify: {
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return (
          module.resource &&
          /\.(js|css|sass|scss|less|json)$/.test(module.resource) &&
          (module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 || module.resource.indexOf('/use-with-node-js/') >= 0)
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}

if(process.env.mode === "development") {
  webpack_config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false }
    })
  );
}

var webpackConfig = merge(baseWebpackConfig, webpack_config)

module.exports =  merge(webpackConfig, { module: { rules: utils.styleLoaders({sourceMap: true, usePostCSS: true}) }});
