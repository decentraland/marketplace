import { Dispatch } from 'redux'
import { Order, RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { WithAuthorizedActionProps } from '../../HOC/withAuthorizedAction'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  authorizations: Authorization[]
  rental: RentalListing | null
  order: Order | null
  userHasAlreadyBidsOnNft: boolean
  currentMana: number | undefined
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onRent: (selectedPeriodIndex: number) => void
} & WithAuthorizedActionProps

export type OwnProps = Pick<Props, 'nft' | 'rental' | 'order'>
export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'userHasAlreadyBidsOnNft'
  | 'getContract'
  | 'currentMana'
>
export type MapDispatchProps = Pick<Props, 'onRent'>
export type MapDispatch = Dispatch<OpenModalAction>
