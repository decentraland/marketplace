import { NFT, RentalListing } from '@dcl/schemas'
import { BigNumber } from 'ethers'
import { Asset } from '../asset/types'

export function getOpenRentalId(asset: Asset | null): string | null {
  return (asset as NFT).openRentalId ?? null
}

export function getMaxPriceOfPeriods(rental: RentalListing): string {
  return rental.periods.reduce(
    (maxPeriodPrice, period) =>
      BigNumber.from(maxPeriodPrice).gte(period.pricePerDay)
        ? maxPeriodPrice
        : period.pricePerDay,
    '0'
  )
}
