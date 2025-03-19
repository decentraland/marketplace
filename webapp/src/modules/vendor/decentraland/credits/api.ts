import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import { config } from '../../../../config'
import { CreditsResponse } from '../../../credits/types'
import { retryParams } from '../utils'

class CreditsAPI extends BaseAPI {
  /**
   * Fetches the credits for a user
   * @param address - The user's address
   * @returns The credits for the user
   */
  async fetchCredits(address: string): Promise<CreditsResponse> {
    try {
      const response = await this.request('get', `/users/${address}/credits`)
      return response as CreditsResponse
    } catch (error) {
      console.error('Error fetching credits', error)
      return { credits: [], totalCredits: 0 }
    }
  }
}

export const creditsAPI = new CreditsAPI(config.get('CREDITS_SERVER_URL'), retryParams)
