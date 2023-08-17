import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsSmartWearablesFTUEnabled } from '../../../../modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { SmartWearablesLaunchModal } from './SmartWearablesLaunchModal'
import { MapStateProps } from './SmartWearablesLaunchModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isSmartWearablesFTUEnabled: getIsSmartWearablesFTUEnabled(state)
  }
}

export default connect(mapState)(SmartWearablesLaunchModal)
