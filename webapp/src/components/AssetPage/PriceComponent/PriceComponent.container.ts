import { connect } from 'react-redux'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import PriceComponent from './PriceComponent'
import { MapStateProps } from './PriceComponent.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  const address = wallet?.address || ''

  return {
    credits: getCredits(state, address)
  }
}

export default connect(mapState)(PriceComponent)
