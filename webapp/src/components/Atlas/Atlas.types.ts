import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { AtlasTile, AtlasProps } from 'decentraland-ui'
import { OnRentNFT } from '../../modules/ui/browse/types'
import { NFT } from '../../modules/nft/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Tile = AtlasTile & {
  estate_id?: string
  price?: number
  owner?: string
  name?: string
}

export type Props = Partial<AtlasProps> & {
  nfts: NFT[]
  nftsOnRent: OnRentNFT[]
  tiles: Record<string, AtlasTile>
  tilesByEstateId: Record<string, Tile[]>
  selection?: { x: number | string; y: number | string }[]
  isEstate?: boolean
  withPopup?: boolean
  withNavigation?: boolean
  showOnSale?: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'tiles' | 'nfts' | 'nftsOnRent' | 'tilesByEstateId' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
