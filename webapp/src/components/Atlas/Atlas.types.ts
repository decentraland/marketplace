import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { AtlasTile, AtlasProps } from 'decentraland-ui'
import { NFT } from '../../modules/nft/types'

export type Tile = AtlasTile & {
  estate_id?: string
  price?: number
  owner?: string
  name?: string
}

export type Props = Partial<AtlasProps> & {
  nfts: NFT[]
  tiles: Record<string, AtlasTile>
  tilesByEstateId: Record<string, Tile[]>
  selection?: { x: number | string; y: number | string }[]
  isEstate?: boolean
  withPopup?: boolean
  withNavigation?: boolean
  showOnSale?: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'tiles' | 'nfts' | 'tilesByEstateId'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
