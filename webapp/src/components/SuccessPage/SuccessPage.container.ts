import { connect } from 'react-redux'
import { getSearch } from 'connected-react-router'
import { Dispatch } from 'redux'
import { ChainId } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getProfileOfAddress } from 'decentraland-dapps/dist/modules/profile/selectors'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { SuccessPage } from './SuccessPage'
import { getTokenIdFromLogs } from './utils'
import { MapDispatchProps, MapStateProps } from './SuccessPage.types'

const mapState = (state: RootState): MapStateProps => {
  const search = new URLSearchParams(getSearch(state))
  const transaction = getTransaction(state, search.get('txHash') || '')
  const address = getAddress(state)
  const isLoadingTx = Boolean(transaction && transaction.status !== TransactionStatus.CONFIRMED)
  return {
    isLoading: isLoadingTx,
    mintedTokenId: getTokenIdFromLogs(ChainId.MATIC_MUMBAI, transaction?.receipt?.logs),
    profile: address ? getProfileOfAddress(state, address) : undefined
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onSetNameAsAlias: (name: string) => dispatch(openModal('SetNameAsAliasModal', { name }))
})

export default connect(mapState, mapDispatch)(SuccessPage)
