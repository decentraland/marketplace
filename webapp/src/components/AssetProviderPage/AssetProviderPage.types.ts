import { ResultType } from '../../modules/asset/types'
import { Order } from '../../modules/order/types'
import { Asset } from '../../modules/routing/types'

export type Props<T extends ResultType = ResultType> = {
  type: T
  isConnecting: boolean
  children: (asset: Asset<T>, order: Order | null) => React.ReactNode | null
}

export type MapStateProps = Pick<Props, 'isConnecting'>
export type OwnProps<T extends ResultType = ResultType> = Pick<
  Props<T>,
  'type' | 'children'
>
