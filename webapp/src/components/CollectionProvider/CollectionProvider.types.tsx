import { ReactNode } from 'react'
import { Collection, Item } from '@dcl/schemas'

export type Props = {
  contractAddress: string
  withItems?: boolean
  collection?: Collection
  items?: Item[]
  isLoadingCollection: boolean
  isLoadingCollectionItems: boolean
  onFetchCollection: () => void
  onFetchCollectionItems: (collection: Collection) => void
  error: string | null
  children: (data: Pick<Props, 'collection' | 'items'> & { isLoading: boolean }) => ReactNode
}

export type MapStateProps = Pick<Props, 'collection' | 'items' | 'isLoadingCollection' | 'isLoadingCollectionItems' | 'error'>
export type MapDispatchProps = Pick<Props, 'onFetchCollection' | 'onFetchCollectionItems'>
export type OwnProps = Pick<Props, 'contractAddress' | 'withItems'>
