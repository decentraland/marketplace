import { connect } from 'react-redux'
import { isOwnedBy } from '../../../../modules/asset/utils'
import { getCredits } from '../../../../modules/credits/selectors'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import UseCreditsToggle from './UseCreditsToggle'
import { MapStateProps, MapDispatchProps, OwnProps } from './UseCreditsToggle.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const wallet = getWallet(state)
  const address = wallet?.address || ''

  return {
    credits: getCredits(state, address),
    isOwner: wallet ? isOwnedBy(ownProps.asset, wallet) : false
  }
}

const mapDispatch = (_dispatch: any, ownProps: OwnProps): MapDispatchProps => ({
  onUseCredits: ownProps.onUseCredits
})

export default connect(mapState, mapDispatch)(UseCreditsToggle)
