import { AuthIdentity } from '@dcl/crypto'

export type Props = {
  identity?: AuthIdentity
}

export type MapStateProps = Pick<Props, 'identity'>
