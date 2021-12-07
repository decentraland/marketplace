import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../modules/routing/actions'
import CollectionPage from './CollectionPage'
import { MapDispatchProps } from './CollectionPage.types'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack())
})

export default connect(null, mapDispatch)(CollectionPage)
