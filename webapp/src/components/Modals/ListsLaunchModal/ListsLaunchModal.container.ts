import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_APPLICATION_FEATURES_REQUEST } from 'decentraland-dapps/dist/modules/features/actions'
import { RootState } from '../../../modules/reducer'
import {
  getIsMarketplaceLaunchPopupEnabled,
  isLoadingFeatureFlags
} from '../../../modules/features/selectors'
import { MapStateProps } from './ListsLaunchModal.types'
import { ListsLaunchModal } from './ListsLaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingType(
      isLoadingFeatureFlags(state),
      FETCH_APPLICATION_FEATURES_REQUEST
    ),
    isListsLaunchPopupEnabled: getIsMarketplaceLaunchPopupEnabled(state)
  }
}

export default connect(mapState, {})(ListsLaunchModal)
