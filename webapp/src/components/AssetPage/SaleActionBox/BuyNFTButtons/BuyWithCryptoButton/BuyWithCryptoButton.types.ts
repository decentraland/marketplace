import type { ButtonProps } from 'decentraland-ui/dist/components/Button/Button'
import { Asset } from '../../../../../modules/asset/types'

export type Props = ButtonProps & {
  asset: Asset
}
