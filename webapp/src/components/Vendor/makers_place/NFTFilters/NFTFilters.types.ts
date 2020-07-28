import { Section, SortBy } from '../../../../modules/routing/types'
import { browse } from '../../../../modules/routing/actions'

export type Props = {
  count?: number
  section: Section
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'count' | 'section' | 'sortBy' | 'search' | 'onlyOnSale'
>
export type OwnProps = Pick<Props, 'onBrowse'>
