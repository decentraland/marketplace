import { connect } from 'react-redux'
import { getCurrentIdentity } from '../../modules/identity/selectors'
import { RootState } from '../../modules/reducer'
import Navbar from './Navbar'
import { MapStateProps } from './Navbar.types'

const mapState = (state: RootState): MapStateProps => ({
  identity: getCurrentIdentity(state) || undefined
})

export default connect(mapState)(Navbar)
