import { createFetchComponent } from '@well-known-components/fetch-component'
import { LambdasClient, createLambdasClient } from 'dcl-catalyst-client/dist/client/LambdasClient'
import { Profile } from '@dcl/schemas'
import { peerUrl } from './environment'

class ProfilesCache {
  cache: Record<string, Promise<Profile[]>>
  client: LambdasClient

  constructor() {
    this.cache = {}
    this.client = createLambdasClient({ url: `${peerUrl}/lambdas`, fetcher: createFetchComponent() })
  }

  public async fetchProfile(address: string[]) {
    const addressesString = address.sort().join(',')
    if (addressesString in this.cache) {
      return this.cache[addressesString]
    }

    this.cache[addressesString] = this.client.getAvatarsDetailsByPost({ ids: address }) as any

    return this.cache[addressesString]
  }
}

export default new ProfilesCache()
