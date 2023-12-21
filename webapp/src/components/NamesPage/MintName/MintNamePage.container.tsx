import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Network } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { BrowseOptions } from '../../../modules/routing/types'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './MintNamePage.types'
import { RootState } from '../../../modules/reducer'
import MintNamePage from './MintNamePage'

const mapState = (state: RootState): MapStateProps => ({
  currentMana: getMana(state, Network.ETHEREUM),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options?: BrowseOptions) =>
    dispatch(push(locations.names({ ...options, section: Section.ENS }))),
  onClaim: (name: string) =>
    dispatch(openModal('ClaimNameFatFingerModal', { name }))
})

export default connect(mapState, mapDispatch)(MintNamePage)
