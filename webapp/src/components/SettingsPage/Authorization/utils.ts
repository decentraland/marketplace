import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'

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
