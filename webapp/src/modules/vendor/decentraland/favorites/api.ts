import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'
import { retryParams } from '../utils'

export const DEFAULT_FAVORITES_LIST_ID = config.get(
  'DEFAULT_FAVORITES_LIST_ID'
)!
export const MARKETPLACE_FAVORITES_SERVER_URL = config.get(
  'MARKETPLACE_FAVORITES_SERVER_URL'
)!

class FavoritesAPI extends BaseAPI {
  async pickItemAsFavorite(
    itemId: string,
    identity: AuthIdentity
  ): Promise<void> {
    const url =
      MARKETPLACE_FAVORITES_SERVER_URL +
      `/lists/${DEFAULT_FAVORITES_LIST_ID}/picks`

    const response = await signedFetch(url, {
      method: 'POST',
      identity,
      body: JSON.stringify({ itemId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(
        'The marketplace favorites server responded with a non-2XX status code.'
      )
    }
  }

  async unpickItemAsFavorite(
    itemId: string,
    identity: AuthIdentity
  ): Promise<void> {
    const url =
      MARKETPLACE_FAVORITES_SERVER_URL +
      `/lists/${DEFAULT_FAVORITES_LIST_ID}/picks/${itemId}`

    const response = await signedFetch(url, {
      method: 'DELETE',
      identity
    })

    if (!response.ok) {
      throw new Error(
        'The marketplace favorites server responded with a non-2XX status code.'
      )
    }
  }
}

export const favoritesAPI = new FavoritesAPI(
  MARKETPLACE_FAVORITES_SERVER_URL,
  retryParams
)
