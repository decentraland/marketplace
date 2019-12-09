import { keccak256 } from 'ethereum-cryptography/keccak'

export function uncompressedPublicKeyToAddress(uncompressedPublicKey: Buffer) {
  return (
    '0x' +
    keccak256(uncompressedPublicKey.subarray(1))
      .subarray(12)
      .toString('hex')
  )
}
