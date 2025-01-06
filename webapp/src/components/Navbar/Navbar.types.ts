import { AuthIdentity } from '@dcl/crypto'
import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'

export type Props = Partial<NavbarProps> & {
  hasPendingTransactions: boolean
  enablePartialSupportAlert?: boolean
  identity?: AuthIdentity
  isChainSelectorEnabled: boolean
  isNavbar2Enabled: boolean
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<Props, 'hasPendingTransactions' | 'identity' | 'isChainSelectorEnabled' | 'isNavbar2Enabled'>
