import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { AssetType } from '../../../modules/asset/types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  section: string
  assetType: AssetType
  onBrowse: (options: BrowseOptions) => void
  wallet: Wallet | null
}

export type MapStateProps = Pick<Props, 'assetType' | 'wallet'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
