import { Entity } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export class PeerAPI extends BaseAPI {
  async fetchItemByUrn(urn: string) {
    const item: Entity[] = await this.request('post', '/content/entities/active', { pointers: [urn] })
    return item && item.length ? item[0] : null
  }
}

export const peerAPI = new PeerAPI(config.get('PEER_URL'), retryParams)
