import React from 'react'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft?: NFT | null
  text: React.ReactNode
  tx: Transaction
}

export type MapStateProps = {}
export type MapDispatchProps = {}
