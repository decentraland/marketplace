import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { Asset } from '../../../../modules/asset/types'

export type Props = {
  asset: Asset
  assetPrice: string | undefined
  credits?: CreditsResponse
  isOwner?: boolean
  useCredits: boolean
  onUseCredits: (useCredits: boolean) => void
}

export type MapStateProps = {
  credits?: CreditsResponse
  isOwner?: boolean
}

export type OwnProps = {
  asset: Asset
  useCredits: boolean
  onUseCredits: (useCredits: boolean) => void
}
