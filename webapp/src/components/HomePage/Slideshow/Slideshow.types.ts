import React from 'react'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  title: string
  subtitle?: string
  viewAllTitle?: string
  assets: Asset[]
  sections?: React.ReactNode
  isSubHeader?: boolean
  isLoading: boolean
  onViewAll: () => void
}
