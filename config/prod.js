module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  weapp: {
    compile: {
      exclude: ["src/components/ec-canvas/echarts.js"]
    }
  },
  h5: {}
};
