import { connect } from 'react-redux'
import { FETCH_APPLICATION_FEATURES_REQUEST } from 'decentraland-dapps/dist/modules/features/actions'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getIsMarketplaceLaunchPopupEnabled, isLoadingFeatureFlags } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { RentalsLaunchModal } from './RentalsLaunchModal'
import { MapStateProps } from './RentalsLaunchModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingType(isLoadingFeatureFlags(state), FETCH_APPLICATION_FEATURES_REQUEST),
    isRentalsLaunchPopupEnabled: getIsMarketplaceLaunchPopupEnabled(state)
  }
}

export default connect(mapState, {})(RentalsLaunchModal)
