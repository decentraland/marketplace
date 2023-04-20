import { Sale } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  sales: Sale[]
  assets: Record<string, Asset>
  count: number
  skip: number
  isLoading: boolean
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<
  Props,
  'sales' | 'assets' | 'count' | 'skip' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
