import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { Network } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { closeModal, openModal } from 'decentraland-dapps/dist/modules/modal'
import type { Route } from 'decentraland-transactions/crossChain'
import { getContract } from '../../../../modules/contract/selectors'
import {
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_REQUEST,
  claimNameCrossChainRequest,
  claimNameRequest
} from '../../../../modules/ens/actions'
import { getLoading } from '../../../../modules/ens/selectors'
import type { RootState } from '../../../../modules/reducer'
import type { Contract } from '../../../../modules/vendor/services'
import { MintNameWithCryptoModal } from './MintNameWithCryptoModal'
import type { MapDispatchProps, MapStateProps, OwnProps } from './MintNameWithCryptoModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isMintingName: isLoadingType(getLoading(state), CLAIM_NAME_REQUEST),
    isMintingNameCrossChain: isLoadingType(getLoading(state), CLAIM_NAME_CROSS_CHAIN_REQUEST),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps =>
  bindActionCreators(
    {
      onCloseFatFingerModal: () => closeModal('ClaimNameFatFingerModal'),
      onOpenFatFingerModal: () => openModal('ClaimNameFatFingerModal', { name: ownProps.metadata.name }),
      onClaimName: claimNameRequest,
      onClaimNameCrossChain: (route: Route) =>
        claimNameCrossChainRequest(ownProps.metadata.name, getChainIdByNetwork(Network.ETHEREUM), route)
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNameWithCryptoModal)
