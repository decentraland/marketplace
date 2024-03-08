import { RentalListing } from '@dcl/schemas'
import { Dispatch } from 'redux'
import { NFT } from '../../../../modules/nft/types'
import {
  upsertRentalRequest,
  UpsertRentalRequestAction,
  removeRentalRequest,
  RemoveRentalRequestAction
} from '../../../../modules/rental/actions'
import { PeriodOption } from '../../../../modules/rental/types'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  pricePerDay: number
  periods: PeriodOption[]
  expiresAt: number
  isSigning: boolean
  isRemoveTransactionBeingConfirmed: boolean
  isSubmittingRemoveTransaction: boolean
  onCancel: () => void
  onEdit: typeof upsertRentalRequest
  onRemove: typeof removeRentalRequest
  error: string | null
}

export type MapStateProps = Pick<Props, 'isSigning' | 'error' | 'isRemoveTransactionBeingConfirmed' | 'isSubmittingRemoveTransaction'>
export type MapDispatchProps = Pick<Props, 'onEdit' | 'onRemove'>
export type MapDispatch = Dispatch<UpsertRentalRequestAction | RemoveRentalRequestAction>
export type OwnProps = Pick<Props, 'nft' | 'rental' | 'onCancel'>
