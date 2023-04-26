import { Dispatch } from 'redux'
import {
  FetchAuthorizationsRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../../modules/vendor/services'
import { ContractName } from 'decentraland-transactions'

type AuthorizeBaseOptions = {
  /** callback to run when authorization process is completed */
  onAuthorized: () => void
  /** address that we want to authorize */
  authorizedAddress: string
  /** contract the should be called to check authorization and authorize */
  targetContract: Contract
  /** name of the target contract */
  targetContractName: ContractName
}

type ApprovalOptions = AuthorizeBaseOptions & {
  authorizationType: AuthorizationType.APPROVAL,
  tokenId: string
}

type AllowanceOptions = AuthorizeBaseOptions & {
  authorizationType: AuthorizationType.ALLOWANCE,
  requiredAllowanceInWei: string
}

export type AuthorizeActionOptions = ApprovalOptions | AllowanceOptions


export type WithAuthorizedActionProps = {
  onAuthorizedAction: (options: AuthorizeActionOptions) => void
  isLoadingAuthorization: boolean
}

export type MapStateProps = { wallet: Wallet | null }
export type MapDispatch = Dispatch<FetchAuthorizationsRequestAction>


