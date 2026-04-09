import { AuthIdentity } from '@dcl/crypto'

export type Props = {
  enablePartialSupportAlert?: boolean
  identity?: AuthIdentity
}

export type OwnProps = Pick<Props, 'enablePartialSupportAlert'>

export type MapStateProps = Pick<Props, 'identity'>
