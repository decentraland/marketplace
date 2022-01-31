import { Dispatch } from 'redux'
import {
  setPriceAndBeneficiaryRequest,
  SetPriceAndBeneficiaryRequestAction
} from '../../modules/item/actions'
import { Item } from '@dcl/schemas'

export type Props = {
  item: Item
  isLoading: boolean
  onSetPriceAndBeneficiary: typeof setPriceAndBeneficiaryRequest
  onClose: () => void
}

export type OwnProps = Pick<Props, 'item'>
export type MapStateProps = Pick<Props, 'item' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onSetPriceAndBeneficiary'>
export type MapDispatch = Dispatch<SetPriceAndBeneficiaryRequestAction>
