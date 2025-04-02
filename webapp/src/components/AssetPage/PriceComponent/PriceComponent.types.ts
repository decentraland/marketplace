import { Network } from '@dcl/schemas'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'

export type Props = {
  price: string
  network: Network
  useCredits: boolean
  credits?: CreditsResponse
  className?: string
}

export type MapStateProps = {
  credits?: CreditsResponse
}

export type OwnProps = Omit<Props, 'credits'>
