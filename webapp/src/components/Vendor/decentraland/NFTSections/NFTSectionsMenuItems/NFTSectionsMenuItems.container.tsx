import { connect } from 'react-redux'

import { getAreEmoteCategoriesEnabled } from '../../../../../modules/features/selectors'
import { RootState } from '../../../../../modules/reducer'
import { MapStateProps } from './NFTSectionsMenuItems.types'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'

const mapState = (state: RootState): MapStateProps => ({
  areEmoteCategoriesEnabled: getAreEmoteCategoriesEnabled(state)
})

export default connect(mapState)(NFTSectionsMenuItems)
