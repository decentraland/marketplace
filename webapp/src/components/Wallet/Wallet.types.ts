import React from 'react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isLoading: boolean
  children: (wallet: Wallet) => React.ReactNode
}

export type MapStateProps = Pick<Props, 'wallet' | 'isLoading'>
