import { Collection, Item } from '@dcl/schemas'
import { RouteChildrenProps } from 'react-router'

export type Props = {
  collection?: Collection
  items: Item[]
  isLoading: boolean
  onFetchCollections: () => void
  onBack: () => void
} & RouteChildrenProps

export type MapStateProps = Pick<Props, 'collection' | 'items' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchCollections' | 'onBack'>
