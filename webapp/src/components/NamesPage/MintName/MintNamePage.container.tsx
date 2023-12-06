import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Network } from '@dcl/schemas'
import { getMana } from '../../../modules/wallet/selectors'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './MintNamePage.types'
import { RootState } from '../../../modules/reducer'
import MintNamePage from './MintNamePage'

const mapState = (state: RootState): MapStateProps => ({
  currentMana: getMana(state, Network.ETHEREUM)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: () => dispatch(push(locations.names({ section: Section.ENS })))
})

export default connect(mapState, mapDispatch)(MintNamePage)
