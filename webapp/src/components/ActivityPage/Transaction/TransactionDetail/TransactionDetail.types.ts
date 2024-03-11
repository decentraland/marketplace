import React from 'react'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Asset } from '../../../../modules/asset/types'

export type Props = {
  asset?: Asset | null
  text: React.ReactNode
  tx: Transaction
}

export type MapStateProps = {}
export type MapDispatchProps = {}
