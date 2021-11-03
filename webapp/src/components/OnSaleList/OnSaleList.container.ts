import { connect } from 'react-redux'
import { getLoading as getItemsLoading } from '../../modules/item/selectors'
import { getLoading as getNFTsLoading } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import { MapStateProps } from './OnSaleList.types'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getOnSaleElements } from '../../modules/ui/browse/selectors'

const mapState = (state: RootState): MapStateProps => {
  const isLoading =
    isLoadingType(getItemsLoading(state), FETCH_ITEMS_REQUEST) ||
    isLoadingType(getNFTsLoading(state), FETCH_NFTS_REQUEST)

  return {
    items: isLoading ? [] : getOnSaleElements(state),
    isLoading
  }
}

export default connect(mapState)(OnSaleList)
