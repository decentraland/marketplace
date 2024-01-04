import { connect } from 'react-redux'
import { push, replace } from 'connected-react-router'
import { Network } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import {
  getMana,
  getWallet,
  isConnecting
} from '../../../modules/wallet/selectors'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { BrowseOptions } from '../../../modules/routing/types'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './ClaimNamePage.types'
import { RootState } from '../../../modules/reducer'
import ClaimNamePage from './ClaimNamePage'

const mapState = (state: RootState): MapStateProps => ({
  currentMana: getMana(state, Network.ETHEREUM),
  isConnecting: isConnecting(state),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options?: BrowseOptions) =>
    dispatch(push(locations.names({ ...options, section: Section.ENS }))),
  onClaim: (name: string) =>
    dispatch(openModal('ClaimNameFatFingerModal', { name })),
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(ClaimNamePage)
