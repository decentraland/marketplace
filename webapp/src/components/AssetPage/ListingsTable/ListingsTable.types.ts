import { Dispatch } from 'react'
import { CallHistoryMethodAction } from 'connected-react-router'
import { OrderSortBy } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  sortBy?: OrderSortBy
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
