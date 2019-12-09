import { keccak256 } from 'ethereum-cryptography/keccak'
import { publicKeyConvert, recover, sign } from 'ethereum-cryptography/secp256k1'
import { Address, isAddress } from './Address'
import { UNCOMPRESSED } from './constants'
import { CryptographicIdentity } from './CryptographicIdentity'
import { uncompressedPublicKeyToAddress } from './uncompressedPublicKeyToAddress'
/**
 * If the address corresponds to the hash of a Public key, then they can sign messages
 */
export type SignedMessage = {
  payload: string // TODO: Could this be an object?
  hash: string
  signature: string
  signingAddress: Address
}
export type ValidMessage = SignedMessage

export function isValidMessage(message: any): message is ValidMessage {
  if (!isSignedMessage(message)) {
    return false
  }
  const hash = keccak256(Buffer.from(message.payload))
  if (hash.toString('hex') !== message.hash) {
    return false
  }
  const signature = Buffer.from(message.signature.slice(0, 128), 'hex')
  const recoveredPublicKey = recover(hash, signature.slice(0, 64), parseInt(message.signature.slice(128)))
  return uncompressedPublicKeyToAddress(publicKeyConvert(recoveredPublicKey, UNCOMPRESSED)) === message.signingAddress
}

export function createSignedMessage(identity: CryptographicIdentity, message: string | object): ValidMessage {
  const payload = typeof message === 'string' ? message : JSON.stringify(message)
  const hash = keccak256(Buffer.from(payload))
  const signature = sign(hash, identity.privateKey)
  return {
    payload,
    hash: hash.toString('hex'),
    signature: signature.signature.toString('hex') + signature.recovery.toString(),
    signingAddress: identity.address
  }
}

export function isSignedMessage(message: any): message is SignedMessage {
  if (typeof message !== 'object') {
    return false
  }
  if (typeof message.payload !== 'string') {
    return false
  }
  if (typeof message.signature !== 'string') {
    return false
  }
  if (message.signature.length !== 129) {
    return false
  }
  if (typeof message.hash !== 'string') {
    return false
  }
  if (!isAddress(message.signingAddress)) {
    return false
  }
  return true
}