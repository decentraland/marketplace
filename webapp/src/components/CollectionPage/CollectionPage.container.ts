import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getContractAddress } from '../../modules/collection/selectors'
import { RootState } from '../../modules/reducer'
import { goBack } from '../../modules/routing/actions'
import { getAddress } from '../../modules/wallet/selectors'
import CollectionPage from './CollectionPage'
import { MapDispatchProps, MapStateProps } from './CollectionPage.types'

const mapState = (state: RootState): MapStateProps => ({
  contractAddress: getContractAddress(state),
  currentAddress: getAddress(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack())
})

export default connect(mapState, mapDispatch)(CollectionPage)
