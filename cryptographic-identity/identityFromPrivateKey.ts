import { getRandomBytesSync } from 'ethereum-cryptography/random'
import { publicKeyCreate } from 'ethereum-cryptography/secp256k1'
import { UNCOMPRESSED, PRIVATE_KEY_LENGTH_IN_BYTES } from './constants'
import { CryptographicIdentity } from './CryptographicIdentity'
import { uncompressedPublicKeyToAddress } from './uncompressedPublicKeyToAddress'

export function identityFromPrivateKey(privateKeyBackup?: Buffer): CryptographicIdentity {
  const privateKey = privateKeyBackup ? privateKeyBackup : getRandomBytesSync(PRIVATE_KEY_LENGTH_IN_BYTES)
  const publicKeyToEncode = publicKeyCreate(privateKey, UNCOMPRESSED)
  const publicKey = publicKeyCreate(privateKey)
  const address = uncompressedPublicKeyToAddress(publicKeyToEncode)
  return {
    privateKey,
    publicKey,
    address
  }
}
