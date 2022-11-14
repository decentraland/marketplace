import { Asset } from '../../../modules/asset/types'
import { HomepageView } from '../../../modules/ui/asset/homepage/types'
import { Section } from '../../../modules/vendor/routing/types'

export type Props = {
  title: string
  subtitle?: string
  viewAllTitle?: string
  emptyMessage?: string
  assets: Asset[]
  view: HomepageView
  isSubHeader?: boolean
  isLoading: boolean
  hasItemsSection?: boolean
  onViewAll: () => void
  onChangeItemSection?: (view: HomepageView, section: Section) => void
}
