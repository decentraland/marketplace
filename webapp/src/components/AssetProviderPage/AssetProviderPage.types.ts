import { Asset, AssetType } from '../../modules/asset/types'
import { Order } from '../../modules/order/types'

export type Props<T extends AssetType = AssetType> = {
  type: T
  isConnecting: boolean
  children: (asset: Asset<T>, order: Order | null) => React.ReactNode | null
}

export type MapStateProps = Pick<Props, 'isConnecting'>
export type OwnProps<T extends AssetType = AssetType> = Pick<
  Props<T>,
  'type' | 'children'
>
