import { ComponentProps, ReactNode } from 'react'
import { Asset } from '../../../modules/asset/types'
import { AssetImage } from '../../AssetImage'

export type Props = {
  asset: Asset
  assetImageProps: Omit<ComponentProps<typeof AssetImage>, 'asset'>
  isOnSale: boolean
  badges: ReactNode
  left: ReactNode
  box: ReactNode
  below?: ReactNode
}
