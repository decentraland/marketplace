import { Store } from '@dcl/schemas'
import { ReactNode } from 'react'

export type Props = {
  address: string
  isLoading: boolean
  store?: Store
  children: (args: Pick<Props, 'store' | 'isLoading'>) => ReactNode
  onFetchStore: () => void
}

export type MapStateProps = Pick<Props, 'isLoading' | 'store'>
export type MapDispatchProps = Pick<Props, 'onFetchStore'>
export type OwnProps = Pick<Props, 'address'>
