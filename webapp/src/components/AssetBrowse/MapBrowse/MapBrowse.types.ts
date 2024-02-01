import { Dispatch } from 'redux'
import { AtlasTile } from 'decentraland-ui'
import { browse, BrowseAction } from '../../../modules/routing/actions'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  onlyOnSale?: boolean
  onlyOnRent?: boolean
  showOwned?: boolean
  tiles: Record<string, AtlasTile>
  ownedLands: NFT[]
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'onlyOnSale' | 'onlyOnRent' | 'tiles' | 'ownedLands'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>

export type MapDispatch = Dispatch<BrowseAction>
