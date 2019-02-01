// const {
  //   Keypair
  // } = bundle
  // const util = bundle
  (function() {

      /////////////////////////
      // Helpers and globals //
      /////////////////////////

      var expect = chai.expect;

      ////////////////
      // Test suite //
      ////////////////

  describe('Testing.. ',function(){
    before(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/index.html'];
        }

        // Create a new instance of our Calculator module to be used in
        // each `it` test case within the ‘Calculator’ describe block
        this.calculator = new Calculator();
        // console.log("WINDOWS:: ",window);
        // this.keypair = window.util;
    });
    // What should it do?
    it('should throw an error if a non-numeric value is used', function() {
        // Chai’s expect function will take a any value, including a function
        // but in our case, we want it to throw an error. If we just said
        // this.calculator.add(2, ‘a’), the error would throw before `expect`
        // could handle it. This is why we create a new function using bind
        // passing in our specified arguments and let Chai catch the error.
        expect(this.calculator.add.bind(this.calculator, 2, 'a')).to.throw();
    });

    it('should gen random buf', async function() {
      // console.log(window);
      let buf = await window.util.randomBytes(32)
      expect(buf.length).equals(32)
    });

  })
}());
// define(['../dist/bundle'],function(bundle){
// });
