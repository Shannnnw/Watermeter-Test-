'use strict'
const { merge } = require('webpack-merge')
const prodEnv = require('./prod.env.cjs')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
