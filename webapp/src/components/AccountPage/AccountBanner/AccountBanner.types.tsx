import { Store } from '../../../modules/store/types'

export type Props = {
  address: string
  store?: Store
}

export type MapStateProps = Pick<Props, 'store'>
