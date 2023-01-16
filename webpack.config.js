const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [

    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new FaviconsWebpackPlugin('./src/favicon.ico'),
    new ManifestPlugin.WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: 'dist/',
      basePath: 'dist/',
      writeToFileEmit: true,
      seed: {
        "name": "TV Show Scheduler",
        "short_name": "TVShowScheduler",
        "start_url": "/index.html",
        "display": "standalone",
        "theme_color": "#ffffff",
        "background_color": "#181a1b",
        "icons": [
          {
            "src": "assets/favicon.ico",
            "sizes": "64x64",
            "type": "image/x-icon"
          }
        ]
      }
    })

  ]
};