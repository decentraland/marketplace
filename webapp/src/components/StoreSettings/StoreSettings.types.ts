import { Store } from '../../modules/store/types'

export type Props = {
  address?: string
  store: Store
  canSubmit: boolean
  onChange: (store: Store) => void
  onRevert: () => void
  onSave: () => void
}

export type MapStateProps = Pick<Props, 'store' | 'canSubmit' | 'address'>
export type MapDispatchProps = Pick<Props, 'onChange' | 'onRevert' | 'onSave'>
