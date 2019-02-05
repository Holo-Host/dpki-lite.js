(function() {

var expect = chai.expect;

describe('keypair Suite', () => {
  let pair0 = null
  let pair1 = null
  let pair2 = null

  beforeEach(async () => {
    await Promise.all([
      (async () => {
        pair0 = await Keypair.newFromSeed(await randomBytes(32))
      })(),
      (async () => {
        pair1 = await Keypair.newFromSeed(await randomBytes(32))
      })(),
      (async () => {
        pair2 = await Keypair.newFromSeed(await randomBytes(32))
      })()
    ])
  })

  it('should gen random buf', async () => {
    let buf = await randomBytes(32)
    expect(buf.length).equals(32)
  })

  it('should gen a keypair', async () => {
    let seed = await randomBytes(32)
    let pair0 = await Keypair.newFromSeed(seed)
    expect(pair0.getId().length).equals(86)
  })

  it('should throw on bad opt', async () => {
    try {
      await new Keypair()
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad signPriv', async () => {
    try {
      await new Keypair({
        pubkeys: 'O2onvM62pC1io6jQKm8Nc2UyFXcd4kOmOsBIoYtZ2ilVfiPXNG8hPsWiNxOyokl-7zU1TVtSCIrGpZk6X9sJHt4m',
        signPriv: 32
      })
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad encPriv', async () => {
    try {
      await new Keypair({
        pubkeys: 'O2onvM62pC1io6jQKm8Nc2UyFXcd4kOmOsBIoYtZ2ilVfiPXNG8hPsWiNxOyokl-7zU1TVtSCIrGpZk6X9sJHt4m',
        encPriv: 32
      })
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  // it('should throw on bad pubkeys', async () => {
  //   try {
  //     await new Keypair({
  //       pubkeys: 'O2onvM62pC1io6jQKm8Nc2UyFXcd4kOmOsBIoYtZ2ilVfiPXNG8hPsWiNxOyokl-7zU1TVtSCIrGpZk6X9sJHt4n'
  //     })
  //   } catch (e) {
  //     return
  //   }
  //   throw new Error('expected exception, got success')
  // })

  it('should sign / verify', async () => {
    const sig = await pair0.sign(new Uint8Array([9,8,8,3]))
    expect(await pair0.verify(sig, new Uint8Array([9,8,8,3]))).equals(true)
  })

  // it('others should not be able to decrypt', async () => {
  //   console.log("-------");
  //   const cipher = await pair0.encrypt([
  //     pair1.getId()
  //   ], new Uint8Array([9,8,8,3]))
  //   console.log("-------");
  //   expect(cipher.byteLength).equals(130)
  //   try {
  //     await pair2.decrypt(pair0.getId(), cipher)
  //     console.log("-------");
  //     } catch (e) {
  //       console.log("-------");
  //       return
  //   }
  //   console.log("-------");
  //
  //   throw new Error('expected exception, got success')
  // })

  it('should bundle / restore', async () => {
    pair0.getBundle(new Uint8Array([9,8,8,3]), 'hola').then(
      (b) => {
        // console.log("Bundle: ",b);
        expect(b.hint).equals('hola')
        expect(b.type).equals('hcKeypair')
        Keypair.fromBundle(b, new Uint8Array([9,8,8,3])).then((kp2) => {
          // console.log("pair: ",pair0.getId());
          // console.log("From Bundle: ",kp2.getId());
          expect(kp2.getId()).equals(pair0.getId())
        })
      }
    )
  })

  it('should throw on no bundle hint', async () => {
    try {
      await pair0.getBundle(new Uint8Array([9,8,8,3]))
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on sign with no signpriv', async () => {
    const p = await new Keypair({
      pubkeys: 'O2onvM62pC1io6jQKm8Nc2UyFXcd4kOmOsBIoYtZ2ilVfiPXNG8hPsWiNxOyokl-7zU1TVtSCIrGpZk6X9sJHt4m'
    })
    try {
      await p.sign(new Uint8Array([9,8,8,3]))
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

})


}());
