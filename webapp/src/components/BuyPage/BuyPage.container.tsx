import { connect } from 'react-redux'
import { getIsBuyCrossChainEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './BuyPage.types'
import BuyPage from './BuyPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    isBuyCrossChainEnabled: getIsBuyCrossChainEnabled(state)
  }
}

export default connect(mapState)(BuyPage)
