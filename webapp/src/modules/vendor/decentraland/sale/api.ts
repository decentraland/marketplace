import { SaleFilters } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'
import { SaleResponse } from './types'

class SaleAPI extends BaseAPI {
  fetch = async (filters: SaleFilters = {}): Promise<SaleResponse> => {
    const queryParams = this.buildSalesQueryString(filters)
    return this.request('get', `/sales?${queryParams}`)
  }

  private buildSalesQueryString(filters: SaleFilters): string {
    const queryParams = new URLSearchParams()

    const entries = Object.entries(filters)

    for (const [key, value] of entries) {
      // when passing categories as an array, it should be added as a query param multiple times
      if (key === 'categories' && Array.isArray(value)) {
        value.forEach(v => queryParams.append('category', v))
      } else {
        queryParams.append(key, value.toString())
      }
    }

    return queryParams.toString()
  }
}

export const saleAPI = new SaleAPI(NFT_SERVER_URL, retryParams)
