module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  weapp: {
    compile: {
      exclude: ["src/components/ec-canvas/echarts.js"]
    }
  },
  h5: {}
};
