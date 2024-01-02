import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getSearch } from 'connected-react-router'
import { ChainId } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getProfileOfAddress } from 'decentraland-dapps/dist/modules/profile/selectors'
import { RootState } from '../../modules/reducer'
import { getTokenIdFromLogs } from './utils'
import { MapDispatchProps, MapStateProps } from './SuccessPage.types'
import { SuccessPage } from './SuccessPage'

const mapState = (state: RootState): MapStateProps => {
  const search = new URLSearchParams(getSearch(state))
  const transaction = getTransaction(state, search.get('txHash') || '')
  const address = getAddress(state)
  return {
    isLoading: Boolean(
      transaction && transaction.status !== TransactionStatus.CONFIRMED
    ),
    mintedTokenId: getTokenIdFromLogs(
      ChainId.MATIC_MUMBAI,
      transaction?.receipt?.logs
    ),
    profile: !!address ? getProfileOfAddress(state, address) : undefined
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onSetNameAsAlias: (name: string) =>
    dispatch(openModal('SetNameAsAliasModal', { name }))
})

export default connect(mapState, mapDispatch)(SuccessPage)
