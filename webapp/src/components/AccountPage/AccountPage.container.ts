import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RouteComponentProps } from 'react-router'

import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import {
  Params,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './AccountPage.types'
import AccountPage from './AccountPage'

const mapState = (
  state: RootState,
  ownProps: RouteComponentProps<Params>
): MapStateProps => {
  const { address } = ownProps.match.params

  return {
    address: address?.toLowerCase(),
    wallet: getWallet(state),
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(AccountPage)
