import { Account, AccountFilters } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { NFT_SERVER_URL } from '../nft'
import { retryParams } from '../utils'
import { AccountResponse } from './types'

class AccountAPI extends BaseAPI {
  fetch = async (filters: AccountFilters = {}): Promise<AccountResponse> => {
    const queryParams = this.buildAccountsQueryString(filters)
    return this.request('get', `/accounts?${queryParams}`) as Promise<AccountResponse>
  }

  fetchOne = async (address: string): Promise<Account> => {
    const { data }: AccountResponse = await this.request('get', '/collections', {
      address
    })

    if (data.length === 0) {
      throw new Error('Not found')
    }

    return data[0]
  }

  private buildAccountsQueryString(filters: AccountFilters): string {
    const queryParams = new URLSearchParams()

    if (filters.first) {
      queryParams.append('first', filters.first.toString())
    }

    if (filters.skip) {
      queryParams.append('skip', filters.skip.toString())
    }

    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy)
    }

    if (filters.id) {
      queryParams.set('id', filters.id)
    }

    if (filters.address) {
      filters.address.forEach(address => queryParams.append('address', address))
    }

    if (filters.network) {
      queryParams.append('network', filters.network)
    }

    return queryParams.toString()
  }
}

export const accountAPI = new AccountAPI(NFT_SERVER_URL, retryParams)
