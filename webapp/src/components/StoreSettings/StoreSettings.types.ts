import { Store } from '../../modules/store/types'

export type Props = {
  store: Store
  onChange: (store: Store) => void
}

export type MapStateProps = Pick<Props, 'store'>
export type MapDispatchProps = Pick<Props, 'onChange'>
