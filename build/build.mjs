import chalk from 'chalk';
import ora from 'ora';
import { rimrafSync } from 'rimraf';
import path from 'path';
import webpack from 'webpack';

import checkVersions from './check-versions.js';
import config from '../config/index.js';
import webpackConfig from './webpack.prod.conf.js';

checkVersions();

process.env.NODE_ENV = 'production';

const spinner = ora('building for production...').start();

rimrafSync(path.join(config.build.assetsRoot, config.build.assetsSubDirectory));

try {
  const stats = await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats);
    });
  });

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  );

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan('  Build complete.\n'));
  console.log(
    chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    )
  );
} catch (err) {
  throw err;
} finally {
  spinner.stop();
}
