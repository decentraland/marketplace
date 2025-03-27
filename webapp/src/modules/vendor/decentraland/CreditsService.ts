import { CreditsClient } from 'decentraland-dapps/dist/modules/credits/CreditsClient'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { config } from '../../../config'
import { CreditsService as CreditsServiceInterface } from '../services'
export class CreditsService implements CreditsServiceInterface {
  private creditsClient: CreditsClient

  constructor() {
    this.creditsClient = new CreditsClient(config.get('CREDITS_SERVER_URL'))
  }

  /**
   * Fetches the credits for a user
   * @param address - The user's address
   * @returns The credits for the user
   */
  async fetchCredits(address: string): Promise<CreditsResponse> {
    return this.creditsClient.fetchCredits(address)
  }
}
