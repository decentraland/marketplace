import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'

export type WithAuthorizedActionProps = {
  onAuthorizedAction: (
    authorization: Authorization,
    requiredAllowanceInWei: string,
    onAuthorized: () => void
  ) => void
}

export type MapStateProps = { authorizations: Authorization[] }
