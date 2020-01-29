import { Dispatch } from 'redux'
import { NFT } from '../../../modules/nft/types'
import { Proximity } from '../../../modules/proximity/types'

export type Props = {
  nft: NFT
  proximity: Record<string, Proximity>
}

export type MapStateProps = Pick<Props, 'proximity'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
