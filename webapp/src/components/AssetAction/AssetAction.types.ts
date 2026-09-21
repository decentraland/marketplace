import React from 'react'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  children: React.ReactNode
  onBack: (location?: string) => void
  // Passed through to the Estate map so a review flow draws the authoritative composition.
  strictEstateSelection?: boolean
}

export type MapDispatchProps = Pick<Props, 'onBack'>
