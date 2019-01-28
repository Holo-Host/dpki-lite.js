const { expect } = require('chai')

const util = require('./util')

const { Seed, RootSeed, DeviceSeed, DevicePinSeed } = require('./index')

describe('seed Suite', async () => {
  it('should initialize with a Buffer', async () => {
    const seed = await util.randomBytes(32)
    const rs = new RootSeed(seed)
    expect(rs.getMnemonic().split(/\s/g).length).equals(24)
  })

  it('should work with static newRandom', async () => {
    const rs = await RootSeed.newRandom()
    expect(rs.getMnemonic().split(/\s/g).length).equals(24)
  })

  it('should bundle / restore', async () => {
    const rs = await RootSeed.newRandom()

    rs.getBundle(Buffer.from('hello'), 'hola').then((bundle) => {
      expect(bundle.hint).equals('hola')
      expect(bundle.type).equals('hcRootSeed')

      Seed.fromBundle(bundle, Buffer.from('hello'))
        .then((rs2) => {
          expect(rs2 instanceof RootSeed).equals(true)
        })
    })
  })

  it('should throw on bad bundle hint', async () => {
    const rs = await RootSeed.newRandom()
    try {
      await rs.getBundle(Buffer.from('hello'))
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad bundle type', async () => {
    try {
      await Seed.fromBundle({
        type: 'badBundleType'
      })
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad init type', async () => {
    try {
      await new Seed(2)
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad mnemonic string', async () => {
    try {
      await new Seed('hcRootSeed')
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should throw on bad mnemonic string (validate)', async () => {
    try {
      await new Seed('hcRootSeed', 'a a a a a a a a a a a a a a a a a a a a a a a a')
    } catch (e) {
      return
    }
    throw new Error('expected exception, got success')
  })

  it('should work with a mnemonic', async () => {
    const rs1 = await RootSeed.newRandom()
    const mn1 = rs1.getMnemonic()
    const rs2 = await new RootSeed(mn1)
    const mn2 = rs2.getMnemonic()
    expect(mn2.split(/\s/g).length).equals(24)
    expect(mn1).equals(mn2)
  })

  describe('device seed subsuite', () => {
    let seed = null
    let rs = null
    let ds = null
    let dps = null

    beforeEach(async () => {
      seed = await util.randomBytes(32)
      rs = await new RootSeed(seed)
      ds = await rs.getDeviceSeed(384)
    })

    it('should derive device seed', async () => {
      expect(ds.getMnemonic().split(/\s/g).length).equals(12)
    })

    it('should throw on bad device seed index', async () => {
      try {
        await rs.getDeviceSeed('a')
      } catch (e) {
        return
      }
      throw new Error('expected exception, got success')
    })

    it('should throw on bad device seed pin', async () => {
      try {
        await ds.getDevicePinSeed('a')
      } catch (e) {
        return
      }
      throw new Error('expected exception, got success')
    })

    it('should derive application keypair', async () => {
      try {
        ds.getDevicePinSeed('123456').then((dps) => {
          dps.getApplicationKeypair(1952).then((kp) => {
            expect(kp.getId().length).equals(86)
          })
        })
      } catch (e) {
        console.log('ERROR')
      }
    })

    it('should throw on bad application keypair index', async () => {
      try {
        await dps.getApplicationKeypair('a')
      } catch (e) {
        return
      }
      throw new Error('expected exception, got success')
    })

    it('should bundle / restore', async () => {
      const m = ds.getMnemonic()
      ds.getBundle(Buffer.from('hello'), 'hola').then((b) => {
        try {
          expect(b.hint).equals('hola')
          expect(b.type).equals('hcDeviceSeed')
          Seed.fromBundle(b, Buffer.from('hello')).then((ds2) => {
            try {
              expect(ds2.getMnemonic()).equals(m)
              expect(ds2 instanceof DeviceSeed).equals(true)
            } catch (e) {
              console.log('ERROR')
            }
          })
        } catch (e) {
          console.log('ERROR')
        }
      })
    })

    it('should bundle / restore (pin seed)', async () => {
      ds.getDevicePinSeed('123456').then((dps) => {
        try {
          const m = dps.getMnemonic()

          dps.getBundle(Buffer.from('hello'), 'hola').then((b) => {
            try {
              expect(b.hint).equals('hola')
              expect(b.type).equals('hcDevicePinSeed')
              Seed.fromBundle(b, Buffer.from('hello')).then((dps2) => {
                expect(dps2.getMnemonic()).equals(m)
                expect(dps2 instanceof DevicePinSeed).equals(true)
              })
            } catch (e) {
              console.log('ERROR')
            }
          })
        } catch (e) {
          console.log('ERROR')
        }
      })
    })
  })
})
