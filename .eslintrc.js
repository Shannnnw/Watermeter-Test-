// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    babelOptions: {
      configFile: false,
      babelrc: false,
      presets: [],
      plugins: []
    }
  },
  env: {
    browser: true
  },
  rules: {}
}
