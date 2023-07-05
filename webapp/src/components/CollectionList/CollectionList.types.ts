import { Collection } from '@dcl/schemas'
import { Dispatch } from 'redux'
import {
  fetchCollectionsRequest,
  FetchCollectionsRequestAction
} from '../../modules/collection/actions'

export type Props = {
  collections: Collection[]
  creator: string
  count: number
  isLoading: boolean
  onFetchCollections: typeof fetchCollectionsRequest
}

export type MapStateProps = Pick<Props, 'collections' | 'count' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchCollections'>
export type MapDispatch = Dispatch<FetchCollectionsRequestAction>
export type OwnProps = Pick<Props, 'creator'>
