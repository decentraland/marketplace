import { connect } from 'react-redux'
import { push, replace } from 'connected-react-router'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../../modules/reducer'
import { locations } from '../../../modules/routing/locations'
import { BrowseOptions } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { getWallet } from '../../../modules/wallet/selectors'
import ClaimNamePage from './ClaimNamePage'
import { MapDispatch, MapDispatchProps, MapStateProps } from './ClaimNamePage.types'

const mapState = (state: RootState): MapStateProps => ({
  isConnecting: isConnecting(state),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options?: BrowseOptions) => dispatch(push(locations.names({ ...options, section: Section.ENS }))),
  onClaim: (name: string) => dispatch(openModal('ClaimNameFatFingerModal', { name })),
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(ClaimNamePage)
