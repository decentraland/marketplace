import { Sale } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  sales: Sale[]
  assets: Record<string, Asset>
}

export type MapStateProps = Pick<Props, 'sales' | 'assets'>
