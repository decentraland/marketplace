import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  onlyOnSale: boolean | undefined
  onlyOnRent: boolean | undefined
  showOwned?: boolean
  onBrowse: (options: BrowseOptions) => void
  onShowOwnedChange?: (show: boolean) => void
}

export type ContainerProps = Pick<Props, 'showOwned' | 'onShowOwnedChange'>
