import * as utils from './utils.mjs';
import config from '../config/index.js';

const isProduction = process.env.NODE_ENV === 'production';
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;

export default {
  // Options for the Vue 3 SFC compiler
  compilerOptions: {
    whitespace: 'condense'
  },
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};
