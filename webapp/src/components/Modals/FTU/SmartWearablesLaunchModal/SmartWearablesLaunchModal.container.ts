import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getIsHandsCategoryFTUEnabled } from '../../../../modules/features/selectors'
import { MapStateProps } from './SmartWearablesLaunchModal.types'
import { SmartWearablesLaunchModal } from './SmartWearablesLaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isSmartWearablesFTUEnabled: getIsHandsCategoryFTUEnabled(state)
  }
}

export default connect(mapState)(SmartWearablesLaunchModal)
