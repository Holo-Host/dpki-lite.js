module.exports = function(config) {
  config.set({
    frameworks: ['mocha','requirejs', 'chai'
  ],
    files: ['test/**/*.test.js',
      {pattern: './dist/bundle.js', watched: false},
      // {pattern: './test/main.js', included: true}
    ],
    plugins:[
      // require('chai'),
      // require('mocha'),
      require('karma-requirejs'),
      require('karma-chai'),
      require('karma-chrome-launcher'),
      // require('karma-firefox-launcher'),
      require('karma-mocha'),
      // require('./dist/bundle'),
      // require( './lib/keypair'),
      // require('./lib/seed')
    ],
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [
    'ChromeHeadless'
    // 'Chrome',
    // 'Firefox'
  ],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity
  })
}
