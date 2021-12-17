import { Store } from '../../../modules/store/types'

export type Props = {
  address: string
  store?: Store
  onBack: () => void
}

export type MapStateProps = Pick<Props, 'store'>
export type MapDispatchProps = Pick<Props, 'onBack'>
