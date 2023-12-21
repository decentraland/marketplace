import { Dispatch } from 'react'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  currentMana: number | undefined
  wallet: Wallet | null
  onBrowse: (options?: BrowseOptions) => void
  onClaim: (name: string) => void
}

export type MapStateProps = Pick<Props, 'currentMana' | 'wallet'>
export type MapDispatchProps = Pick<Props, 'onBrowse' | 'onClaim'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | OpenModalAction>
