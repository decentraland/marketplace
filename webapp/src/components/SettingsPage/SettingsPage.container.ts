import { connect } from 'react-redux'

import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './SettingsPage.types'
import SettingsPage from './SettingsPage'
import { RootState } from '../../modules/reducer'

const mapState = (_: RootState): MapStateProps => ({})

const mapDispatch = (_: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(SettingsPage)
