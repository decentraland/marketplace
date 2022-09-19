import signedFetch from 'decentraland-crypto-fetch'
import { RentalListing, RentalListingCreation } from '@dcl/schemas'
import { AuthIdentity } from '@dcl/crypto'
import { config } from '../../../../config'

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
      throw new Error((error as Error).message)
    }
  }

  refreshRentalListing = async (rentalListingId: string) => {
    const url = SIGNATURES_SERVER_URL + `/rentals-listings/${rentalListingId}`
    const response = await signedFetch(url, {
      method: 'PATCH'
    })

    if (!response.ok) {
      throw new Error(
        'The signature server responded without a 2XX status code.'
      )
    }

    try {
      const json = await response.json()
      if (json.ok) {
        return json.data
      } else {
        throw new Error(json.message)
      }
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }
}

export const rentalsAPI = new RentalsAPI()
