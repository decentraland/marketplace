import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  fetchCollectionsRequest,
  FETCH_COLLECTIONS_REQUEST
} from '../../modules/collection/actions'
import {
  getLoading,
  getCollectionsByAddress
} from '../../modules/collection/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import {
  getItemsByContractAddress,
  getLoading as getLoadingItems
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
  items: getItemsByContractAddress(state)[ownProps.contractAddress],
  isLoading:
    isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST) ||
    (!!ownProps.withItems &&
      isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST))
})

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onFetchCollections: () =>
    dispatch(
      fetchCollectionsRequest(
        {
          first: 1,
          contractAddress: ownProps.contractAddress
        },
        ownProps.withItems
      )
    )
})

export default connect(mapState, mapDispatch)(CollectionProvider)
