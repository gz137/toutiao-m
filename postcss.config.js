module.exports = {
    plugins: {
    //   'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    //   },
      'postcss-pxtorem': {
        rootValue({file}){
            return file.includes("van") ? 37.5 : 75
        },
        // rootValue: 37.5,
        propList: ['*']
      }
    }
  }