import { Profile } from '@dcl/schemas'
import { LambdasClient, createLambdasClient } from 'dcl-catalyst-client/dist/client/LambdasClient'
import { peerUrl } from './environment'
import { createFetchComponent } from '@well-known-components/fetch-component'

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

    this.cache[addressesString] = this.client.getAvatarsDetailsByPost({ ids: address }).then(profiles => profiles as any) // "as any" so that no need to map types (prior versions returned any)

    return this.cache[addressesString]
  }
}

export default new ProfilesCache()
