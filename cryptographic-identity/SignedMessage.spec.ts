import { isValidMessage, createSignedMessage } from './SignedMessage'
import { testIdentity } from './TestIdentities.spec'

const signed = createSignedMessage(testIdentity, 'Message')
describe('validateSignedMessage', () => {
  it('returns false if what was sent is not a SignedMessage', () => {
    expect(isValidMessage(true)).toBe(false)
  })

  it('returns false if provided an invalid hash', () => {
    const fakeSign = { ...signed, hash: signed.hash + '0' }
    expect(isValidMessage(fakeSign)).toBe(false)
  })

  it('returns false if provided an invalid signature', () => {
    const fakeSign = { ...signed, signature: signed.signature + '0' }
    expect(isValidMessage(fakeSign)).toBe(false)
  })
})