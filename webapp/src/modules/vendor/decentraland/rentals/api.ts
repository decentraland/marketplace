import { RentalListing, RentalListingCreation, RentalsListingsFilterBy } from '@dcl/schemas'
import { BaseAPI } from 'decentraland-dapps/dist/lib/api'
import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { config } from '../../../../config'
import { objectToURLSearchParams } from './utils'

export const SIGNATURES_SERVER_URL = config.get('SIGNATURES_SERVER_URL')
type ValueOf<T> = T[keyof T]

const isPrimitive = (value: any): value is string | number | boolean => {
  return value !== undefined && value !== null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
}

type RentalsListingResponse<T> = { ok: boolean; message?: string; data: T }

class RentalsAPI extends BaseAPI {
  createRentalListing = async (listing: RentalListingCreation, identity: AuthIdentity): Promise<RentalListing> => {
    const url = SIGNATURES_SERVER_URL + `/rentals-listings`
    const response = await signedFetch(url, {
      method: 'POST',
      identity,
      body: JSON.stringify(listing),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = (await response.json()) as RentalsListingResponse<RentalListing>
    if (json.ok) {
      return json.data
    } else {
      throw new Error(json.message)
    }
  }

  refreshRentalListing = async (rentalListingId: string) => {
    const url = SIGNATURES_SERVER_URL + `/rentals-listings/${rentalListingId}`
    const response = await signedFetch(url, {
      method: 'PATCH'
    })

    if (!response.ok) {
      throw new Error('The signature server responded without a 2XX status code.')
    }

    const json = (await response.json()) as RentalsListingResponse<RentalListing>
    if (json.ok) {
      return json.data
    } else {
      throw new Error(json.message)
    }
  }

  getRentalListings = async (
    params: RentalsListingsFilterBy & { page: number; limit: number }
  ): Promise<{
    results: RentalListing[]
    total: number
  }> => {
    const UrlSearchParams = URLSearchParams ?? window.URLSearchParams
    const urlSearchParams = new UrlSearchParams()
    ;(Object.keys(params) as Array<keyof typeof params>).forEach(parameterName => {
      const parameter = params[parameterName]
      if (Array.isArray(parameter)) {
        ;(parameter as ValueOf<typeof params>[]).filter(isPrimitive).forEach(parameterValue => {
          urlSearchParams.append(parameterName, parameterValue.toString())
        })
      } else if (isPrimitive(parameter)) {
        urlSearchParams.append(parameterName, parameter.toString())
      }
    })
    const url = SIGNATURES_SERVER_URL + `/rentals-listings?` + urlSearchParams.toString()
    const response = await signedFetch(url)

    if (!response.ok) {
      throw new Error('The signature server responded without a 2XX status code.')
    }

    const json = (await response.json()) as RentalsListingResponse<{
      results: RentalListing[]
      total: number
    }>
    if (json.ok) {
      return json.data
    } else {
      throw new Error(json.message)
    }
  }

  getRentalListingsPrices = async (filters: Omit<RentalsListingsFilterBy, 'periods'>): Promise<Record<string, number>> => {
    const queryParams = objectToURLSearchParams(filters)
    try {
      const response: Record<string, number> = await this.request('get', `/rental-listings/prices?${queryParams.toString()}`)
      return response
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }
}

export const rentalsAPI = new RentalsAPI(SIGNATURES_SERVER_URL)
