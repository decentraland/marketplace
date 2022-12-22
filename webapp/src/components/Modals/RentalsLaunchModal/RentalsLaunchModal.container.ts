import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getIsMarketplaceLaunchPopupEnabled } from '../../../modules/features/selectors'
import { MapStateProps } from './RentalsLaunchModal.types'
import { RentalsLaunchModal } from './RentalsLaunchModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isRentalsLaunchPopupEnabled: getIsMarketplaceLaunchPopupEnabled(state)
  }
}

export default connect(mapState, {})(RentalsLaunchModal)
