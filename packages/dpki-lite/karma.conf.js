module.exports = function(config) {
  config.set({
    frameworks: ['mocha','requirejs', 'chai'
    // {pattern: './test/main.js', included: true}
  ],
    files: ['lib/**/*.test.js'],
    plugins:[
      // require('chai'),
      // require('mocha'),
      require('karma-requirejs'),
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('./lib/util'),
      // require('./lib/keypair'),
      // require('./lib/seed')
    ],
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
  })
}
