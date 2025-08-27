import * as utils from './utils.mjs';
import webpack from 'webpack';
import config from '../config/index.js';
import { merge } from 'webpack-merge';
import path from 'path';
import baseWebpackConfig from './webpack.base.conf.mjs';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import portfinder from 'portfinder';
import devEnv from '../config/dev.env.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    historyApiFallback: true,
    hot: true,
    static: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    client: {
      logging: 'warn',
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
    },
    allowedHosts: 'all',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': devEnv,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          globOptions: { ignore: ['.*'] },
        },
      ],
    }),
  ],
});

export default new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // expose application URL in console
      console.log(`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`);

      resolve(devWebpackConfig);
    }
  });
});
