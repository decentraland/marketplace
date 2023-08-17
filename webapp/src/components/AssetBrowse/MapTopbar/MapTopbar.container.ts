import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getOnlyOnRent, getOnlyOnSale } from '../../../modules/routing/selectors'
import { BrowseOptions } from '../../../modules/routing/types'
import { MapTopbar } from './MapTopbar'
import { MapStateProps, MapDispatchProps } from './MapTopbar.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    onlyOnRent: getOnlyOnRent(state),
    onlyOnSale: getOnlyOnSale(state)
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBrowse: (options: BrowseOptions) => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(MapTopbar)
