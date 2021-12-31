import { Store } from '../../modules/store/types'

export type Props = {
  address: string
  store: Store
  error: string | null
  canSubmit: boolean
  isLoading: boolean
  isSaving: boolean
  onChange: (store: Store) => void
  onRevert: (address: string) => void
  onSave: (store: Store) => void
  onFetchStore: (address: string) => void
}

export type MapStateProps = Pick<
  Props,
  'store' | 'canSubmit' | 'address' | 'isLoading' | 'isSaving' | 'error'
>
export type MapDispatchProps = Pick<
  Props,
  'onChange' | 'onRevert' | 'onSave' | 'onFetchStore'
>
