import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  isOffchainPublicItemOrdersEnabled: boolean
  isOffchainPublicNFTOrdersEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isOffchainPublicItemOrdersEnabled' | 'isOffchainPublicNFTOrdersEnabled'>
