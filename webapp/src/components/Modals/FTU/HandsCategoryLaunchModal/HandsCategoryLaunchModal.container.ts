import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getIsHandsCategoryFTUEnabled } from '../../../../modules/features/selectors'
import { MapStateProps } from './HandsCategoryLaunchModal.types'
import { HandsCategoryLaunchModal } from './HandsCategoryLaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isHandsCategoryFTUEnabled: getIsHandsCategoryFTUEnabled(state)
  }
}

export default connect(mapState, {})(HandsCategoryLaunchModal)
