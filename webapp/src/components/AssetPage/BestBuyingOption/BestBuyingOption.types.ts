import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
}

export enum BuyOptions {
  MINT = 'MINT',
  BUY_LISTING = 'BUY_LISTING',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}
