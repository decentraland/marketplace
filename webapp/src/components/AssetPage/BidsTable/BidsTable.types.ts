import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
}

export type MapStateProps = {}
export type MapDispatchProps = {}
