import { Item } from '@dcl/schemas'
import { CatalogItem } from '../catalog/types'
import { NFT } from '../nft/types'

export enum AssetType {
  ITEM = 'item',
  NFT = 'nft',
  CATALOG_ITEM = 'catalog_item'
}

export type Asset<T extends AssetType = AssetType> = T extends AssetType.NFT
  ? NFT
  : T extends AssetType.ITEM
  ? Item
  : T extends AssetType.CATALOG_ITEM
  ? CatalogItem
  : NFT | Item
