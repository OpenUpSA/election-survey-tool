const firebase = require("firebase");
const firebaseApp = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const firebaseDB = require("firebase/database");

const cryptoJS = require("crypto-js");
const aes = require("crypto-js/aes");

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const {GenerateSW} = require('workbox-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const uuidv1 = require('uuid/v1');

const controller = require('./src/js/controller.min.js');
const transformer = require('./src/js/transformation.min.js');

const entryArray = glob.sync('./src/**/*.js|.css');
const entryObject = entryArray.reduce((acc, item) => {
  const name = item.replace('/index.js', '');
  acc[name] = item;
  return acc;
}, {});

const cryptoval = cryptoJS.AES.decrypt('U2FsdGVkX19qso7ZVBc9WDhCQu1rAwLkncXMB87Pe8Inbx0cAS2hgaCFoMCGkJOCKuktzZ9d+0Nt9My2HFICEQ==', '64b0f400-f8a9-11e8-ba8f-6f4534024543');
var val = cryptoval.toString(cryptoJS.enc.Utf8);

const config = {
	apiKey: val,
	authDomain: "election-tool-2019.firebaseapp.com",
	databaseURL: "https://election-tool-2019.firebaseio.com",
	projectId: "election-tool-2019",
	storageBucket: "election-tool-2019.appspot.com",
	messagingSenderId: "168702593827"
};

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
 ]
 /*plugins: [
	 new GenerateSW({
		 importWorkboxFrom: 'local'
	 })
	 new webpack.optimize.UglifyJsPlugin({
		 compress: {
			 warnings: false,
			 drop_console: false,
		 }
	 })
 ]*/
 /*resolve: {
   extensions: ['', '.js']
 },
 jshint: {
        camelcase: true,
        emitErrors: true,
        failOnHint: true,
				curly: true
   }*/
 }
}
