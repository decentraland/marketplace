import { RefObject } from 'react'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  tableRef?: RefObject<HTMLDivElement> | null
}

export enum BuyOptions {
  MINT = 'MINT',
  BUY_LISTING = 'BUY_LISTING'
}
