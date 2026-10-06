import { BaseClient } from 'decentraland-dapps/dist/lib/BaseClient'
import { API_SIGNER } from '../../../../lib/api'
import { CancelledTradesFilters, CancelledTradesResponse } from './types'

export class CancelledTradesAPI extends BaseClient {
  async fetchCancelledTrades(filters: CancelledTradesFilters = {}): Promise<CancelledTradesResponse> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString())
    })
    const query = params.toString()

    return this.fetch<CancelledTradesResponse>(`/v1/cancelled-trades${query ? `?${query}` : ''}`, {
      method: 'GET',
      metadata: { signer: API_SIGNER }
    })
  }
}
