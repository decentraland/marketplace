import { testIdentity } from './TestIdentities.spec'
import { uncompressedPublicKeyToAddress } from './uncompressedPublicKeyToAddress'
import { publicKeyConvert } from 'ethereum-cryptography/secp256k1'
import { UNCOMPRESSED } from './constants'

describe('uncompressedPublicKeyToAddress', () => {
  it('Creates the correct address for a given private key', () => {
    expect(uncompressedPublicKeyToAddress(publicKeyConvert(testIdentity.publicKey, UNCOMPRESSED))).toBe(
      '0xb908de4c389e7a8eeb4b7367587d2784bb7e1e47'
    )
  })
})
