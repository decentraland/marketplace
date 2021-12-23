import { ReactNode } from 'react'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset
  assetImage: ReactNode
  isOnSale: boolean
  badges: ReactNode
  left: ReactNode
  box: ReactNode
  below?: ReactNode
  className?: string
}
