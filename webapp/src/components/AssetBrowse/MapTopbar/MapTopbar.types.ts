import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  onlyOnSale: boolean | undefined
  onlyOnRent: boolean | undefined
  showOwned?: boolean
  onBrowse: (options: BrowseOptions) => void
  onShowOwnedChange?: (show: boolean) => void
}

export type MapStateProps = Pick<Props, 'onlyOnRent' | 'onlyOnSale'>

export type MapDispatchProps = Pick<Props, 'onBrowse'>
