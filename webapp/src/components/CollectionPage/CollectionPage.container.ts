import { push } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  fetchCollectionsRequest,
  FETCH_COLLECTIONS_REQUEST
} from '../../modules/collection/actions'
import {
  getLoading as getLoadingCollection,
  getCollectionsByAddress
} from '../../modules/collection/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import {
  getLoading as getLoadingItem,
  getItemsByContractAddress
} from '../../modules/item/selectors'
import { RootState } from '../../modules/reducer'
import { locations } from '../../modules/routing/locations'
import CollectionPage from './CollectionPage'
import { Props, MapDispatchProps, MapStateProps } from './CollectionPage.types'
import { getContractAddressFromProps } from './utils'

const mapState = (state: RootState, ownProps: Props): MapStateProps => {
  const contractAddress = getContractAddressFromProps(ownProps)

  return {
    collection: getCollectionsByAddress(state)[contractAddress],
    items: getItemsByContractAddress(state)[contractAddress] || [],
    isLoading:
      isLoadingType(getLoadingCollection(state), FETCH_COLLECTIONS_REQUEST) ||
      isLoadingType(getLoadingItem(state), FETCH_ITEMS_REQUEST)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: Props
): MapDispatchProps => ({
  onFetchCollections: () =>
    dispatch(
      fetchCollectionsRequest(
        {
          first: 1,
          contractAddress: getContractAddressFromProps(ownProps)
        },
        true
      )
    ),
  onBack: () => dispatch(push(locations.defaultCurrentAccount()))
})

export default connect(mapState, mapDispatch)(CollectionPage)
