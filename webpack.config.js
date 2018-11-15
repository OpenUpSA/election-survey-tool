const firebase = require("firebase");
const firebaseApp = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const firebaseDB = require("firebase/database");
const firebaseFunctions = require("firebase/functions");

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const {GenerateSW} = require('workbox-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const uuidv3 = require('uuid/v3');

const entryArray = glob.sync('./src/**/*.js|.css');
const entryObject = entryArray.reduce((acc, item) => {
  const name = item.replace('/index.js', '');
  acc[name] = item;
  return acc;
}, {});

var config = {
	apiKey: "AIzaSyDSLOG6UQL5CSUVpfSDfcFCl3nVrsUXe8c",
	authDomain: "election-tool-2019.firebaseapp.com",
	databaseURL: "https://election-tool-2019.firebaseio.com",
	projectId: "election-tool-2019",
	storageBucket: "election-tool-2019.appspot.com",
	messagingSenderId: "168702593827"
};
firebase.initializeApp(config);

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
