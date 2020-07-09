import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getOnlyOnSale } from '../../modules/routing/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './NFTBrowse.types'
import NFTBrowse from './NFTBrowse'

const mapState = (state: RootState): MapStateProps => ({
  onlyOnSale: getOnlyOnSale(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(NFTBrowse)
