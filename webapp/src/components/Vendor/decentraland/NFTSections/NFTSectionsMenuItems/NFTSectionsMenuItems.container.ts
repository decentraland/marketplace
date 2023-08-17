import { connect } from 'react-redux'
import { getIsHandsCategoryEnabled } from '../../../../../modules/features/selectors'
import { RootState } from '../../../../../modules/reducer'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'
import { MapStateProps } from './NFTSectionsMenuItems.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isHandsCategoryEnabled: getIsHandsCategoryEnabled(state)
  }
}
export default connect(mapState)(NFTSectionsMenuItems)
