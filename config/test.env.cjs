'use strict'
const { merge } = require('webpack-merge')
const devEnv = require('./dev.env.cjs')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})
