import { Dispatch, bindActionCreators } from 'redux'
import { Network } from '@dcl/schemas'
import type { Route } from 'decentraland-transactions/crossChain'
import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib'
import type { RootState } from '../../../../modules/reducer'
import { getContract } from '../../../../modules/contract/selectors'
import { getLoading } from '../../../../modules/ens/selectors'
import type { Contract } from '../../../../modules/vendor/services'
import {
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_REQUEST,
  claimNameCrossChainRequest,
  claimNameRequest
} from '../../../../modules/ens/actions'
import type {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './MintNameWithCryptoModal.types'
import { MintNameWithCryptoModal } from './MintNameWithCryptoModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isClaimingName: isLoadingType(getLoading(state), CLAIM_NAME_REQUEST),
    isClaimingNameCrossChain: isLoadingType(
      getLoading(state),
      CLAIM_NAME_CROSS_CHAIN_REQUEST
    ),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onClaimName: claimNameRequest,
      onClaimNameCrossChain: (route: Route) =>
        claimNameCrossChainRequest(
          ownProps.metadata.name,
          getChainIdByNetwork(Network.ETHEREUM),
          route
        )
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(MintNameWithCryptoModal)
