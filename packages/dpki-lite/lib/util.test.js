const { expect } = require('chai')

const util = require('./util')

describe('utils', () => {

  it('should convert a base64 string to a uint8 array and back again', async () => {
    const base64Str = "c2VjcmV0X21lc3NhZ2Vfb21n"
    const buf = await util.fromBase64(base64Str)

    expect(buf instanceof Uint8Array).equals(true)
    expect(buf.length).equals(18)

    const strBack = await util.toBase64(buf)
    expect(typeof strBack).equals('string')
    expect(strBack).equals(base64Str)
  })

  it('should error when trying to convert an invalid base64 string', async () => {
    const base64Str = "&^%c2VjcmV0X21lc3NhZ2Vfb21n"
    try {
      await util.fromBase64(base64Str)
      throw new Error("fromBase64 did not error")
    } catch (err) {
      expect(err.message).to.equal("incomplete input")
    }
  })

})