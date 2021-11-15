import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { OwnProps, MapStateProps } from './CollectionImage.types'
import CollectionImage from './CollectionImage'
import { getItemsByContractAddress } from '../../modules/item/selectors'
import { RootState } from '../../modules/reducer'
import { getLoading as getLoadingCollection } from '../../modules/collection/selectors'
import { getLoading as getLoadingItem } from '../../modules/item/selectors'
import { FETCH_COLLECTIONS_REQUEST } from '../../modules/collection/actions'
import {
  FETCH_ITEMS_REQUEST,
  FETCH_ITEM_REQUEST
} from '../../modules/item/actions'

const mapState = (
  state: RootState,
  { contractAddress }: OwnProps
): MapStateProps => {
  const items = getItemsByContractAddress(state)[contractAddress] || []
  return {
    items,
    isLoading:
      isLoadingType(getLoadingCollection(state), FETCH_COLLECTIONS_REQUEST) ||
      isLoadingType(getLoadingItem(state), FETCH_ITEMS_REQUEST) ||
      isLoadingType(getLoadingItem(state), FETCH_ITEM_REQUEST)
  }
}

export default connect(mapState)(CollectionImage)
