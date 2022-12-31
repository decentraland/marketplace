import { Dispatch } from 'redux'
import { NFT } from '../../../../modules/nft/types'
import {
  clearRentalErrors,
  ClearRentalErrorsAction,
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
  onClearRentalErros: typeof clearRentalErrors
  error: string | null
}

export type MapStateProps = Pick<Props, 'isSigning' | 'error'>
export type MapDispatchProps = Pick<Props, 'onCreate' | 'onClearRentalErros'>
export type MapDispatch = Dispatch<
  UpsertRentalRequestAction | ClearRentalErrorsAction
>
export type OwnProps = Pick<Props, 'nft' | 'onCancel'>
