import { CreditsResponse } from '../../credits/types'
import { CreditsService as CreditsServiceInterface } from '../services'
import { creditsAPI } from './credits'

export class CreditsService implements CreditsServiceInterface {
  /**
   * Fetches the credits for a user
   * @param address - The user's address
   * @returns The credits for the user
   */
  async fetchCredits(address: string): Promise<CreditsResponse> {
    return creditsAPI.fetchCredits(address)
  }
}
