import {
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'

export type Props = {
  authorization: Authorization
  authorizations: Authorization[]
  pendingTransactions: Transaction[]
  isLoading?: boolean
  onGrant: typeof grantTokenRequest
  onRevoke: typeof revokeTokenRequest
}
