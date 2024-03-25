import { Dispatch } from 'redux'
import { Order, RentalListing } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  rental: RentalListing | null
  order: Order | null
  userHasAlreadyBidsOnNft: boolean
  currentMana: number | undefined
  isCrossChainLandEnabled: boolean
  onRent: (selectedPeriodIndex: number) => void
  onBuyWithCrypto: () => void
}

export type OwnProps = Pick<Props, 'nft' | 'rental' | 'order'>
export type MapStateProps = Pick<Props, 'wallet' | 'userHasAlreadyBidsOnNft' | 'currentMana' | 'isCrossChainLandEnabled'>
export type MapDispatchProps = Pick<Props, 'onRent' | 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<OpenModalAction>
