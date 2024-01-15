import { connect } from 'react-redux'
import { push, replace } from 'connected-react-router'
import { ChainId, Network } from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { BrowseOptions } from '../../../modules/routing/types'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import { claimNameTransactionSubmitted } from '../../../modules/ens/actions'
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
  wallet: getWallet(state),
  identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: (options?: BrowseOptions) =>
    dispatch(push(locations.names({ ...options, section: Section.ENS }))),
  onClaim: (name: string) =>
    dispatch(openModal('ClaimNameFatFingerModal', { name })),
  onClaimTxSubmitted: (
    subdomain: string,
    address: string,
    chainId: ChainId,
    txHash: string
  ) =>
    dispatch(
      claimNameTransactionSubmitted(subdomain, address, chainId, txHash)
    ),
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(ClaimNamePage)
