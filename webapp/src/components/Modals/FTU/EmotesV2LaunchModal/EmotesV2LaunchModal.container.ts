import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getIsEmotesV2FTUEnabled } from '../../../../modules/features/selectors'
import { MapStateProps } from './EmotesV2LaunchModal.types'
import { EmotesV2LaunchModal } from './EmotesV2LaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isEmotesV2FTUEnabled: getIsEmotesV2FTUEnabled(state)
  }
}

export default connect(mapState, {})(EmotesV2LaunchModal)
