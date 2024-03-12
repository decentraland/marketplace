import { Dispatch } from 'redux'
import { NFT } from '../../../modules/nft/types'
import { Proximity } from '../../../modules/proximity/types'

export type Props = {
  nft: NFT
  proximities: Record<string, Proximity>
}

export type MapStateProps = Pick<Props, 'proximities'>
export type MapDispatch = Dispatch
