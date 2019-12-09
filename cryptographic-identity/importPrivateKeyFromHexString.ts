import { privateKeyVerify } from 'ethereum-cryptography/secp256k1'
import { CryptographicIdentity } from './CryptographicIdentity'
import { identityFromPrivateKey } from './identityFromPrivateKey'
import { HEXADECIMAL_REGEXP, PRIVATE_KEY_LENGTH_IN_HEXA } from './constants'

export function importPrivateKeyFromHexString(privateKeyAsHexadecimalString: string): CryptographicIdentity {
  if (typeof privateKeyAsHexadecimalString !== 'string') {
    throw new Error(`An invalid private key was provided: ${privateKeyAsHexadecimalString}: it should be a string`)
  }
  if (!HEXADECIMAL_REGEXP.test(privateKeyAsHexadecimalString)) {
    throw new Error(
      `An invalid private key was provided: ${privateKeyAsHexadecimalString}: it should be in hexadecimal format`
    )
  }
  if (privateKeyAsHexadecimalString.length !== PRIVATE_KEY_LENGTH_IN_HEXA) {
    throw new Error(`An invalid private key was provided: ${privateKeyAsHexadecimalString}: it should be 256bits long`)
  }
  const privateKey = Buffer.from(privateKeyAsHexadecimalString, 'hex')
  if (!privateKeyVerify(privateKey)) {
    throw new Error(
      `An invalid private key was provided: ${privateKeyAsHexadecimalString}: it is not a valid value for the secp256k1 curve`
    )
  }
  return identityFromPrivateKey(privateKey)
}
