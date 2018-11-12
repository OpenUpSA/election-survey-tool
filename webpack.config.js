const path = require('path');

module.exports = {
  entry: './src/index.js',
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
   ]
 },
 resolve: {
   extensions: ['', '.js']
 },
 jshint: {
        camelcase: true,
        emitErrors: true,
        failOnHint: true,
				curly: true
};
