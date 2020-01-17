import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RouteComponentProps } from 'react-router'

import {
  Params,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './AccountPage.types'
import AccountPage from './AccountPage'
import { getUISection } from '../../modules/ui/selectors'
import { RootState } from '../../modules/reducer'

const mapState = (
  state: RootState,
  ownProps: RouteComponentProps<Params>
): MapStateProps => {
  const { address } = ownProps.match.params
  return { address, section: getUISection(state) }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(
  mapState,
  mapDispatch
)(AccountPage)
