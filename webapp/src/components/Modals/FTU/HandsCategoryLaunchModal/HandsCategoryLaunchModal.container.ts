import { connect } from 'react-redux'
import { MapStateProps } from './HandsCategoryLaunchModa.types'
import { HandsCategoryLaunchModal } from './HandsCategoryLaunchModal'
import { RootState } from '../../../../modules/reducer'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsHandsCategoryEnabled } from '../../../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isHandsCategoryEnabled: getIsHandsCategoryEnabled(state)
  }
}

export default connect(mapState, {})(HandsCategoryLaunchModal)
