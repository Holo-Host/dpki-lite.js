const {
  expect
} = require('chai')

const {
  Keypair
} = require('./index')
const util = require('./util')

describe('keypair Suite', () => {
  let pair0 = null
  let pair1 = null
  let pair2 = null

  beforeEach(async () => {
    await Promise.all([
      (async () => {
        pair0 = await Keypair.newFromSeed(await util.randomBytes(32))
      })(),
      (async () => {
        pair1 = await Keypair.newFromSeed(await util.randomBytes(32))
      })(),
      (async () => {
        pair2 = await Keypair.newFromSeed(await util.randomBytes(32))
      })()
    ])
  })

  it('should gen random buf', async () => {
    let buf = await util.randomBytes(32)
    expect(buf.length).equals(32)
  })

  it('should gen a keypair', async () => {
    let seed = await util.randomBytes(32)
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
    const sig = await pair0.sign(Buffer.from('hello'))
    expect(await pair0.verify(sig, Buffer.from('hello'))).equals(true)
  })

  it('should enc / dec', async () => {
    const cipher = await pair0.encrypt([
      pair1.getId(),
      pair2.getId()
    ], Buffer.from('hello'))
    expect(cipher.byteLength).equals(208)

    const res1 = await pair1.decrypt(pair0.getId(), cipher)
    expect(res1).equals('hello')

    const res2 = await pair2.decrypt(pair0.getId(), cipher)
    expect(res2.toString()).equals('hello')
  })

  it('others should not be able to decrypt', async () => {
    const cipher = await pair0.encrypt([
      pair1.getId()
    ], Buffer.from('hello'))

    expect(cipher.byteLength).equals(130)

    try {
      await pair2.decrypt(pair0.getId(), cipher)
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should bundle / restore', async () => {
    pair0.getBundle(Buffer.from('hello'), 'hola').then(
      (b) => {
        // console.log("Bundle: ",b);
        expect(b.hint).equals('hola')
        expect(b.type).equals('hcKeypair')
        Keypair.fromBundle(b, Buffer.from('hello')).then((kp2) => {
          // console.log("pair: ",pair0.getId());
          // console.log("From Bundle: ",kp2.getId());
          expect(kp2.getId()).equals(pair0.getId())
        })
      }
    )
  })

  it('should throw on no bundle hint', async () => {
    try {
      await pair0.getBundle(Buffer.from('hello'))
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
      await p.sign(Buffer.from('hello'))
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })
})
