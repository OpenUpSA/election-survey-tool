const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const {GenerateSW} = require('workbox-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const entryArray = glob.sync('./src/**/*.js|.css');
const entryObject = entryArray.reduce((acc, item) => {
  const name = item.replace('/index.js', '');
  acc[name] = item;
  return acc;
}, {});

module.exports = {
  entry: entryObject,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
	module: {
   preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'

      }
   ],
	 loaders: [
       {
         test: /\.jsx?$/,
         loader: 'babel-loader'
       },
       {
         test: /\.s?css$/,
         loaders: ['style', 'css', 'sass', 'postcss-loader']
       },
 },
 plugins: [
	 new GenerateSW({
		 importWorkboxFrom: 'local'
	 }),
	 new webpack.optimize.UglifyJsPlugin({
		 compress: {
			 warnings: false,
			 drop_console: false,
		 }
	 })
 ],
 resolve: {
   extensions: ['', '.js']
 },
 jshint: {
        camelcase: true,
        emitErrors: true,
        failOnHint: true,
				curly: true
};
