import { Network } from '@dcl/schemas/dist/dapps/network'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  section: string
  assetType?: AssetType
  minPrice: string
  maxPrice: string
  network?: Network
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
}

export type MapStateProps = Pick<Props, 'section' | 'assetType'>
