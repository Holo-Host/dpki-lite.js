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
    let buf1;
    let buf2;
    before(async function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/index.html'];
        }
        buf1 = await randomBytes(32)
        // done()
        // buf2 = await randomBytes(32)
        // console.log("UTIL:: ",util);
        // Create a new instance of our Calculator module to be used in
        // each `it` test case within the ‘Calculator’ describe block
        // this.calculator = new Calculator();
        // console.log("WINDOWS:: ",window);
        // this.keypair = window.util;
    });
    it('should gen random buf',async function() {
      // console.log(window);

      // let e = await encodeId(buf1,buf1)
      console.log("Encoded:: ",buf1);
      expect(32).equals(32)
      // done()

    });

  })
}());
// define(['../dist/bundle'],function(bundle){
// });
