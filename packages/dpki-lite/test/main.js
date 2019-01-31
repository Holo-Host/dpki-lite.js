var tests = [];
for (var file in window.__karma__.files) {
    if (/\_test\.js$/.test(file)) { tests.push(file); }
}
requirejs.config({
    baseUrl: '../lib/',
    deps: tests,
    callback: mocha.run
});
