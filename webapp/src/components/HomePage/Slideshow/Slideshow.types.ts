import { Asset } from '../../../modules/asset/types'

export type Props = {
  title: string
  assets: Asset[]
  isSubHeader?: boolean
  isLoading: boolean
  onViewAll: () => void
}
