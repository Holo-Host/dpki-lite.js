const sodium = require('libsodium-wrappers')
const { SecBuf } = require('./secbuf')

const PUBLICKEYBYTES = 32; // sodium.crypto_sign_PUBLICKEYBYTES
const SECRETKEYBYTES = 64; // sodium.crypto_sign_SECRETKEYBYTES
const SIGNBYTES = 64; // sodium.crypto_sign_BYTES

/**
 * Generate a signing keypair from a seed buffer
 * @example
 * const { publicKey, secretKey } = mosodium.sign.seedKeypair(seed)
 *
 * @param {SecBuf} seed - the seed to derive a keypair from
 * @retun {object} - { publicKey, privateKey }
 */
exports.seedKeypair = function signSeedKeypair (seed) {
  return sodium.crypto_sign_seed_keypair(seed)
}

/**
 * generate a signature
 * @example
 * const sig = mosodium.sign.sign(Buffer.from('hello'), secretKey)
 *
 * @param {Buffer} message - the message to sign
 * @param {SecBuf} secretKey - the secret key to sign with
 * @return {Buffer} signature data
 */
exports.sign = function signSign (message, secretKey) {
    console.log("PRIVATE :: ",secretKey);
    return sodium.crypto_sign_detached(message, secretKey)
}

/**
 * verify a signature given the message and a publicKey
 * @example
 * const isGood = mosodium.sign.verify(sig, Buffer.from('hello'), pubKey)
 *
 * @param {Buffer} signature
 * @param {Buffer} message
 * @param {Buffer} publicKey
 */
exports.verify = function signVerify (signature, message, publicKey) {
  return sodium.crypto_sign_verify_detached(signature, message, publicKey)
}
