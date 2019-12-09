import { Address } from './Address'

/**
 * One can easily create a Private Key.
 *
 * As a user, this is what identifies you. You can create any number of private keys you want, but if you
 * lose this data, you'll lose your identity, and you won't be able to show proof of who you say you are.
 */
export type CryptographicIdentity = {
  privateKey: Buffer
} & PublicCryptographicIdentity

export type PublicCryptographicIdentity = {
  publicKey: Buffer
  address: Address
}
