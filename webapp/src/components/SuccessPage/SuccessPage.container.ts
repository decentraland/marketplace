import { connect } from 'react-redux'
import { getSearch } from 'connected-react-router'
import { ChainId } from '@dcl/schemas'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../../modules/reducer'
import { getTokenIdFromLogs } from './utils'
import {
  MapStateProps,
} from './SuccessPage.types'
import { SuccessPage } from './SuccessPage'

const mapState = (state: RootState): MapStateProps => {
  const search = new URLSearchParams(getSearch(state))
  const transaction = getTransaction(state, search.get('txHash') || '')
  return {
    isLoading: Boolean(
      transaction && transaction.status !== TransactionStatus.CONFIRMED
    ),
    mintedTokenId: getTokenIdFromLogs(ChainId.MATIC_MUMBAI, transaction?.receipt?.logs)
  }
}

export default connect(mapState)(SuccessPage)
