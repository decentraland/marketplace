import React from 'react'
import { RentalListing } from '@dcl/schemas'
import { AtlasTile, AtlasProps } from 'decentraland-ui'
import { getContract } from '../../modules/contract/selectors'
import { NFT } from '../../modules/nft/types'
import { OnRentNFT } from '../../modules/ui/browse/types'
import { Contract } from '../../modules/vendor/services'

export type TileRentalListing = Pick<RentalListing, 'expiration' | 'periods'>

export type Tile = AtlasTile & {
  estate_id?: string
  price?: number
  owner?: string
  name?: string
  rentalPricePerDay?: string
}

export type Props = Partial<AtlasProps> & {
  nfts: NFT[]
  nftsOnRent: OnRentNFT[]
  tiles: Record<string, AtlasTile>
  tilesByEstateId: Record<string, Tile[]>
  selection?: { x: number | string; y: number | string }[]
  isEstate?: boolean
  // Highlight exactly the `selection`, without the estate_id expansion below. Set when the selection is
  // the authoritative composition (read from the registry), so a stale tile layer cannot re-add parcels
  // the Estate no longer contains to what the user is reviewing.
  strictSelection?: boolean
  withPopup?: boolean
  withNavigation?: boolean
  showOnSale?: boolean
  showForRent?: boolean
  showOwned?: boolean
  withMapColorsInfo?: boolean
  withZoomControls?: boolean
  lastUpdated?: Date
  lastAtlasModifiedDate: Date | null
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  children?: React.ReactNode
}

export type MapStateProps = Pick<Props, 'tiles' | 'nfts' | 'nftsOnRent' | 'tilesByEstateId' | 'getContract' | 'lastAtlasModifiedDate'>
