import { OrderSortBy } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  sortBy?: OrderSortBy
  isOffchainPublicNFTOrdersEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isOffchainPublicNFTOrdersEnabled'>
