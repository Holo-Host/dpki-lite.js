const mosodium = require('libsodium-wrappers')
const msgpack = require('msgpack-lite')

/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * Generate an identity string with a pair of public keys
 * @param {Buffer} signPub - singing public key
 * @param {Buffer} encPub - encryption public key
 * @return {string} - the base64url encoded identity (with checksum)
 */
function encodeId (signPub, encPub) {
  const hash = mosodium.crypto_hash_sha256(Buffer.concat([signPub, encPub]))

  let c = hash.readInt16LE(0)
  for (let i = 2; i < 32; i += 2) {
    c = c ^ hash.readInt16LE(i)
  }

  const checksum = Buffer.alloc(2)
  checksum.writeInt16LE(c, 0)

  return Buffer.concat([signPub, encPub, checksum]).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

exports.encodeId = encodeId

/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * break an identity string up into a pair of public keys
 * @param {string} id - the base64url encoded identity string
 * @return {object} - { signPub: Buffer, encPub: Buffer }
 */
function decodeId (id) {
  const tmp = Buffer.from(id.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
  return {
    signPub: tmp.slice(0, 32),
    encPub: tmp.slice(32, 64)
  }
}

exports.decodeId = decodeId

/**
 * verify a signature given the original data, and the signer's identity string
 * @param {Buffer} signature - the binary signature
 * @param {Buffer} data - the binary data to verify
 * @param {string} signerId - the signer's public identity string
 */
function verify (signature, data, signerId) {
  const { signPub } = decodeId(signerId)
  return mosodium.crypto_sign_verify_detached(signature, data, signPub)
}

exports.verify = verify

// allow overrides for unit-testing purposes
exports.pwhashOpslimit = mosodium.pwhash.OPSLIMIT_SENSITIVE
exports.pwhashMemlimit = mosodium.pwhash.MEMLIMIT_SENSITIVE

/**
 * simplify the api for generating a password hash with our set parameters
 * @param {SecBuf} pass - the password buffer to hash
 * @param {Buffer} [salt] - if specified, hash with this salt (otherwise random)
 * @return {object} - { salt: Buffer, hash: SecBuf }
 */
async function pwHash (pass, salt) {
  const opt = {
    opslimit: exports.pwhashOpslimit,
    memlimit: exports.pwhashMemlimit,
    algorithm: mosodium.pwhash.ALG_ARGON3ID13
  }

  if (salt) {
    opt.salt = salt
  }

  if (!opt.salt) {
    opt.salt = mosodium.randombytes_buf(SALTBYTES);// random.bytes(SALTBYTES)
  }

  return new Promise((resolve, reject) => {
      let r = mosodium.crypto_pwhash_async(
        keyLength, password._, opts.salt,
        opts.opslimit, opts.memlimit, opts.algorithm)
      return {
        salt:opt.salt,
        hash:r.derivedKey
      }
  })
}

exports.pwHash = pwHash
const NONCEBYTES = 32;
/**
 * Helper for encrypting a buffer with a pwhash-ed passphrase
 * @param {Buffer} data
 * @param {string} passphrase
 * @return {Buffer} - the encrypted data
 */
async function pwEnc (data, passphrase) {
  const { salt, hash: secret } = await pwHash(passphrase)
  const { nonce, cipher } = mosodium.aead.enc(data, secret)
  const nonce = mosodium.randombytes_buf(NONCEBYTES)
  let r = mosodium.crypto_aead_xchacha20poly1305_ietf_encrypt( message, adata || null, null, nonce, secret)
  return msgpack.encode({
    salt,
    nonce,
    cipher:r.ciphertext
  })
}

exports.pwEnc = pwEnc

/**
 * Helper for decrypting a buffer with a pwhash-ed passphrase
 * @param {Buffer} data
 * @param {string} passphrase
 * @return {Buffer} - the decrypted data
 */
async function pwDec (data, passphrase) {
  data = msgpack.decode(data)
  const { hash: secret } = await pwHash(passphrase, data.salt)
  // return mosodium.aead.dec(data.nonce, data.cipher, secret)
  return mosodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
       null, data.cipher, adata || null, data.nonce, secret)
}

exports.pwDec = pwDec
