import { RentalListing } from '@dcl/schemas'
import { ReactNode } from 'react'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  rental?: RentalListing
  assetImage: ReactNode
  isOnSale: boolean
  badges: ReactNode
  left: ReactNode
  box: ReactNode
  below?: ReactNode
  className?: string
  actions?: ReactNode
  showDetails?: boolean
  isFavoritesEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isFavoritesEnabled'>
