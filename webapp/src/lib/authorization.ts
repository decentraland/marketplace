import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import {
  getData as getAuthorizations,
  isLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { ContractName } from 'decentraland-transactions'

import { Contract } from '../modules/vendor/services'

export function isAuthorized(
  authorization: Authorization,
  authorizations: Authorization[]
) {
  return authorizations.some(
    a =>
      a.address.toLocaleLowerCase() === authorization.address.toLowerCase() &&
      a.authorizedAddress.toLowerCase() ===
        authorization.authorizedAddress.toLowerCase() &&
      a.contractAddress.toLowerCase() ===
        authorization.contractAddress.toLowerCase() &&
      a.chainId === authorization.chainId &&
      a.type === authorization.type
  )
}

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

export const useAuthorization = (
  authorization: Authorization,
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
) => {
  const authorizations = useSelector(getAuthorizations)
  const isLoadingAuthorizations = useSelector(getLoadingAuthorizations)
  const hasFetchedAuthorizations = useRef(false)

  useEffect(() => {
    if (
      !isAuthorized(authorization, authorizations) &&
      !hasFetchedAuthorizations.current
    ) {
      hasFetchedAuthorizations.current = true
      onFetchAuthorizations([authorization])
    }
  }, [authorization, authorizations, onFetchAuthorizations])

  return [isLoadingAuthorizations, isAuthorized(authorization, authorizations)]
}
