import { stableStringify } from 'dcl/stableStringify'
import {
  chainSignatureError,
  createAddressCertificateLink,
  validateChainedSignature
} from './ChainedCertificatedMessage'
import { CHAINED_ADDRESS } from './constants'
import { createNewIdentity } from './createNewIdentity'
import { createSignedMessage } from './SignedMessage'
import { secondTestIdentity, testIdentity } from './TestIdentities.spec'

const thirdTestIdentity = createNewIdentity()
const link = createAddressCertificateLink(testIdentity, secondTestIdentity)
const signedByChild = createSignedMessage(secondTestIdentity, 'Message by second identity')
const link2 = createAddressCertificateLink(secondTestIdentity, thirdTestIdentity)
const signedByThirdChild = createSignedMessage(thirdTestIdentity, 'Sent by third key')

describe('ChainedCertificate', () => {
  it('can be created from two identities', () => {
    expect(typeof link.hash).toBe('string')
  })

  it('creates valid link signatures', () => {
    expect(validateChainedSignature(testIdentity.address, [link, signedByChild])).toBe(true)
  })

  it('validates correctly through a chain of signatures', () => {
    expect(validateChainedSignature(testIdentity.address, [link, link2, signedByThirdChild])).toBe(true)
  })

  it(`doesn't work if a message has an invalid signature`, () => {
    const fakeLink = { ...link, hash: '' }
    expect(chainSignatureError(testIdentity.address, [fakeLink, link2, signedByChild])).toContain(
      'Invalid signature for message: '
    )
  })

  it(`doesn't work if address doesn't match the signature chain`, () => {
    expect(chainSignatureError(testIdentity.address, [link, link2, signedByChild])).toContain(
      'Signing address mismatch: Expected signature from'
    )
  })

  it(`doesn't work if it's not in the correct order`, () => {
    expect(chainSignatureError(testIdentity.address, [link2, link, signedByThirdChild])).toContain(
      'Signing address mismatch: Expected signature from'
    )
  })

  it(`doesn't work if the link is not parseable`, () => {
    const fakeLink = createSignedMessage(testIdentity, 'Cant{}ParseMe')
    expect(chainSignatureError(testIdentity.address, [fakeLink, signedByChild])).toContain('Could not parse JSON from ')
  })

  it(`doesn't work if the link is not an object`, () => {
    const fakeLink = createSignedMessage(testIdentity, `"You can parse this string"`)
    expect(chainSignatureError(testIdentity.address, [fakeLink, signedByChild])).toContain('Parsed message')
  })

  it(`doesn't work if the chain type is not CHAINED_ADDRESS`, () => {
    const fakeLink = createSignedMessage(
      testIdentity,
      stableStringify({
        type: 'Not Chained Address',
        childAddress: secondTestIdentity.address
      })
    )
    expect(chainSignatureError(testIdentity.address, [fakeLink, signedByChild])).toContain(
      `Type of certificate link Not Chained Address is not recognized (expected CHAINED_ADDRESS=${CHAINED_ADDRESS})`
    )
  })

  it(`doesn't work if the chain has an invalid address`, () => {
    const fakeLink = createSignedMessage(
      testIdentity,
      stableStringify({
        type: CHAINED_ADDRESS,
        childAddress: 'Invalid address'
      })
    )
    expect(chainSignatureError(testIdentity.address, [fakeLink, signedByChild])).toContain(`Invalid chained address: `)
  })
})
