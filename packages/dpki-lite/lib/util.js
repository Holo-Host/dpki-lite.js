const _sodium = require('libsodium-wrappers')
const msgpack = require('msgpack-lite')


async function libsodium(){
  await _sodium.ready;
  return _sodium;
}
exports.libsodium = libsodium

/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * Generate an identity string with a pair of public keys
 * @param {Buffer} signPub - singing public key
 * @param {Buffer} encPub - encryption public key
 * @return {string} - the base64url encoded identity (with checksum)
 */
 async function encodeId (signPub, encPub) {
  const sodium = await libsodium()
  try{
    // console.log(sodium._sodium_init());
    // const hash = sodium.crypto_hash_sha256(Buffer.concat([signPub, encPub]))
    return sodium.to_base64(Buffer.concat([signPub, encPub]));
  }catch(e){
    console.log("ERROR at encodeId: ",e);
  }

  }

exports.encodeId = encodeId

/**
 * using base64url encoding (https://tools.ietf.org/html/rfc4648#section-5)
 * break an identity string up into a pair of public keys
 * @param {string} id - the base64url encoded identity string
 * @return {object} - { signPub: Buffer, encPub: Buffer }
 */
async function decodeId (id) {
  const sodium = await libsodium()

  const tmp = sodium.from_base64(id)

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
async function verify (signature, data, signerId) {
  const sodium = await libsodium()
  const { signPub } = await decodeId(signerId)
  return sodium.crypto_sign_verify_detached(signature, data, signPub)
}
exports.verify = verify

// allow overrides for unit-testing purposes
// exports.pwhashOpslimit = sodium.crypto_pwhash_OPSLIMIT_SENSITIVE
// exports.pwhashMemlimit = sodium.crypto_pwhash_MEMLIMIT_SENSITIVE

/**
 * simplify the api for generating a password hash with our set parameters
 * @param {SecBuf} pass - the password buffer to hash
 * @param {Buffer} [salt] - if specified, hash with this salt (otherwise random)
 * @return {object} - { salt: Buffer, hash: SecBuf }
 */
 // TODO: update the package
const SALTBYTES = 16;
async function pwHash (pass, salt) {
  const sodium = await libsodium()
  const opt = {
    opslimit: sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,// 4, //exports.pwhashOpslimit,
    memlimit: sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,//1073741824,//exports.pwhashMemlimit,
    algorithm: sodium.crypto_pwhash_ALG_ARGON2ID13,//2 //sodium.crypto_pwhash_ALG_ARGON2ID13
    keyLength: 32//sodium.crypto_aead_xchacha20poly1305_ietf_keybytes
  }

  if (salt) {
    opt.salt = salt
  }

  if (!opt.salt) {
    opt.salt = sodium.randombytes_buf(SALTBYTES);// random.bytes(SALTBYTES)
  }
  // console.log("opt:",opt);
  let derivedKey = await sodium.crypto_pwhash(
    opt.keyLength, pass, opt.salt,
    opt.opslimit, opt.memlimit, opt.algorithm)
  return new Promise ((resolve,reject) =>{
    resolve ({
    salt:opt.salt,
    hash:derivedKey
  })
})
  // return new Promise((resolve, reject) => {
  //   try {
  //     sodium.crypto_pwhash(
  //     opt.keyLength, pass, opt.salt,
  //     opt.opslimit, opt.memlimit, opt.algorithm,
  //       (err) => {
  //         try {
  //           finalize()
  //           if (err) return reject(err)
  //           resolve({
  //             salt: opt.salt,
  //             hash
  //           })
  //         } catch (e) {
  //           reject(e)
  //         }
  //       })
  //   } catch (e) {
  //     reject(e)
  //   }
  // })


}
exports.pwHash = pwHash

const NONCEBYTES = 24;
/**
 * Helper for encrypting a buffer with a pwhash-ed passphrase
 * @param {Buffer} data
 * @param {string} passphrase
 * @return {Buffer} - the encrypted data
 */
async function pwEnc (data, passphrase,adata) {
  const sodium = await libsodium()
  const { salt, hash: secret } = await pwHash(passphrase)
  // const { nonce, cipher } = sodium.aead.enc(data, secret)
  const nonce = sodium.randombytes_buf(NONCEBYTES)
  let r = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt( data, adata || null, null, nonce, secret)
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
async function pwDec (data, passphrase,adata) {
  const sodium = await libsodium()
  data = msgpack.decode(data)
  const { hash: secret } = await pwHash(passphrase, data.salt)
  // return sodium.aead.dec(data.nonce, data.cipher, secret)
  return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
       null, data.cipher, adata || null, data.nonce, secret)
}

exports.pwDec = pwDec

/**
 * Output `count` random bytes
 * @example
 * const bytes = sodium.random.bytes(32)
 *
 * @param {number} count - number of random bytes to output
 * @return {Buffer}
 */
async function randomBytes (count) {
  const sodium = await libsodium()
  return sodium.randombytes_buf(count)
}
exports.randomBytes = randomBytes
