const _sodium = require('libsodium-wrappers-sumo')
const msgpack = require('msgpack-lite')

const NONCEBYTES = 24
const SALTBYTES = 16

// async function libsodium () {
//   await _sodium.ready
//   return _sodium
// }
// exports.libsodium = libsodium

/**
 * Output `count` random bytes
 * @example
 * const bytes = sodium.random.bytes(32)
 *
 * @param {number} count - number of random bytes to output
 * @return {Buffer}
 */
function randomBytes (count) {
  return new Promise((resolve, reject) => {
    _sodium.ready.then((_)=>{
      resolve(_sodium.randombytes_buf(count));
      reject("failure reason"); // rejected
    })
});
}

exports.randomBytes = randomBytes
/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * Generate an identity string with a pair of public keys
 * @param {Buffer} signPub - singing public key
 * @param {Buffer} encPub - encryption public key
 * @return {string} - the base64url encoded identity (with checksum)
 */
 function encodeId (signPub, encPub) {
  return new Promise((resolve, reject) => {
    _sodium.ready.then((_)=>{
      resolve(_sodium.to_base64(Buffer.concat([signPub, encPub])));
      reject("failure reason"); // rejected
    })
  });

}

exports.encodeId = encodeId

/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * break an identity string up into a pair of public keys
 * @param {string} id - the base64url encoded identity string
 * @return {object} - { signPub: Buffer, encPub: Buffer }
 */
 function decodeId (id) {
  return new Promise((resolve, reject) => {
    _sodium.ready.then((sodium)=>{
      const tmp = _sodium.from_base64(id)
      resolve({
        signPub: tmp.slice(0, 32),
        encPub: tmp.slice(32, 64)
      });
      reject("failure reason");
    })
  });

}

exports.decodeId = decodeId

/**
 * verify a signature given the original data, and the signer's identity string
 * @param {Buffer} signature - the binary signature
 * @param {Buffer} data - the binary data to verify
 * @param {string} signerId - the signer's public identity string
 */
async function verify (signature, data, signerId) {
  const {
    signPub
  } = await decodeId(signerId)
  return new Promise((resolve, reject) => {
    _sodium.ready.then((sodium)=>{
      resolve(_sodium.crypto_sign_verify_detached(signature, data, signPub));
      reject("failure reason"); // rejected
    })
  });

}
exports.verify = verify
/**
 * simplify the api for generating a password hash with our set parameters
 * @param {Buffer} pass - the password buffer to hash
 * @param {Buffer} [salt] - if specified, hash with this salt (otherwise random)
 * @return {object} - { salt: Buffer, hash: Buffer }
 */
function pwHash (pass, salt) {
  return new Promise((resolve, reject) => {
    _sodium.ready.then((_)=>{
      const opt = {
        opslimit: _sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
        memlimit: _sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
        algorithm: _sodium.crypto_pwhash_ALG_ARGON2ID13,
        keyLength: 32
      }

      if (salt) {
        opt.salt = salt
      }

      if (!opt.salt) {
        opt.salt = _sodium.randombytes_buf(SALTBYTES)
      }
      let derivedKey = _sodium.crypto_pwhash(
        opt.keyLength, pass, opt.salt,
        opt.opslimit, opt.memlimit, opt.algorithm)
      resolve({
        salt: opt.salt,
        hash: derivedKey
      });
      reject("failure reason");
    })
  });
}
exports.pwHash = pwHash

/**
 * Helper for encrypting a buffer with a pwhash-ed passphrase
 * @param {Buffer} data
 * @param {string} passphrase
 * @return {Buffer} - the encrypted data
 */
function pwEnc (data, passphrase, adata) {
  return new Promise((resolve, reject) => {
    _sodium.ready.then((_)=>{
       pwHash(passphrase).then(pw=>{
        const salt = pw.salt;
        const secret = pw.hash;
        const nonce = _sodium.randombytes_buf(NONCEBYTES)
        let ciphertext = _sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(data, adata || null, null, nonce, secret)

        resolve(msgpack.encode({
          salt,
          nonce,
          cipher: ciphertext
        }));
        reject("failure reason");
      })
    })
  });
}
exports.pwEnc = pwEnc

/**
 * Helper for decrypting a buffer with a pwhash-ed passphrase
 * @param {Buffer} data
 * @param {string} passphrase
 * @return {Buffer} - the decrypted data
 */
function pwDec (data, passphrase, adata) {
  data = msgpack.decode(data)
  return new Promise((resolve, reject) => {
    pwHash(passphrase, data.salt).then(pw=>{
      const secret = pw.hash;
      _sodium.ready.then((sodium)=>{
        resolve(_sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
          null, data.cipher, adata || null, data.nonce, secret));
          reject("failure reason"); // rejected
        })
    })
  });
}

exports.pwDec = pwDec
