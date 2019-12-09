import { safeGetMessage } from './safeGetMessage'
import { createSignedMessage } from './SignedMessage'
import { secondTestIdentity, testIdentity } from './TestIdentities.spec'

describe('safeGetMessage', () => {
  const signed = createSignedMessage(testIdentity, 'Message')
  it('returns undefined if the message is invalid', () => {
    const fakeSigned = { ...signed, hash: '' }
    expect(safeGetMessage(testIdentity.address, [fakeSigned])).toBeUndefined()
  })
  it('returns undefined if the address is invalid', () => {
    expect(safeGetMessage(secondTestIdentity.address, [signed])).toBeUndefined()
  })
  it('returns the message if the signature is correct', () => {
    expect(safeGetMessage(testIdentity.address, [signed])).toBe('Message')
  })
})
