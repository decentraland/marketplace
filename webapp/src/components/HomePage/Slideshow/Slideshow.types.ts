import { Asset } from '../../../modules/routing/types'

export type Props = {
  title: string
  assets: Asset[]
  isSubHeader?: boolean
  isLoading: boolean
  onViewAll: () => void
}
