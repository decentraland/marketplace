import { Dispatch } from 'redux'
import { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import {
  BrowseAction,
  ClearFiltersAction
} from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'
import { View } from '../../../modules/ui/types'
import { AssetType } from '../../../modules/asset/types'

export type Props = ModalProps & {
  hasFiltersEnabled: boolean
  view?: View
  assetType: AssetType
  browseOptions: BrowseOptions
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<
  Props,
  | 'hasFiltersEnabled'
  | 'view'
  | 'assetType'
  | 'browseOptions'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<ClearFiltersAction | BrowseAction>
