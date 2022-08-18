import { RentalListing, RentalListingCreation } from '@dcl/schemas'
import { config } from '../../../../config'
import signedFetch from 'decentraland-crypto-fetch'
import { AuthIdentity } from '@dcl/crypto'

export const SIGNATURES_SERVER_URL = config.get('SIGNATURES_SERVER_URL')!

class RentalsAPI {
  createRentalListing = async (
    listing: RentalListingCreation,
    identity: AuthIdentity
  ): Promise<RentalListing> => {
    const url = SIGNATURES_SERVER_URL + `/rentals-listings`
    const response = await signedFetch(url, {
      method: 'POST',
      identity,
      body: JSON.stringify(listing),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    try {
      const json = await response.json()
      if (json.ok) {
        return json.data
      } else {
        throw new Error(json.message)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export const rentalsAPI = new RentalsAPI()
