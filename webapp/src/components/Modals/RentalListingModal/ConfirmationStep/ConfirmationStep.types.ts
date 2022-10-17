import { Dispatch } from 'redux'
import { NFT } from '../../../../modules/nft/types'
import {
  upsertRentalRequest,
  UpsertRentalRequestAction
} from '../../../../modules/rental/actions'
import { PeriodOption } from '../../../../modules/rental/types'

export type Props = {
  nft: NFT
  pricePerDay: number
  periods: PeriodOption[]
  expiresAt: number
  isSigning: boolean
  onCancel: () => void
  onCreate: typeof upsertRentalRequest
  error: string | null
}

export type MapStateProps = Pick<Props, 'isSigning' | 'error'>
export type MapDispatchProps = Pick<Props, 'onCreate'>
export type MapDispatch = Dispatch<UpsertRentalRequestAction>
export type OwnProps = Pick<Props, 'nft' | 'onCancel'>
