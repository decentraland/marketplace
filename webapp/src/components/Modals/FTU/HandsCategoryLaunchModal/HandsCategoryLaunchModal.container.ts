import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getIsHandsCategoryEnabled } from '../../../../modules/features/selectors'
import { MapStateProps } from './HandsCategoryLaunchModal.types'
import { HandsCategoryLaunchModal } from './HandsCategoryLaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isHandsCategoryEnabled: getIsHandsCategoryEnabled(state)
  }
}

export default connect(mapState, {})(HandsCategoryLaunchModal)
