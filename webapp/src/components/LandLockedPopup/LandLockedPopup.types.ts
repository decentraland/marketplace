import React from 'react'
import { RentalListing } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'

export type Props = {
  asset: Asset
  rental: RentalListing | null
  children: React.ReactNode
  userAddress: string
}
