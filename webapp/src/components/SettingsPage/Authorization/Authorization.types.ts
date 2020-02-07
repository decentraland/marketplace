import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import {
  allowTokenRequest,
  approveTokenRequest
} from '../../../modules/authorization/actions'

export type Props = {
  checked: boolean
  contractAddress: string
  tokenContractAddress: string
  pendingTransactions: Transaction[]
  onChange: typeof allowTokenRequest | typeof approveTokenRequest
}
