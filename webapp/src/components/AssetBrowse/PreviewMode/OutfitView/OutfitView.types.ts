import { Avatar } from '@dcl/schemas'
import { Asset } from '../../../../modules/asset/types'

export type Props = {
  items: Asset[]
  avatar?: Avatar
}
