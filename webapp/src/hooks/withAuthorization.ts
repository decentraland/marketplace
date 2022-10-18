import { Network } from '@dcl/schemas'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { getContract } from '../modules/contract/utils'
import { getContractNames } from '../modules/vendor'
import { Contract } from '../modules/vendor/services'

export const withMANAAuthorization = (
  address: string,
  authorizedAddress: string,
  network: Network,
  authorizationType = AuthorizationType.ALLOWANCE
) => {
  const contractNames = getContractNames()
  const mana = getContract({
    name: contractNames.MANA,
    network
  })
  const authorization = withContractAuthorization(
    address,
    authorizedAddress,
    { ...mana, name: ContractName.MANAToken },
    authorizationType
  )
  return authorization
}

export const withContractAuthorization = (
  address: string,
  authorizedAddress: string,
  contract: Contract,
  authorizationType = AuthorizationType.ALLOWANCE
) => {
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
