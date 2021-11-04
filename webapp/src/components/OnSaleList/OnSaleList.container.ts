import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading as getItemsLoading } from '../../modules/item/selectors'
import { getLoading as getNFTsLoading } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import { MapStateProps } from './OnSaleList.types'

import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getOnSaleElements } from '../../modules/ui/browse/selectors'
import { OnSaleNFT } from '../../modules/ui/browse/types'
import { Item } from '@dcl/schemas'

const mapState = (state: RootState): MapStateProps => {
  const isLoading =
    isLoadingType(getItemsLoading(state), FETCH_ITEMS_REQUEST) ||
    isLoadingType(getNFTsLoading(state), FETCH_NFTS_REQUEST)

  return {
    elements: isLoading
      ? []
      : getOnSaleElements(state).map(element => {
          if (Array.isArray(element)) {
            const [nft, order] = element as OnSaleNFT
            return { nft, order }
          } else {
            const item = element as Item
            return { item }
          }
        }),
    isLoading
  }
}

export default connect(mapState)(OnSaleList)
