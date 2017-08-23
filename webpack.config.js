const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractStyles = new ExtractTextPlugin('pipgrabber.css');

module.exports = {
	context: path.resolve(__dirname, 'src'),
	
	entry: './PIPGrabber.js',
	
	module: {
		rules: [
			{
				test: /PIPGrabber\.css/,
				use: extractStyles.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							// options: { importLoaders: 1 },
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: (loader) => [
									require('postcss-import')({ root: loader.resourcePath }),
									require('postcss-cssnext')()
								]
							}
						}
					],
				}),
			},
			{
				test: /\.html/,
				use: 'file-loader'
			}
			// {
			//   test: /Font\.css/,
			//   use: extractFonts.extract({
			//     use: 'css-loader',
			//   }),
			// },
			// {
			//   test: /\.(woff|woff2)$/,
			//   use: ['url-loader'],
			// },
		],
	},
	
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: 'pipgrabber.js',
	},
	
	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
	},
	
	plugins: [
		extractStyles,
		new CopyWebpackPlugin([
			{
				from: 'index.html',
				to: ''
			}, {
				from: 'assets',
				to: ''
			}
		])
	],
};
