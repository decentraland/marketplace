import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import {
  MapStateProps
} from './EmoteAttributesFilter.types'
import { EmoteAttributesFilter } from './EmoteAttributesFilter'
import { getIsEmotesV2Enabled } from '../../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => ({
  isEmotesV2Enabled: getIsEmotesV2Enabled(state)
})

export default connect(mapState)(EmoteAttributesFilter)
