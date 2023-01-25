import { connect } from 'react-redux'
import { Item } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading as getItemsLoading } from '../../modules/item/selectors'
import { getLoading as getNFTsLoading } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleOrRentList'
import {
  MapStateProps,
  OnSaleOrRentType,
  OwnProps
} from './OnSaleOrRentList.types'

import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import {
  getOnRentNFTsByLessor,
  getOnRentNFTsByTenant,
  getOnSaleElements,
  getView
} from '../../modules/ui/browse/selectors'
import { OnRentNFT, OnSaleNFT } from '../../modules/ui/browse/types'
import { getWallet } from '../../modules/wallet/selectors'
import { View } from '../../modules/ui/types'
import { OnSaleElement } from '../../modules/ui/browse/types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const isLoading =
    isLoadingType(getItemsLoading(state), FETCH_ITEMS_REQUEST) ||
    isLoadingType(getNFTsLoading(state), FETCH_NFTS_REQUEST)
  const address = getWallet(state)?.address

  const showRents = ownProps.onSaleOrRentType === OnSaleOrRentType.RENT
  const view = getView(state)
  let elements: Array<OnRentNFT | OnSaleElement>
  if (showRents && view === View.ACCOUNT && address) {
    elements = getOnRentNFTsByTenant(state, address)
  } else if (showRents && view === View.CURRENT_ACCOUNT && address) {
    elements = getOnRentNFTsByLessor(state, address)
  } else {
    elements = getOnSaleElements(state)
  }

  return {
    elements: isLoading
      ? []
      : elements.map(element => {
          if (Array.isArray(element)) {
            const [nft, rentOrOrder] = element as OnSaleNFT
            return {
              nft,
              ...(showRents ? { rental: rentOrOrder } : { order: rentOrOrder })
            }
          } else {
            const item = element as Item
            return { item }
          }
        }),
    isLoading
  }
}

export default connect(mapState)(OnSaleList)
