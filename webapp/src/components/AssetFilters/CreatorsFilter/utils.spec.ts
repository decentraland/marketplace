import { Profile } from '@dcl/schemas'
import { CatalystClient } from 'dcl-catalyst-client'
import { getCreatorsByAddress } from './utils'

describe('when getting creators by address', () => {
  let mockFetchProfile: jest.SpyInstance<Promise<Profile[]>>
  let anAddress: string
  let anotherAddress: string
  let avatarName: string
  let anotherAvatarName: string

  afterEach(() => {
    if (mockFetchProfile) {
      mockFetchProfile.mockClear()
    }
  })
  beforeEach(() => {
    anAddress = 'anAddress'
    anotherAddress = 'anotherAddress'
    avatarName = 'anAvatarName'
    anotherAvatarName = 'anotherAvatarName'
    mockFetchProfile = jest
      .spyOn(CatalystClient.prototype, 'fetchProfiles')
      .mockResolvedValueOnce([
        {
          avatars: [{ name: avatarName, ethAddress: anAddress }]
        },
        {
          avatars: [{ name: anotherAvatarName, ethAddress: anotherAddress }]
        }
      ])
  })

  it('should fetch the profile and return a Creator object', async () => {
    expect(await getCreatorsByAddress([anAddress, anotherAddress])).toEqual([
      {
        name: avatarName,
        address: anAddress
      },
      {
        name: anotherAvatarName,
        address: anotherAddress
      }
    ])
  })
})
