import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { isConnecting } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTProviderPage.types'
import NFTProviderPage from './NFTProviderPage'

const mapState = (state: RootState): MapStateProps => ({
  isConnecting: isConnecting(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(NFTProviderPage)
