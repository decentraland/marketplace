import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { MarketSection } from '../../modules/routing/locations'

export type Props = {
  section: MarketSection
  wallet: Wallet | null
  isConnecting: boolean
}

export type MapStateProps = Pick<Props, 'section' | 'wallet' | 'isConnecting'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch<any>
