import { ReactNode } from 'react'
import { RentalListing } from '@dcl/schemas'
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
}
