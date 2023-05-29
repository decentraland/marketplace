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
  onBack: (location?: string) => void
}

export type MapDispatchProps = Pick<Props, 'onBack'>
