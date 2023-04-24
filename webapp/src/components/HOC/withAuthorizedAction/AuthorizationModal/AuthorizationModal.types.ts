import { Authorization } from "decentraland-dapps/dist/modules/authorization/types"

export enum AuthorizationAction {
  BID = "bid",
  BUY = "buy",
  MINT = "mint",
  RENT = "rent",
  CLAIM_NAME = "claim_name",
  SWAP_MANA = "swap_mana",
  SELL = "sell"
}

export type Props = {
  authorization: Authorization
  requiredAllowance: string
  shouldAuthorize: boolean
  shouldUpdateAllowance: boolean
  action: AuthorizationAction
  onClose: () => void
}

