import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getData as getAuthorizations,
  isLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Authorization, AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { Contract } from '../modules/vendor/services'

export function isAuthorized(authorization: Authorization, authorizations: Authorization[]) {
  return authorizations.some(
    a =>
      a.address.toLocaleLowerCase() === authorization.address.toLowerCase() &&
      a.authorizedAddress.toLowerCase() === authorization.authorizedAddress.toLowerCase() &&
      a.contractAddress.toLowerCase() === authorization.contractAddress.toLowerCase() &&
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

export const useAuthorization = (authorization: Authorization | null, onFetchAuthorizations: typeof fetchAuthorizationsRequest) => {
  const authorizations = useSelector(getAuthorizations)
  const isLoadingAuthorizations = useSelector(getLoadingAuthorizations)
  const hasFetchedAuthorizations = useRef(false)

  useEffect(() => {
    // Authorization fetch has to be done only once using this hook
    if (hasFetchedAuthorizations.current || !authorization) {
      return
    }

    // Allowance authorizations have an allowance amount that determines how much the target can spend in behalf of the user.
    // These need to be re-fetched every time because the user might have executed a transaction that consumed from this allowance, changing its value.
    // For other kind of authorizations, if it is already authorized, we don't need to re-fetch it.
    if (authorization.type !== AuthorizationType.ALLOWANCE && isAuthorized(authorization, authorizations)) {
      return
    }

    hasFetchedAuthorizations.current = true
    onFetchAuthorizations([authorization])
  }, [authorization, authorizations, onFetchAuthorizations])

  return [isLoadingAuthorizations, authorization ? isAuthorized(authorization, authorizations) : false]
}
