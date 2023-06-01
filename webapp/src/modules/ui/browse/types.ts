import { CatalogFilters, Item, Order, RentalListing } from '@dcl/schemas'
import { NFT } from '../../nft/types'
import { VendorName } from '../../vendor'
import { View } from '../types'

export type OnSaleNFT = [NFT<VendorName.DECENTRALAND>, Order]
export type OnRentNFT = [NFT<VendorName.DECENTRALAND>, RentalListing]

export type OnSaleElement = Item | OnSaleNFT

export type CatalogBrowseOptions = {
  view?: View
  page?: number
  filters?: CatalogFilters
}
