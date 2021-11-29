import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { locations } from '../../modules/routing/locations'
import CollectionPage from './CollectionPage'
import { MapDispatchProps } from './CollectionPage.types'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(push(locations.defaultCurrentAccount()))
})

export default connect(null, mapDispatch)(CollectionPage)
