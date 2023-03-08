import { Avatar, Profile } from '@dcl/schemas'
import { profileToCreatorAccount } from './utils'
import { Creator } from './CreatorsFilter'

describe('profileToCreatorAccount', () => {
  let profiles: Profile[]
  let names: string[]
  let addresses: string[]
  let creatorAccounts: Creator[]
  beforeEach(() => {
    names = ['aName', 'anotherName']
    addresses = ['anAddress', 'anotherAddress']
    profiles = [
      { avatars: [{ name: names[0], ethAddress: addresses[0] } as Avatar] },
      { avatars: [{ name: names[1], ethAddress: addresses[1] } as Avatar] }
    ]
    creatorAccounts = [
      { name: names[0], address: addresses[0] },
      { name: names[1], address: addresses[1] }
    ]
  })
  it('should get the name and address out of the profile', () => {
    expect(profileToCreatorAccount(profiles)).toStrictEqual(creatorAccounts)
  })
})
