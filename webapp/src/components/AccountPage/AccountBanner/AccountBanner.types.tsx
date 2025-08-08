import { fetchStoreRequest } from '../../../modules/store/actions'
import { Store } from '../../../modules/store/types'

export type Props = {
  address: string
  store?: Store
  isLoading: boolean
  onBack: () => void
  onFetchStore: ActionFunction<typeof fetchStoreRequest>
}

export type ContainerProps = Pick<Props, 'address'>
