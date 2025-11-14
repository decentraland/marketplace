import { Order, RentalListing } from '@dcl/schemas'
import { Asset, AssetType } from '../../modules/asset/types'

export type Props<T extends AssetType = AssetType> = {
  type: T
  isConnecting: boolean
  isSocialEmotesEnabled: boolean
  fullWidth?: boolean
  withEntity?: boolean
  children: (asset: Asset<T>, order: Order | null, rental: RentalListing | null, isSocialEmotesEnabled: boolean) => React.ReactNode | null
}

export type MapStateProps = Pick<Props, 'isConnecting' | 'isSocialEmotesEnabled'>
export type OwnProps<T extends AssetType = AssetType> = Pick<Props<T>, 'type' | 'children' | 'fullWidth' | 'withEntity'>
