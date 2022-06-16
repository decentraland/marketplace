import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../modules/routing/actions'
import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import { getContractAddress } from '../../modules/collection/selectors'
import { MapDispatchProps, MapStateProps } from './CollectionPage.types'
import CollectionPage from './CollectionPage'

const mapState = (state: RootState): MapStateProps => ({
  contractAddress: getContractAddress(state),
  currentAddress: getAddress(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack())
})

export default connect(mapState, mapDispatch)(CollectionPage)
