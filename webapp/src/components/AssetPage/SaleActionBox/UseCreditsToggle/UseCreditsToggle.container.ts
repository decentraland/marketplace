import { connect } from 'react-redux'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { isOwnedBy } from '../../../../modules/asset/utils'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import UseCreditsToggle from './UseCreditsToggle'
import { MapStateProps, OwnProps } from './UseCreditsToggle.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  const address = wallet?.address || ''

  return {
    credits: getCredits(state, address),
    isOwner: wallet ? isOwnedBy(ownProps.asset, wallet) : false
  }
}

export default connect(mapState)(UseCreditsToggle)
