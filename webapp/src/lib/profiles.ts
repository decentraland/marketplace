import { Profile } from '@dcl/schemas'
import { CatalystClient } from 'dcl-catalyst-client'
import { peerUrl } from './environment'

class ProfilesCache {
  cache: Record<string, Promise<Profile[]>>
  client: CatalystClient
  constructor() {
    this.cache = {}
    this.client = new CatalystClient({ catalystUrl: peerUrl })
  }

  public async fetchProfile(address: string[]) {
    const addressesString = address.sort().join(',')
    if (addressesString in this.cache) {
      return this.cache[addressesString]
    }
    this.cache[addressesString] = this.client.fetchProfiles(address)
    return this.cache[addressesString]
  }
}

export default new ProfilesCache()
