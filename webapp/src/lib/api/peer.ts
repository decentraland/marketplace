import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { Profile } from '../../modules/profile/types'

export const PEER_URL = process.env.REACT_APP_PEER_URL!

export class PeerAPI extends BaseAPI {
  cache: Record<string, Promise<Profile>> = {}

  fetchProfile = async (address: string) => {
    if (address in this.cache) {
      return this.cache[address]
    }
    const promise = fetch(
      `${this.url}/lambdas/profile/${address.toLowerCase()}`
    ).then(res => res.json()) as Promise<Profile>
    this.cache[address] = promise
    return promise
  }
}

export const content = new PeerAPI(PEER_URL)
