import { connect } from 'react-redux'

import { browse } from '../../modules/routing/actions'
import { MapDispatch, MapDispatchProps, MapStateProps } from './NFTBrowse.types'
import NFTBrowse from './NFTBrowse'

const mapState = (): MapStateProps => ({})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTBrowse)
