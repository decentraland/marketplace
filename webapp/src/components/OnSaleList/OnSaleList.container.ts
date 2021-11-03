import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading as getItemsLoading } from '../../modules/item/selectors'
import { getLoading as getNFTsLoading } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './OnSaleList.types'

import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { FETCH_NFTS_REQUEST, setSearch } from '../../modules/nft/actions'
import {
  getOnSaleElements,
  getOnSaleProcessedElements,
  getSearch
} from '../../modules/ui/browse/selectors'
import { handleOnSaleElement } from '../../modules/ui/browse/utils'
import { Props as OnSaleListItemProps } from './OnSaleListItem/OnSaleListItem.types'

const mapState = (state: RootState): MapStateProps => {
  const isLoading =
    isLoadingType(getItemsLoading(state), FETCH_ITEMS_REQUEST) ||
    isLoadingType(getNFTsLoading(state), FETCH_NFTS_REQUEST)

  return {
    items: isLoading
      ? []
      : getOnSaleProcessedElements(state).map(element =>
          handleOnSaleElement<OnSaleListItemProps>(
            element,
            item => ({ item }),
            ([nft, order]) => ({ nft, order })
          )
        ),
    isLoading,
    search: getSearch(state),
    count: getOnSaleElements(state).length
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => {
  return {
    onSearch: val => dispatch(setSearch(val))
  }
}

export default connect(mapState, mapDispatch)(OnSaleList)
