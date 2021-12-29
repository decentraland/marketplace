import React from 'react'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  children: React.ReactNode
  onBack: (location?: string) => void
}

export type MapDispatchProps = Pick<Props, 'onBack'>
