  (function() {

      /////////////////////////
      // Helpers and globals //
      /////////////////////////

      var expect = chai.expect;

      ////////////////
      // Test suite //
      ////////////////

  describe('Keypair Suite.. ',async function(){
    let pair0 = null
    let pair1 = null
    let pair2 = null

    // beforeEach(async () => {
    //   await Promise.all([
    //     (async () => {
    //       pair0 = await Keypair.newFromSeed(await randomBytes(32))
    //     })(),
    //     (async () => {
    //       pair1 = await Keypair.newFromSeed(await randomBytes(32))
    //     })(),
    //     (async () => {
    //       pair2 = await Keypair.newFromSeed(await randomBytes(32))
    //     })()
    //   ])
    // })

    it('should gen random buf', async () => {
      let buf = await randomBytes(32)
      console.log("BUFFER::",buf);
      expect(buf.length).equals(32)
    })
  })

  // describe('Keypair Suite.. ',async function(){
  //     beforeEach(async () => {
  //       await Promise.all([
  //         (async () => {
  //           pair0 = await Keypair.newFromSeed(await randomBytes(32))
  //         })()
  //       ])
  //   it('should gen a keypair', async () => {
  //     let seed = await randomBytes(32)
  //     let pair0 = await Keypair.newFromSeed(seed)
  //     console.log("Key Pair: ",pair0);
  //     expect(pair0.getId().length).equals(86)
  //   })
  //
  // })});
}());
