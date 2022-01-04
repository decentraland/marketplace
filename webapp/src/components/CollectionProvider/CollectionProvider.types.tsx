import { Collection, Item } from '@dcl/schemas'
import { ReactNode } from 'react'

export type Props = {
  contractAddress: string
  withItems?: boolean
  collection?: Collection
  items?: Item[]
  isLoading: boolean
  onFetchCollection: () => void
  children: (
    data: Pick<Props, 'collection' | 'items' | 'isLoading'>
  ) => ReactNode
}

export type MapStateProps = Pick<Props, 'collection' | 'items' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchCollection'>
export type OwnProps = Pick<Props, 'contractAddress' | 'withItems'>
