import { Avatar, Profile } from '@dcl/schemas'
import ProfilesCache from './profiles'

describe('when getting profiles from the cache', () => {
  let mockFetchProfile: jest.SpyInstance<Promise<Profile[]>>
  let anAddress: string
  let anotherAddress: string
  let avatarName: string
  let anotherAvatarName: string
  let profiles: Profile[]

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
    profiles = [
      {
        avatars: [{ name: avatarName, ethAddress: anAddress } as Avatar]
      },
      {
        avatars: [{ name: anotherAvatarName, ethAddress: anotherAddress } as Avatar]
      }
    ]
    //@ts-ignore
    mockFetchProfile = jest.spyOn(ProfilesCache.client, 'getAvatarsDetailsByPost').mockResolvedValueOnce(profiles)
  })

  describe('and the request is not in the cache', () => {
    it('should start the request and return the promise', async () => {
      expect(await ProfilesCache.fetchProfile([anAddress, anotherAddress])).toBe(profiles)
      expect(mockFetchProfile).toHaveBeenCalledWith({ ids: [anAddress, anotherAddress] })
    })
  })

  describe('and the request is in the cache', () => {
    beforeEach(() => {
      ProfilesCache.cache[[anAddress, anotherAddress].join(',')] = Promise.resolve(profiles)
    })
    it('should return the ongoing request and to not have called the fetchProfiles endpoint', async () => {
      expect(await ProfilesCache.fetchProfile([anAddress, anotherAddress])).toBe(profiles)
      expect(mockFetchProfile).not.toHaveBeenCalled()
    })
  })
})
