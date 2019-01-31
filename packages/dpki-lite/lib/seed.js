const bip39 = require('bip39')
let Buffer = require('safe-buffer').Buffer
const {
  Keypair
} = require('./keypair')
const util = require('./util')

/**
 * Superclass of all other seed types
 */
class Seed {
  /**
   * Initialize this seed class with persistence bundle type and private seed
   * @param {string} type - the persistence bundle type
   * @param {Buffer|string} seed - the private seed data (as a buffer or mnemonic)
   */
  constructor (type, seed) {
    if (typeof type !== 'string') {
      throw new Error('type must be specified for bundling')
    }
    this._type = type
    if (typeof seed === 'string' && seed.split(/\s/g).length === 24) {
      if (!bip39.validateMnemonic(seed)) {
        throw new Error('invalid mnemonic string')
      }
      this._seed = Buffer.from(bip39.mnemonicToEntropy(seed), 'hex')
    } else if ((seed.constructor === Uint8Array && seed.length === 32) || (seed.constructor === Uint8Array && seed.length === 16)) {
      this._seed = seed
    } else {
      throw new Error('`seed` must be a 16/32 byte Buffer or 24 word bip39 mnemonic string')
    }
  }

  /**
   * Get the proper seed type from a persistence bundle
   * @param {object} bundle - the persistence bundle
   * @param {string} passphrase - the decryption passphrase
   * @return {RootSeed|DeviceSeed|DevicePinSeed}
   */
  static async fromBundle (bundle, passphrase) {
    let Class = null
    switch (bundle.type) {
      case 'holoDevicePinSeed':
        Class = DevicePinSeed
        break
      case 'holoRootSeed':
        Class = RootSeed
        break
      default:
        throw new Error('unrecognized bundle type: "' + bundle.type + '"')
    }
    return new Class(await util.pwDec(bundle.data, passphrase))
  }

  /**
   * generate a persistence bundle with hint info
   * @param {string} passphrase - the encryption passphrase
   * @param {string} hint - additional info / description for persistence
   */
  async getBundle (passphrase, hint) {
    if (typeof hint !== 'string') {
      throw new Error('hint must be a string')
    }

    const out = {
      type: this._type,
      hint,
      data: (await util.pwEnc(this._seed, passphrase))
    }

    return out
  }

  /**
   * generate a bip39 mnemonic based on the private seed entroyp
   */
  // TODO: not tested
  getMnemonic () {
    return bip39.entropyToMnemonic(Buffer.from(this._seed).toString('hex'))
  }
}

exports.Seed = Seed

/**
 * This is a device seed that has been PIN derived
 */
class DevicePinSeed extends Seed {
  /**
   * delegate to base class
   */
  constructor (seed) {
    super('holoDevicePinSeed', seed)
  }

  /**
   * generate an application keypair given an index based on this seed
   * @param {number} index
   * @return {Keypair}
   */
  async getApplicationKeypair (index) {
    if (typeof index !== 'number' || parseInt(index, 10) !== index || index < 1) {
      throw new Error('invalid index')
    }
    const sodium = await util.libsodium()
    const appSeed = sodium.crypto_kdf_derive_from_key(32, index, Buffer.from('HOLO_APPLIC'), this._seed)

    return Keypair.newFromSeed(appSeed)
  }
}

exports.DevicePinSeed = DevicePinSeed

/**
 * This root seed should be pure entropy
 */
class RootSeed extends Seed {
  /**
   * delegate to base class
   */
  constructor (seed) {
    super('holoRootSeed', seed)
  }

  /**
   * Get a new, completely random root seed
   */
  static async newRandom () {
    const seed = await util.randomBytes(32)
    return new RootSeed(seed)
  }

  /**
   * generate a device pin seed by applying pwhash of pin with this seed as the salt
   * @param {string} pin - should be >= 4 characters 1-9
   * @return {DevicePinSeed}
   */
  async getDevicePinSeed (dna) {
    if (typeof dna !== 'string' || dna.length < 4) {
      throw new Error('dna must be a string >= 4 characters')
    }
    dna = Buffer.from(dna, 'utf8')

    const sodium = await util.libsodium()

    const dnaSeed = sodium.crypto_hash_sha256(Buffer.concat([dna, this._seed]))

    return new DevicePinSeed(dnaSeed)
  }
}

exports.RootSeed = RootSeed
