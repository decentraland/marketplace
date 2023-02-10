import React from 'react'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isLoading: boolean
  onNavigate: (path: string) => void
  children: (wallet: Wallet) => React.ReactNode
}

export type MapStateProps = Pick<Props, 'wallet' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
