import { Dispatch } from 'redux'
import { Bid, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  wallet: Wallet | null
  order: Order | null
  bids: Bid[]
  authorizations: Authorization[]
  userHasAlreadyBidsOnNft: boolean
  currentMana: number | undefined
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onBuyWithMana: () => void
  onBuyWithCard: () => void
  onBid: () => void
}

export type OwnProps = Pick<Props, 'asset'>
export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'order'
  | 'bids'
  | 'authorizations'
  | 'userHasAlreadyBidsOnNft'
  | 'getContract'
  | 'currentMana'
>
export type MapDispatchProps = Pick<
  Props,
  'onBuyWithMana' | 'onBuyWithCard' | 'onBid'
>
export type MapDispatch = Dispatch<OpenModalAction>
