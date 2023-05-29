import { connect } from 'react-redux'
import {
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_APPLICATION_FEATURES_REQUEST } from 'decentraland-dapps/dist/modules/features/actions'
import { RootState } from '../../../modules/reducer'
import { isLoadingFeatureFlags as getLoadingFeatureFlags } from '../../../modules/features/selectors'
import {
  buyItemRequest,
  buyItemWithCardRequest,
  BUY_ITEM_REQUEST,
  clearItemErrors
} from '../../../modules/item/actions'
import { getLoading as getItemsLoading } from '../../../modules/item/selectors'
import { getContract } from '../../../modules/contract/selectors'
import { getIsBuyWithCardPage } from '../../../modules/routing/selectors'
import { Contract } from '../../../modules/vendor/services'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './MintItemModal.types'
import MintItemModal from './MintItemModal'

const mapState = (state: RootState): MapStateProps => ({
  isLoading:
    isLoadingType(
      getLoadingAuthorizations(state),
      FETCH_AUTHORIZATIONS_REQUEST
    ) ||
    isLoadingType(getItemsLoading(state), BUY_ITEM_REQUEST) ||
    isLoadingType(
      getLoadingFeatureFlags(state),
      FETCH_APPLICATION_FEATURES_REQUEST
    ),
  isBuyWithCardPage: getIsBuyWithCardPage(state),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBuyItem: item => dispatch(buyItemRequest(item)),
  onBuyItemWithCard: item => dispatch(buyItemWithCardRequest(item)),
  onClearItemErrors: () => dispatch(clearItemErrors())
})
export default connect(mapState, mapDispatch)(MintItemModal)
