const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'lib'),
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.scss', '.sass', '.css', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'lib'),
    },
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    redux: 'redux',
    reselect: 'reselect',
    router5: 'router5',
    'redux-batched-actions': 'redux-batched-actions',
    'redux-devtools-extension': 'redux-devtools-extension',
    'redux-saga': 'redux-saga',
    'redux-saga/effects': 'redux-saga/effects',
    'redux-devtools-extension/developmentOnly':
      'redux-devtools-extension/developmentOnly',
  },
  devtool: isDev ? 'source-map' : '',
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(\.module)?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:3]',
              },
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(\.module)?s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]-[hash:base64:3]',
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.woff2$/,
        use: ['file-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
};
