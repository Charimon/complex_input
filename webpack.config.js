const webpack = require('webpack');
const path = require('path');
const bourbon = require('bourbon');
const env = require('yargs').argv.mode;

const APP_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')

var filePath = 'app.jsx'
if(env == "build") {
  filePath = 'complexInput.jsx'
}

var config = {
  entry: {
    bundle: ['babel-polyfill', path.join(APP_DIR, filePath)],
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: '/assets/javascripts/'
  },
  module : {
    loaders : [
      { test: /\.jsx?/, include: APP_DIR, loader: 'babel'},

      { test: /\.scss$/, loader: `style!css?modules&localIdentName=[path][name]---[local]!scss?includePaths[]=${bourbon.includePaths}&includePaths[]=${[path.join(APP_DIR, 'sassConfig')]}` },
      { test: /\.sass$/, loaders: [
        'style', 
        'css?modules&localIdentName=[path][name]---[local]&importLoaders=1',
        `sass?indentedSyntax&includePaths[]=${bourbon.includePaths}&includePaths[]=${[path.join(APP_DIR, 'sassConfig')]}`]
      },
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}']},
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
}

module.exports = config