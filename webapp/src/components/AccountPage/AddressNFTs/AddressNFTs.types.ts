import { SearchOptions } from '../../../modules/routing/search'

export type Props = {
  address: string
  onNavigate: (options?: SearchOptions) => void
}
