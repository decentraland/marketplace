import { Item, Order, RentalListing } from '@dcl/schemas'
import { NFT } from '../../nft/types'
import { VendorName } from '../../vendor'

export type OnSaleNFT = [NFT<VendorName.DECENTRALAND>, Order]
export type OnRentNFT = [NFT<VendorName.DECENTRALAND>, RentalListing]

export type OnSaleElement = Item | OnSaleNFT
