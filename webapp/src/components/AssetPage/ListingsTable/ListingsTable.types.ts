import { OrderSortBy } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  sortBy?: OrderSortBy
  nftToRemove?: string
}

export type MapStateProps = {}
export type MapDispatchProps = {}
