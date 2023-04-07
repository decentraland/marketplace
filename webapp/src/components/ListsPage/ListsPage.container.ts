import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  OwnProps
} from './ListsPage.types'
import AccountPage from './ListsPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { listId } = ownProps.match.params

  return {
    wallet: getWallet(state),
    isConnecting: isConnecting(state),
    listId
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(AccountPage)
