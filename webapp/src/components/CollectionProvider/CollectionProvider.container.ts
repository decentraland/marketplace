import { Collection } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  fetchSingleCollectionRequest,
  FETCH_COLLECTIONS_REQUEST
} from '../../modules/collection/actions'
import {
  getLoading,
  getCollectionsByAddress,
  isFetchingCollection
} from '../../modules/collection/selectors'
import { fetchItemsRequest } from '../../modules/item/actions'
import {
  getItemsByContractAddress,
  isFetchingItemsOfCollection
} from '../../modules/item/selectors'
import { RootState } from '../../modules/reducer'
import CollectionProvider from './CollectionProvider'
import {
  MapStateProps,
  MapDispatchProps,
  OwnProps
} from './CollectionProvider.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  collection: getCollectionsByAddress(state)[ownProps.contractAddress],
  items: getItemsByContractAddress(state)[ownProps.contractAddress] ?? [],
  isLoadingCollection:
    isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST) ||
    isFetchingCollection(state, ownProps.contractAddress),
  isLoadingCollectionItems: isFetchingItemsOfCollection(
    state,
    ownProps.contractAddress
  )
})

const mapDispatch = (
  dispatch: Dispatch,
  { contractAddress }: OwnProps
): MapDispatchProps => ({
  onFetchCollection: () =>
    dispatch(fetchSingleCollectionRequest(contractAddress)),
  onFetchCollectionItems: (collection: Collection) =>
    dispatch(
      fetchItemsRequest({
        filters: {
          first: collection.size,
          contracts: [collection.contractAddress]
        }
      })
    )
})

export default connect(mapState, mapDispatch)(CollectionProvider)
