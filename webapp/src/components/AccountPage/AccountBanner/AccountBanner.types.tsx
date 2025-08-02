import { Store } from '../../../modules/store/types'

export type Props = {
  address: string
  store?: Store
  isLoading: boolean
  onBack: () => void
  onFetchStore: (address: string) => void
}
