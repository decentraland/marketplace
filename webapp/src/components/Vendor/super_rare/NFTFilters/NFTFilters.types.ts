import { Section, SortBy } from '../../../../modules/routing/search'

export type Props = {
  section: Section
  sortBy: SortBy
  search: string
  count?: number
  onlyOnSale?: boolean
}

export type MapStateProps = Props
