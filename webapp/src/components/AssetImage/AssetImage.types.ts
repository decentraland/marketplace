import { Dispatch } from 'redux'
import { Avatar } from 'decentraland-ui'
import { Item } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'

export type Props = {
  asset: NFT | Item
  className?: string
  isDraggable?: boolean
  withNavigation?: boolean
  hasPopup?: boolean
  zoom?: number
  isSmall?: boolean
  showMonospace?: boolean
  avatar?: Avatar
}

export type MapStateProps = Pick<Props, 'avatar'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
