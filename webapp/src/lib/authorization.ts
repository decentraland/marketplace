import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { Contract } from '../modules/vendor/services'

export const getContractAuthorization = (
  address: string,
  authorizedAddress: string | undefined,
  contract: Contract | undefined,
  authorizationType = AuthorizationType.ALLOWANCE
) => {
  if (!contract || !authorizedAddress) {
    return null
  }

  const authorization: Authorization = {
    address,
    authorizedAddress,
    contractAddress: contract.address,
    contractName: contract.name as ContractName,
    chainId: contract.chainId,
    type: authorizationType
  }
  return authorization
}
