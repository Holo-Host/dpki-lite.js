const msgpack = require('msgpack-lite')

// const { AsyncClass } = require('@holochain/n3h-common')
const _sodium = require('libsodium-wrappers')

const util = require('./util')
const NONCEBYTES = 24;

/**
 * Represents two asymmetric cryptography keypairs
 * - a signing keypair
 * - an encryption keypair
 *
 * base64url encoded identity string to represent the public sides
 *
 * can optionally be initialized without the private halves of the pairs
 */
class Keypair {
  /**
   * keypair constructor (you probably want one of the static functions above)
   * @param {object} opt
   * @param {string} opt.pubkeys - the keypair identity string
   * @param {SecBuf} [opt.signPriv] - private signature key
   * @param {SecBuf} [opt.encPriv] - private encryption key
   */
  constructor(opt) {
    if (
      typeof opt !== 'object' ||
      typeof opt.pubkeys !== 'string'
    ) {
      throw new Error('opt.pubkeys must be a base64 encoded pubkey pair (sign / enc)')
    }

    if (opt.signPub.constructor !== Uint8Array || opt.signPriv.constructor !== Uint8Array) {
    console.log("CHECK: ",Buffer.isBuffer(opt.encPriv));
      throw new Error('if opt.signPriv or opt.signPub is specified, it must be a Buffer')
    }

    if (opt.encPub.constructor !== Uint8Array || opt.encPriv.constructor !== Uint8Array) {
      throw new Error('if opt.encPriv or opt.encPub is specified, it must be a Buffer')
    }

    this._pubkeys = opt.pubkeys
    this._signPub = opt.signPub
    this._encPub = opt.encPub
    this._signPriv = opt.signPriv
    this._encPriv = opt.encPriv
  }

  /**
   * derive the pairs from a 32 byte seed buffer
   * @param {SecBuf} seed - the seed buffer
   */
  static async newFromSeed(seed) {
    const sodium = await util.libsodium();
    const {
      publicKey: signPub,
      privateKey: signPriv
    } = sodium.crypto_sign_seed_keypair(seed)
    const {
      publicKey: encPub,
      privateKey: encPriv
    } = sodium.crypto_kx_seed_keypair(seed)
    const pubkeys =  await util.encodeId(signPub, encPub)

    return new Keypair({
      pubkeys,
      signPub,
      signPriv,
      encPub,
      encPriv
    })
  }


  /**
   * get the keypair identifier string
   * @return {string}
   */
  getId() {
    return this._pubkeys
  }


  /**
   * sign some arbitrary data with the signing private key
   * @param {Buffer} data - the data to sign
   */
  async sign (data) {
    if (!this._signPriv) {
      throw new Error('no signPriv - cannot sign data')
    }
    const sodium = await util.libsodium();
    return sodium.crypto_sign_detached(data, this._signPriv)
  }

  /**
 * verify data that was signed with our private signing key
 * @param {Buffer} signature
 * @param {Buffer} data
 */
  async verify (signature, data) {
    return await util.verify(signature, data, this._pubkeys)
  }

  /**
   * encrypt arbitrary data to be readale by potentially multiple recipients
   * @param {array<string>} recipientIds - multiple recipient identifier strings
   * @param {Buffer} data - the data to encrypt
   * @return {Buffer}
   */
  async encrypt (recipientIds, data, adata) {
    const sodium = await util.libsodium()

    let symSecret = await util.randomBytes(32);

    // we will call the encryptor (us) the "server"
    // and the recipients the "client"
    const out = []
    for (let id of recipientIds) {
      const {encPub : recipPub} = await util.decodeId(id);
      // XXX lru cache these so we don't have to re-gen every time?
      const { sharedTx:tx } = sodium.crypto_kx_server_session_keys(
        this._encPub, this._encPriv, recipPub)
        const nonce = sodium.randombytes_buf(NONCEBYTES)

        const cipher = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
          symSecret,adata || null, null, nonce, tx)
        out.push(nonce)
        out.push(cipher)

    }

    const nonce = sodium.randombytes_buf(NONCEBYTES)
    const cipher = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(data, adata || null, null, nonce, symSecret)
    out.push(nonce)
    out.push(cipher)

    return msgpack.encode(out)
  }

  /**
 * attempt to decrypt the cipher buffer (assuming it was targeting us)
 * @param {string} sourceId - identifier string of who encrypted this data
 * @param {Buffer} cipher - the encrypted data
 * @return {Buffer} - the decrypted data
 */
async decrypt (sId, cipher,adata) {
  const sodium = await util.libsodium()

  cipher = msgpack.decode(cipher)

  const {encPub : sourceId} = await util.decodeId(sId);

  // we will call the encryptor the "server"
  // and the recipient (us) the "client"
  // XXX cache?
  const { sharedRx: rx } = sodium.crypto_kx_client_session_keys(this._encPub, this._encPriv, sourceId)
  let symSecret = null
  for (let i = 0; i < cipher.length - 2; i += 2) {
    const n = cipher[i]
    const c = cipher[i + 1]
    try {
      symSecret =  sodium.crypto_aead_xchacha20poly1305_ietf_decrypt( null, c, adata || null, n, rx)
    } catch (e) { /* pass */}
}

  if (!symSecret) {
    throw new Error('could not decrypt - not a recipient?')
  }
  return sodium.to_string(sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,cipher[cipher.length - 1],adata||null, cipher[cipher.length - 2], symSecret))
  }

  /**
 * generate an encrypted persistence bundle
 * @param {string} passphrase - the encryption passphrase
 * @param {string} hint - additional info / description for the bundle
 */
  async getBundle (passphrase, hint) {
    if (typeof hint !== 'string') {
      throw new Error('hint must be a string')
    }

    const out = {
      type: 'hcKeypair',
      hint,
      data: (await util.pwEnc(msgpack.encode([
        this._signPub, this._encPub,
        this._signPriv._, this._encPriv._
      ]), passphrase))
    }
    // console.log("Out: ",out);
    return out
  }
}
exports.Keypair = Keypair
