const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    styles: './src/styles/bundle.css'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '_site/assets'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [{
        from: 'src/pictures/*',
        to: 'pictures/[name][ext]',
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env']
                ]
              }
            }
          }
        ]
      }
    ]
  }
};
