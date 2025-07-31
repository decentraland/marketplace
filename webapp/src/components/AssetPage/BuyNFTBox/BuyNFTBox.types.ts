import { Bid } from '@dcl/schemas'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../modules/asset/types'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  address?: string
  wallet: Wallet | null
  bids: Bid[]
  onFetchBids: (asset: Asset) => void
  credits: CreditsResponse | null
}

export type OwnProps = Pick<Props, 'nft'>
export type MapStateProps = Pick<Props, 'address' | 'wallet' | 'bids' | 'credits'>
export type MapDispatchProps = Pick<Props, 'onFetchBids'>
