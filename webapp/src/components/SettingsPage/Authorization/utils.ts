import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'

export function isAuthorized(
  authorization: Authorization,
  authorizations: Authorization[]
) {
  return authorizations.some(
    a =>
      a.address === authorization.address &&
      a.authorizedAddress === authorization.authorizedAddress &&
      a.tokenAddress === authorization.tokenAddress &&
      a.chainId === authorization.chainId &&
      a.type === authorization.type
  )
}
