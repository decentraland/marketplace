import { SaleFilters } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { SaleResponse } from './types'

class SaleAPI extends BaseAPI {
  fetch = async (filters: SaleFilters = {}): Promise<SaleResponse> => {
    const queryParams = this.buildSalesQueryString(filters)
    return this.request('get', `/sales?${queryParams}`)
  }

  private buildSalesQueryString(filters: SaleFilters): string {
    const queryParams = new URLSearchParams()

    const entries = Object.entries(filters)

    console.log(entries)

    for (let [key, value] of entries) {
      console.log(key, value)
      queryParams.append(key, value.toString())
    }

    return queryParams.toString()
  }
}

export const collectionAPI = new SaleAPI(NFT_SERVER_URL)
