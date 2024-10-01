import { RefObject } from 'react'
import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  isOffchainPublicNFTOrdersEnabled: boolean
  tableRef?: RefObject<HTMLDivElement> | null
}

export type MapStateProps = Pick<Props, 'isOffchainPublicNFTOrdersEnabled'>

export enum BuyOptions {
  MINT = 'MINT',
  BUY_LISTING = 'BUY_LISTING'
}
