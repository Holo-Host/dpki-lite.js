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

  describe('Testing.. ',()=>{
    it('should throw on bad opt', async () => {
      try {
        await new Keypair()
      } catch (e) {
        return
      }
      throw new Error('expected exception, got success')
    })
  })
}());
// define(['../dist/bundle'],function(bundle){
// });
