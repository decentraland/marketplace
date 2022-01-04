import { Item, Order } from '@dcl/schemas'
import { NFT } from '../../nft/types'
import { VendorName } from '../../vendor'

export type OnSaleNFT = [NFT<VendorName.DECENTRALAND>, Order]

export type OnSaleElement = Item | OnSaleNFT
