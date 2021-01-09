const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  mode: "production",
  entry: {
  	"page-script": './src/page/index.js',
  	"popup-script": './src/popup/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      filename: 'popup.html',
      template: 'src/popup/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/page/styles.css", to: "styles.css" },
        { from: "src/assets", to: "." },
      ]
    }),
  ],
};