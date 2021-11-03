import { Item } from '@dcl/schemas'
import { NFT } from '../../nft/types'
import { Order } from '../../order/types'
import { VendorName } from '../../vendor'

export type OnSaleNFT = [NFT<VendorName.DECENTRALAND>, Order]

export type OnSaleElement = Item | OnSaleNFT
