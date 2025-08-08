import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorName } from '../../modules/vendor/types'

type Params = { address?: string }

export type Props = {
  addressInUrl?: string
  vendor: VendorName
  wallet: Wallet | null
  isConnecting: boolean
  isFullscreen?: boolean
  viewAsGuest: boolean
}

export type ContainerProps = RouteComponentProps<Params>
