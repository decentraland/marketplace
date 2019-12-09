import { isAddress } from './Address'
import { createNewIdentity } from './createNewIdentity'

describe('Identity', () => {
  it('can be created randomly', () => {
    const identity = createNewIdentity()
    expect(isAddress(identity.address)).toBe(true)
    expect(Buffer.isBuffer(identity.publicKey)).toBe(true)
    expect(Buffer.isBuffer(identity.privateKey)).toBe(true)
  })
})
