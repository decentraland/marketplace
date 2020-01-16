import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import {
  Params,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './AccountPage.types'
import AccountPage from './AccountPage'
import { getMarketSection } from '../../modules/ui/selectors'
import { RootState } from '../../modules/reducer'

const mapState = (
  state: RootState,
  ownProps: RouteComponentProps<Params>
): MapStateProps => {
  const { address } = ownProps.match.params
  return { address, section: getMarketSection(state) }
}

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(
  mapState,
  mapDispatch
)(AccountPage)
