const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const extractStyles = new ExtractTextPlugin('pipgrabber.css');

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: './PIPGrabber.js',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
        }
      },
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
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'pipgrabber.js',
  },

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      app: path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components/')
    }
  },

  plugins: [
    new StyleLintPlugin({
      files: '**/*.css'
    }),
    extractStyles,
    new CopyWebpackPlugin([
      {
        from: 'assets',
        to: ''
      }
    ])
  ],

  devtool: 'cheap-eval-source-map'
};
