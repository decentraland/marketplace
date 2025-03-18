import { Asset } from '../../../../modules/asset/types'
import { CreditsResponse } from '../../../../modules/credits/types'

export type Props = {
  asset: Asset
  credits?: CreditsResponse
  isOwner?: boolean
  useCredits: boolean
  onUseCredits: (useCredits: boolean) => void
}

export type MapStateProps = {
  credits?: CreditsResponse
  isOwner?: boolean
}

export type MapDispatchProps = {
  onUseCredits: (useCredits: boolean) => void
}

export type OwnProps = {
  asset: Asset
  useCredits: boolean
  onUseCredits: (useCredits: boolean) => void
}
