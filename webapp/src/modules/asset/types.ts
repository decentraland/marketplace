import { Item } from '@dcl/schemas'
import { NFT } from '../nft/types'

export enum AssetType {
  ITEM = 'item',
  NFT = 'nft'
}

export type Asset<T extends AssetType = AssetType> = T extends AssetType.NFT
  ? NFT
  : T extends AssetType.ITEM
  ? Item
  : NFT | Item
