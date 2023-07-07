import { connect } from 'react-redux'
import { RootState } from '../../../../../modules/reducer'
import { getIsHandsCategoryEnabled } from '../../../../../modules/features/selectors'
import { MapStateProps } from './NFTSectionsMenuItems.types'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'

const mapState = (state: RootState): MapStateProps => {
  return {
    isHandsCategoryEnabled: getIsHandsCategoryEnabled(state)
  }
}
export default connect(mapState)(NFTSectionsMenuItems)
